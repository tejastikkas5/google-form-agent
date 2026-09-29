"""
app/llm/factory.py
==================
Factory pattern for constructing and returning LLM provider instances.
Decouples LLM provider selection from application business logic.
"""

from __future__ import annotations

import logging
from functools import lru_cache

from app.core.config import settings
from app.llm.base import LLMProvider
from app.llm.exceptions import ProviderNotConfigured
from app.llm.gemini import GeminiProvider

logger = logging.getLogger(__name__)


def get_llm_provider(provider_name: str | None = None) -> LLMProvider:
    """
    Return an instance of the configured or specified LLMProvider.

    Supported providers:
      - 'gemini' (default)
      - Future: 'claude', 'openai', 'groq', 'openrouter', 'ollama'
    """
    selected_name = (provider_name or settings.llm_provider or "gemini").strip().lower()

    if selected_name == "gemini":
        return GeminiProvider(api_key=settings.gemini_api_key, model=settings.gemini_model)

    # Future providers raise ProviderNotConfigured until implemented
    if selected_name in ("claude", "openai", "groq", "openrouter", "ollama"):
        raise ProviderNotConfigured(f"LLM Provider '{selected_name}' is planned for future phases but not yet implemented.")

    raise ProviderNotConfigured(f"Unsupported LLM provider '{selected_name}'. Supported providers: gemini, claude, openai, groq, openrouter, ollama.")


@lru_cache(maxsize=1)
def get_cached_llm_provider() -> LLMProvider:
    """
    Return a cached singleton instance of the default configured LLM provider.
    """
    return get_llm_provider()
