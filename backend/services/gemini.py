import os
from typing import Optional

import google.generativeai as genai
from dotenv import load_dotenv
from google.api_core.exceptions import GoogleAPICallError, ResourceExhausted

load_dotenv()

_MODEL_NAME = "gemini-2.5-flash"
_model: Optional[genai.GenerativeModel] = None


def _get_model() -> genai.GenerativeModel:
    global _model
    if _model is not None:
        return _model

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set.")

    genai.configure(api_key=api_key)
    _model = genai.GenerativeModel(_MODEL_NAME)
    return _model


def _extract_text(response: object) -> str:
    text = getattr(response, "text", None)
    if isinstance(text, str) and text.strip():
        return text.strip()

    candidates = getattr(response, "candidates", None)
    if not candidates:
        return ""

    parts = getattr(candidates[0].content, "parts", [])
    joined = "\n".join(
        part.text.strip()
        for part in parts
        if getattr(part, "text", None) and part.text.strip()
    )
    return joined.strip()


def generate_with_gemini(prompt: str) -> str:
    if not prompt or not prompt.strip():
        raise ValueError("Prompt cannot be empty.")

    model = _get_model()
    try:
        response = model.generate_content(prompt)
    except ResourceExhausted as error:
        raise RuntimeError(
            "Gemini rate limit reached for free tier. Please wait a minute and retry."
        ) from error
    except GoogleAPICallError as error:
        raise RuntimeError(f"Gemini API error: {error}") from error

    response_text = _extract_text(response)
    if not response_text:
        raise RuntimeError("Gemini returned an empty response.")

    return response_text
