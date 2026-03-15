"""
Feature 4: Evaluate visit summary for referral needs and cross-reference with benefits.
Output: ReferralPacket JSON (benefits snapshot, missing paperwork, clinical reason).
"""

import json
import logging
from typing import Any, Optional

from ai.watsonx_client import WatsonxError, call_watsonx, extract_json_from_content

logger = logging.getLogger(__name__)

REFERRAL_PACKET_SCHEMA = """
You must respond with a single JSON object only. No markdown, no code fences, no extra text.
Required schema:
{
  "referralRecommended": true | false,
  "clinicalReason": "string",
  "recommendedSpecialty": "string",
  "benefitsSnapshot": {
    "planName": "string",
    "planType": "string",
    "referralRequired": true | false,
    "specialistCoverage": "string",
    "priorAuthRequired": "string",
    "outOfPocketNotes": "string",
    "missingFields": [ "string" ]
  },
  "missingPaperwork": [ "string" ],
  "nextSteps": [ "string" ]
}
- referralRecommended: true if visit summary indicates need for specialist referral.
- clinicalReason: brief clinical justification from the visit; "Not mentioned" if no referral needed or not stated.
- recommendedSpecialty: e.g. "Endocrinology", "GYN Oncology"; "Not mentioned" if N/A.
- benefitsSnapshot: copy or summarize the provided benefits snapshot object; do not invent fields.
- missingPaperwork: list of forms or documents that appear required but not yet present (e.g. "Prior auth form", "Referral form").
- nextSteps: short list of recommended next steps for referral/workflow.
Rules: Use ONLY the provided visit summary and benefits snapshot. Do not add clinical reasons or paperwork not implied by the inputs. Use "Not mentioned" where data is missing.
"""


def generate_referral_packet(
    visit_summary: dict[str, Any],
    benefits_snapshot: Optional[dict[str, Any]] = None,
) -> dict[str, Any]:
    """
    Produce a ReferralPacket from visit summary and optional benefits snapshot.

    Args:
        visit_summary: Dict from extract_visit_summary (chiefConcerns, actionItems, etc.).
        benefits_snapshot: Optional dict from benefits_snapshot(); if None, benefits fields are "Not mentioned".

    Returns:
        Python dict: referralRecommended, clinicalReason, recommendedSpecialty,
        benefitsSnapshot, missingPaperwork, nextSteps.
    """
    visit_summary = visit_summary or {}
    benefits_snapshot = benefits_snapshot or _empty_benefits_for_packet()

    system_prompt = (
        "You are a referral coordinator. Determine if the visit warrants a specialist referral and align with benefits. "
        + REFERRAL_PACKET_SCHEMA
    )
    user_content = (
        f"Visit summary:\n{json.dumps(visit_summary, indent=2)}\n\n"
        f"Benefits snapshot:\n{json.dumps(benefits_snapshot, indent=2)}"
    )

    try:
        content = call_watsonx(system_prompt, user_content)
    except WatsonxError as e:
        logger.exception("watsonx failed in generate_referral_packet: %s", e)
        raise

    try:
        data = extract_json_from_content(content)
    except json.JSONDecodeError as e:
        logger.error("ReferralPacket JSON parse error: %s raw=%s", e, content[:500])
        raise WatsonxError(f"ReferralPacket response was not valid JSON: {e}") from e

    return _normalize_referral_packet(data)


def _empty_benefits_for_packet() -> dict[str, Any]:
    return {
        "planName": "Not mentioned",
        "planType": "Not mentioned",
        "referralRequired": False,
        "specialistCoverage": "Not mentioned",
        "priorAuthRequired": "Not mentioned",
        "outOfPocketNotes": "Not mentioned",
        "missingFields": [],
    }


def _normalize_referral_packet(data: dict[str, Any]) -> dict[str, Any]:
    bs = data.get("benefitsSnapshot")
    if not isinstance(bs, dict):
        bs = _empty_benefits_for_packet()
    else:
        bs = {
            "planName": _str(bs.get("planName")),
            "planType": _str(bs.get("planType")),
            "referralRequired": bool(bs.get("referralRequired", False)),
            "specialistCoverage": _str(bs.get("specialistCoverage")),
            "priorAuthRequired": _str(bs.get("priorAuthRequired")),
            "outOfPocketNotes": _str(bs.get("outOfPocketNotes")),
            "missingFields": _ensure_str_list(bs.get("missingFields")),
        }
    return {
        "referralRecommended": bool(data.get("referralRecommended", False)),
        "clinicalReason": _str(data.get("clinicalReason")),
        "recommendedSpecialty": _str(data.get("recommendedSpecialty")),
        "benefitsSnapshot": bs,
        "missingPaperwork": _ensure_str_list(data.get("missingPaperwork")),
        "nextSteps": _ensure_str_list(data.get("nextSteps")),
    }


def _str(v: Any) -> str:
    return str(v).strip() if v is not None else ""


def _ensure_str_list(v: Any) -> list[str]:
    if v is None:
        return []
    if isinstance(v, list):
        return [str(x).strip() for x in v if x is not None]
    return [str(v).strip()] if str(v).strip() else []
