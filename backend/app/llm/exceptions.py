"""
app/llm/exceptions.py
=====================
Custom exception hierarchy for LLM providers.
"""

from __future__ import annotations


class LLMError(Exception):
    """Base exception for all LLM provider errors."""

    def __init__(self, message: str, status_code: int = 500) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class ProviderNotConfigured(LLMError):
    """Raised when an LLM provider or its API credentials are missing/unconfigured."""

    def __init__(self, message: str = "LLM provider is not configured or missing API credentials.") -> None:
        super().__init__(message, status_code=503)


class InvalidAPIKeyError(LLMError):
    """Raised when an invalid API key is provided for the LLM provider."""

    def __init__(self, message: str = "Invalid LLM provider API key.") -> None:
        super().__init__(message, status_code=401)


class RateLimitError(LLMError):
    """Raised when LLM provider rate limit or quota is exceeded."""

    def __init__(self, message: str = "LLM provider rate limit or quota exceeded.") -> None:
        super().__init__(message, status_code=429)


class LLMTimeoutError(LLMError):
    """Raised when an LLM provider request times out."""

    def __init__(self, message: str = "LLM provider request timed out.") -> None:
        super().__init__(message, status_code=504)


class ProviderUnavailable(LLMError):
    """Raised when the LLM provider service is unreachable or offline."""

    def __init__(self, message: str = "LLM provider service is currently unavailable.") -> None:
        super().__init__(message, status_code=503)


class InvalidLLMResponse(LLMError):
    """Raised when the LLM response fails validation or format checks."""

    def __init__(self, message: str = "Invalid response received from LLM provider.") -> None:
        super().__init__(message, status_code=502)

