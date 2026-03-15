"""
Feature 3: Ingest historical symptom logs and produce clinical trend analysis.
Output: SymptomSummary JSON (trends, adherence notes, follow-up questions).
"""

import json
import logging
from typing import Any

from ai.watsonx_client import WatsonxError, call_watsonx, extract_json_from_content

logger = logging.getLogger(__name__)

SYMPTOM_SUMMARY_SCHEMA = """
You must respond with a single JSON object only. No markdown, no code fences, no extra text.
Required schema:
{
  "trends": [ "string" ],
  "adherenceNotes": "string",
  "followUpQuestions": [ "string" ]
}
- trends: list of short clinical trend observations (e.g. "Symptom X improved over 2 weeks", "No change in Y").
- adherenceNotes: brief note on medication or plan adherence if evident from logs; otherwise "Not mentioned".
- followUpQuestions: suggested clinician follow-up questions based on the logs.
Rules: Base analysis ONLY on the provided symptom logs. Do not infer data that is not present. If a trend cannot be determined, say "Insufficient data" or omit. Use "Not mentioned" where information is missing.
"""


def summarize_tracker(logs: list[Any]) -> dict[str, Any]:
    """
    Analyze an array of historical symptom logs and return a SymptomSummary.

    Args:
        logs: List of log entries (each can be a string, or a dict with text/notes to summarize).

    Returns:
        Python dict: trends, adherenceNotes, followUpQuestions.
    """
    if not logs:
        return _empty_symptom_summary()

    # Normalize logs to a list of strings for the prompt
    log_lines = []
    for i, entry in enumerate(logs):
        if isinstance(entry, str):
            log_lines.append(entry.strip())
        elif isinstance(entry, dict):
            # Prefer common keys; otherwise dump the dict
            text = (
                entry.get("notes")
                or entry.get("text")
                or entry.get("summary")
                or entry.get("content")
                or json.dumps(entry)
            )
            log_lines.append(str(text).strip())
        else:
            log_lines.append(str(entry).strip())

    combined = "\n---\n".join(log_lines)
    if not combined.strip():
        return _empty_symptom_summary()

    system_prompt = (
        "You are a clinical analyst. Review the patient's symptom tracker logs and produce a concise trend summary. "
        + SYMPTOM_SUMMARY_SCHEMA
    )
    user_content = f"Symptom logs:\n\n{combined}"

    try:
        content = call_watsonx(system_prompt, user_content)
    except WatsonxError as e:
        logger.exception("watsonx failed in summarize_tracker: %s", e)
        raise

    try:
        data = extract_json_from_content(content)
    except json.JSONDecodeError as e:
        logger.error("SymptomSummary JSON parse error: %s raw=%s", e, content[:500])
        raise WatsonxError(f"SymptomSummary response was not valid JSON: {e}") from e

    return _normalize_symptom_summary(data)


def _empty_symptom_summary() -> dict[str, Any]:
    return {
        "trends": [],
        "adherenceNotes": "",
        "followUpQuestions": [],
    }


def _normalize_symptom_summary(data: dict[str, Any]) -> dict[str, Any]:
    return {
        "trends": _ensure_str_list(data.get("trends")),
        "adherenceNotes": _str(data.get("adherenceNotes")),
        "followUpQuestions": _ensure_str_list(data.get("followUpQuestions")),
    }


def _str(v: Any) -> str:
    return str(v).strip() if v is not None else ""


def _ensure_str_list(v: Any) -> list[str]:
    if v is None:
        return []
    if isinstance(v, list):
        return [str(x).strip() for x in v if x is not None]
    return [str(v).strip()] if str(v).strip() else []
