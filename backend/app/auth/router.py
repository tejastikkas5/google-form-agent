"""
app/auth/router.py
==================
FastAPI router for Google OAuth 2.0 endpoints.

Routes:
  - GET  /api/v1/auth/login
  - GET  /api/v1/auth/callback
  - GET  /api/v1/auth/me
  - POST /api/v1/auth/logout
"""

from __future__ import annotations

import logging
import secrets

from fastapi import APIRouter, Cookie, Header, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse, RedirectResponse

from app.auth.schemas import AuthLoginResponse, AuthStatusResponse, UserProfile
from app.auth.service import GoogleAuthError, google_auth_service
from app.core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["Authentication"])


@router.get(
    "/login",
    summary="Initiate Google OAuth 2.0 Login",
    description="Redirects user directly to Google OAuth 2.0 consent screen, or returns auth URL if JSON requested.",
)
async def login(request: Request, json: bool = False) -> Response:
    """
    Generate state and redirect user to Google's OAuth consent screen.
    """
    state = secrets.token_urlsafe(16)
    try:
        auth_url = google_auth_service.get_authorization_url(state=state)
    except GoogleAuthError as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)

    accept_header = request.headers.get("accept", "")
    if json or "application/json" in accept_header:
        return JSONResponse(content={"url": auth_url, "state": state})

    return RedirectResponse(url=auth_url, status_code=status.HTTP_307_TEMPORARY_REDIRECT)


@router.get(
    "/callback",
    summary="Google OAuth 2.0 Callback",
    description="Processes authorization code from Google, performs token exchange, retrieves profile, and establishes session.",
)
async def callback(
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
) -> RedirectResponse:
    """
    Callback endpoint registered with Google Cloud Console.
    """
    frontend_login = f"{settings.frontend_url.rstrip('/')}/login"
    frontend_dashboard = f"{settings.frontend_url.rstrip('/')}/dashboard"

    # Handle user cancellation or error from Google
    if error:
        logger.warning("Google OAuth callback error: %s", error)
        return RedirectResponse(url=f"{frontend_login}?error=cancelled", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    if not code:
        logger.warning("Google OAuth callback missing authorization code.")
        return RedirectResponse(url=f"{frontend_login}?error=missing_code", status_code=status.HTTP_307_TEMPORARY_REDIRECT)

    try:
        tokens = await google_auth_service.exchange_code_for_tokens(code=code)
        access_token = tokens.get("access_token")
        if not access_token:
            raise GoogleAuthError("Access token not found in Google response.", status_code=400)

        user_profile = await google_auth_service.get_user_profile(access_token=access_token)
        session_token = google_auth_service.create_session_token(user=user_profile, access_token=access_token)

        response = RedirectResponse(url=frontend_dashboard, status_code=status.HTTP_307_TEMPORARY_REDIRECT)
        response.set_cookie(
            key="session_token",
            value=session_token,
            httponly=True,
            samesite="lax",
            secure=not settings.debug,
            path="/",
            max_age=60 * 60 * 24 * 7,  # 7 days
        )
        return response

    except GoogleAuthError as exc:
        logger.error("OAuth callback error: %s", exc.message)
        return RedirectResponse(url=f"{frontend_login}?error=auth_failed", status_code=status.HTTP_307_TEMPORARY_REDIRECT)
    except Exception as exc:
        logger.exception("Unexpected error in OAuth callback: %s", exc)
        return RedirectResponse(url=f"{frontend_login}?error=server_error", status_code=status.HTTP_307_TEMPORARY_REDIRECT)


@router.get(
    "/me",
    response_model=AuthStatusResponse,
    summary="Get Authenticated User Profile",
    description="Returns current authenticated user profile from HTTP-only session cookie or Bearer token.",
)
async def get_me(
    session_token: str | None = Cookie(default=None),
    authorization: str | None = Header(default=None),
) -> AuthStatusResponse:
    """
    Check current authentication state.
    """
    token = session_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split("Bearer ", 1)[1].strip()

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    user = google_auth_service.verify_session_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid",
        )

    return AuthStatusResponse(authenticated=True, user=user)


@router.post(
    "/logout",
    summary="Logout User",
    description="Destroys active session by clearing HTTP-only cookie.",
)
async def logout(response: Response) -> AuthStatusResponse:
    """
    Log out active user.
    """
    response.delete_cookie(
        key="session_token",
        path="/",
        samesite="lax",
        secure=not settings.debug,
    )
    return AuthStatusResponse(authenticated=False, user=None, message="Successfully logged out")
