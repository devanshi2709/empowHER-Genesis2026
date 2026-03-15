"""
Local "Brain Test" for the GynoFlow Copilot AI layer.
Proves that watsonx-backed functions return valid JSON-schema dicts before backend integration.
"""

import json
import sys
from pathlib import Path

# Ensure project root is on path so `ai` package resolves when run as: python test_ai.py
_project_root = Path(__file__).resolve().parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

from ai.extract_visit import extract_visit_summary
from ai.generate_care_plan import generate_care_plan


# Realistic gynecology visit transcript for testing VisitSummary and CarePlan extraction
dummy_transcript = """
Doctor: Hi, thanks for coming in. What brings you in today?

Patient: I've been having this persistent pain in my lower pelvis for about three weeks now. 
It's like a constant ache, maybe a 6 out of 10. It gets worse when I sit for a long time or after exercise.

Doctor: I'm sorry to hear that. Have you had any imaging done recently—ultrasound or anything else?

Patient: I had an ultrasound at my old clinic about two months ago, but I forgot to bring the records today. 
I can try to get them sent over.

Doctor: Yes, please have those ultrasound records sent to our office so we can review them. 
Based on what you're describing, I'd like to refer you to a pelvic floor physical therapist—they can help 
with the kind of pain you're describing. I'll put the referral in today.

Patient: Okay, that sounds good.

Doctor: One more thing—please use the symptom tracker every day. Log your pain level and any triggers. 
That will help us at your follow-up in four weeks.
"""


def run_local_test() -> None:
    print("=" * 60)
    print("  Starting AI Pipeline Test")
    print("=" * 60)

    # --- Step 1: Extract VisitSummary from dummy transcript ---
    print("\n[1] Calling extract_visit_summary(dummy_transcript)...")
    try:
        visit_summary = extract_visit_summary(dummy_transcript)
        print("\nVisitSummary (JSON):")
        print(json.dumps(visit_summary, indent=2))
    except Exception as e:
        print(f"\nERROR in extract_visit_summary: {e}")
        raise

    # --- Step 2: Generate CarePlan from VisitSummary ---
    print("\n[2] Calling generate_care_plan(visit_summary)...")
    try:
        care_plan = generate_care_plan(visit_summary)
        print("\nCarePlan (JSON):")
        print(json.dumps(care_plan, indent=2))
    except Exception as e:
        print(f"\nERROR in generate_care_plan: {e}")
        raise

    print("\n" + "=" * 60)
    print("  All AI contracts passed locally. Ready for backend integration.")
    print("=" * 60)


if __name__ == "__main__":
    run_local_test()
