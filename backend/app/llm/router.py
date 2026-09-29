"""
app/llm/router.py
=================
FastAPI router for LLM provider health check and text generation endpoints.

Routes:
  - GET  /api/v1/llm/health
  - POST /api/v1/llm/generate
"""

from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException, status

from app.llm.exceptions import LLMError
from app.llm.factory import get_llm_provider
from app.llm.schemas import PromptRequest, PromptResponse, ProviderHealth

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["LLM Provider Architecture"])


@router.get(
    "/health",
    response_model=ProviderHealth,
    summary="Get LLM Provider Health Status",
    description="Returns configuration and health status of the active LLM provider.",
)
async def get_llm_health(provider: str | None = None) -> ProviderHealth:
    """
    Check current LLM provider configuration and status.
    """
    try:
        provider_instance = get_llm_provider(provider_name=provider)
        health_status = await provider_instance.health()
        return health_status
    except LLMError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)
    except Exception as exc:
        logger.exception("Unexpected error checking LLM provider health: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to retrieve LLM provider health status.",
        )


@router.post(
    "/generate",
    response_model=PromptResponse,
    summary="Generate text using LLM provider",
    description="Sends prompt to configured LLM provider (e.g. Gemini) and returns generated response.",
)
async def generate_llm_text(
    request: PromptRequest,
    provider: str | None = None,
) -> PromptResponse:
    """
    Generate text via configured LLM provider.
    """
    try:
        provider_instance = get_llm_provider(provider_name=provider)
        response = await provider_instance.generate(request)
        return response
    except LLMError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)
    except Exception as exc:
        logger.exception("Unexpected error generating text with LLM provider: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"LLM generation failed: {str(exc)}",
        )

