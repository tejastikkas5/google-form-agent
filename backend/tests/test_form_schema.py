"""
tests/test_form_schema.py
=========================
Unit and integration tests for FormSchema models, FormPromptBuilder,
GeminiProvider schema generation, and FastAPI POST /api/v1/forms/generate-schema endpoint.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from pydantic import ValidationError
from fastapi.testclient import TestClient

from app.main import app
from app.forms.schemas import (
    ChoiceSchema,
    FormSchema,
    FormSettings,
    QuestionSchema,
    QuestionType,
    ValidationSchema,
)
from app.forms.prompt_builder import FormPromptBuilder
from app.llm.gemini import GeminiProvider
from app.llm.exceptions import InvalidLLMResponse, ProviderNotConfigured


client = TestClient(app)


# ======================================================================
# Unit Tests for Pydantic Form Schema Models
# ======================================================================

def test_question_type_alias_normalization():
    q1 = QuestionSchema(id="q1", title="Rating", type="rating")
    assert q1.type == QuestionType.LINEAR_SCALE

    q2 = QuestionSchema(id="q2", title="Details", type="long_text")
    assert q2.type == QuestionType.PARAGRAPH

    q3 = QuestionSchema(id="q3", title="Name", type="text")
    assert q3.type == QuestionType.SHORT_ANSWER


def test_choice_question_default_choices():
    q = QuestionSchema(id="q1", title="Pick one", type=QuestionType.MULTIPLE_CHOICE)
    assert q.choices is not None
    assert len(q.choices) == 2
    assert q.choices[0].value == "Option 1"


def test_form_schema_validation():
    # Empty questions should fail validation
    with pytest.raises(ValidationError):
        FormSchema(title="Test Form", questions=[])

    schema = FormSchema(
        title="Student Registration Form",
        description="Fill out student details.",
        settings=FormSettings(collect_email=True),
        questions=[
            QuestionSchema(
                id="q1",
                title="Full Name",
                type=QuestionType.SHORT_ANSWER,
                required=True,
            ),
            QuestionSchema(
                id="q2",
                title="Course Selection",
                type=QuestionType.DROPDOWN,
                choices=[ChoiceSchema(value="Computer Science"), ChoiceSchema(value="Mathematics")],
            ),
        ],
    )
    assert schema.title == "Student Registration Form"
    assert len(schema.questions) == 2
    assert schema.settings.collect_email is True


# ======================================================================
# Unit Tests for FormPromptBuilder
# ======================================================================

def test_prompt_builder():
    sys_inst = FormPromptBuilder.get_system_instruction()
    assert "expert Google Forms designer" in sys_inst
    assert "Return ONLY raw, valid JSON" in sys_inst

    user_p = FormPromptBuilder.build_prompt("Create a customer feedback survey")
    assert "customer feedback survey" in user_p
    assert "FormSchema JSON" in user_p


# ======================================================================
# Unit Tests for GeminiProvider.generate_form_schema()
# ======================================================================

@pytest.mark.asyncio
async def test_gemini_generate_form_schema_unconfigured():
    provider = GeminiProvider(api_key="", model="gemini-2.5-flash")
    with pytest.raises(ProviderNotConfigured):
        await provider.generate_form_schema("Create a feedback form")


@pytest.mark.asyncio
async def test_gemini_generate_form_schema_success():
    provider = GeminiProvider(api_key="mock-api-key", model="gemini-2.5-flash")

    valid_json_response = """
    {
      "title": "Employee Feedback Form",
      "description": "Feedback survey",
      "settings": { "collect_email": true },
      "questions": [
        {
          "id": "q1",
          "title": "What is your department?",
          "type": "dropdown",
          "required": true,
          "choices": [{"value": "Engineering"}, {"value": "Sales"}]
        }
      ]
    }
    """

    mock_response = MagicMock()
    mock_response.text = valid_json_response

    mock_genai_client = MagicMock()
    mock_genai_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("app.llm.gemini.genai.Client", return_value=mock_genai_client):
        schema = await provider.generate_form_schema("Create an employee feedback form")
        assert isinstance(schema, FormSchema)
        assert schema.title == "Employee Feedback Form"
        assert len(schema.questions) == 1
        assert schema.questions[0].type == QuestionType.DROPDOWN


@pytest.mark.asyncio
async def test_gemini_generate_form_schema_malformed_json():
    provider = GeminiProvider(api_key="mock-api-key", model="gemini-2.5-flash")

    invalid_json_response = "{ title: 'Broken JSON without quotes' "

    mock_response = MagicMock()
    mock_response.text = invalid_json_response

    mock_genai_client = MagicMock()
    mock_genai_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("app.llm.gemini.genai.Client", return_value=mock_genai_client):
        with pytest.raises(InvalidLLMResponse):
            await provider.generate_form_schema("Create a form")


# ======================================================================
# Integration Tests for POST /api/v1/forms/generate-schema Endpoint
# ======================================================================

def test_api_generate_schema_success():
    mock_form_schema = FormSchema(
        title="Customer Feedback Survey",
        description="Tell us about your experience",
        questions=[
            QuestionSchema(
                id="q1",
                title="Overall Experience",
                type=QuestionType.LINEAR_SCALE,
                min_scale=1,
                max_scale=5,
            )
        ]
    )

    with patch("app.llm.gemini.GeminiProvider.generate_form_schema", AsyncMock(return_value=mock_form_schema)):
        response = client.post(
            "/api/v1/forms/generate-schema",
            json={"prompt": "Create customer feedback survey"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "Customer Feedback Survey"
        assert len(data["questions"]) == 1
        assert data["questions"][0]["type"] == "linear_scale"


def test_api_generate_schema_empty_prompt():
    response = client.post(
        "/api/v1/forms/generate-schema",
        json={"prompt": "   "}
    )
    assert response.status_code == 400
