"""
app/llm/base.py
===============
Abstract base class definition for LLM providers.

All concrete provider implementations (GeminiProvider, ClaudeProvider, OpenAIProvider, etc.)
must inherit from LLMProvider and implement generate(), health(), and validate_response().
"""

from __future__ import annotations

from abc import ABC, abstractmethod
from app.forms.schemas import FormSchema
from app.llm.schemas import PromptRequest, PromptResponse, ProviderHealth



class LLMProvider(ABC):
    """
    Abstract Base Class defining the unified contract for LLM providers.
    """

    @abstractmethod
    async def generate(self, request: PromptRequest) -> PromptResponse:
        """
        Generate text output from prompt request.
        Must return a structured PromptResponse.
        """
        ...

    @abstractmethod
    async def generate_form_schema(self, prompt: str, current_schema: FormSchema | None = None) -> FormSchema:
        """
        Generate structured FormSchema JSON from natural language prompt, optionally updating an existing FormSchema.
        Must return a validated FormSchema instance.
        """
        ...


    @abstractmethod
    async def health(self) -> ProviderHealth:
        """
        Inspect health and configuration status of the provider.
        Must return a ProviderHealth instance.
        """
        ...

    @abstractmethod
    def validate_response(self, response: PromptResponse) -> bool:
        """
        Validate whether the response content meets baseline requirements.
        Returns True if valid, False otherwise.
        """
        ...

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Return the unique provider name string (e.g. 'gemini')."""
        ...

    @property
    @abstractmethod
    def model_name(self) -> str:
        """Return the configured model identifier (e.g. 'gemini-2.5-flash')."""
        ...
