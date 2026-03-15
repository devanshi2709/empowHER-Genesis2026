"""
Feature 1: Process raw visit transcript with watsonx.ai into structured VisitSummary.
Output: VisitSummary JSON (chief concerns, action items, missing info).
"""

import json
import logging
from typing import Any

from ai.watsonx_client import WatsonxError, call_watsonx, extract_json_from_content

logger = logging.getLogger(__name__)

VISIT_SUMMARY_SCHEMA = """
You must respond with a single JSON object only. No markdown, no code fences, no extra text.
Required schema:
{
  "chiefConcerns": [ "string" ],
  "actionItems": [ "string" ],
  "missingInfo": [ "string" ],
  "visitNotes": "string"
}
- chiefConcerns: list of main patient concerns or reasons for visit mentioned in the transcript.
- actionItems: list of agreed next steps, orders, or tasks (e.g. labs, follow-up, meds).
- missingInfo: list of clinically relevant details that were NOT mentioned or could not be confirmed (use "Not mentioned" for missing fields you would expect).
- visitNotes: brief clinical summary in 1–2 sentences.
Rules: Extract ONLY what is explicitly stated or clearly implied in the transcript. If something is not mentioned, include it in missingInfo or use "Not mentioned". Do not invent or assume data.
"""


def extract_visit_summary(transcript: str) -> dict[str, Any]:
    """
    Turn raw visit transcript into a structured VisitSummary.

    Args:
        transcript: Raw text from the visit (e.g. from Speech to Text or document).

    Returns:
        Python dict conforming to VisitSummary: chiefConcerns, actionItems, missingInfo, visitNotes.
    """
    transcript = (transcript or "").strip()
    if not transcript:
        return _empty_visit_summary()

    system_prompt = (
        "You are a clinical documentation assistant. Your task is to extract structured information from a visit transcript. "
        + VISIT_SUMMARY_SCHEMA
    )
    user_content = f"Visit transcript:\n\n{transcript}"

    try:
        content = call_watsonx(system_prompt, user_content)
    except WatsonxError as e:
        logger.exception("watsonx failed in extract_visit_summary: %s", e)
        raise

    try:
        data = extract_json_from_content(content)
    except json.JSONDecodeError as e:
        logger.error("VisitSummary JSON parse error: %s raw=%s", e, content[:500])
        raise WatsonxError(f"VisitSummary response was not valid JSON: {e}") from e

    return _normalize_visit_summary(data)


def _empty_visit_summary() -> dict[str, Any]:
    return {
        "chiefConcerns": [],
        "actionItems": [],
        "missingInfo": [],
        "visitNotes": "",
    }


def _normalize_visit_summary(data: dict[str, Any]) -> dict[str, Any]:
    return {
        "chiefConcerns": _ensure_str_list(data.get("chiefConcerns")),
        "actionItems": _ensure_str_list(data.get("actionItems")),
        "missingInfo": _ensure_str_list(data.get("missingInfo")),
        "visitNotes": _ensure_str(data.get("visitNotes")),
    }


def _ensure_str_list(v: Any) -> list[str]:
    if v is None:
        return []
    if isinstance(v, list):
        return [str(x).strip() for x in v if x is not None]
    return [str(v).strip()] if str(v).strip() else []


def _ensure_str(v: Any) -> str:
    if v is None:
        return ""
    return str(v).strip()
