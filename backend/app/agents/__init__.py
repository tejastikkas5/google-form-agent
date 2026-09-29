"""
app/agents
==========
AI agent orchestration layer.

Phase 0.2 — empty package.
Phase 0.6+ — LangGraph / multi-step agent nodes live here.

Agent nodes planned:
  - understand_prompt  — parse user intent
  - extract_intent     — classify form type
  - generate_json      — produce FormSpec via LLM
  - validate_json      — ensure spec is well-formed
  - create_form        — call Google Forms API
  - add_questions      — batch insert questions
  - publish            — set permissions
  - return_links       — compose final response
"""
