"""
app/auth
========
Google OAuth 2.0 authentication package.
"""

from app.auth.router import router as auth_router
from app.auth.service import google_auth_service

__all__ = ["auth_router", "google_auth_service"]
