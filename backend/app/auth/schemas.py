"""
app/auth/schemas.py
===================
Pydantic models for authentication and user profiles.
"""

from pydantic import BaseModel, ConfigDict, Field


class UserProfile(BaseModel):
    """
    User profile model representing an authenticated Google user.
    """

    model_config = ConfigDict(extra="ignore")

    google_id: str = Field(..., description="Unique Google User Identifier (sub)")
    name: str = Field(..., description="User's full name")
    email: str = Field(..., description="User's primary email address")
    picture: str = Field("", description="URL to user's profile picture")


class AuthLoginResponse(BaseModel):
    """
    Response schema for OAuth login authorization URL.
    """

    url: str = Field(..., description="Google OAuth 2.0 authorization URL")
    state: str = Field(..., description="OAuth state parameter for CSRF protection")


class AuthStatusResponse(BaseModel):
    """
    Response schema for session status endpoint (/me).
    """

    authenticated: bool
    user: UserProfile | None = None
    message: str | None = None
