import os
import sys

# Ensure backend directory is in sys.path for Vercel serverless functions
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "../backend"))

from app.main import app  # noqa: F401
