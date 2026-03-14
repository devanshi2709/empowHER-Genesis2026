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
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/shared/PageLayout'
import { GlassCard } from '@/components/shared/GlassCard'
import { PrimaryAction } from '@/components/shared/PrimaryAction'
import { useAppContext } from '@/context/AppContext'

export const SunLinkPage = () => {
  const navigate = useNavigate()
  const { setActiveFlow } = useAppContext()

  const handleContinueToResult = () => {
    setActiveFlow('result')
    navigate('/result')
  }

  return (
    <PageLayout
      title="SunLink Scan"
      description="Person 3: connect camera/upload and AI scan workflow to this container."
      primaryActionSlot={<PrimaryAction label="Continue to Results" onClick={handleContinueToResult} />}
    >
      <GlassCard
        title="Scan workspace"
        subtitle="Drop in camera, upload, and AI interpretation UI here."
        tone="info"
      >
        <p>
          This panel is intentionally minimal. Person 3 should mount the full SunLink scanning
          experience here, including any progress indicators and AI guidance.
        </p>
      </GlassCard>
    </PageLayout>
  )
}

