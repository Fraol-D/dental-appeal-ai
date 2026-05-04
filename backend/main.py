import os
import logging
import time
from collections import defaultdict, deque
from threading import Lock

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pydantic import ValidationError
from supabase import Client, create_client

from agent.classifier import classify_denial, validate_denial_text
from agent.letter_gen import generate_appeal_letter
from agent.rule_engine import match_payer_rule
from models.schemas import (
    DenialInput,
    GenerateAppealResponse,
    WaitlistSignupInput,
    WaitlistSignupResponse,
)

load_dotenv()

app = FastAPI(title="Dental Denial Appeal Letter Generator API")
logger = logging.getLogger("uvicorn.error")

RATE_LIMIT_WINDOW_SECONDS = 60 * 60
RATE_LIMIT_MAX_SUBMISSIONS = 3

_rate_limit_store: dict[str, deque[float]] = defaultdict(deque)
_rate_limit_lock = Lock()


def _build_allowed_origins() -> list[str]:
    origins = {
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    }

    # Accept comma-separated production origins, e.g. https://app.example.com,https://myapp.vercel.app
    extra_origins = os.getenv("FRONTEND_ORIGINS", "")
    if extra_origins:
        origins.update(
            origin.strip() for origin in extra_origins.split(",") if origin.strip()
        )

    single_origin = os.getenv("FRONTEND_ORIGIN", "").strip()
    if single_origin:
        origins.add(single_origin)

    return sorted(origins)


allowed_origins = _build_allowed_origins()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "").strip()
supabase_client: Client | None = None

if SUPABASE_URL and SUPABASE_KEY:
    supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    # Enables Vercel preview URLs such as https://feature-branch-xyz.vercel.app
    allow_origin_regex=r"^https://[a-zA-Z0-9-]+\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _get_supabase_client() -> Client:
    if supabase_client is None:
        raise HTTPException(
            status_code=500,
            detail="Supabase is not configured on the server.",
        )
    return supabase_client


def _extract_client_ip(request: Request) -> str:
    forwarded_for = request.headers.get("x-forwarded-for", "")
    if forwarded_for:
        return forwarded_for.split(",")[0].strip()

    real_ip = request.headers.get("x-real-ip", "")
    if real_ip:
        return real_ip.strip()

    if request.client and request.client.host:
        return request.client.host

    return "unknown"


def _consume_rate_limit(ip_address: str) -> bool:
    now = time.time()
    cutoff = now - RATE_LIMIT_WINDOW_SECONDS

    with _rate_limit_lock:
        events = _rate_limit_store[ip_address]
        while events and events[0] <= cutoff:
            events.popleft()

        if len(events) >= RATE_LIMIT_MAX_SUBMISSIONS:
            return False

        events.append(now)
        return True


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


@app.post("/waitlist", response_model=WaitlistSignupResponse)
def join_waitlist(
    payload: WaitlistSignupInput, request: Request
) -> WaitlistSignupResponse:
    ip_address = _extract_client_ip(request)
    if not _consume_rate_limit(ip_address):
        raise HTTPException(
            status_code=429,
            detail="Too many submissions from this IP. Please try again in about an hour.",
        )

    client = _get_supabase_client()

    try:
        response = (
            client.table("waitlist")
            .insert(
                {
                    "email": payload.email,
                    "is_dental_office": payload.is_dental_office,
                }
            )
            .execute()
        )

        response_error = getattr(response, "error", None)
        response_data = getattr(response, "data", None)
        logger.info("Supabase waitlist insert response: %s", response_data)
        if response_error:
            error_message = str(response_error).lower()
            logger.error("Supabase waitlist insert error: %s", response_error)

            if (
                "duplicate" in error_message
                or "unique" in error_message
                or "23505" in error_message
            ):
                raise HTTPException(
                    status_code=409,
                    detail="This email is already registered on the waitlist.",
                )

            if "relation" in error_message and "waitlist" in error_message:
                raise HTTPException(
                    status_code=500,
                    detail="Waitlist table is missing. Run the SQL migration in Supabase.",
                )

            if (
                "invalid" in error_message and "api key" in error_message
            ) or "jwt" in error_message:
                raise HTTPException(
                    status_code=502,
                    detail="Supabase credentials are invalid. Double-check SUPABASE_URL and SUPABASE_KEY.",
                )

            if "permission" in error_message or "rls" in error_message:
                raise HTTPException(
                    status_code=403,
                    detail="Supabase rejected the insert (RLS). Use the service role key for backend inserts.",
                )

            raise HTTPException(
                status_code=502,
                detail="Unable to add you to the waitlist right now. Please try again shortly.",
            )
    except Exception as error:  # noqa: BLE001
        error_message = str(error).lower()
        logger.exception("Supabase waitlist insert failed: %s", error)
        if (
            "duplicate" in error_message
            or "unique" in error_message
            or "23505" in error_message
        ):
            raise HTTPException(
                status_code=409,
                detail="This email is already registered on the waitlist.",
            ) from error

        if "relation" in error_message and "waitlist" in error_message:
            raise HTTPException(
                status_code=500,
                detail="Waitlist table is missing. Run the SQL migration in Supabase.",
            ) from error

        if (
            "invalid" in error_message and "api key" in error_message
        ) or "jwt" in error_message:
            raise HTTPException(
                status_code=502,
                detail="Supabase credentials are invalid. Double-check SUPABASE_URL and SUPABASE_KEY.",
            ) from error

        if "permission" in error_message or "rls" in error_message:
            raise HTTPException(
                status_code=403,
                detail="Supabase rejected the insert (RLS). Use the service role key for backend inserts.",
            ) from error

        raise HTTPException(
            status_code=502,
            detail="Unable to add you to the waitlist right now. Please try again shortly.",
        ) from error

    return WaitlistSignupResponse(message="You're on the list")
