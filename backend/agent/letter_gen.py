from models.schemas import AppealApproach, AppealLetter, DenialClassification
from services.gemini import generate_with_gemini


def generate_appeal_letter(
    classification: DenialClassification,
    approach: AppealApproach,
) -> str:
    prompt = f"""
You are an expert dental insurance appeals writer.

Write a complete and professional appeal letter with no markdown.
The letter must include all of these placeholders exactly as written:
- [PATIENT NAME]
- [DATE OF SERVICE]
- [CLAIM NUMBER]
- [PAYER ADDRESS]

Context:
- denial_category: {classification.denial_category}
- cdt_code: {classification.cdt_code or 'unknown'}
- payer_name: {classification.payer_name or approach.payer_name}
- confidence: {classification.confidence}
- strategy_name: {approach.strategy_name}
- payer_appeal_language: {approach.appeal_language}
- required_documentation: {', '.join(approach.required_documentation)}
- frequency_limit_note: {approach.frequency_limit_note or 'none'}

Requirements:
- Include date line, payer address block, subject line, body, and closing.
- Keep tone formal and medically grounded.
- Mention attached supporting documentation.
- Do not include PHI beyond placeholders.
""".strip()

    raw_letter = generate_with_gemini(prompt)
    validated = AppealLetter.model_validate({"letter": raw_letter.strip()})
    return validated.letter
