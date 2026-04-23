from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from agent.classifier import classify_denial, validate_denial_text
from agent.letter_gen import generate_appeal_letter
from agent.rule_engine import match_payer_rule
from models.schemas import DenialInput, GenerateAppealResponse

app = FastAPI(title="Dental Denial Appeal Letter Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/generate-appeal", response_model=GenerateAppealResponse)
def generate_appeal(payload: DenialInput) -> GenerateAppealResponse:
    try:
        validity = validate_denial_text(payload.denial_text)
        if not validity.is_valid_denial:
            raise HTTPException(status_code=400, detail=validity.reason)

        classification = classify_denial(
            raw_denial_text=payload.denial_text,
            payer_name=payload.payer_name,
            cdt_code=payload.cdt_code,
        )
        if classification.denial_category == "invalid_input":
            raise HTTPException(
                status_code=400,
                detail="Input does not look like a dental insurance denial reason. Please paste the denial text from your EOB or payer notice.",
            )

        approach = match_payer_rule(classification)
        letter = generate_appeal_letter(classification, approach)

        return GenerateAppealResponse(
            classification=classification,
            appeal_approach=approach,
            letter=letter,
        )
    except ValidationError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error
    except ValueError as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except RuntimeError as error:
        if "rate limit" in str(error).lower():
            raise HTTPException(status_code=429, detail=str(error)) from error
        raise HTTPException(status_code=502, detail=str(error)) from error
