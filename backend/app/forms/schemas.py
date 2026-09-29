"""
app/forms/schemas.py
====================
Pydantic data models defining the canonical FormSchema contract.

Models:
  - ChoiceSchema
  - ValidationSchema
  - QuestionSchema
  - FormSettings
  - FormSchema
"""

from __future__ import annotations

from enum import Enum
from typing import Any
from pydantic import BaseModel, ConfigDict, Field, field_validator, model_validator


class QuestionType(str, Enum):
    """Supported question types for form generation."""

    SHORT_ANSWER = "short_answer"
    PARAGRAPH = "paragraph"
    MULTIPLE_CHOICE = "multiple_choice"
    CHECKBOXES = "checkboxes"
    DROPDOWN = "dropdown"
    DATE = "date"
    TIME = "time"
    EMAIL = "email"
    NUMBER = "number"
    LINEAR_SCALE = "linear_scale"


class ChoiceSchema(BaseModel):
    """Option choice for multiple choice, checkbox, or dropdown questions."""

    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    value: str = Field(..., description="Option choice label or value text")
    is_other: bool = Field(default=False, description="Whether this choice represents an 'Other' write-in option")


class ValidationSchema(BaseModel):
    """Input validation rules for text or numeric fields."""

    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    min_length: int | None = Field(default=None, ge=0, description="Minimum allowed character length")
    max_length: int | None = Field(default=None, ge=0, description="Maximum allowed character length")
    min_value: float | None = Field(default=None, description="Minimum numeric value allowed")
    max_value: float | None = Field(default=None, description="Maximum numeric value allowed")
    regex_pattern: str | None = Field(default=None, description="Regex pattern for text validation")
    error_message: str | None = Field(default=None, description="Custom error message on validation failure")


class QuestionSchema(BaseModel):
    """Schema representing an individual question item within a form."""

    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    id: str = Field(..., description="Unique question identifier within the form")
    title: str = Field(..., description="The primary question prompt or text")
    type: QuestionType = Field(..., description="Supported question input type")
    required: bool = Field(default=False, description="Whether answering this question is mandatory")
    placeholder: str | None = Field(default=None, description="Placeholder text for text input fields")
    help_text: str | None = Field(default=None, description="Additional context or guidance for respondents")
    choices: list[ChoiceSchema] | None = Field(default=None, description="Available choices for select/choice questions")
    validation: ValidationSchema | None = Field(default=None, description="Validation rules for respondent inputs")

    # Linear scale configuration (for rating/scale questions)
    low_label: str | None = Field(default=None, description="Label for lowest value on scale")
    high_label: str | None = Field(default=None, description="Label for highest value on scale")
    min_scale: int | None = Field(default=1, description="Minimum scale bound (e.g. 1)")
    max_scale: int | None = Field(default=5, description="Maximum scale bound (e.g. 5)")

    @field_validator("type", mode="before")
    @classmethod
    def normalize_question_type(cls, v: Any) -> Any:
        """Normalize common string aliases to standard QuestionType enum values."""
        if isinstance(v, str):
            v_clean = v.strip().lower().replace("-", "_").replace(" ", "_")
            alias_map = {
                "shortanswer": "short_answer",
                "text": "short_answer",
                "string": "short_answer",
                "single_line": "short_answer",
                "long_text": "paragraph",
                "textarea": "paragraph",
                "multi_line": "paragraph",
                "multiplechoice": "multiple_choice",
                "radio": "multiple_choice",
                "checkbox": "checkboxes",
                "select": "dropdown",
                "rating": "linear_scale",
                "scale": "linear_scale",
                "linear": "linear_scale",
            }
            return alias_map.get(v_clean, v_clean)
        return v

    @model_validator(mode="after")
    def validate_question_structure(self) -> QuestionSchema:
        """Ensure choice-based question types possess at least default choices."""
        choice_types = (
            QuestionType.MULTIPLE_CHOICE,
            QuestionType.CHECKBOXES,
            QuestionType.DROPDOWN,
        )
        if self.type in choice_types:
            if not self.choices or len(self.choices) == 0:
                self.choices = [
                    ChoiceSchema(value="Option 1"),
                    ChoiceSchema(value="Option 2"),
                ]
        return self


class FormSettings(BaseModel):
    """Configuration settings for the overall form behavior."""

    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    collect_email: bool = Field(default=False, description="Whether to collect respondent email addresses")
    allow_response_editing: bool = Field(default=False, description="Whether respondents can edit responses after submission")
    limit_to_one_response: bool = Field(default=False, description="Limit to single submission per respondent")
    shuffle_question_order: bool = Field(default=False, description="Randomize question display order")
    show_progress_bar: bool = Field(default=False, description="Display progress bar for multi-part forms")
    confirmation_message: str | None = Field(
        default="Thank you for submitting your response.",
        description="Custom message displayed after form submission",
    )


class FormSchema(BaseModel):
    """Canonical form schema object containing full form structure and settings."""

    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    title: str = Field(..., description="Main title of the form")
    description: str | None = Field(default="", description="Form sub-header or instruction text")
    settings: FormSettings = Field(default_factory=FormSettings, description="Form configuration settings")
    questions: list[QuestionSchema] = Field(default_factory=list, description="Ordered list of questions in the form")

    @model_validator(mode="after")
    def validate_non_empty_questions(self) -> FormSchema:
        """Ensure form schema includes at least one question."""
        if not self.questions:
            raise ValueError("FormSchema must contain at least one question.")
        return self
