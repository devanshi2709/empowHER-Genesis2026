import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@carbon/react";
import PageLayout from "../../components/PageLayout";
import GlassCard from "../../components/GlassCard";
import { useAppContext } from "../../context/AppContext";
import "./SunLink.css";

const SCAN_DURATION_MS = 3000;

const SunLink: React.FC = () => {
  const { setLastScanSessionId } = useAppContext();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
    };
    reader.readAsDataURL(file);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || scanning) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setUploadedImage(canvas.toDataURL("image/png"));
    stopCamera();
    setScanComplete(false);
  };

  const handleStartCamera = async () => {
    if (scanning) return;
    setCameraError(null);
    setUploadedImage(null);
    setScanComplete(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      setIsCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      }, 100);
    } catch (err) {
      setCameraError("Camera access denied or unavailable. Please check your browser permissions.");
      console.error("Camera error:", err);
    }
  };

  const handleStartScan = () => {
    if (!uploadedImage && !isCameraActive) return;
    setScanning(true);
    setScanComplete(false);
    setProgress(0);

    const intervalMs = 50;
    const steps = SCAN_DURATION_MS / intervalMs;
    let current = 0;

    scanTimerRef.current = setInterval(() => {
      current += 1;
      setProgress(Math.min(Math.round((current / steps) * 100), 100));
      if (current >= steps) {
        clearInterval(scanTimerRef.current!);
        scanTimerRef.current = null;
        const sessionId = `scan_${Date.now()}`;
        setLastScanSessionId(sessionId);
        setScanning(false);
        setScanComplete(true);
        setProgress(100);
      }
    }, intervalMs);
  };

  const hasPreview = uploadedImage || isCameraActive;

  return (
    <PageLayout>
      <div className="scan-container">
        <GlassCard>
          <h1 className="scan-title">SunLink Scan</h1>
          <p className="scan-description">
            Capture or upload an image to check for early health signals.
          </p>

          {/* Upload area */}
          <div className={`upload-area${scanning ? " upload-area--disabled" : ""}`}>
            <span className="upload-area__text">Upload or capture an image to begin</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={scanning}
              style={{ marginTop: "0.75rem" }}
            />
            {!isCameraActive && (
              <button
                onClick={handleStartCamera}
                disabled={scanning}
                style={{ marginTop: "0.5rem" }}
              >
                Start Camera
              </button>
            )}
          </div>

          {/* Preview + scan overlay */}
          {hasPreview && (
            <div className={`scan-frame${scanning ? " scan-frame--active" : ""}${scanComplete ? " scan-frame--complete" : ""}`}>
              {uploadedImage && (
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="scan-frame__media"
                />
              )}
              {isCameraActive && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="scan-frame__media"
                  />
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button onClick={handleCapturePhoto} disabled={scanning}>Capture Photo</button>
                    <button onClick={stopCamera} disabled={scanning}>Stop Camera</button>
                  </div>
                </>
              )}

              {/* Scan line */}
              {scanning && <div className="scan-line" />}

              {/* Glow overlay */}
              {scanning && <div className="scan-glow" />}
            </div>
          )}

          {cameraError && <p style={{ color: "#ff8389", marginTop: "0.5rem" }}>{cameraError}</p>}

          {/* Status */}
          {scanning && (
            <div className="scan-status">
              <span className="scan-status__text">Analyzing…</span>
              <div className="scan-progress-bar">
                <div className="scan-progress-bar__fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="scan-status__pct">{progress}%</span>
            </div>
          )}

          {scanComplete && (
            <div className="scan-result">
              ✅ Scan complete — Health Insight ready.
            </div>
          )}

          <Button
            kind="primary"
            style={{ marginTop: "1.5rem" }}
            disabled={scanning || !hasPreview}
            onClick={handleStartScan}
          >
            {scanning ? "Scanning…" : "Start Scan"}
          </Button>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default SunLink;

