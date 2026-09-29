"""
schemas/base.py
===============
Shared response schemas used across all API endpoints.

All API responses wrap their payload in a consistent envelope:

  Success:
    { "success": true,  "data": <payload>,  "message": "OK" }

  Error (handled by exception handlers):
    { "success": false, "error": { "code": "...", "message": "..." } }
"""

from __future__ import annotations

from typing import Any, Generic, TypeVar

from pydantic import BaseModel, Field

# Generic payload type for ApiResponse[T]
T = TypeVar("T")


# ======================================================================
# Base model — shared config for all schemas
# ======================================================================

class BaseSchema(BaseModel):
    """
    Root Pydantic model for all Prompt2Form schemas.

    Enables:
      - from_attributes: allows building from ORM objects (Phase 0.5+)
      - populate_by_name: allows both alias and field name
    """

    model_config = {
        "from_attributes": True,
        "populate_by_name": True,
    }


# ======================================================================
# Generic API response envelope
# ======================================================================

class ApiResponse(BaseSchema, Generic[T]):
    """
    Standard success response wrapper.

    Usage:
        return ApiResponse(data=my_data, message="Form created.")

    JSON output:
        { "success": true, "message": "Form created.", "data": { ... } }
    """

    success: bool = Field(default=True, description="Whether the request succeeded")
    message: str = Field(default="OK", description="Human-readable status message")
    data: T | None = Field(default=None, description="Response payload")


# ======================================================================
# Health check schema
# ======================================================================

class HealthResponse(BaseSchema):
    """Response schema for GET /api/v1/health."""

    status: str = Field(default="healthy", description="Service health status")


# ======================================================================
# Error detail schema (matches exception handler output)
# ======================================================================

class ErrorDetail(BaseSchema):
    """Inner error object in an error response."""

    code: str = Field(description="Machine-readable error code")
    message: str = Field(description="Human-readable error description")
    detail: Any = Field(default=None, description="Optional structured context")


class ErrorResponse(BaseSchema):
    """
    Error response envelope — matches what exception handlers return.

    JSON output:
        {
          "success": false,
          "error": { "code": "NOT_FOUND", "message": "...", "detail": null }
        }
    """

    success: bool = Field(default=False)
    error: ErrorDetail
