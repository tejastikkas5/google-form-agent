"""
app/middleware
==============
FastAPI middleware package.

Phase 0.2 — empty package.
Phase 0.5+ — custom middleware added here:

  - RequestIdMiddleware   — attach a unique X-Request-ID to every request
  - RateLimitMiddleware   — token-bucket rate limiting per API key / IP
  - TimingMiddleware      — add X-Process-Time header to responses
  - AuthMiddleware        — validate Bearer tokens (JWT)

Each middleware is a Starlette BaseHTTPMiddleware subclass and registered
inside app/main.py via app.add_middleware().
"""
