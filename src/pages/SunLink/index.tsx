import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import { PageLayout as SharedPageLayout } from "../../components/shared/PageLayout";
import { GlassCard as SharedGlassCard } from "../../components/shared/GlassCard";
import { useAppContext } from "../../context/AppContext";
import type { ScanResult } from "../../context/AppContext";
import "./SunLink.css";

// ─── Mock AI data ──────────────────────────────────────────────────────────────
const SCAN_DURATION_MS = 3000;

const SCAN_STEPS = [
  { at: 0,  label: "Analyzing scan…" },
  { at: 33, label: "Scanning tissue patterns…" },
  { at: 66, label: "Generating insight…" },
];

const MOCK_RESULTS: Omit<ScanResult, "scanId" | "imageUrl">[] = [
  {
    detectedIssue: "gum_inflammation",
    confidence: "moderate",
    scanType: "oral",
    insight: "Possible mild inflammation detected around the gum line. Staying hydrated and gentle brushing may help. Consider a dental follow-up.",
  },
  {
    detectedIssue: "healthy_tissue",
    confidence: "high",
    scanType: "oral",
    insight: "No significant anomalies detected. Tissue patterns appear healthy. Keep up your current oral hygiene routine.",
  },
  {
    detectedIssue: "pigmentation_irregularity",
    confidence: "low",
    scanType: "skin",
    insight: "Early-stage pigmentation irregularity observed. Results are inconclusive — consider a follow-up scan in better lighting.",
  },
  {
    detectedIssue: "elevated_vascular_activity",
    confidence: "moderate",
    scanType: "general",
    insight: "Elevated vascular activity detected in the scan area. Recommend a clinical review for accurate diagnosis.",
  },
];

/** TODO: Replace with IBM watsonx.ai call when credentials are available. */
async function runAIScan(imageUrl: string): Promise<ScanResult> {
  await new Promise((r) => setTimeout(r, SCAN_DURATION_MS));
  const mock = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
  return { ...mock, scanId: `scan_${Date.now()}`, imageUrl };
}

// ─── Health Insight Card ───────────────────────────────────────────────────────
const CONFIDENCE_COLORS: Record<ScanResult["confidence"], string> = {
  low: "#f1c21b",
  moderate: "#ff832b",
  high: "#42ffa1",
};

const ISSUE_LABELS: Record<string, string> = {
  gum_inflammation: "Gum Inflammation",
  healthy_tissue: "Healthy Tissue",
  pigmentation_irregularity: "Pigmentation Irregularity",
  elevated_vascular_activity: "Elevated Vascular Activity",
};

interface HealthInsightCardProps {
  result: ScanResult;
  onNavigate: () => void;
}

const HealthInsightCard: React.FC<HealthInsightCardProps> = ({ result, onNavigate }) => (
  <SharedGlassCard tone="success">
    <div className="insight-card">
      <div className="insight-card__header">
        <span className="insight-card__label">Health Insight</span>
        <span
          className="insight-card__badge"
          style={{ background: `${CONFIDENCE_COLORS[result.confidence]}22`, color: CONFIDENCE_COLORS[result.confidence], borderColor: CONFIDENCE_COLORS[result.confidence] }}
        >
          {result.confidence} confidence
        </span>
      </div>

      <p className="insight-card__issue">
        {ISSUE_LABELS[result.detectedIssue] ?? result.detectedIssue}
      </p>

      <p className="insight-card__insight">{result.insight}</p>

      <div className="insight-card__meta">
        <span>Scan type: <strong>{result.scanType}</strong></span>
        <span>ID: <code>{result.scanId}</code></span>
      </div>

      <Button kind="tertiary" size="md" onClick={onNavigate} style={{ marginTop: "1rem" }}>
        See Connected Path →
      </Button>
    </div>
  </SharedGlassCard>
);

