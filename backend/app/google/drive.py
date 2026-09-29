"""
google/drive.py
===============
Google Drive API service — stub for Phase 0.2.

Phase 0.3 implements:
  - move_to_folder(file_id, folder_id)
  - set_public_permission(file_id)
  - get_shareable_link(file_id) -> str
"""

from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


class GoogleDriveService:
    """
    Wraps the Google Drive REST API.

    Phase 0.2 — placeholder.
    Phase 0.3 — full implementation.
    """

    def __init__(self, credentials: object | None = None) -> None:
        self._credentials = credentials

    async def move_to_folder(self, file_id: str, folder_id: str) -> None:
        """Move a Drive file into a specific folder."""
        raise NotImplementedError("GoogleDriveService.move_to_folder() — Phase 0.3")

    async def set_public_permission(self, file_id: str) -> None:
        """Make a Drive file accessible to anyone with the link."""
        raise NotImplementedError("GoogleDriveService.set_public_permission() — Phase 0.3")

    async def get_shareable_link(self, file_id: str) -> str:
        """Return the shortened shareable URL for the file."""
        raise NotImplementedError("GoogleDriveService.get_shareable_link() — Phase 0.3")
