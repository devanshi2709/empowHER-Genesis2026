import { PageLayout } from '@/components/shared/PageLayout'
import { GlassCard } from '@/components/shared/GlassCard'
import { useAppContext } from '@/context/AppContext'

export const AdvocacyPage = () => {
  const { lastScanSessionId } = useAppContext()

  return (
    <PageLayout
      title="Advocacy & Results"
      description="Person 4: orchestrate benefits, recommendations, and advocacy logic here."
    >
      <GlassCard
        title="Personalised advocacy outcome"
        subtitle="Swap this text for AI-driven recommendations, benefit matching, and follow-up actions."
        tone="success"
      >
        <p>
          This is the final stage of the flow, reserved for tailored insights and next best actions
          after a scan. You can optionally key your UI off the latest scan session identifier:
        </p>
        <p>
          <strong>Latest scan session:</strong>{' '}
          {lastScanSessionId ? lastScanSessionId : 'none yet – ready for first SunLink scan.'}
        </p>
      </GlassCard>
    </PageLayout>
  )
}

