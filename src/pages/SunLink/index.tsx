import React, { useState, useRef, useEffect, useCallback } from "react";
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

  // Stop camera stream helper
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadedImage(result);
      stopCamera();

      // Save session reference in context
      const sessionId = `scan_${Date.now()}`;
      setLastScanSessionId(sessionId);
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
    const dataUrl = canvas.toDataURL("image/png");

    setUploadedImage(dataUrl);
    stopCamera();

    const sessionId = `scan_${Date.now()}`;
    setLastScanSessionId(sessionId);
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

      // Slight delay to ensure videoRef is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setCameraError(
        "Camera access denied or unavailable. Please check your browser permissions."
      );
      console.error("Camera error:", err);
    }
  };

  return (
    <PageLayout>
      <GlassCard>
        <h1 className="scan-title">SunLink Scan</h1>
        <p className="scan-description">Capture or upload an image to check for early signals</p>
        <div className="upload-area">
          <p className="upload-area__text">Upload or capture an image to begin</p>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          {!isCameraActive && (
            <button onClick={handleStartCamera}>Start Camera</button>
          )}
          {uploadedImage && (
            <div>
              <h2>Uploaded Image</h2>
              <img src={uploadedImage} alt="Uploaded Image" />
            </div>
          )}
          {isCameraActive && (
            <div>
              <h2>Camera Input</h2>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                style={{ width: "100%", height: "auto" }}
              />
              <button onClick={handleCapturePhoto}>Capture Photo</button>
              <button onClick={stopCamera}>Stop Camera</button>
            </div>
          )}
          {cameraError && <p>{cameraError}</p>}
        </div>
        <button onClick={() => {}}>Start Scan</button>
      </GlassCard>
    </PageLayout>
  );
};

export default SunLink; 