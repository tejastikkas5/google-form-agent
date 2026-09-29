"""
app/llm
=======
AI LLM Provider Architecture package.
Exposes abstract base provider, provider factory, concrete Gemini provider, schemas, and exceptions.
"""

from app.llm.base import LLMProvider
from app.llm.exceptions import (
    InvalidLLMResponse,
    LLMError,
    ProviderNotConfigured,
    ProviderUnavailable,
)
from app.llm.factory import get_llm_provider
from app.llm.gemini import GeminiProvider
from app.llm.router import router as llm_router
from app.llm.schemas import (
    GenerationMetadata,
    PromptRequest,
    PromptResponse,
    ProviderHealth,
    TokenUsage,
)

__all__ = [
    "LLMProvider",
    "GeminiProvider",
    "get_llm_provider",
    "llm_router",
    "PromptRequest",
    "PromptResponse",
    "ProviderHealth",
    "TokenUsage",
    "GenerationMetadata",
    "LLMError",
    "ProviderNotConfigured",
    "ProviderUnavailable",
    "InvalidLLMResponse",
]
