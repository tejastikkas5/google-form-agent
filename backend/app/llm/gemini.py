"""
app/llm/gemini.py
=================
Google Gemini LLM provider implementation satisfying the LLMProvider contract.
Communicates with Google Generative AI API using the official google-genai SDK.
"""

from __future__ import annotations

import asyncio
import json
import logging
import time
from typing import Any
from pydantic import ValidationError

from google import genai
from google.genai import types
from google.genai.errors import APIError, ClientError, ServerError

from app.core.config import settings
from app.forms.prompt_builder import FormPromptBuilder
from app.forms.schemas import FormSchema
from app.llm.base import LLMProvider

from app.llm.exceptions import (
    InvalidAPIKeyError,
    InvalidLLMResponse,
    LLMError,
    LLMTimeoutError,
    ProviderNotConfigured,
    ProviderUnavailable,
    RateLimitError,
)
from app.llm.schemas import (
    GenerationMetadata,
    PromptRequest,
    PromptResponse,
    ProviderHealth,
    TokenUsage,
)

logger = logging.getLogger(__name__)


class GeminiProvider(LLMProvider):
    """
    Google Gemini LLM provider using official Google GenAI SDK.
    """

    def __init__(self, api_key: str | None = None, model: str | None = None) -> None:
        self._api_key = (api_key if api_key is not None else settings.gemini_api_key) or ""
        self._model = (model if model is not None else settings.gemini_model) or "gemini-2.5-flash"

    @property
    def provider_name(self) -> str:
        return "gemini"

    @property
    def model_name(self) -> str:
        return self._model or settings.gemini_model or "gemini-2.5-flash"

    def is_configured(self) -> bool:
        """Return True if a valid API key and model are present."""
        key = self._api_key.strip() if self._api_key else ""
        return bool(key and key != "not-set-yet" and self.model_name.strip())

    async def health(self) -> ProviderHealth:
        """
        Return current provider health status.
        Verifies provider configured, API key exists, and model configured.
        Does NOT make unnecessary API requests.
        """
        configured = self.is_configured()
        return ProviderHealth(
            provider=self.provider_name,
            status="ok" if configured else "unconfigured",
            model=self.model_name,
            configured=configured,
        )

    def validate_response(self, response: PromptResponse) -> bool:
        """
        Validate whether response content is non-empty.
        """
        if not response or not isinstance(response, PromptResponse):
            return False
        return bool(response.content and response.content.strip())

    async def generate(self, request: PromptRequest) -> PromptResponse:
        """
        Generate text output from prompt request via real Gemini API call.
        """
        if not self.is_configured():
            raise ProviderNotConfigured(
                "Gemini API key is missing or not configured in environment (GEMINI_API_KEY)."
            )

        if not request.prompt or not request.prompt.strip():
            raise InvalidLLMResponse("Prompt text cannot be empty.")

        start_time = time.perf_counter()

        try:
            client = genai.Client(api_key=self._api_key)

            config_kwargs: dict[str, Any] = {}
            if request.system_instruction:
                config_kwargs["system_instruction"] = request.system_instruction
            if request.temperature is not None:
                config_kwargs["temperature"] = request.temperature
            if request.max_tokens is not None:
                config_kwargs["max_output_tokens"] = request.max_tokens

            config = types.GenerateContentConfig(**config_kwargs) if config_kwargs else None

            response = await client.aio.models.generate_content(
                model=self.model_name,
                contents=request.prompt,
                config=config,
            )
        except ClientError as exc:
            logger.error("Gemini API ClientError (%s): %s", getattr(exc, "code", "4xx"), exc)
            code = getattr(exc, "code", 400)
            err_msg = str(exc)
            err_msg_upper = err_msg.upper()
            if (
                code in (401, 403)
                or "API_KEY" in err_msg_upper
                or ("API" in err_msg_upper and "KEY" in err_msg_upper)
                or ("KEY" in err_msg_upper and "INVALID" in err_msg_upper)
            ):
                raise InvalidAPIKeyError("Invalid Gemini API key provided.") from exc
            elif code == 429 or "RESOURCE_EXHAUSTED" in err_msg_upper or "QUOTA" in err_msg_upper:
                raise RateLimitError("Gemini API rate limit or quota exceeded.") from exc
            else:
                raise LLMError(f"Gemini API client error: {err_msg}", status_code=code) from exc

        except ServerError as exc:
            logger.error("Gemini API ServerError (%s): %s", getattr(exc, "code", "5xx"), exc)
            raise ProviderUnavailable(f"Gemini service is currently unavailable: {str(exc)}") from exc
        except APIError as exc:
            logger.error("Gemini APIError: %s", exc)
            raise ProviderUnavailable(f"Gemini API error: {str(exc)}") from exc
        except (TimeoutError, asyncio.TimeoutError) as exc:
            logger.error("Gemini API request timed out: %s", exc)
            raise LLMTimeoutError("Gemini API request timed out.") from exc
        except Exception as exc:
            logger.exception("Unexpected error communicating with Gemini API: %s", exc)
            raise ProviderUnavailable(f"Failed to communicate with Gemini provider: {str(exc)}") from exc

        latency_ms = round((time.perf_counter() - start_time) * 1000, 2)

        content: str | None = getattr(response, "text", None)
        if not content and hasattr(response, "candidates") and response.candidates:
            try:
                candidate = response.candidates[0]
                if candidate.content and candidate.content.parts:
                    content = "".join(
                        [p.text for p in candidate.content.parts if hasattr(p, "text") and p.text]
                    )
            except Exception:
                pass

        if not content or not content.strip():
            raise InvalidLLMResponse("Empty or blocked response received from Gemini API.")

        token_usage: TokenUsage | None = None
        if hasattr(response, "usage_metadata") and response.usage_metadata:
            usage = response.usage_metadata
            p_tokens = getattr(usage, "prompt_token_count", 0) or 0
            c_tokens = getattr(usage, "candidates_token_count", 0) or 0
            t_tokens = getattr(usage, "total_token_count", 0) or (p_tokens + c_tokens)
            token_usage = TokenUsage(
                prompt_tokens=p_tokens,
                completion_tokens=c_tokens,
                total_tokens=t_tokens,
            )

        metadata = GenerationMetadata(
            provider=self.provider_name,
            model=self.model_name,
            latency_ms=latency_ms,
            token_usage=token_usage,
        )

        prompt_response = PromptResponse(
            content=content,
            metadata=metadata,
        )

        if not self.validate_response(prompt_response):
            raise InvalidLLMResponse("Generated Gemini response failed validation.")

        return prompt_response

    async def generate_form_schema(self, prompt: str, current_schema: FormSchema | None = None) -> FormSchema:
        """
        Generate a validated FormSchema from a natural language prompt using Gemini,
        optionally modifying an existing FormSchema.
        """
        if not self.is_configured():
            raise ProviderNotConfigured(
                "Gemini API key is missing or not configured in environment (GEMINI_API_KEY)."
            )

        if not prompt or not prompt.strip():
            raise InvalidLLMResponse("Prompt text cannot be empty.")

        system_instruction = FormPromptBuilder.get_system_instruction()
        current_schema_dict = current_schema.model_dump() if current_schema else None
        formatted_prompt = FormPromptBuilder.build_prompt(prompt, current_schema_dict=current_schema_dict)

        try:
            client = genai.Client(api_key=self._api_key)

            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0.2,
                response_mime_type="application/json",
            )

            response = await client.aio.models.generate_content(
                model=self.model_name,
                contents=formatted_prompt,
                config=config,
            )
        except ClientError as exc:
            logger.error("Gemini API ClientError during schema generation (%s): %s", getattr(exc, "code", "4xx"), exc)
            code = getattr(exc, "code", 400)
            err_msg = str(exc)
            err_msg_upper = err_msg.upper()
            if (
                code in (401, 403)
                or "API_KEY" in err_msg_upper
                or ("API" in err_msg_upper and "KEY" in err_msg_upper)
                or ("KEY" in err_msg_upper and "INVALID" in err_msg_upper)
            ):
                raise InvalidAPIKeyError("Invalid Gemini API key provided.") from exc
            elif code == 429 or "RESOURCE_EXHAUSTED" in err_msg_upper or "QUOTA" in err_msg_upper:
                raise RateLimitError("Gemini API rate limit or quota exceeded.") from exc
            else:
                raise LLMError(f"Gemini API client error: {err_msg}", status_code=code) from exc
        except ServerError as exc:
            logger.error("Gemini API ServerError during schema generation (%s): %s", getattr(exc, "code", "5xx"), exc)
            raise ProviderUnavailable(f"Gemini service is currently unavailable: {str(exc)}") from exc
        except APIError as exc:
            logger.error("Gemini APIError during schema generation: %s", exc)
            raise ProviderUnavailable(f"Gemini API error: {str(exc)}") from exc
        except (TimeoutError, asyncio.TimeoutError) as exc:
            logger.error("Gemini API request timed out during schema generation: %s", exc)
            raise LLMTimeoutError("Gemini API request timed out.") from exc
        except Exception as exc:
            logger.exception("Unexpected error communicating with Gemini API for schema generation: %s", exc)
            raise ProviderUnavailable(f"Failed to communicate with Gemini provider: {str(exc)}") from exc

        raw_content: str | None = getattr(response, "text", None)
        if not raw_content and hasattr(response, "candidates") and response.candidates:
            try:
                candidate = response.candidates[0]
                if candidate.content and candidate.content.parts:
                    raw_content = "".join(
                        [p.text for p in candidate.content.parts if hasattr(p, "text") and p.text]
                    )
            except Exception:
                pass

        if not raw_content or not raw_content.strip():
            raise InvalidLLMResponse("Empty or blocked response received from Gemini API.")

        clean_json = raw_content.strip()
        if clean_json.startswith("```"):
            lines = clean_json.splitlines()
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            clean_json = "\n".join(lines).strip()

        try:
            schema_dict = json.loads(clean_json)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse Gemini response as JSON: %s. Response content: %r", exc, clean_json)
            raise InvalidLLMResponse(f"Gemini returned invalid or malformed JSON: {str(exc)}") from exc

        try:
            form_schema = FormSchema.model_validate(schema_dict)
        except ValidationError as exc:
            logger.error("Gemini JSON output failed FormSchema validation: %s", exc)
            raise InvalidLLMResponse(f"Generated form schema failed validation: {str(exc)}") from exc
        except Exception as exc:
            logger.error("Unexpected error validating FormSchema: %s", exc)
            raise InvalidLLMResponse(f"Failed to validate form schema structure: {str(exc)}") from exc

        return form_schema


