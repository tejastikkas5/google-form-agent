"""
core/exceptions.py
==================
Centralised exception hierarchy and FastAPI exception handlers.

Design principles:
  - All application exceptions inherit from Prompt2FormError.
  - Each exception carries a status_code, error_code, and message.
  - register_exception_handlers() wires everything into the FastAPI app.
  - Clients always receive a consistent JSON envelope:

    {
        "success": false,
        "error": {
            "code":    "FORM_NOT_FOUND",
            "message": "The requested form does not exist.",
            "detail":  null
        }
    }
"""

from __future__ import annotations

import logging
from typing import Any

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import ValidationError

logger = logging.getLogger(__name__)


# ======================================================================
# Base exception
# ======================================================================

class Prompt2FormError(Exception):
    """
    Root exception for all application-level errors.

    Attributes:
        status_code: HTTP status code to return to the client.
        error_code:  Machine-readable string identifier (e.g. "NOT_FOUND").
        message:     Human-readable description.
        detail:      Optional extra context (not exposed in production).
    """

    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code: str = "INTERNAL_ERROR"

    def __init__(
        self,
        message: str = "An unexpected error occurred.",
        *,
        detail: Any = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.detail = detail

    def to_dict(self) -> dict[str, Any]:
        return {
            "code": self.error_code,
            "message": self.message,
            "detail": self.detail,
        }


# ======================================================================
# Concrete application exceptions
# ======================================================================

class NotFoundError(Prompt2FormError):
    """Raised when a requested resource does not exist."""
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "NOT_FOUND"

    def __init__(self, resource: str = "Resource", *, detail: Any = None) -> None:
        super().__init__(message=f"{resource} was not found.", detail=detail)


class ValidationFailedError(Prompt2FormError):
    """Raised when business-logic validation fails (not Pydantic schema)."""
    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    error_code = "VALIDATION_FAILED"


class UnauthorizedError(Prompt2FormError):
    """Raised when the request lacks valid authentication credentials."""
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "UNAUTHORIZED"

    def __init__(self, message: str = "Authentication required.", *, detail: Any = None) -> None:
        super().__init__(message=message, detail=detail)


class ForbiddenError(Prompt2FormError):
    """Raised when an authenticated user lacks permission."""
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "FORBIDDEN"


class LLMError(Prompt2FormError):
    """Raised when an LLM provider call fails (Phase 0.4+)."""
    status_code = status.HTTP_502_BAD_GATEWAY
    error_code = "LLM_ERROR"


class GoogleAPIError(Prompt2FormError):
    """Raised when a Google API call fails (Phase 0.3+)."""
    status_code = status.HTTP_502_BAD_GATEWAY
    error_code = "GOOGLE_API_ERROR"


class RateLimitError(Prompt2FormError):
    """Raised when rate limits are exceeded."""
    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    error_code = "RATE_LIMIT_EXCEEDED"


# ======================================================================
# Response builder helpers
# ======================================================================

def _error_response(
    status_code: int,
    error_code: str,
    message: str,
    detail: Any = None,
) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {
                "code": error_code,
                "message": message,
                "detail": detail,
            },
        },
    )


# ======================================================================
# Exception handlers
# ======================================================================

async def _handle_prompt2form_error(
    request: Request,
    exc: Prompt2FormError,
) -> JSONResponse:
    logger.error(
        "Application error [%s] on %s %s: %s",
        exc.error_code,
        request.method,
        request.url.path,
        exc.message,
    )
    return _error_response(
        status_code=exc.status_code,
        error_code=exc.error_code,
        message=exc.message,
        detail=exc.detail,
    )


async def _handle_request_validation_error(
    request: Request,
    exc: RequestValidationError,
) -> JSONResponse:
    logger.warning(
        "Request validation failed on %s %s: %s",
        request.method,
        request.url.path,
        exc.errors(),
    )
    return _error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error_code="REQUEST_VALIDATION_ERROR",
        message="The request body or parameters are invalid.",
        detail=exc.errors(),
    )


async def _handle_pydantic_validation_error(
    request: Request,
    exc: ValidationError,
) -> JSONResponse:
    logger.warning(
        "Pydantic validation failed on %s %s",
        request.method,
        request.url.path,
    )
    return _error_response(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        error_code="SCHEMA_VALIDATION_ERROR",
        message="Data validation failed.",
        detail=exc.errors(),
    )


async def _handle_unhandled_error(
    request: Request,
    exc: Exception,
) -> JSONResponse:
    logger.exception(
        "Unhandled exception on %s %s",
        request.method,
        request.url.path,
        exc_info=exc,
    )
    return _error_response(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        error_code="INTERNAL_ERROR",
        message="An unexpected error occurred. Please try again later.",
    )


# ======================================================================
# Public registration function
# ======================================================================

def register_exception_handlers(app: FastAPI) -> None:
    """
    Wire all exception handlers into the FastAPI application.

    Call once inside create_app() — never call from individual routers.
    """
    app.add_exception_handler(Prompt2FormError, _handle_prompt2form_error)  # type: ignore[arg-type]
    app.add_exception_handler(RequestValidationError, _handle_request_validation_error)  # type: ignore[arg-type]
    app.add_exception_handler(ValidationError, _handle_pydantic_validation_error)  # type: ignore[arg-type]
    app.add_exception_handler(Exception, _handle_unhandled_error)  # type: ignore[arg-type]
