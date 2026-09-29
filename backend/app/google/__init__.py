"""
app/google
==========
Google API service layer — Forms, Drive, Sheets.

Phase 0.2 — placeholder classes only.
Phase 0.3 — full OAuth + API implementation.
"""

from app.google.drive import GoogleDriveService
from app.google.forms import GoogleFormsService
from app.google.sheets import GoogleSheetsService

__all__ = ["GoogleDriveService", "GoogleFormsService", "GoogleSheetsService"]
