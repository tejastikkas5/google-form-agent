"""
api/v1/health.py
================
Health check endpoint.

GET /api/v1/health
  Returns { "status": "healthy" } with HTTP 200.
  Used by load balancers, container orchestrators, and monitoring tools
  to verify the service is alive and accepting requests.
"""

import logging

from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.schemas import HealthResponse

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Health"])


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Health check",
    description="Returns the current health status of the API.",
    responses={
        200: {
            "description": "Service is healthy",
            "content": {"application/json": {"example": {"status": "healthy"}}},
        }
    },
)
async def health_check() -> JSONResponse:
    """
    Lightweight liveness probe.

    Future phases may extend this to include:
      - Database connectivity check
      - LLM provider reachability
      - Google API token validity
    """
    logger.debug("Health check requested")
    return JSONResponse(content={"status": "healthy"})
