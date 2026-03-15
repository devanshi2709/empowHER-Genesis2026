from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="GynoFlow Copilot API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProcessVisitRequest(BaseModel):
    transcript: str


class PatientCareState(BaseModel):
    transcript: str
    carePlanSummary: str
    symptoms: list[str]
    referralNeeded: bool


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "gynoflow-copilot-api"}


@app.post("/api/process-visit", response_model=PatientCareState)
def process_visit(body: ProcessVisitRequest):
    """Accept a visit transcript and return a dummy PatientCareState (Watsonx integration later)."""
    return PatientCareState(
        transcript=body.transcript or "",
        carePlanSummary="Placeholder care plan summary. Watsonx integration to be added.",
        symptoms=[],
        referralNeeded=False,
    )
