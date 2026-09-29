"""
tests/test_llm_gemini.py
========================
Unit and integration tests for Gemini LLM provider and FastAPI endpoints.
"""

import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from fastapi.testclient import TestClient

from app.main import app
from app.llm.gemini import GeminiProvider
from app.llm.exceptions import (
    InvalidAPIKeyError,
    InvalidLLMResponse,
    ProviderNotConfigured,
    ProviderUnavailable,
    RateLimitError,
)
from app.llm.schemas import PromptRequest, PromptResponse, ProviderHealth
from google.genai import errors


client = TestClient(app)


# ======================================================================
# Unit Tests for GeminiProvider
# ======================================================================

@pytest.mark.asyncio
async def test_gemini_provider_unconfigured_health():
    provider = GeminiProvider(api_key="", model="gemini-2.5-flash")
    health = await provider.health()
    assert isinstance(health, ProviderHealth)
    assert health.provider == "gemini"
    assert health.model == "gemini-2.5-flash"
    assert health.configured is False
    assert health.status == "unconfigured"


@pytest.mark.asyncio
async def test_gemini_provider_configured_health():
    provider = GeminiProvider(api_key="valid-test-key", model="gemini-2.5-flash")
    health = await provider.health()
    assert health.configured is True
    assert health.status == "ok"


@pytest.mark.asyncio
async def test_gemini_provider_unconfigured_generate():
    provider = GeminiProvider(api_key="", model="gemini-2.5-flash")
    req = PromptRequest(prompt="Hello")
    with pytest.raises(ProviderNotConfigured):
        await provider.generate(req)


@pytest.mark.asyncio
async def test_gemini_provider_empty_prompt():
    provider = GeminiProvider(api_key="valid-key", model="gemini-2.5-flash")
    req = PromptRequest(prompt="   ")
    with pytest.raises(InvalidLLMResponse):
        await provider.generate(req)


@pytest.mark.asyncio
async def test_gemini_provider_successful_generation():
    provider = GeminiProvider(api_key="mock-api-key", model="gemini-2.5-flash")
    req = PromptRequest(prompt="Hello Gemini", temperature=0.5, max_tokens=100)

    mock_response = MagicMock()
    mock_response.text = "Hello! How can I help you today?"
    mock_response.usage_metadata.prompt_token_count = 10
    mock_response.usage_metadata.candidates_token_count = 15
    mock_response.usage_metadata.total_token_count = 25

    mock_genai_client = MagicMock()
    mock_genai_client.aio.models.generate_content = AsyncMock(return_value=mock_response)

    with patch("app.llm.gemini.genai.Client", return_value=mock_genai_client):
        res = await provider.generate(req)
        assert isinstance(res, PromptResponse)
        assert res.content == "Hello! How can I help you today?"
        assert res.metadata.provider == "gemini"
        assert res.metadata.model == "gemini-2.5-flash"
        assert res.metadata.token_usage.total_tokens == 25


@pytest.mark.asyncio
async def test_gemini_provider_invalid_api_key_error():
    provider = GeminiProvider(api_key="invalid-key", model="gemini-2.5-flash")
    req = PromptRequest(prompt="Hello")

    mock_client_error = errors.ClientError(
        code=400,
        response_json={"error": {"code": 400, "message": "API key not valid. Please pass a valid API key."}}
    )

    mock_genai_client = MagicMock()
    mock_genai_client.aio.models.generate_content = AsyncMock(side_effect=mock_client_error)

    with patch("app.llm.gemini.genai.Client", return_value=mock_genai_client):
        with pytest.raises(InvalidAPIKeyError):
            await provider.generate(req)


@pytest.mark.asyncio
async def test_gemini_provider_rate_limit_error():
    provider = GeminiProvider(api_key="valid-key", model="gemini-2.5-flash")
    req = PromptRequest(prompt="Hello")

    mock_rate_error = errors.ClientError(
        code=429,
        response_json={"error": {"code": 429, "message": "RESOURCE_EXHAUSTED"}}
    )

    mock_genai_client = MagicMock()
    mock_genai_client.aio.models.generate_content = AsyncMock(side_effect=mock_rate_error)

    with patch("app.llm.gemini.genai.Client", return_value=mock_genai_client):
        with pytest.raises(RateLimitError):
            await provider.generate(req)


@pytest.mark.asyncio
async def test_gemini_provider_server_error():
    provider = GeminiProvider(api_key="valid-key", model="gemini-2.5-flash")
    req = PromptRequest(prompt="Hello")

    mock_server_error = errors.ServerError(
        code=503,
        response_json={"error": {"code": 503, "message": "Service unavailable"}}
    )

    mock_genai_client = MagicMock()
    mock_genai_client.aio.models.generate_content = AsyncMock(side_effect=mock_server_error)

    with patch("app.llm.gemini.genai.Client", return_value=mock_genai_client):
        with pytest.raises(ProviderUnavailable):
            await provider.generate(req)


# ======================================================================
# Integration Tests for FastAPI Router Endpoints
# ======================================================================

def test_api_health_endpoint():
    response = client.get("/api/v1/llm/health")
    assert response.status_code == 200
    data = response.json()
    assert "provider" in data
    assert "status" in data
    assert "model" in data
    assert "configured" in data


def test_api_generate_endpoint_unconfigured():
    with patch("app.core.config.settings.gemini_api_key", "not-set-yet"):
        response = client.post("/api/v1/llm/generate", json={"prompt": "Hello Gemini"})
        assert response.status_code in (503, 400)


def test_api_generate_endpoint_success():
    mock_resp = PromptResponse(
        content="Generated text content from Gemini",
        metadata={
            "provider": "gemini",
            "model": "gemini-2.5-flash",
            "latency_ms": 12.34,
            "token_usage": {"prompt_tokens": 5, "completion_tokens": 10, "total_tokens": 15},
        }
    )

    with patch("app.llm.gemini.GeminiProvider.generate", AsyncMock(return_value=mock_resp)):
        response = client.post("/api/v1/llm/generate", json={"prompt": "Hello Gemini"})
        assert response.status_code == 200
        data = response.json()
        assert data["content"] == "Generated text content from Gemini"
        assert data["metadata"]["provider"] == "gemini"
        assert data["metadata"]["model"] == "gemini-2.5-flash"
