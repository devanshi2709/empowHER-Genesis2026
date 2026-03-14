import { useNavigate } from 'react-router-dom'
import { PageLayout } from '@/components/shared/PageLayout'
import { GlassCard } from '@/components/shared/GlassCard'
import { PrimaryAction } from '@/components/shared/PrimaryAction'
import { useAppContext } from '@/context/AppContext'

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { setActiveFlow } = useAppContext()

  const handleBeginScan = () => {
    setActiveFlow('scan')
    navigate('/scan')
  }

  return (
    <PageLayout
      title="Daily Health Dashboard"
      description="Person 2: plug dashboard widgets and visualizations into this glass card."
      primaryActionSlot={
        <PrimaryAction label="Begin SunLink Scan" onClick={handleBeginScan} />
      }
    >
      <GlassCard
        title="Your energy and wellbeing at a glance"
        subtitle="Replace this copy with Mental Energy Gauge, focus metrics, and other insights."
        tone="info"
      >
        <p>
          This is a placeholder surface for Person 2. Use this space to render the core dashboard
          components that summarize the user&apos;s health, energy, and resilience for today.
        </p>
      </GlassCard>
    </PageLayout>
  )
}

