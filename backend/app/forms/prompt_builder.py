"""
app/forms/prompt_builder.py
============================
Dedicated prompt builder constructing system instructions and user prompts
for LLM FormSchema generation and form editing/updates.
"""

from __future__ import annotations

import json
from typing import Any


FORM_DESIGNER_SYSTEM_INSTRUCTION = """\
You are an expert Google Forms designer and Senior UX Architect.
Your role is to transform natural language form requests into clean, highly professional, structured form schemas.

CRITICAL OUTPUT REQUIREMENTS:
1. Return ONLY raw, valid JSON satisfying the FormSchema specification.
2. DO NOT use markdown code blocks (DO NOT wrap JSON in ```json or ```).
3. DO NOT output any introductory text, explanation, summary, or postscript.
4. The output must start with '{' and end with '}'.

SUPPORTED QUESTION TYPES:
- "short_answer": Brief text field.
- "paragraph": Extended multi-line text area.
- "multiple_choice": Single choice selection (radio buttons).
- "checkboxes": Multi-select options.
- "dropdown": Dropdown selection menu.
- "date": Date selector.
- "time": Time selector.
- "email": Email address input.
- "number": Numeric value field.
- "linear_scale": Rating scale (min_scale to max_scale).

EXPECTED JSON SCHEMA TEMPLATE:
{
  "title": "Form Title Here",
  "description": "Clear instructions for respondents.",
  "settings": {
    "collect_email": false,
    "allow_response_editing": false,
    "limit_to_one_response": false,
    "show_progress_bar": true,
    "confirmation_message": "Thank you for completing this form."
  },
  "questions": [
    {
      "id": "q1",
      "title": "Question text",
      "type": "short_answer",
      "required": true,
      "placeholder": "Sample placeholder",
      "help_text": "Helpful guidance"
    },
    {
      "id": "q2",
      "title": "Select one option",
      "type": "multiple_choice",
      "required": true,
      "choices": [
        {"value": "Option A", "is_other": false},
        {"value": "Option B", "is_other": false}
      ]
    }
  ]
}
"""


class FormPromptBuilder:
    """
    Constructs System Instructions and User Prompts for FormSchema generation and modifications.
    """

    @staticmethod
    def get_system_instruction() -> str:
        """Return the strict system instruction defining designer persona and JSON format rules."""
        return FORM_DESIGNER_SYSTEM_INSTRUCTION

    @staticmethod
    def build_prompt(user_prompt: str, current_schema_dict: dict[str, Any] | None = None) -> str:
        """
        Construct the prompt text requesting form generation or modification.
        """
        clean_user_prompt = user_prompt.strip()

        if current_schema_dict:
            schema_json = json.dumps(current_schema_dict, indent=2)
            return (
                f"You are updating an existing form based on user feedback.\n\n"
                f"CURRENT FORM SCHEMA:\n{schema_json}\n\n"
                f"USER REQUEST: \"{clean_user_prompt}\"\n\n"
                f"RULES FOR MODIFICATION:\n"
                f"1. If the user is asking to modify, add, or remove questions from the current form (e.g., 'delete the t shirt field', 'add phone number', 'change title'), update the CURRENT FORM SCHEMA accordingly.\n"
                f"2. Keep all unmodified questions, title, and description intact unless changes were requested.\n"
                f"3. If the user is explicitly requesting a completely NEW and unrelated form (e.g. 'Create a brand new survey for employee feedback'), ignore the current schema and generate a fresh schema.\n"
                f"4. Return ONLY valid, raw JSON starting with '{{' and ending with '}}'."
            )

        return (
            f"Design a complete, high-quality FormSchema JSON for the following form request:\n\n"
            f"User Prompt: \"{clean_user_prompt}\"\n\n"
            f"Strict Requirement: Return ONLY valid, raw JSON starting with '{{' and ending with '}}'."
        )
