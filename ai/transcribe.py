"""
Feature 1: IBM Speech to Text — ingest audio buffers and return raw text transcript.
Caller (Person 2) provides audio bytes and content type; this module returns transcript text.
"""

import logging
import os
from pathlib import Path
from typing import Optional

import requests

# Load .env from project root or backend
for _d in [Path(__file__).resolve().parent.parent, Path(__file__).resolve().parent.parent / "backend"]:
    _f = _d / ".env"
    if _f.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(_f)
        except Exception:
            pass
        break

logger = logging.getLogger(__name__)

SPEECH_TO_TEXT_API_KEY = os.getenv("SPEECH_TO_TEXT_API_KEY")
SPEECH_TO_TEXT_URL = os.getenv(
    "SPEECH_TO_TEXT_URL",
    "https://api.us-south.speech-to-text.watson.cloud.ibm.com",
)
IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"


class TranscriptionError(Exception):
    """Raised when Speech to Text fails."""
    def __init__(self, message: str, status_code: Optional[int] = None):
        self.status_code = status_code
        super().__init__(message)


def _get_iam_token(api_key: str) -> str:
    if not api_key:
        raise TranscriptionError("SPEECH_TO_TEXT_API_KEY is not set.")
    resp = requests.post(
        IAM_TOKEN_URL,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        data=f"grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={api_key}",
        timeout=30,
    )
    if resp.status_code == 403:
        raise TranscriptionError("Speech to Text IAM 403 Forbidden.", 403)
    resp.raise_for_status()
    return resp.json()["access_token"]


def transcribe_audio(
    audio_buffer: bytes,
    content_type: str = "audio/wav",
) -> str:
    """
    Send audio buffer to IBM Speech to Text and return raw transcript text.

    Args:
        audio_buffer: Raw audio bytes (e.g. WAV, FLAC, Ogg).
        content_type: MIME type, e.g. "audio/wav", "audio/flac", "audio/ogg; codecs=opus".

    Returns:
        Concatenated transcript text from all result segments. Empty string if no speech.

    Raises:
        TranscriptionError: On missing config, 403, 502, or other API errors.
    """
    if not SPEECH_TO_TEXT_API_KEY or not SPEECH_TO_TEXT_URL:
        raise TranscriptionError(
            "IBM Speech to Text is not configured. Set SPEECH_TO_TEXT_API_KEY and optionally SPEECH_TO_TEXT_URL."
        )

    token = _get_iam_token(SPEECH_TO_TEXT_API_KEY)
    url = f"{SPEECH_TO_TEXT_URL.rstrip('/')}/v1/recognize"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": content_type,
    }
    params = {"model": "en-US_BroadbandModel"}

    try:
        resp = requests.post(
            url,
            headers=headers,
            params=params,
            data=audio_buffer,
            timeout=60,
        )
    except requests.RequestException as e:
        logger.exception("Speech to Text request failed: %s", e)
        raise TranscriptionError(f"Speech to Text request failed: {e}") from e

    if resp.status_code == 403:
        raise TranscriptionError("Speech to Text returned 403 Forbidden.", 403)
    if resp.status_code == 502:
        raise TranscriptionError("Speech to Text returned 502 Bad Gateway.", 502)
    if resp.status_code != 200:
        raise TranscriptionError(
            f"Speech to Text error status={resp.status_code} body={resp.text[:300]}",
            resp.status_code,
        )

    data = resp.json()
    results = data.get("results") or []
    parts = []
    for r in results:
        alternatives = r.get("alternatives") or []
        if alternatives:
            text = (alternatives[0].get("transcript") or "").strip()
            if text:
                parts.append(text)
    return " ".join(parts)
