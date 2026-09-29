"""
app/services
============
Business logic services layer.

Phase 0.2 — empty package.
Phase 0.4+ — FormService, UserService, etc. live here.

Services coordinate between:
  - LLM providers  (app/llm)
  - Google APIs    (app/google)
  - Database       (app/models)
  - External APIs  (via httpx)

They are injected into API route handlers via FastAPI dependency injection.
"""
