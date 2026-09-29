"""
google/forms.py
===============
Service wrapping the official Google Forms REST API (v1).
Provides methods for creating blank Google Forms, fetching form metadata,
and populating a form with questions via batchUpdate.
"""

from __future__ import annotations

from datetime import datetime, timezone
import logging
from typing import Any

import httpx

from app.forms.schemas import FormSchema, QuestionType

logger = logging.getLogger(__name__)

GOOGLE_FORMS_API_BASE = "https://forms.googleapis.com/v1/forms"


class GoogleFormsError(Exception):
    """Exception raised when Google Forms API requests fail."""

    def __init__(self, message: str, status_code: int = 400) -> None:
        super().__init__(message)
        self.message = message
        self.status_code = status_code


class GoogleFormsService:
    """
    Client for interacting directly with the Google Forms REST API (v1).
    """

    def __init__(self) -> None:
        pass

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _make_headers(self, access_token: str) -> dict[str, str]:
        return {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }

    def _handle_error_response(self, response: httpx.Response, context: str = "") -> None:
        """Raise a GoogleFormsError with clear message for known HTTP error codes."""
        if response.status_code == 401:
            raise GoogleFormsError(
                "Google OAuth token expired or invalid. Please sign in again.", status_code=401
            )
        if response.status_code == 403:
            logger.error("Google Forms API 403 %s: %s", context, response.text)
            raise GoogleFormsError(
                "Google Forms API permission denied. Please grant Google Forms permissions.", status_code=403
            )
        if response.status_code == 404:
            raise GoogleFormsError(f"Google Form not found. {context}", status_code=404)
        if response.status_code not in (200, 201):
            logger.error("Google Forms API error (%d) %s: %s", response.status_code, context, response.text)
            raise GoogleFormsError(
                f"Google Forms API returned error ({response.status_code}).",
                status_code=response.status_code,
            )

    # ------------------------------------------------------------------
    # Schema → Google Forms API payload converters
    # ------------------------------------------------------------------

    def _schema_question_to_request(self, question: Any) -> dict | None:
        """
        Convert a QuestionSchema into a Google Forms API 'createItem' request body.
        Returns None if the question type is not supported by the API.
        """
        item: dict = {
            "title": question.title,
            "description": question.help_text or "",
        }
        q: dict = {"required": question.required}

        qtype = question.type

        if qtype in (QuestionType.SHORT_ANSWER, QuestionType.EMAIL, QuestionType.NUMBER):
            q["textQuestion"] = {"paragraph": False}
        elif qtype == QuestionType.PARAGRAPH:
            q["textQuestion"] = {"paragraph": True}
        elif qtype in (QuestionType.MULTIPLE_CHOICE, QuestionType.CHECKBOXES, QuestionType.DROPDOWN):
            option_type_map = {
                QuestionType.MULTIPLE_CHOICE: "RADIO",
                QuestionType.CHECKBOXES: "CHECKBOX",
                QuestionType.DROPDOWN: "DROP_DOWN",
            }
            choices = question.choices or []
            options = [{"value": c.value} for c in choices if c.value]
            if not options:
                options = [{"value": "Option 1"}, {"value": "Option 2"}]
            q["choiceQuestion"] = {
                "type": option_type_map[qtype],
                "options": options,
            }
        elif qtype == QuestionType.DATE:
            q["dateQuestion"] = {"includeTime": False, "includeYear": True}
        elif qtype == QuestionType.TIME:
            q["timeQuestion"] = {"duration": False}
        elif qtype == QuestionType.LINEAR_SCALE:
            low = question.min_scale if question.min_scale is not None else 1
            high = question.max_scale if question.max_scale is not None else 5
            scale_opts: dict = {"low": low, "high": high}
            if question.low_label:
                scale_opts["lowLabel"] = question.low_label
            if question.high_label:
                scale_opts["highLabel"] = question.high_label
            q["scaleQuestion"] = scale_opts
        else:
            # Fallback to short answer for any unknown type
            q["textQuestion"] = {"paragraph": False}

        item["questionItem"] = {"question": q}
        return {"createItem": {"item": item, "location": {"index": 0}}}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    async def create_blank_form(self, access_token: str, title: str = "Untitled Form") -> dict:
        """
        Create a new blank Google Form using the user's OAuth access token.
        """
        if not access_token:
            raise GoogleFormsError("Missing Google OAuth access token.", status_code=401)

        headers = self._make_headers(access_token)
        body = {"info": {"title": title or "Untitled Form"}}

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.post(GOOGLE_FORMS_API_BASE, headers=headers, json=body)

            self._handle_error_response(response, context="create_blank_form")

            data = response.json()
            form_id = data.get("formId")
            if not form_id:
                raise GoogleFormsError("Google Forms API response missing formId.", status_code=500)

            info = data.get("info", {})
            form_title = info.get("title") or title
            responder_url = data.get("responderUri") or f"https://docs.google.com/forms/d/e/{form_id}/viewform"
            edit_url = f"https://docs.google.com/forms/d/{form_id}/edit"
            created_time = datetime.now(timezone.utc).isoformat()

            return {
                "formId": form_id,
                "title": form_title,
                "editUrl": edit_url,
                "responderUrl": responder_url,
                "createdTime": created_time,
            }

        except GoogleFormsError:
            raise
        except httpx.RequestError as exc:
            logger.error("Network error connecting to Google Forms API: %s", exc)
            raise GoogleFormsError("Network failure while connecting to Google Forms API.", status_code=503)

    async def populate_form_with_questions(
        self, access_token: str, form_id: str, form_schema: FormSchema
    ) -> None:
        """
        Use the Google Forms batchUpdate API to add all questions from FormSchema
        into an existing Google Form.
        """
        if not access_token:
            raise GoogleFormsError("Missing Google OAuth access token.", status_code=401)
        if not form_id:
            raise GoogleFormsError("Form ID is required.", status_code=400)

        if not form_schema.questions:
            return  # Nothing to add

        headers = self._make_headers(access_token)
        url = f"{GOOGLE_FORMS_API_BASE}/{form_id}:batchUpdate"

        # Build requests list — add questions in reverse so index=0 inserts maintain order
        requests = []
        for question in reversed(form_schema.questions):
            req = self._schema_question_to_request(question)
            if req:
                requests.append(req)

        if not requests:
            return

        body = {"requests": requests}

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(url, headers=headers, json=body)

            self._handle_error_response(response, context="populate_form_with_questions")

        except GoogleFormsError:
            raise
        except httpx.RequestError as exc:
            logger.error("Network error during batchUpdate: %s", exc)
            raise GoogleFormsError("Network failure during form question creation.", status_code=503)

    async def create_form_from_schema(
        self, access_token: str, form_schema: FormSchema
    ) -> dict:
        """
        High-level method: Creates a Google Form and populates it with
        all questions from a FormSchema in one pipeline.
        Returns a dict with formId, title, editUrl, responderUrl, createdTime, questionCount.
        """
        # Step 1: Create blank form with the schema title
        result = await self.create_blank_form(access_token, title=form_schema.title)
        form_id = result["formId"]

        # Step 2: Populate with questions via batchUpdate
        try:
            await self.populate_form_with_questions(access_token, form_id, form_schema)
        except GoogleFormsError as exc:
            logger.error("Failed to populate form %s with questions: %s", form_id, exc.message)
            # Return partial result with error note rather than failing completely
            result["questionCount"] = 0
            result["warning"] = f"Form created but questions could not be added: {exc.message}"
            return result

        result["questionCount"] = len(form_schema.questions)
        result["description"] = form_schema.description or ""
        return result

    async def update_form_from_schema(
        self, access_token: str, form_id: str, form_schema: FormSchema
    ) -> dict:
        """
        Updates an existing Google Form with new title, description, and questions from FormSchema.
        Replaces existing items on the form with the updated questions.
        """
        if not access_token:
            raise GoogleFormsError("Missing Google OAuth access token.", status_code=401)
        if not form_id:
            raise GoogleFormsError("Form ID is required.", status_code=400)

        headers = self._make_headers(access_token)
        url = f"{GOOGLE_FORMS_API_BASE}/{form_id}"

        # Step 1: Fetch current form to get existing items
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers)
            self._handle_error_response(response, context=f"get_form_for_update({form_id})")
            existing_data = response.json()
        except GoogleFormsError:
            raise
        except httpx.RequestError as exc:
            logger.error("Network error fetching form for update: %s", exc)
            raise GoogleFormsError("Network failure connecting to Google Forms API.", status_code=503)

        existing_items = existing_data.get("items", [])

        # Step 2: Build batchUpdate requests
        requests = []

        # 2a. Delete existing items in reverse order
        for idx in range(len(existing_items) - 1, -1, -1):
            requests.append({"deleteItem": {"location": {"index": idx}}})

        # 2b. Update form title & description
        requests.append({
            "updateFormInfo": {
                "info": {
                    "title": form_schema.title,
                    "description": form_schema.description or "",
                },
                "updateMask": "title,description",
            }
        })

        # 2c. Add new questions in reverse order
        for question in reversed(form_schema.questions):
            req = self._schema_question_to_request(question)
            if req:
                requests.append(req)

        # Step 3: Send batchUpdate
        batch_url = f"{GOOGLE_FORMS_API_BASE}/{form_id}:batchUpdate"
        body = {"requests": requests}

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                batch_res = await client.post(batch_url, headers=headers, json=body)
            self._handle_error_response(batch_res, context=f"update_form_from_schema({form_id})")
        except GoogleFormsError:
            raise
        except httpx.RequestError as exc:
            logger.error("Network error during form update batchUpdate: %s", exc)
            raise GoogleFormsError("Network failure during form update.", status_code=503)

        responder_url = existing_data.get("responderUri") or f"https://docs.google.com/forms/d/e/{form_id}/viewform"
        edit_url = f"https://docs.google.com/forms/d/{form_id}/edit"
        created_time = datetime.now(timezone.utc).isoformat()

        return {
            "formId": form_id,
            "title": form_schema.title,
            "description": form_schema.description or "",
            "editUrl": edit_url,
            "responderUrl": responder_url,
            "createdTime": created_time,
            "questionCount": len(form_schema.questions),
        }

    async def get_form_details(self, access_token: str, form_id: str) -> dict:
        """
        Fetch details for an existing Google Form by ID.
        """
        if not access_token:
            raise GoogleFormsError("Missing Google OAuth access token.", status_code=401)
        if not form_id:
            raise GoogleFormsError("Form ID is required.", status_code=400)

        url = f"{GOOGLE_FORMS_API_BASE}/{form_id}"
        headers = {"Authorization": f"Bearer {access_token}"}

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(url, headers=headers)

            self._handle_error_response(response, context=f"get_form_details({form_id})")

            data = response.json()
            info = data.get("info", {})
            responder_url = data.get("responderUri") or f"https://docs.google.com/forms/d/e/{form_id}/viewform"
            edit_url = f"https://docs.google.com/forms/d/{form_id}/edit"

            return {
                "formId": data.get("formId", form_id),
                "title": info.get("title", "Untitled Form"),
                "description": info.get("description", ""),
                "revisionId": data.get("revisionId", ""),
                "responderUrl": responder_url,
                "editUrl": edit_url,
            }

        except GoogleFormsError:
            raise
        except httpx.RequestError as exc:
            logger.error("Network error fetching Google Form details: %s", exc)
            raise GoogleFormsError("Network failure connecting to Google Forms API.", status_code=503)


# Singleton instance
google_forms_service = GoogleFormsService()