// ─── Main SunLink page ─────────────────────────────────────────────────────────
const SunLink: React.FC = () => {
  const { setLastScanSessionId, setScanResult } = useAppContext();
  const navigate = useNavigate();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStepLabel, setScanStepLabel] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
      if (scanTimerRef.current) clearInterval(scanTimerRef.current);
    };
  }, [stopCamera]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (scanning) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      stopCamera();
      setScanComplete(false);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || scanning) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    setUploadedImage(canvas.toDataURL("image/png"));
    stopCamera();
    setScanComplete(false);
    setResult(null);
  };

  const handleStartCamera = async () => {
    if (scanning) return;
    setCameraError(null);
    setUploadedImage(null);
    setScanComplete(false);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, 100);
    } catch (err) {
      setCameraError("Camera access denied or unavailable. Please check your browser permissions.");
      console.error("Camera error:", err);
    }
  };

  const handleStartScan = async () => {
    if (!uploadedImage && !isCameraActive) return;

    setScanning(true);
    setScanComplete(false);
    setResult(null);
    setScanError(null);
    setProgress(0);
    setScanStepLabel(SCAN_STEPS[0].label);
    console.log("Scan started");

    const intervalMs = 50;
    const steps = SCAN_DURATION_MS / intervalMs;
    let current = 0;
    scanTimerRef.current = setInterval(() => {
      current += 1;
      const pct = Math.min(Math.round((current / steps) * 100), 100);
      setProgress(pct);
      const active = [...SCAN_STEPS].reverse().find((s) => pct >= s.at);
      if (active) setScanStepLabel(active.label);
      if (current === 1) console.log("Animation running");
    }, intervalMs);

    try {
      const aiResult = await runAIScan(uploadedImage ?? "");
      setLastScanSessionId(aiResult.scanId);
      setScanResult(aiResult);
      setResult(aiResult);
      console.log("Scan complete", aiResult.scanId);
    } catch (err) {
      console.error("Scan error:", err);
      setScanError("Scan failed. Please try again.");
    } finally {
      if (scanTimerRef.current) { clearInterval(scanTimerRef.current); scanTimerRef.current = null; }
      setScanning(false);
      setScanComplete(true);
      setProgress(100);
      setScanStepLabel("");
    }
  };

  const hasPreview = uploadedImage || isCameraActive;

  return (
    <SharedPageLayout
      title="SunLink Scan"
      description="Capture or upload an image to check for early health signals."
    >
      {/* Scan input card */}
      <SharedGlassCard title="Scan Workspace">
        {/* Upload area */}
        <div className={`upload-area${scanning ? " upload-area--disabled" : ""}`}>
          <span className="upload-area__text">Upload or capture an image to begin</span>
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} disabled={scanning} style={{ marginTop: "0.75rem" }} />
          {!isCameraActive && (
            <button onClick={handleStartCamera} disabled={scanning} style={{ marginTop: "0.5rem" }}>
              Start Camera
            </button>
          )}
        </div>

        {/* Preview + scan overlay */}
        {hasPreview && (
          <div className={`scan-frame${scanning ? " scan-frame--active" : ""}${scanComplete && !scanError ? " scan-frame--complete" : ""}`}>
            {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="scan-frame__media" />}
            {isCameraActive && (
              <>
                <video ref={videoRef} autoPlay playsInline className="scan-frame__media" />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button onClick={handleCapturePhoto} disabled={scanning}>Capture Photo</button>
                  <button onClick={stopCamera} disabled={scanning}>Stop Camera</button>
                </div>
              </>
            )}
            {scanning && <div className="scan-line" />}
            {scanning && <div className="scan-glow" />}
          </div>
        )}

        {cameraError && <p style={{ color: "#ff8389", marginTop: "0.5rem" }}>{cameraError}</p>}

        {/* Progress status */}
        {scanning && (
          <div className="scan-status">
            <span className="scan-status__text">{scanStepLabel}</span>
            <div className="scan-progress-bar">
              <div className="scan-progress-bar__fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="scan-status__pct">{progress}%</span>
          </div>
        )}

        {scanComplete && scanError && (
          <p style={{ color: "#ff8389", marginTop: "1rem" }}>⚠️ {scanError}</p>
        )}

        <Button kind="primary" style={{ marginTop: "1.5rem" }} disabled={scanning || !hasPreview} onClick={handleStartScan}>
          {scanning ? "Scanning…" : "Start Scan"}
        </Button>
      </SharedGlassCard>

      {/* Health Insight Card — only when result exists */}
      {result && (
        <HealthInsightCard
          result={result}
          onNavigate={() => navigate("/result")}
        />
      )}
    </SharedPageLayout>
  );
};

export default SunLink;


