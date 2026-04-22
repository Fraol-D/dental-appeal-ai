import json
import re
from typing import Any, Optional

from models.schemas import DenialClassification
from services.gemini import generate_with_gemini


def _extract_json_object(text: str) -> dict[str, Any]:
    fenced_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
    if fenced_match:
        return json.loads(fenced_match.group(1))

    object_match = re.search(r"\{.*\}", text, flags=re.DOTALL)
    if object_match:
        return json.loads(object_match.group(0))

    raise ValueError("Gemini response did not include a JSON object.")


def classify_denial(
    raw_denial_text: str,
    payer_name: Optional[str] = None,
    cdt_code: Optional[str] = None,
) -> DenialClassification:
    prompt = f"""
You are classifying a dental insurance denial.

Return ONLY a JSON object with these exact keys:
- denial_category: one of ["frequency_limitation", "bundling", "medical_necessity", "missing_documentation", "coordination_of_benefits"]
- cdt_code: a CDT code like "D4341" or null
- payer_name: payer name string or null
- confidence: one of ["high", "medium", "low"]

Use the hints if available:
- payer_name_hint: {payer_name if payer_name else 'null'}
- cdt_code_hint: {cdt_code if cdt_code else 'null'}

Denial text:
{raw_denial_text}
""".strip()

    raw_response = generate_with_gemini(prompt)
    parsed = _extract_json_object(raw_response)
    classification = DenialClassification.model_validate(parsed)

    updates: dict[str, str] = {}
    if payer_name and not classification.payer_name:
        updates["payer_name"] = payer_name
    if cdt_code and not classification.cdt_code:
        updates["cdt_code"] = cdt_code

    if updates:
        classification = classification.model_copy(update=updates)

    return classification
