# Prompt2Form — Backend (Phase 0.2)

AI-powered Google Form generator — FastAPI backend foundation.

---

## What is this phase?

Phase 0.2 establishes the **production-ready backend architecture**.  
No AI, no Google APIs, no database — just a clean, scalable foundation that every future phase builds on top of.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | FastAPI 0.115 |
| Server | Uvicorn (ASGI) |
| Validation | Pydantic v2 |
| Config | Pydantic Settings |
| HTTP Client | httpx |
| Logging | colorlog |
| Python | 3.12+ |

---

## Folder Structure

```
backend/
├── app/
│   ├── main.py              ← FastAPI app factory + root endpoint
│   ├── api/
│   │   └── v1/
│   │       ├── __init__.py  ← v1 router aggregator
│   │       └── health.py    ← GET /api/v1/health
│   ├── core/
│   │   ├── config.py        ← Pydantic Settings (all env vars)
│   │   ├── logging.py       ← Colored console logging
│   │   └── exceptions.py    ← Exception hierarchy + handlers
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── base.py          ← ApiResponse, HealthResponse, ErrorResponse
│   ├── llm/
│   │   ├── base.py          ← Abstract LLMProvider interface
│   │   ├── gemini.py        ← GeminiProvider stub (Phase 0.4)
│   │   └── factory.py       ← Provider factory + registry
│   ├── google/
│   │   ├── forms.py         ← GoogleFormsService stub (Phase 0.3)
│   │   ├── drive.py         ← GoogleDriveService stub (Phase 0.3)
│   │   └── sheets.py        ← GoogleSheetsService stub (Phase 0.3)
│   ├── agents/              ← LangGraph agents (Phase 0.6+)
│   ├── services/            ← Business logic (Phase 0.4+)
│   ├── middleware/          ← Custom middleware (Phase 0.5+)
│   ├── models/              ← ORM models (Phase 0.5+)
│   └── utils/               ← Shared helpers (Phase 0.4+)
├── tests/                   ← pytest test suite (Phase 0.5+)
├── .env                     ← Local secrets (git-ignored)
├── .env.example             ← Template for .env
├── requirements.txt
└── README.md
```

---

## Installation

### 1. Create and activate a virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment variables

```bash
cp .env.example .env
# Edit .env and fill in your values
```

---

## Running the Server

```bash
# Development (auto-reload)
uvicorn app.main:app --reload

# Custom host/port
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Or use the built-in launcher
python -m app.main
```

---

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/` | Service info |
| `GET` | `/api/v1/health` | Health check |
| `GET` | `/docs` | Swagger UI (debug mode only) |
| `GET` | `/redoc` | ReDoc (debug mode only) |

### Example responses

```json
GET /
{
  "status": "running",
  "project": "Prompt2Form",
  "version": "0.1.0"
}

GET /api/v1/health
{
  "status": "healthy"
}
```

---

## Environment Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `HOST` | `127.0.0.1` | No | Server bind host |
| `PORT` | `8000` | No | Server bind port |
| `DEBUG` | `False` | No | Enable debug mode + Swagger UI |
| `SECRET_KEY` | — | **Yes** (prod) | JWT signing key |
| `GEMINI_API_KEY` | — | Phase 0.4+ | Google Gemini API key |
| `GOOGLE_CLIENT_ID` | — | Phase 0.3+ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | — | Phase 0.3+ | Google OAuth client secret |

---

## Error Response Format

All errors return a consistent JSON envelope:

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found.",
    "detail": null
  }
}
```

---

## Development Phases

| Phase | Description | Status |
|---|---|---|
| **0.2** | Backend architecture + health endpoint | ✅ Current |
| 0.3 | Google OAuth + Forms/Drive/Sheets API | 🔜 |
| 0.4 | LLM prompt → JSON (Gemini) | 🔜 |
| 0.5 | AI Agent workflow (LangGraph) | 🔜 |
| 0.6 | Database + user management | 🔜 |
| 0.7 | Advanced features | 🔜 |
