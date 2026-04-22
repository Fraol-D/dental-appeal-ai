import json
from pathlib import Path
from typing import Any, Optional

from models.schemas import AppealApproach, DenialClassification


def _load_payer_rules(rules_path: Optional[Path] = None) -> dict[str, Any]:
    if rules_path is None:
        rules_path = Path(__file__).resolve().parent.parent / "payer_rules.json"

    with rules_path.open("r", encoding="utf-8") as file:
        return json.load(file)


def _match_payer_name(
    available_payers: dict[str, Any], payer_name: Optional[str]
) -> Optional[str]:
    if not payer_name:
        return None

    normalized_input = payer_name.strip().lower()
    if not normalized_input:
        return None

    for candidate in available_payers.keys():
        if candidate.lower() == normalized_input:
            return candidate

    for candidate in available_payers.keys():
        candidate_lower = candidate.lower()
        if normalized_input in candidate_lower or candidate_lower in normalized_input:
            return candidate

    return None


def match_payer_rule(classification: DenialClassification) -> AppealApproach:
    rules = _load_payer_rules()

    default_rule = rules.get("default_strategy", {})
    payer_rules = rules.get("payers", {})

    matched_payer = _match_payer_name(payer_rules, classification.payer_name)
    selected_rule = payer_rules.get(matched_payer, default_rule)

    frequency_map = selected_rule.get("frequency_limitations", {})
    frequency_note = None
    if classification.cdt_code:
        frequency_note = frequency_map.get(classification.cdt_code)

    return AppealApproach(
        payer_name=matched_payer or classification.payer_name or "Generic",
        strategy_name=selected_rule.get("strategy_name", "Generic Dental Appeal"),
        appeal_language=selected_rule.get(
            "appeal_language",
            "Request reconsideration using clinical rationale and payer policy terms.",
        ),
        required_documentation=selected_rule.get("required_documentation", []),
        frequency_limit_note=frequency_note,
        fallback_used=matched_payer is None,
    )
