import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button, FileUploaderDropContainer, InlineNotification, Loading } from "@carbon/react";
import { useNavigate } from "react-router-dom";
import { PageLayout as SharedPageLayout } from "../../components/shared/PageLayout";
import { GlassCard as SharedGlassCard } from "../../components/shared/GlassCard";
import { useAppContext } from "../../context/AppContext";
import type { ScanResult } from "../../context/AppContext";
import "./SunLink.css";

const SCAN_STEPS = [
  { at: 0,  label: "Uploading image…" },
  { at: 25, label: "Analyzing scan…" },
  { at: 60, label: "Generating insight…" },
];

interface ScanErrorResponse {
  readonly error?: string;
}

/**
 * Convert a data URL string to a Blob so it can be appended to FormData.
 */
function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const contentTypeMatch = meta.match(/data:(.*);base64/);
  const contentType = contentTypeMatch?.[1] ?? "image/png";
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Blob([bytes], { type: contentType });
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
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanStepLabel, setScanStepLabel] = useState("");
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);

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

  const handleFilesAdded = (
    _evt: React.DragEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>,
    data: { addedFiles: File[] }
  ) => {
    if (isScanning) return;
    const file = data.addedFiles[0];
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
    if (!videoRef.current || isScanning) return;
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
    if (isScanning) return;
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
    if (!uploadedImage && !isCameraActive) {
      return;
    }

    setIsScanning(true);
    setScanComplete(false);
    setResult(null);
    setScanError(null);
    setProgress(0);
    setScanStepLabel(SCAN_STEPS[0].label);

    const intervalMs = 80;
    const maxPct = 95;
    let elapsed = 0;
    scanTimerRef.current = setInterval(() => {
      elapsed += intervalMs;
      const pct = Math.min(Math.round((elapsed / 4000) * maxPct), maxPct);
      setProgress(pct);
      const active = [...SCAN_STEPS].reverse().find((s) => pct >= s.at);
      if (active) setScanStepLabel(active.label);
    }, intervalMs);

    try {
      const imageSource = uploadedImage;
      if (!imageSource) {
        throw new Error("Please upload or capture an image before starting a scan.");
      }

      const blob = dataUrlToBlob(imageSource);
      const formData = new FormData();
      const ext = blob.type?.split("/")[1] || "png";
      formData.append("image", blob, `scan.${ext}`);

      const apiRes = await fetch("/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!apiRes.ok) {
        let message = apiRes.statusText || "Scan failed";
        try {
          const payload = (await apiRes.json()) as ScanErrorResponse;
          if (payload.error) {
            message = payload.error;
          }
        } catch {
          // Ignore JSON parse errors and fall back to default message.
        }
        throw new Error(message);
      }

      const data = (await apiRes.json()) as ScanResult;
      setLastScanSessionId(data.scanId);
      setScanResult(data);
      setResult(data);

      // Navigate to the Advocacy results page once we have a successful scan.
      navigate("/advocacy");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Scan failed. Please try again.";
      setScanError(message);
    } finally {
      if (scanTimerRef.current) {
        clearInterval(scanTimerRef.current);
        scanTimerRef.current = null;
      }
      setIsScanning(false);
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
        <div className={`upload-area${isScanning ? " upload-area--disabled" : ""}`}>
          <span className="upload-area__text">
            Upload or drag an image of the area you want HelioMind to analyze.
          </span>
          <FileUploaderDropContainer
            accept={["image/jpeg", "image/png", "image/webp"]}
            labelText="Drop image here or click to browse"
            multiple={false}
            name="scan-image"
            disabled={isScanning}
            onAddFiles={handleFilesAdded}
          />
          {!isCameraActive && (
            <Button
              kind="tertiary"
              size="sm"
              onClick={handleStartCamera}
              disabled={isScanning}
              style={{ marginTop: "0.75rem" }}
            >
              Use live camera instead
            </Button>
          )}
        </div>

        {/* Preview + scan overlay */}
        {hasPreview && (
          <div className={`scan-frame${isScanning ? " scan-frame--active" : ""}${scanComplete && !scanError ? " scan-frame--complete" : ""}`}>
            {uploadedImage && <img src={uploadedImage} alt="Uploaded" className="scan-frame__media" />}
            {isCameraActive && (
              <>
                <video ref={videoRef} autoPlay playsInline className="scan-frame__media" />
                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <Button kind="secondary" size="sm" onClick={handleCapturePhoto} disabled={isScanning}>
                    Capture photo
                  </Button>
                  <Button kind="ghost" size="sm" onClick={stopCamera} disabled={isScanning}>
                    Stop camera
                  </Button>
                </div>
              </>
            )}
            {isScanning && <div className="scan-line" />}
            {isScanning && <div className="scan-glow" />}
          </div>
        )}

        {cameraError && (
          <InlineNotification
            kind="error"
            lowContrast
            title="Camera unavailable"
            subtitle={cameraError}
            onCloseButtonClick={() => setCameraError(null)}
            style={{ marginTop: "0.75rem" }}
          />
        )}

        {/* Progress status */}
        {isScanning && (
          <div className="scan-status">
            <span className="scan-status__text">{scanStepLabel}</span>
            <div className="scan-progress-bar">
              <div className="scan-progress-bar__fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="scan-status__pct">{progress}%</span>
            <Loading withOverlay={false} description="Analyzing image" small />
          </div>
        )}

        {scanComplete && scanError && (
          <InlineNotification
            kind="error"
            lowContrast
            title="Scan failed"
            subtitle={scanError}
            onCloseButtonClick={() => setScanError(null)}
            style={{ marginTop: "1rem" }}
          />
        )}

        <Button
          kind="primary"
          style={{ marginTop: "1.5rem" }}
          disabled={isScanning || !uploadedImage}
          onClick={handleStartScan}
        >
          {isScanning ? "Scanning…" : "Start scan"}
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


