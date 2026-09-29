"""
app/api/v1
==========
Version 1 API router.

Aggregates all v1 sub-routers and exposes a single v1_router
that is mounted at /api/v1 in app/main.py.

To add a new feature router:
  1. Create app/api/v1/forms.py
  2. from app.api.v1.forms import router as forms_router
  3. v1_router.include_router(forms_router, prefix="/forms")
"""

from fastapi import APIRouter

from app.api.v1.forms import router as forms_router
from app.api.v1.health import router as health_router
from app.auth.router import router as auth_router
from app.llm.router import router as llm_router

v1_router = APIRouter()
v1_router.include_router(health_router)
v1_router.include_router(auth_router, prefix="/auth")
v1_router.include_router(forms_router, prefix="/forms")
v1_router.include_router(llm_router, prefix="/llm")

__all__ = ["v1_router"]


