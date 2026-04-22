from typing import Literal, Optional

from pydantic import BaseModel, Field, field_validator

DenialCategory = Literal[
    "frequency_limitation",
    "bundling",
    "medical_necessity",
    "missing_documentation",
    "coordination_of_benefits",
]
ConfidenceLevel = Literal["high", "medium", "low"]


class DenialInput(BaseModel):
    denial_text: str = Field(..., min_length=10)
    payer_name: Optional[str] = None
    cdt_code: Optional[str] = Field(default=None, pattern=r"^D\d{4}$")

    @field_validator("denial_text")
    @classmethod
    def validate_denial_text(cls, value: str) -> str:
        cleaned = value.strip()
        if not cleaned:
            raise ValueError("denial_text cannot be empty.")
        return cleaned

    @field_validator("payer_name", "cdt_code")
    @classmethod
    def normalize_optional_text(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None


class DenialClassification(BaseModel):
    denial_category: DenialCategory
    cdt_code: Optional[str] = Field(default=None, pattern=r"^D\d{4}$")
    payer_name: Optional[str] = None
    confidence: ConfidenceLevel

    @field_validator("payer_name")
    @classmethod
    def normalize_payer_name(cls, value: Optional[str]) -> Optional[str]:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None


class AppealApproach(BaseModel):
    payer_name: str
    strategy_name: str
    appeal_language: str
    required_documentation: list[str]
    frequency_limit_note: Optional[str] = None
    fallback_used: bool = False


class AppealLetter(BaseModel):
    letter: str = Field(..., min_length=100)

    @field_validator("letter")
    @classmethod
    def enforce_required_placeholders(cls, value: str) -> str:
        required_tokens = [
            "[PATIENT NAME]",
            "[DATE OF SERVICE]",
            "[CLAIM NUMBER]",
            "[PAYER ADDRESS]",
        ]
        for token in required_tokens:
            if token not in value:
                raise ValueError(
                    f"Generated letter is missing required placeholder: {token}"
                )
        return value


class GenerateAppealResponse(BaseModel):
    classification: DenialClassification
    appeal_approach: AppealApproach
    letter: str
