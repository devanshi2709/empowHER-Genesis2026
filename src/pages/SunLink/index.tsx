import React from "react";
import { Button } from "@carbon/react";
import PageLayout from "../../components/PageLayout";
import GlassCard from "../../components/GlassCard";
import "./SunLink.css";

const SunLink: React.FC = () => {
  return (
    <PageLayout>
      <div className="scan-container">
        <GlassCard>
          <h1 className="scan-title">SunLink Scan</h1>
          <p className="scan-description">
            Capture or upload an image to check for early health signals.
          </p>

          <div className="upload-area">
            <span className="upload-area__text">
              Upload or capture an image to begin
            </span>
          </div>

          <Button kind="primary">Start Scan</Button>
        </GlassCard>
      </div>
    </PageLayout>
  );
};

export default SunLink;
