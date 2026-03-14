import React, { useState, useEffect } from "react";
import { Button, Modal, ProgressBar, Tag, Tile, ToastNotification } from "@carbon/react";
import { ArrowRight, DocumentExport } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import { useAppContext, type ScanResult } from "../../context/AppContext";
import { getMockBenefits } from "../../utils/mockBenefits";
import "./Advocacy.css";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Format snake_case string to Title Case (e.g. "elevated_vascular_activity" → "Elevated Vascular Activity"). */
function formatSnakeToTitleCase(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/** Map confidence to Carbon Tag color: high = red, moderate = magenta, low = green. */
function getConfidenceTagType(
  confidence: ScanResult["confidence"]
): "red" | "magenta" | "green" {
  switch (confidence) {
    case "high":
      return "red";
    case "moderate":
      return "magenta";
    case "low":
      return "green";
    default:
      return "green";
  }
}

/** Truncate a long ID for display (e.g. "abc...xyz"). */
function truncateId(id: string, maxLength: number = 24): string {
  if (id.length <= maxLength) return id;
  const head = 10;
  const tail = 8;
  return `${id.slice(0, head)}…${id.slice(-tail)}`;
}

// ─── Empty state ─────────────────────────────────────────────────────────────

const AdvocacyEmptyState: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="page-frame page-frame--full-height">
      <div className="advocacy-empty">
        <div className="glass-surface">
          <h2 className="advocacy-empty__title">No active scan found</h2>
          <p className="advocacy-empty__text">
            We didn’t find a recent scan in this session. Start a new scan so
            EmpowHER can analyze your image and show your personalized
            connected path and next steps.
          </p>
          <Button kind="primary" onClick={() => navigate("/scan")}>
            Start a scan
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Dashboard (happy path) ──────────────────────────────────────────────────

type ToastKind = "success" | "info" | "error";
interface ToastState {
  isOpen: boolean;
  title: string;
  subtitle: string;
  kind: ToastKind;
}

const AdvocacyDashboard: React.FC = () => {
  const { scanResult, lastScanSessionId } = useAppContext();
  const navigate = useNavigate();
  const [isBenefitsModalOpen, setIsBenefitsModalOpen] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast?.isOpen) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast?.isOpen]);

  if (!scanResult) return <AdvocacyEmptyState />;

  const confidenceLabel =
    scanResult.confidence.charAt(0).toUpperCase() + scanResult.confidence.slice(1);
  const tagType = getConfidenceTagType(scanResult.confidence);
  const displayId = lastScanSessionId || scanResult.scanId;
  const benefits = getMockBenefits(scanResult.scanType, scanResult.detectedIssue);

  /** Parse coverage percentage for ProgressBar (e.g. "80%" -> 80, "N/A" -> 0). */
  const coveragePercent = (() => {
    const match = benefits.coverage.match(/(\d+)/);
    return match ? Math.min(100, Math.max(0, parseInt(match[1], 10))) : 0;
  })();

  return (
    <>
    <div className="page-frame page-frame--full-height">
      <header className="advocacy-page-heading glass-page-heading">
        <div>
          <h1>Your Connected Path</h1>
          <p>
            A clear, human-centered view of what EmpowHER detected and how you
            can act on it. We’re here to help you understand and advocate for
            your care.
          </p>
        </div>
      </header>

      <section
        className="glass-surface advocacy-dashboard"
        aria-label="Scan results and insights"
      >
        <div className="advocacy-grid">
          {/* Left column — media & metadata */}
          <div className="advocacy-media">
            <div className="advocacy-media__frame">
              <img
                src={scanResult.imageUrl}
                alt="Scanned area"
                decoding="async"
              />
            </div>
            <div className="advocacy-media__meta">
              <span>Session ID: <code>{truncateId(displayId)}</code></span>
              <span>Type: <strong>{scanResult.scanType}</strong></span>
            </div>
          </div>

          {/* Right column — AI insights & actions */}
          <div className="advocacy-insights">
            <div className="advocacy-insights__header">
              <h2 className="advocacy-insights__title">
                {formatSnakeToTitleCase(scanResult.detectedIssue)}
              </h2>
              <Tag type={tagType} title={`Confidence: ${confidenceLabel}`}>
                {confidenceLabel} confidence
              </Tag>
            </div>

            <hr className="advocacy-divider" aria-hidden />

            <Tile className="advocacy-tile-wrap">
              <span className="advocacy-tile-label">WatsonX Insight</span>
              <p className="advocacy-tile-content">{scanResult.insight}</p>
            </Tile>

            <div className="advocacy-actions">
              <Button
                kind="primary"
                renderIcon={ArrowRight}
                onClick={() => setIsBenefitsModalOpen(true)}
              >
                View covered benefits
              </Button>
              <Button
                kind="secondary"
                renderIcon={DocumentExport}
                onClick={() =>
                  setToast({
                    isOpen: true,
                    title: "Report Sent",
                    subtitle:
                      "Your scan and WatsonX insights have been securely routed to your primary care portal.",
                    kind: "success",
                  })
                }
              >
                Send report to provider
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <Modal
      open={isBenefitsModalOpen}
      modalHeading="Covered benefits"
      modalLabel="Insurance benefits for your scan"
      primaryButtonText="Find a Provider"
      secondaryButtonText="Close"
      onRequestClose={() => setIsBenefitsModalOpen(false)}
      onRequestSubmit={() => {
        setIsBenefitsModalOpen(false);
        setToast({
          isOpen: true,
          title: "Redirecting...",
          subtitle:
            "Connecting you to the Sun Life in-network provider directory.",
          kind: "info",
        });
      }}
    >
      <div className="advocacy-modal-body">
        <p className="advocacy-modal-provider">
          <strong>Provider:</strong> {benefits.provider}
        </p>
        <p className="advocacy-modal-plan">
          <strong>Plan:</strong> {benefits.plan}
        </p>
        {benefits.description && (
          <p className="advocacy-modal-description">{benefits.description}</p>
        )}
        <div className="advocacy-modal-breakdown">
          <span className="advocacy-modal-breakdown-label">Plan coverage</span>
          {coveragePercent > 0 ? (
            <ProgressBar
              label="Plan pays"
              value={coveragePercent}
              max={100}
              size="small"
              status={coveragePercent >= 100 ? "finished" : "active"}
              helperText={`${benefits.coverage} • Your copay: ${benefits.copay}`}
            />
          ) : (
            <p className="advocacy-modal-description" style={{ marginBottom: 0 }}>
              {benefits.coverage} — {benefits.copay}
            </p>
          )}
        </div>
        <p className="advocacy-modal-action">
          <strong>Suggested action:</strong> {benefits.action}
        </p>
      </div>
    </Modal>

    {toast?.isOpen && (
      <div className="advocacy-toast-container" role="status" aria-live="polite">
        <ToastNotification
          kind={toast.kind}
          title={toast.title}
          subtitle={toast.subtitle}
          onClose={() => setToast(null)}
          onCloseButtonClick={() => setToast(null)}
        />
      </div>
    )}
    </>
  );
};

// ─── Page export ─────────────────────────────────────────────────────────────

const AdvocacyPage: React.FC = () => {
  const { scanResult } = useAppContext();

  if (!scanResult) {
    return <AdvocacyEmptyState />;
  }

  return <AdvocacyDashboard />;
};

export default AdvocacyPage;
