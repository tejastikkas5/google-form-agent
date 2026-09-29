"""
core/config.py
==============
Centralised application settings loaded from environment variables.

Uses Pydantic Settings v2 so every value is strongly-typed and validated
at startup. Future phases add their own settings sections here — no other
files need to change.
"""

from functools import lru_cache
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application-wide configuration.

    Values are resolved in this order (highest priority first):
      1. Actual environment variables
      2. .env file
      3. Default values defined below
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",            # silently ignore unknown env vars
    )

    # ------------------------------------------------------------------
    # Server
    # ------------------------------------------------------------------
    host: str = Field(default="127.0.0.1", description="Uvicorn bind host")
    port: int = Field(default=8000, description="Uvicorn bind port")
    debug: bool = Field(default=False, description="Enable debug mode")

    # ------------------------------------------------------------------
    # Application metadata
    # ------------------------------------------------------------------
    app_name: str = Field(default="Prompt2Form", description="Application name")
    app_version: str = Field(default="0.1.0", description="Application version")
    app_description: str = Field(
        default="AI-powered Google Form generator",
        description="Application description",
    )

    # ------------------------------------------------------------------
    # Security
    # ------------------------------------------------------------------
    secret_key: str = Field(
        default="change-me-in-production",
        description="Secret key for signing tokens",
    )

    # ------------------------------------------------------------------
    # AI / LLM
    # ------------------------------------------------------------------
    llm_provider: str = Field(
        default="gemini",
        description="Active LLM provider (gemini, claude, openai, groq, openrouter, ollama)",
    )
    gemini_model: str = Field(
        default="gemini-2.5-flash",
        description="Default Google Gemini model name",
    )
    gemini_api_key: str = Field(
        default="",
        description="Google Gemini API key",
    )

    # ------------------------------------------------------------------
    # Google OAuth & Sessions
    # ------------------------------------------------------------------
    google_client_id: str = Field(
        default="",
        description="Google OAuth 2.0 client ID",
    )
    google_client_secret: str = Field(
        default="",
        description="Google OAuth 2.0 client secret",
    )
    google_redirect_uri: str = Field(
        default="http://localhost:8000/api/v1/auth/callback",
        description="Google OAuth 2.0 redirect URI",
    )
    session_secret: str = Field(
        default="",
        description="Session secret key for signing JWT tokens",
    )
    frontend_url: str = Field(
        default="http://localhost:3000",
        description="Frontend web application base URL",
    )

    @property
    def effective_session_secret(self) -> str:
        return self.session_secret if self.session_secret else self.secret_key


    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    cors_origins: list[str] = Field(
        default=["http://localhost:3000", "http://localhost:4173"],
        description="Allowed CORS origins",
    )
    cors_allow_credentials: bool = Field(default=True)
    cors_allow_methods: list[str] = Field(default=["*"])
    cors_allow_headers: list[str] = Field(default=["*"])

    # ------------------------------------------------------------------
    # Validators
    # ------------------------------------------------------------------
    @field_validator("port")
    @classmethod
    def validate_port(cls, v: int) -> int:
        if not (1 <= v <= 65535):
            raise ValueError(f"Port must be between 1 and 65535, got {v}")
        return v


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Return the cached singleton Settings instance.

    Using @lru_cache ensures the .env file is read only once at startup,
    not on every request.
    """
    return Settings()


# Module-level singleton — import this throughout the codebase.
settings: Settings = get_settings()
