/**
 * SunLinkTest.tsx
 * Self-contained test component — no app context, router, or Carbon required.
 * Verifies: camera preview, image upload, scan animation, Health Insight Card.
 *
 * Usage: temporarily render <SunLinkTest /> anywhere to run it standalone.
 */
import React, { useState, useRef, useEffect, useCallback } from "react";

const SCAN_DURATION_MS = 3000;
const INTERVAL_MS = 50;

/* ─── inline styles ──────────────────────────────────────────────────── */
const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left,#ffb347 0,transparent 55%)," +
      "radial-gradient(circle at top right,#ff6fd8 0,transparent 55%)," +
      "radial-gradient(circle at bottom,#46c2ff 0,transparent 55%)," +
      "#050910",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2.5rem 1rem",
    fontFamily: "system-ui, -apple-system, sans-serif",
    color: "#f4f4f4",
  },
  card: {
    background:
      "linear-gradient(135deg,rgba(255,255,255,0.18),rgba(255,255,255,0.04)),rgba(12,20,33,0.65)",
    backdropFilter: "blur(22px)",
    WebkitBackdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: "20px",
    boxShadow: "0 18px 45px rgba(0,0,0,0.55)",
    padding: "2rem",
    width: "100%",
    maxWidth: "560px",
    boxSizing: "border-box",
  },
  title: { fontSize: "1.75rem", fontWeight: 600, marginBottom: "0.4rem" },
  desc: { fontSize: "0.95rem", color: "rgba(244,244,244,0.65)", marginBottom: "1.25rem" },
  instructions: {
    display: "flex",
    flexDirection: "column",
    gap: "0.3rem",
    marginBottom: "1.25rem",
    padding: "0.75rem 1rem",
    background: "rgba(255,255,255,0.06)",
    borderRadius: "8px",
    fontSize: "0.88rem",
    color: "rgba(244,244,244,0.7)",
  },
  uploadArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "180px",
    border: "2px dashed rgba(255,255,255,0.25)",
    borderRadius: "8px",
    padding: "1rem",
    marginBottom: "1rem",
    background: "rgba(255,255,255,0.04)",
    transition: "opacity 0.2s",
  },
  uploadDisabled: { opacity: 0.4, pointerEvents: "none" },
  uploadText: { fontSize: "0.9rem", color: "rgba(244,244,244,0.55)", marginBottom: "0.75rem" },
  frameWrapper: {
    position: "relative",
    width: "100%",
    borderRadius: "8px",
    overflow: "hidden",
    marginBottom: "1rem",
  },
  media: { width: "100%", height: "auto", display: "block", borderRadius: "6px" },
  scanLine: {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "3px",
    background:
      "linear-gradient(90deg,transparent,#63d2ff,#a78bfa,#63d2ff,transparent)",
    boxShadow: "0 0 12px 4px rgba(99,210,255,0.7)",
    pointerEvents: "none",
    zIndex: 10,
    animation: "scanLine 1.4s ease-in-out infinite",
  },
  glow: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(ellipse at center,rgba(99,210,255,0.25) 0%,transparent 70%)",
    pointerEvents: "none",
    zIndex: 9,
    animation: "pulseGlow 1.4s ease-in-out infinite",
  },
  statusRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    marginBottom: "1rem",
    flexWrap: "wrap" as const,
  },
  analyzingText: { color: "#63d2ff", fontWeight: 500, fontSize: "0.95rem" },
  progressTrack: {
    flex: 1,
    minWidth: "100px",
    height: "6px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressFill: (pct: number): React.CSSProperties => ({
    height: "100%",
    width: `${pct}%`,
    background: "linear-gradient(90deg,#63d2ff,#a78bfa)",
    borderRadius: "999px",
    transition: "width 0.05s linear",
  }),
  pct: { fontSize: "0.8rem", color: "rgba(244,244,244,0.55)", minWidth: "34px" },
  insightCard: {
    padding: "1rem 1.25rem",
    borderRadius: "10px",
    background: "rgba(66,255,161,0.08)",
    border: "1px solid rgba(66,255,161,0.3)",
    marginBottom: "1rem",
  },
  insightTitle: { color: "#42ffa1", fontWeight: 600, marginBottom: "0.4rem" },
  insightBody: { fontSize: "0.88rem", color: "rgba(244,244,244,0.75)", lineHeight: 1.6 },
  btn: (disabled: boolean, variant: "primary" | "ghost" = "primary"): React.CSSProperties => ({
    padding: "0.55rem 1.25rem",
    borderRadius: "6px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    fontWeight: 500,
    fontSize: "0.9rem",
    background:
      variant === "primary"
        ? "linear-gradient(135deg,#f97316,#4f46e5)"
        : "rgba(255,255,255,0.1)",
    color: "#fff",
    transition: "opacity 0.15s",
  }),
  row: { display: "flex", gap: "0.5rem", marginTop: "0.5rem", flexWrap: "wrap" as const },
  error: { color: "#ff8389", fontSize: "0.88rem", marginTop: "0.5rem" },
};

