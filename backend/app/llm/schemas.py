"""
app/llm/schemas.py
==================
Pydantic data models for LLM requests, responses, metadata, and health status.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, Field


class TokenUsage(BaseModel):
    """Token consumption statistics."""

    model_config = ConfigDict(extra="ignore")

    prompt_tokens: int = Field(0, description="Tokens consumed by the prompt")
    completion_tokens: int = Field(0, description="Tokens generated in the completion")
    total_tokens: int = Field(0, description="Total tokens processed")


class GenerationMetadata(BaseModel):
    """Metadata describing model generation details."""

    model_config = ConfigDict(extra="ignore")

    provider: str = Field(..., description="LLM provider name (e.g. gemini, claude, openai)")
    model: str = Field(..., description="LLM model identifier")
    latency_ms: float = Field(0.0, description="Generation latency in milliseconds")
    token_usage: TokenUsage | None = Field(default=None, description="Token usage details")


class PromptRequest(BaseModel):
    """Request model for LLM generation."""

    model_config = ConfigDict(extra="ignore")

    prompt: str = Field(..., description="User prompt or instruction text")
    system_instruction: str | None = Field(default=None, description="Optional system instruction/context")
    temperature: float = Field(0.7, ge=0.0, le=2.0, description="Sampling temperature")
    max_tokens: int | None = Field(default=None, description="Maximum tokens to generate")


class PromptResponse(BaseModel):
    """Structured response model returned by LLM providers."""

    model_config = ConfigDict(extra="ignore")

    content: str = Field(..., description="Generated text content from the LLM provider")
    metadata: GenerationMetadata = Field(..., description="Generation metadata and provider info")


class ProviderHealth(BaseModel):
    """Health status representation for an LLM provider."""

    model_config = ConfigDict(extra="ignore")

    provider: str = Field(..., description="LLM provider identifier")
    status: str = Field(..., description="Health status ('ok', 'unconfigured', 'error')")
    model: str = Field(..., description="Configured model name")
    configured: bool = Field(..., description="Whether valid API credentials are present")
