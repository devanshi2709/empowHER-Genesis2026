"""
Feature 2: Translate structured VisitSummary into a plain-language patient CarePlan.
Output: CarePlan JSON (patient-friendly tasks, timelines, test prep).
"""

import json
import logging
from typing import Any

from ai.watsonx_client import WatsonxError, call_watsonx, extract_json_from_content

logger = logging.getLogger(__name__)

CARE_PLAN_SCHEMA = """
You must respond with a single JSON object only. No markdown, no code fences, no extra text.
Required schema:
{
  "patientFriendlySummary": "string",
  "tasks": [
    {
      "description": "string",
      "timeline": "string",
      "testPrep": "string"
    }
  ],
  "reminders": [ "string" ]
}
- patientFriendlySummary: 1–3 sentence plain-language overview for the patient.
- tasks: list of { description, timeline, testPrep }. description = what to do; timeline = when (e.g. "Before next visit", "This week"); testPrep = instructions if it's a test/lab (e.g. fasting), otherwise empty string or "Not applicable".
- reminders: short reminder bullets for the patient.
Rules: Base content ONLY on the provided VisitSummary. Do not add tasks or details not implied by it. Use "Not mentioned" or leave empty where the summary does not specify.
"""


def generate_care_plan(visit_summary: dict[str, Any]) -> dict[str, Any]:
    """
    Generate a patient-facing CarePlan from a structured VisitSummary.

    Args:
        visit_summary: Dict with chiefConcerns, actionItems, missingInfo, visitNotes.

    Returns:
        Python dict conforming to CarePlan: patientFriendlySummary, tasks, reminders.
    """
    if not visit_summary:
        return _empty_care_plan()

    system_prompt = (
        "You are a patient education assistant. Turn a structured visit summary into a clear, plain-language care plan. "
        + CARE_PLAN_SCHEMA
    )
    user_content = f"Visit summary (JSON):\n{json.dumps(visit_summary, indent=2)}"

    try:
        content = call_watsonx(system_prompt, user_content)
    except WatsonxError as e:
        logger.exception("watsonx failed in generate_care_plan: %s", e)
        raise

    try:
        data = extract_json_from_content(content)
    except json.JSONDecodeError as e:
        logger.error("CarePlan JSON parse error: %s raw=%s", e, content[:500])
        raise WatsonxError(f"CarePlan response was not valid JSON: {e}") from e

    return _normalize_care_plan(data)


def _empty_care_plan() -> dict[str, Any]:
    return {
        "patientFriendlySummary": "",
        "tasks": [],
        "reminders": [],
    }


def _normalize_care_plan(data: dict[str, Any]) -> dict[str, Any]:
    tasks = data.get("tasks")
    if not isinstance(tasks, list):
        tasks = []
    out_tasks = []
    for t in tasks:
        if not isinstance(t, dict):
            continue
        out_tasks.append({
            "description": _str(t.get("description")),
            "timeline": _str(t.get("timeline")),
            "testPrep": _str(t.get("testPrep")),
        })
    return {
        "patientFriendlySummary": _str(data.get("patientFriendlySummary")),
        "tasks": out_tasks,
        "reminders": _ensure_str_list(data.get("reminders")),
    }


def _str(v: Any) -> str:
    return str(v).strip() if v is not None else ""


def _ensure_str_list(v: Any) -> list[str]:
    if v is None:
        return []
    if isinstance(v, list):
        return [str(x).strip() for x in v if x is not None]
    return [str(v).strip()] if str(v).strip() else []
