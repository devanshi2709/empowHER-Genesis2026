import React from "react";
import { Button, Tag } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../../components/shared/PageLayout";
import { GlassCard } from "../../components/shared/GlassCard";
import { useAppContext, type ScanResult } from "../../context/AppContext";

const CONFIDENCE_TAG_TYPE: Record<ScanResult["confidence"], "high" | "low" | "medium"> = {
  high: "high",
  moderate: "medium",
  low: "low",
};

const AdvocacyPage: React.FC = () => {
  const { scanResult } = useAppContext();
  const navigate = useNavigate();

  if (!scanResult) {
    return (
      <PageLayout
        title="No scan yet"
        description="Run a HelioMind scan to unlock your personalized advocacy path."
      >
        <GlassCard tone="info">
          <p style={{ color: "rgba(244,244,244,0.8)", margin: 0 }}>
            We didn&apos;t find a recent scan in this session. Start a scan to let HelioMind analyze
            your image and surface guided next steps.
          </p>
          <div style={{ marginTop: "1.25rem" }}>
            <Button kind="primary" onClick={() => navigate("/scan")}>
              Start a scan
            </Button>
          </div>
        </GlassCard>
      </PageLayout>
    );
  }

  const confidenceLabel =
    scanResult.confidence.charAt(0).toUpperCase() + scanResult.confidence.slice(1);

  return (
    <PageLayout
      title="Your Connected Path"
      description="A clear, human-centered view of what HelioMind detected and how to act on it."
    >
      <GlassCard tone="neutral">
        <div
          style={{
            display: "grid",
            gap: "1.5rem",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 3fr)",
          }}
        >
          {/* Visual column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div
              style={{
                borderRadius: 10,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.18)",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <img
                src={scanResult.imageUrl}
                alt="Scanned area"
                style={{ display: "block", width: "100%", height: "auto" }}
              />
            </div>
            <div style={{ fontSize: "0.78rem", color: "rgba(244,244,244,0.55)" }}>
              Scan ID <code>{scanResult.scanId}</code> • Type{" "}
              <strong>{scanResult.scanType}</strong>
            </div>
          </div>

          {/* Insight + actions column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
                {scanResult.detectedIssue}
              </h2>
              <Tag
                type={CONFIDENCE_TAG_TYPE[scanResult.confidence]}
                title={`Model confidence: ${confidenceLabel}`}
              >
                {confidenceLabel} confidence
              </Tag>
            </div>

            <p
              style={{
                margin: 0,
                fontSize: "0.96rem",
                lineHeight: 1.7,
                color: "rgba(244,244,244,0.85)",
              }}
            >
              {scanResult.insight}
            </p>

            <div
              style={{
                marginTop: "0.75rem",
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <Button kind="primary">View covered benefits</Button>
              <Button kind="secondary">Send report to provider</Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </PageLayout>
  );
};

export default AdvocacyPage;

