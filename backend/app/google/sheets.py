"""
google/sheets.py
================
Google Sheets API service — stub for Phase 0.2.

Phase 0.3 implements:
  - create_response_sheet(form_title) -> str  (spreadsheet URL)
  - link_to_form(form_id, spreadsheet_id)
  - get_responses(spreadsheet_id) -> list[dict]
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


class GoogleSheetsService:
    """
    Wraps the Google Sheets REST API.

    Phase 0.2 — placeholder.
    Phase 0.3 — full implementation.
    """

    def __init__(self, credentials: object | None = None) -> None:
        self._credentials = credentials

    async def create_response_sheet(self, form_title: str) -> str:
        """Create a new spreadsheet to collect form responses."""
        raise NotImplementedError("GoogleSheetsService.create_response_sheet() — Phase 0.3")

    async def link_to_form(self, form_id: str, spreadsheet_id: str) -> None:
        """Link a Google Form to a Sheets spreadsheet for response collection."""
        raise NotImplementedError("GoogleSheetsService.link_to_form() — Phase 0.3")

    async def get_responses(self, spreadsheet_id: str) -> list[dict]:
        """Fetch all form responses from the linked spreadsheet."""
        raise NotImplementedError("GoogleSheetsService.get_responses() — Phase 0.3")
