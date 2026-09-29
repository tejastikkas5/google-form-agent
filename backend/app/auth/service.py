"""
app/auth/service.py
===================
Business logic for Google OAuth 2.0 authentication and session management.
"""

from __future__ import annotations

from datetime import datetime, timedelta, timezone
import logging
from urllib.parse import urlencode

import httpx
import jwt

from app.auth.config import (
    DEFAULT_SCOPES,
    GOOGLE_OAUTH_AUTH_URL,
    GOOGLE_OAUTH_TOKEN_URL,
    GOOGLE_OAUTH_USERINFO_URL,
)
from app.auth.schemas import UserProfile
from app.core.config import settings

logger = logging.getLogger(__name__)


class GoogleAuthError(Exception):
    """Base exception for Google Auth failures."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class GoogleAuthService:
    """
    Service handling Google OAuth 2.0 Authorization Code Flow,
    token exchange, user profile extraction, and JWT sessions.
    """

    def __init__(self) -> None:
        pass

    def check_credentials_configured(self) -> bool:
        """Return True if Google Client ID and Secret are configured."""
        return bool(
            settings.google_client_id
            and settings.google_client_id != "not-set-yet"
            and settings.google_client_secret
            and settings.google_client_secret != "not-set-yet"
        )

    def get_authorization_url(self, state: str) -> str:
        """
        Build the Google OAuth 2.0 authorization URL.
        """
        if not self.check_credentials_configured():
            raise GoogleAuthError(
                "Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not configured.",
                status_code=500,
            )

        params = {
            "client_id": settings.google_client_id,
            "redirect_uri": settings.google_redirect_uri,
            "response_type": "code",
            "scope": " ".join(DEFAULT_SCOPES),
            "state": state,
            "access_type": "offline",
            "prompt": "consent",
        }
        url = f"{GOOGLE_OAUTH_AUTH_URL}?{urlencode(params)}"
        return url

    async def exchange_code_for_tokens(self, code: str) -> dict:
        """
        Exchange authorization code for tokens via backend HTTP POST.
        """
        if not self.check_credentials_configured():
            raise GoogleAuthError("Google OAuth credentials not configured.", status_code=500)

        data = {
            "code": code,
            "client_id": settings.google_client_id,
            "client_secret": settings.google_client_secret,
            "redirect_uri": settings.google_redirect_uri,
            "grant_type": "authorization_code",
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.post(GOOGLE_OAUTH_TOKEN_URL, data=data)

            if response.status_code != 200:
                logger.error("Token exchange failed: %s", response.text)
                err_data = response.json() if response.headers.get("content-type", "").startswith("application/json") else {}
                err_msg = err_data.get("error_description") or err_data.get("error") or "Failed to exchange authorization code."
                raise GoogleAuthError(f"OAuth token error: {err_msg}", status_code=400)

            return response.json()

        except httpx.RequestError as exc:
            logger.error("Network error during token exchange: %s", exc)
            raise GoogleAuthError("Network failure while connecting to Google OAuth servers.", status_code=503)

    async def get_user_profile(self, access_token: str) -> UserProfile:
        """
        Fetch user profile details from Google UserInfo endpoint.
        """
        headers = {"Authorization": f"Bearer {access_token}"}
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(GOOGLE_OAUTH_USERINFO_URL, headers=headers)

            if response.status_code != 200:
                logger.error("Failed to fetch user profile: %s", response.text)
                raise GoogleAuthError("Failed to retrieve user profile from Google.", status_code=400)

            data = response.json()
            google_id = data.get("sub") or data.get("id")
            if not google_id:
                raise GoogleAuthError("Invalid Google profile response (missing user ID).", status_code=400)

            return UserProfile(
                google_id=str(google_id),
                name=data.get("name") or data.get("email", "").split("@")[0] or "Google User",
                email=data.get("email", ""),
                picture=data.get("picture", ""),
            )

        except httpx.RequestError as exc:
            logger.error("Network error during user profile fetch: %s", exc)
            raise GoogleAuthError("Network failure while fetching user profile.", status_code=503)

    def create_session_token(self, user: UserProfile, access_token: str = "") -> str:
        """
        Generate a signed JWT session token.
        """
        now = datetime.now(timezone.utc)
        payload = {
            "sub": user.google_id,
            "name": user.name,
            "email": user.email,
            "picture": user.picture,
            "access_token": access_token,
            "iat": int(now.timestamp()),
            "exp": int((now + timedelta(days=7)).timestamp()),
        }
        secret = settings.effective_session_secret
        token = jwt.encode(payload, secret, algorithm="HS256")
        return token

    def verify_session_token(self, token: str) -> UserProfile | None:
        """
        Verify and decode JWT session token. Returns UserProfile if valid.
        """
        if not token:
            return None
        try:
            secret = settings.effective_session_secret
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            return UserProfile(
                google_id=str(payload["sub"]),
                name=str(payload.get("name", "")),
                email=str(payload.get("email", "")),
                picture=str(payload.get("picture", "")),
            )
        except (jwt.PyJWTError, KeyError, ValueError) as exc:
            logger.warning("Session token verification failed: %s", exc)
            return None

    def get_access_token_from_session(self, token: str) -> str | None:
        """
        Extract the Google OAuth access token from the session JWT.
        """
        if not token:
            return None
        try:
            secret = settings.effective_session_secret
            payload = jwt.decode(token, secret, algorithms=["HS256"])
            return payload.get("access_token")
        except (jwt.PyJWTError, KeyError):
            return None


# Singleton instance
google_auth_service = GoogleAuthService()
