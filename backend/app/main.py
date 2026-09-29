"""
app/main.py
===========
FastAPI application factory for Prompt2Form.

Start the server with:
    uvicorn app.main:app --reload

Or use the settings-driven launcher:
    python -m app.main
"""

from __future__ import annotations

import os
import sys
import logging

# Ensure backend directory is in sys.path for serverless runtimes
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import v1_router
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging

# ------------------------------------------------------------------
# Bootstrap logging before anything else runs
# ------------------------------------------------------------------
setup_logging()
logger = logging.getLogger(__name__)


# ======================================================================
# Application factory
# ======================================================================

def create_app() -> FastAPI:
    """
    Construct and configure the FastAPI application.

    Separating construction into a factory function makes the app
    easily testable — tests call create_app() to get a fresh instance.
    """
    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=settings.app_description,
        docs_url="/docs" if settings.debug else None,
        redoc_url="/redoc" if settings.debug else None,
        openapi_url="/openapi.json" if settings.debug else None,
    )

    # ------------------------------------------------------------------
    # CORS
    # ------------------------------------------------------------------
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=settings.cors_allow_credentials,
        allow_methods=settings.cors_allow_methods,
        allow_headers=settings.cors_allow_headers,
    )

    # ------------------------------------------------------------------
    # Global exception handlers
    # ------------------------------------------------------------------
    register_exception_handlers(app)

    # ------------------------------------------------------------------
    # Routers
    # ------------------------------------------------------------------
    app.include_router(v1_router, prefix="/api/v1")

    # ------------------------------------------------------------------
    # Application lifecycle hooks
    # ------------------------------------------------------------------
    @app.on_event("startup")
    async def on_startup() -> None:
        logger.info(
            "[START] %s v%s  running on %s:%s  [debug=%s]",
            settings.app_name,
            settings.app_version,
            settings.host,
            settings.port,
            settings.debug,
        )

    @app.on_event("shutdown")
    async def on_shutdown() -> None:
        logger.info("[STOP] %s shutting down.", settings.app_name)

    # ------------------------------------------------------------------
    # Root endpoint
    # ------------------------------------------------------------------
    @app.get(
        "/",
        tags=["Root"],
        summary="API root",
        description="Returns basic service information.",
        include_in_schema=True,
    )
    async def root() -> JSONResponse:
        return JSONResponse(
            content={
                "status": "running",
                "project": settings.app_name,
                "version": settings.app_version,
            }
        )

    return app


# ======================================================================
# Application instance
# ======================================================================

app: FastAPI = create_app()


# ======================================================================
# Direct execution entry point
# ======================================================================

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level="debug" if settings.debug else "info",
    )
