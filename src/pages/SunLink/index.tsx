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

