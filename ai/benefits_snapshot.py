"""
Feature 4: Extract structured benefits snapshot from uploaded benefits document text.
Used by generate_referral_packet to cross-reference referral needs with coverage.
"""

import json
import logging
from typing import Any

from ai.watsonx_client import WatsonxError, call_watsonx, extract_json_from_content

logger = logging.getLogger(__name__)

BENEFITS_SNAPSHOT_SCHEMA = """
You must respond with a single JSON object only. No markdown, no code fences, no extra text.
Required schema:
{
  "planName": "string",
  "planType": "string",
  "referralRequired": true | false,
  "specialistCoverage": "string",
  "priorAuthRequired": "string",
  "outOfPocketNotes": "string",
  "missingFields": [ "string" ]
}
- planName: plan or insurer name if stated; otherwise "Not mentioned".
- planType: e.g. PPO, HMO, Medicaid; "Not mentioned" if absent.
- referralRequired: true if document states specialist referrals require PCP referral, false otherwise.
- specialistCoverage: brief description of specialist/gynecologist coverage; "Not mentioned" if absent.
- priorAuthRequired: when prior auth is needed (e.g. "For imaging"); "Not mentioned" if absent.
- outOfPocketNotes: relevant copay/deductible/out-of-network notes; "Not mentioned" if absent.
- missingFields: list of important benefit details that are NOT found in the document.
Rules: Extract ONLY what is explicitly stated in the document. Do not assume. Use "Not mentioned" for any field not present. Do not invent coverage details.
"""


def benefits_snapshot(benefits_document_text: str) -> dict[str, Any]:
    """
    Parse benefits document text into a structured benefits snapshot.

    Args:
        benefits_document_text: Raw text from uploaded benefits document(s).

    Returns:
        Python dict: planName, planType, referralRequired, specialistCoverage,
        priorAuthRequired, outOfPocketNotes, missingFields.
    """
    text = (benefits_document_text or "").strip()
    if not text:
        return _empty_benefits_snapshot()

    system_prompt = (
        "You are a benefits analyst. Extract structured insurance/benefits information from the provided document. "
        + BENEFITS_SNAPSHOT_SCHEMA
    )
    user_content = f"Benefits document text:\n\n{text[:50000]}"

    try:
        content = call_watsonx(system_prompt, user_content)
    except WatsonxError as e:
        logger.exception("watsonx failed in benefits_snapshot: %s", e)
        raise

    try:
        data = extract_json_from_content(content)
    except json.JSONDecodeError as e:
        logger.error("BenefitsSnapshot JSON parse error: %s raw=%s", e, content[:500])
        raise WatsonxError(f"BenefitsSnapshot response was not valid JSON: {e}") from e

    return _normalize_benefits_snapshot(data)


def _empty_benefits_snapshot() -> dict[str, Any]:
    return {
        "planName": "",
        "planType": "",
        "referralRequired": False,
        "specialistCoverage": "",
        "priorAuthRequired": "",
        "outOfPocketNotes": "",
        "missingFields": [],
    }


def _normalize_benefits_snapshot(data: dict[str, Any]) -> dict[str, Any]:
    return {
        "planName": _str(data.get("planName")),
        "planType": _str(data.get("planType")),
        "referralRequired": bool(data.get("referralRequired", False)),
        "specialistCoverage": _str(data.get("specialistCoverage")),
        "priorAuthRequired": _str(data.get("priorAuthRequired")),
        "outOfPocketNotes": _str(data.get("outOfPocketNotes")),
        "missingFields": _ensure_str_list(data.get("missingFields")),
    }


def _str(v: Any) -> str:
    return str(v).strip() if v is not None else ""


def _ensure_str_list(v: Any) -> list[str]:
    if v is None:
        return []
    if isinstance(v, list):
        return [str(x).strip() for x in v if x is not None]
    return [str(v).strip()] if str(v).strip() else []