/* Inject keyframes once */
const injectKeyframes = () => {
  if (document.getElementById("sunlink-test-kf")) return;
  const style = document.createElement("style");
  style.id = "sunlink-test-kf";
  style.textContent = `
    @keyframes scanLine {
      0%   { top: 0%; }
      50%  { top: calc(100% - 3px); }
      100% { top: 0%; }
    }
    @keyframes pulseGlow {
      0%,100% { opacity: 0.5; }
      50%      { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
};

/* ─── component ──────────────────────────────────────────────────────── */
const SunLinkTest: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);
  // Unique scan session ID (mirrors real context)
  const [sessionId, setSessionId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => { injectKeyframes(); }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => () => {
    stopCamera();
    if (timerRef.current) clearInterval(timerRef.current);
  }, [stopCamera]);

  /* ── handlers ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (scanning) return;
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      stopCamera();
      setScanComplete(false);
      setSessionId(null);
      console.log("Upload preview visible");
    };
    reader.readAsDataURL(file);
  };

  const handleStartCamera = async () => {
    if (scanning) return;
    setCameraError(null);
    setUploadedImage(null);
    setScanComplete(false);
    setSessionId(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
        console.log("Camera ready");
      }, 100);
    } catch (err) {
      setCameraError("Camera access denied or unavailable.");
      console.error("Camera error:", err);
    }
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
    setSessionId(null);
    console.log("Upload preview visible");
  };

  const handleStartScan = () => {
    if (!uploadedImage && !isCameraActive) return;
    setScanning(true);
    setScanComplete(false);
    setProgress(0);
    console.log("Scan animation running");

    const steps = SCAN_DURATION_MS / INTERVAL_MS;
    let current = 0;
    timerRef.current = setInterval(() => {
      current += 1;
      setProgress(Math.min(Math.round((current / steps) * 100), 100));
      if (current >= steps) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        const id = `scan_${Date.now()}`;
        setSessionId(id);
        setScanning(false);
        setScanComplete(true);
        setProgress(100);
        console.log("Scan complete", id);
      }
    }, INTERVAL_MS);
  };

  const hasPreview = uploadedImage || isCameraActive;

  return (
    <div style={s.page}>
      <div style={s.card}>
        <h1 style={s.title}>SunLink Test</h1>
        <p style={s.desc}>Standalone verification — no app context required.</p>

        {/* Instructions */}
        <div style={s.instructions}>
          <span>📐 Align the scan area with the subject</span>
          <span>🔍 Press <strong>Start Scan</strong> to analyze</span>
        </div>

        {/* Upload area */}
        <div style={{ ...s.uploadArea, ...(scanning ? s.uploadDisabled : {}) }}>
          <span style={s.uploadText}>Upload or capture an image to begin</span>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={scanning}
          />
          {!isCameraActive && (
            <button
              style={{ ...s.btn(scanning, "ghost"), marginTop: "0.5rem" }}
              onClick={handleStartCamera}
              disabled={scanning}
            >
              Start Camera
            </button>
          )}
        </div>

        {/* Preview / scan frame */}
        {hasPreview && (
          <div
            style={{
              ...s.frameWrapper,
              border: scanning
                ? "2px solid rgba(99,210,255,0.6)"
                : scanComplete
                ? "2px solid rgba(66,255,161,0.5)"
                : "2px solid transparent",
              boxShadow: scanning ? "0 0 18px rgba(99,210,255,0.35)" : "none",
            }}
          >
            {uploadedImage && (
              <img src={uploadedImage} alt="Preview" style={s.media} />
            )}
            {isCameraActive && (
              <>
                <video ref={videoRef} autoPlay playsInline style={s.media} />
                <div style={s.row}>
                  <button style={s.btn(scanning, "ghost")} onClick={handleCapturePhoto} disabled={scanning}>
                    Capture Photo
                  </button>
                  <button style={s.btn(scanning, "ghost")} onClick={stopCamera} disabled={scanning}>
                    Stop Camera
                  </button>
                </div>
              </>
            )}
            {scanning && <div style={s.scanLine} />}
            {scanning && <div style={s.glow} />}
          </div>
        )}

        {cameraError && <p style={s.error}>{cameraError}</p>}

        {/* Scan status */}
        {scanning && (
          <div style={s.statusRow}>
            <span style={s.analyzingText}>Analyzing…</span>
            <div style={s.progressTrack}>
              <div style={s.progressFill(progress)} />
            </div>
            <span style={s.pct}>{progress}%</span>
          </div>
        )}

        {/* Health Insight Card */}
        {scanComplete && sessionId && (
          <div style={s.insightCard}>
            <p style={s.insightTitle}>✅ Health Insight</p>
            <p style={s.insightBody}>
              Mock scan complete. No anomalies detected in this test run.<br />
              <span style={{ opacity: 0.55, fontSize: "0.8rem" }}>Session: {sessionId}</span>
            </p>
          </div>
        )}

        {/* Scan button */}
        <button
          style={s.btn(!hasPreview || scanning)}
          disabled={!hasPreview || scanning}
          onClick={handleStartScan}
        >
          {scanning ? "Scanning…" : "Start Scan"}
        </button>
      </div>
    </div>
  );
};

export default SunLinkTest;
