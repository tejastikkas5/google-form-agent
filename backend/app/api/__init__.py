"""
app/api
=======
API routing layer.

Exposes versioned routers. Currently only v1 is active.
v2 can be added in the future without breaking existing consumers.
"""

from app.api.v1 import v1_router

__all__ = ["v1_router"]
