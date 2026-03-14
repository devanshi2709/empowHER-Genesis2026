import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@carbon/react";
import PageLayout from "../../components/PageLayout";
import GlassCard from "../../components/GlassCard";
import { useAppContext } from "../../context/AppContext";
import "./SunLink.css";

const SunLink: React.FC = () => {
  const { setLastScanSessionId } = useAppContext();

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    return () => { stopCamera(); };
  }, [stopCamera]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      stopCamera();
      setLastScanSessionId(`scan_${Date.now()}`);
    };
    reader.readAsDataURL(file);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    setUploadedImage(canvas.toDataURL("image/png"));
    stopCamera();
    setLastScanSessionId(`scan_${Date.now()}`);
  };

  const handleStartCamera = async () => {
    setCameraError(null);
    setUploadedImage(null);
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

  return (
    <PageLayout>
      <div className="scan-container">
        <GlassCard>
          <h1 className="scan-title">SunLink Scan</h1>
          <p className="scan-description">
            Capture or upload an image to check for early health signals.
          </p>

          <div className="upload-area">
            <span className="upload-area__text">Upload or capture an image to begin</span>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ marginTop: "0.75rem" }}
            />
            {!isCameraActive && (
              <button onClick={handleStartCamera} style={{ marginTop: "0.5rem" }}>
                Start Camera
              </button>
            )}
          </div>

          {uploadedImage && (
            <div style={{ marginTop: "1rem" }}>
              <h2>Preview</h2>
              <img src={uploadedImage} alt="Uploaded" style={{ maxWidth: "100%", borderRadius: "8px" }} />
            </div>
          )}

          {isCameraActive && (
            <div style={{ marginTop: "1rem" }}>
              <video ref={videoRef} autoPlay playsInline style={{ width: "100%", height: "auto", borderRadius: "8px" }} />
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button onClick={handleCapturePhoto}>Capture Photo</button>
                <button onClick={stopCamera}>Stop Camera</button>
              </div>
            </div>
          )}

          {cameraError && <p style={{ color: "red", marginTop: "0.5rem" }}>{cameraError}</p>}

          <Button kind="primary" style={{ marginTop: "1.5rem" }}>Start Scan</Button>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default SunLink;

