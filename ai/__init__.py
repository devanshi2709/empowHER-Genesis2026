"""
GynoFlow Copilot — AI / IBM Workflow layer.

This package transforms raw clinical data (audio, text, document text)
into schema-compliant JSON using IBM Watson Speech to Text and watsonx.ai.
"""

from ai.transcribe import transcribe_audio
from ai.extract_visit import extract_visit_summary
from ai.generate_care_plan import generate_care_plan
from ai.summarize_tracker import summarize_tracker
from ai.benefits_snapshot import benefits_snapshot
from ai.generate_referral_packet import generate_referral_packet

__all__ = [
    "transcribe_audio",
    "extract_visit_summary",
    "generate_care_plan",
    "summarize_tracker",
    "benefits_snapshot",
    "generate_referral_packet",
]
