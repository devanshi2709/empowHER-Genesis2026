"""
Shared watsonx.ai client for the AI layer.
Uses REST API with IAM token; handles 403/502 with fallback.
"""

import json
import logging
import os
import re
from pathlib import Path
from typing import Optional

import requests

# Load .env from project root or backend (when running from backend/)
_env_dirs = [
    Path(__file__).resolve().parent.parent,
    Path(__file__).resolve().parent.parent / "backend",
]
for _d in _env_dirs:
    _env_file = _d / ".env"
    if _env_file.exists():
        try:
            from dotenv import load_dotenv
            load_dotenv(_env_file)
        except Exception:
            pass
        break

logger = logging.getLogger(__name__)

WATSONX_API_KEY = os.getenv("WATSONX_API_KEY")
WATSONX_PROJECT_ID = os.getenv("WATSONX_PROJECT_ID")
WATSONX_CHAT_URL = os.getenv(
    "WATSONX_URL",
    "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2024-01-01",
)
WATSONX_MODEL_ID = "meta-llama/llama-3-70b-instruct"

IAM_TOKEN_URL = "https://iam.cloud.ibm.com/identity/token"


class WatsonxError(Exception):
    """Raised when watsonx call fails after retries/fallback."""
    def __init__(self, message: str, status_code: Optional[int] = None):
        self.status_code = status_code
        super().__init__(message)


def get_iam_token(api_key: str) -> str:
    """Exchange IBM API key for an IAM bearer token."""
    if not api_key:
        raise WatsonxError("WATSONX_API_KEY is not set.")
    try:
        resp = requests.post(
            IAM_TOKEN_URL,
            headers={"Content-Type": "application/x-www-form-urlencoded"},
            data=f"grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey={api_key}",
            timeout=30,
        )
        if resp.status_code == 403:
            raise WatsonxError("IAM returned 403 Forbidden; check API key and permissions.", 403)
        if resp.status_code != 200:
            raise WatsonxError(
                f"IAM token failed: status={resp.status_code} body={resp.text[:200]}",
                resp.status_code,
            )
        return resp.json()["access_token"]
    except requests.RequestException as e:
        status = getattr(e.response, "status_code", None) if getattr(e, "response", None) else None
        raise WatsonxError(f"IAM request failed: {e}", status) from e


def extract_json_from_content(raw: str) -> dict:
    """
    Parse JSON from model output; strip optional markdown code fences.
    Handles: pure JSON, ```json ... ```, ``` ... ```, and leading/trailing text.
    """
    text = raw.strip()
    # Exact wrap: entire string is one code block
    match = re.search(r"^```(?:json)?\s*([\s\S]*?)\s*```\s*$", text)
    if match:
        text = match.group(1).strip()
    else:
        # Robust fallback: find first code fence and extract inner content
        inner = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if inner:
            text = inner.group(1).strip()
    return json.loads(text)


def call_watsonx(
    system_prompt: str,
    user_content: str,
    max_retries_502: int = 1,
) -> str:
    """
    Call watsonx.ai chat API; return content from choices[0].message.content.
    Handles 403 (no retry) and 502 (optional retry).
    """
    if not WATSONX_API_KEY or not WATSONX_PROJECT_ID:
        raise WatsonxError(
            "watsonx is not configured. Set WATSONX_API_KEY and WATSONX_PROJECT_ID."
        )

    token = get_iam_token(WATSONX_API_KEY)
    payload = {
        "model_id": WATSONX_MODEL_ID,
        "project_id": WATSONX_PROJECT_ID,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_content},
        ],
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    last_error = None
    for attempt in range(max_retries_502 + 1):
        try:
            resp = requests.post(
                WATSONX_CHAT_URL,
                headers=headers,
                json=payload,
                timeout=90,
            )
        except requests.RequestException as e:
            last_error = WatsonxError(f"watsonx request failed: {e}")
            logger.warning("watsonx attempt %s failed: %s", attempt + 1, e)
            continue

        if resp.status_code == 403:
            raise WatsonxError(
                "watsonx returned 403 Forbidden; check project access and API key.",
                403,
            )
        if resp.status_code == 502:
            last_error = WatsonxError(
                f"watsonx returned 502 Bad Gateway. body={resp.text[:200]}",
                502,
            )
            logger.warning("watsonx 502 on attempt %s", attempt + 1)
            continue
        if resp.status_code != 200:
            raise WatsonxError(
                f"watsonx error status={resp.status_code} body={resp.text[:200]}",
                resp.status_code,
            )

        data = resp.json()
        choices = data.get("choices") or []
        if not choices:
            last_error = WatsonxError("watsonx returned no choices.")
            continue
        message = choices[0].get("message") or {}
        content = (message.get("content") or "").strip()
        if not content:
            last_error = WatsonxError("watsonx returned empty content.")
            continue
        return content

    raise last_error or WatsonxError("watsonx failed after retries.")
