import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DonutChart } from '@carbon/charts-react'
import type { DonutChartOptions } from '@carbon/charts'
import '@carbon/charts/styles.css'
import { PageLayout } from '@/components/shared/PageLayout'
import { GlassCard } from '@/components/shared/GlassCard'
import { PrimaryAction } from '@/components/shared/PrimaryAction'
import { useAppContext } from '@/context/AppContext'

type VoiceCheckInState =
  | 'idle'
  | 'requesting'
  | 'listening'
  | 'analyzing'
  | 'blocked'
  | 'unsupported'

interface VoiceCheckInResult {
  readonly transcript: string
  readonly summary: string
  readonly energySignal: 'low' | 'moderate' | 'high' | 'unknown'
  readonly nextPrompt: string
  readonly source: 'backend' | 'mock'
}

interface DailyPulseData {
  readonly userName: string
  readonly greeting: string
  readonly subtitle: string
  readonly energyScore: number
  readonly energyLabel: 'Low' | 'Moderate' | 'High'
  readonly energySummary: string
  readonly heartStability: {
    readonly status: 'Stable' | 'Elevated' | 'Needs Attention'
    readonly summary: string
    readonly detail: string
  }
  readonly lastScan: {
    readonly timeAgo: string
    readonly reminder: string
    readonly detail: string
  }
}

const dailyPulseData: DailyPulseData = {
  userName: 'Vaibhavi',
  greeting: 'Good morning, Vaibhavi',
  subtitle: "Let's check in with how you're feeling today.",
  energyScore: 68,
  energyLabel: 'Moderate',
  energySummary: 'Your voice check-in and self-reported mood suggest steady but not fully recovered focus.',
  heartStability: {
    status: 'Stable',
    summary: 'Mock wearable sync shows a steady heart signal this morning.',
    detail: 'This card can combine wearable trends with voice context for clearer daily support.',
  },
  lastScan: {
    timeAgo: '2 days ago',
    reminder: "You haven't checked your gums or visible health markers today.",
    detail: 'A quick scan supports preventive care and helps the app nudge action early.',
  },
}

const buildVoicePayloadPreview = (transcript: string): VoiceCheckInResult => {
  const normalizedTranscript = transcript.toLowerCase()

  if (normalizedTranscript.includes('tired')) {
    return {
      transcript,
      source: 'mock',
      energySignal: 'low',
      nextPrompt: 'Consider a recovery break and a guided scan for extra context.',
      summary: 'The check-in suggests lower energy and a need for recovery support.',
    }
  }

  if (normalizedTranscript.includes('calm') || normalizedTranscript.includes('walk')) {
    return {
      transcript,
      source: 'mock',
      energySignal: 'moderate',
      nextPrompt: 'A scan can confirm whether your energy and recovery are trending up.',
      summary: 'The check-in suggests a steady but still building energy pattern.',
    }
  }

  return {
    transcript,
    source: 'mock',
    energySignal: transcript ? 'high' : 'unknown',
    nextPrompt: 'Connect a backend endpoint later to turn this into structured symptom extraction.',
    summary: transcript
      ? 'The check-in sounds positive, but backend interpretation is still a placeholder.'
      : 'No transcript captured yet.',
  }
}

const dashboardCardBodyStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
} as const

const dashboardSectionTitleStyle = {
  margin: 0,
  fontSize: '1.75rem',
  lineHeight: 1.1,
} as const

export const DashboardPage = () => {
  const navigate = useNavigate()
  const { setActiveFlow } = useAppContext()
  const [voiceState, setVoiceState] = useState<VoiceCheckInState>('idle')
  const [voiceStatus, setVoiceStatus] = useState('Voice input will be connected by the backend/integration layer.')
  const [transcript, setTranscript] = useState('')
  const [voiceResult, setVoiceResult] = useState<VoiceCheckInResult>(() => buildVoicePayloadPreview(''))

  const handleBeginScan = () => {
    setActiveFlow('scan')
    navigate('/scan')
  }

  const analyzeVoiceCheckIn = async () => {
    const backendUrl = import.meta.env.VITE_WATSONX_ANALYZE_URL
    const trimmedTranscript = transcript.trim()

    if (!trimmedTranscript) {
      setVoiceStatus('No transcript yet. Your teammate can wire real speech capture into this state later.')
      setVoiceResult(buildVoicePayloadPreview(''))
      setVoiceState('idle')
      return
    }

    if (!backendUrl) {
      setVoiceStatus('Backend endpoint not configured yet. Showing a local placeholder interpretation.')
      setVoiceResult(buildVoicePayloadPreview(trimmedTranscript))
      setVoiceState('idle')
      return
    }

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript: trimmedTranscript,
          source: 'dashboard-voice-check-in',
        }),
      })

      if (!response.ok) {
        throw new Error(`Backend responded with ${response.status}`)
      }

      const result = (await response.json()) as Partial<VoiceCheckInResult>

      setVoiceResult({
        transcript: result.transcript ?? trimmedTranscript,
        summary: result.summary ?? 'Backend connected, but no summary was returned.',
        energySignal: result.energySignal ?? 'unknown',
        nextPrompt: result.nextPrompt ?? 'Review backend response shape with your integration teammate.',
        source: 'backend',
      })
      setVoiceStatus('Backend placeholder endpoint responded successfully.')
      setVoiceState('idle')
    } catch {
      setVoiceStatus('Backend placeholder request failed. Showing local interpretation instead.')
      setVoiceResult(buildVoicePayloadPreview(trimmedTranscript))
      setVoiceState('blocked')
    }
  }

  const handleVoiceButtonClick = async () => {
    if (voiceState === 'listening') {
      setVoiceState('analyzing')
      setVoiceStatus('Analyzing the current transcript with the backend placeholder...')
      await analyzeVoiceCheckIn()
      return
    }

    setVoiceState('listening')
    setVoiceStatus('Listening state active. Wire real speech capture into the transcript field next.')
  }

  const mentalEnergyChartData = [
    {
      group: 'Available energy',
      value: dailyPulseData.energyScore,
    },
    {
      group: 'Recovery reserve',
      value: 100 - dailyPulseData.energyScore,
    },
  ]

  const mentalEnergyChartOptions: DonutChartOptions = {
    height: '240px',
    toolbar: {
      enabled: false,
    },
    resizable: true,
    color: {
      scale: {
        'Available energy': '#fb923c',
        'Recovery reserve': '#312e81',
      },
    },
    pie: {
      alignment: 'center',
    },
    donut: {
      alignment: 'center',
      center: {
        label: dailyPulseData.energyLabel,
        number: dailyPulseData.energyScore,
        numberFormatter: (value) => `${value}%`,
      },
    },
    legend: {
      enabled: false,
    },
  }

  const listeningMessage =
    voiceState === 'analyzing'
      ? 'Analyzing voice check-in...'
      : voiceState === 'blocked'
        ? 'Backend placeholder failed.'
        : voiceState === 'unsupported'
          ? 'Speech capture is not wired yet.'
          : voiceState === 'listening'
            ? 'Listening state active'
            : 'Voice check-in scaffold'

  return (
    <PageLayout
      title={dailyPulseData.greeting}
      description={dailyPulseData.subtitle}
      primaryActionSlot={<PrimaryAction label="Start Scan" onClick={handleBeginScan} />}
    >
      <GlassCard tone="info">
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
          }}
        >
          <div>
            <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.08em', opacity: 0.7 }}>
              Daily Pulse
            </p>
            <h2 style={{ margin: '0.5rem 0 0.75rem', fontSize: '2.35rem', lineHeight: 1.05 }}>
              How are you doing today?
            </h2>
            <p style={{ margin: 0, maxWidth: '54ch', lineHeight: 1.55 }}>
              Start with one quick wellbeing snapshot, then move into a preventive scan if
              something feels off.
            </p>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
            }}
          >
            <div className="glass-surface--soft" style={{ padding: '1rem' }}>
              <strong>Today&apos;s focus</strong>
              <p style={{ margin: '0.5rem 0 0', lineHeight: 1.5 }}>
                Check your energy, notice early signals, and decide whether you want to scan.
              </p>
            </div>
            <div className="glass-surface--soft" style={{ padding: '1rem' }}>
              <strong>Next step</strong>
              <p style={{ margin: '0.5rem 0 0', lineHeight: 1.5 }}>
                Use the check-in below to capture symptoms or context before the scan flow.
              </p>
            </div>
          </div>
        </div>
      </GlassCard>

      <GlassCard
        title="Mental Energy Gauge"
        subtitle="A simple wellness snapshot based on voice check-in, mood, and self-reported energy."
        tone="success"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              minHeight: '280px',
              width: '100%',
              maxWidth: '320px',
              justifySelf: 'center',
              overflow: 'hidden',
            }}
          >
            <DonutChart data={mentalEnergyChartData} options={mentalEnergyChartOptions} />
          </div>

          <div style={dashboardCardBodyStyle}>
            <div className="glass-surface--soft" style={{ padding: '1rem' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  opacity: 0.7,
                  marginBottom: '0.35rem',
                }}
              >
                Current state
              </span>
              <strong style={{ display: 'block', fontSize: '1.5rem', lineHeight: 1.2 }}>
                {dailyPulseData.energyLabel}
              </strong>
              <p style={{ marginBottom: 0, marginTop: '0.5rem', lineHeight: 1.6 }}>
                {dailyPulseData.energySummary}
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '0.75rem',
              }}
            >
              <div className="glass-elevated-border" style={{ padding: '0.9rem 1rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    opacity: 0.7,
                    marginBottom: '0.25rem',
                  }}
                >
                  Score
                </span>
                <strong>{dailyPulseData.energyScore}%</strong>
              </div>
              <div className="glass-elevated-border" style={{ padding: '0.9rem 1rem' }}>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    opacity: 0.7,
                    marginBottom: '0.25rem',
                  }}
                >
                  Use
                </span>
                <strong>Daily check-in</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="glass-elevated-border" style={{ padding: '0.35rem 0.6rem' }}>
                Carbon Charts
              </span>
              <span className="glass-elevated-border" style={{ padding: '0.35rem 0.6rem' }}>
                Mock data
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <GlassCard
          title="Heart Stability"
          subtitle={dailyPulseData.heartStability.detail}
          tone="info"
        >
          <div style={dashboardCardBodyStyle}>
            <div className="glass-surface--soft" style={{ padding: '0.75rem 1rem', alignSelf: 'flex-start' }}>
              <strong>{dailyPulseData.heartStability.status}</strong>
            </div>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{dailyPulseData.heartStability.summary}</p>
            <p style={{ margin: 0, opacity: 0.78, lineHeight: 1.5 }}>
              Mock wearable trend: <strong>+4% steadier than yesterday</strong>
            </p>
          </div>
        </GlassCard>

        <GlassCard
          title="Last Scan Reminder"
          subtitle={dailyPulseData.lastScan.detail}
          tone="warning"
        >
          <div style={dashboardCardBodyStyle}>
            <div className="glass-surface--soft" style={{ padding: '1rem', width: 'fit-content' }}>
              <span
                style={{
                  display: 'block',
                  fontSize: '0.78rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  opacity: 0.7,
                  marginBottom: '0.35rem',
                }}
              >
                Last scan
              </span>
              <strong style={{ display: 'block', fontSize: '1.35rem', lineHeight: 1.2 }}>
                {dailyPulseData.lastScan.timeAgo}
              </strong>
            </div>
            <p style={{ margin: 0, lineHeight: 1.5 }}>{dailyPulseData.lastScan.reminder}</p>
            <PrimaryAction label="Start Preventive Scan" onClick={handleBeginScan} />
          </div>
        </GlassCard>
      </div>

      <GlassCard
        title="Check-In"
        subtitle="Capture symptoms, mood, or context here. Real speech capture can be wired in later."
        tone="neutral"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
            alignItems: 'start',
          }}
        >
          <div style={dashboardCardBodyStyle}>
            <div className="glass-surface--soft" style={{ padding: '1rem' }}>
              <strong>{listeningMessage}</strong>
              <p style={{ margin: '0.5rem 0 0', lineHeight: 1.5 }}>{voiceStatus}</p>
            </div>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Transcript placeholder</span>
              <textarea
                value={transcript}
                onChange={(event) => setTranscript(event.target.value)}
                rows={5}
                placeholder="Example: I feel a little tired today, but calmer than yesterday."
                style={{
                  width: '100%',
                  resize: 'vertical',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(12, 20, 33, 0.35)',
                  color: 'inherit',
                  padding: '0.85rem 1rem',
                  boxSizing: 'border-box',
                }}
              />
            </label>
            <PrimaryAction
              label={voiceState === 'listening' ? 'Analyze Check-In' : 'Start Check-In'}
              onClick={() => {
                void handleVoiceButtonClick()
              }}
            />
          </div>

          <div className="glass-elevated-border" style={{ padding: '1rem', minHeight: '100%' }}>
            <h3 style={dashboardSectionTitleStyle}>Check-In Insight</h3>
            <p style={{ marginTop: 0, lineHeight: 1.55 }}>
              <strong>Summary:</strong> {voiceResult.summary}
            </p>
            <p style={{ lineHeight: 1.55 }}>
              <strong>Energy signal:</strong> {voiceResult.energySignal}
            </p>
            <p style={{ lineHeight: 1.55 }}>
              <strong>Next prompt:</strong> {voiceResult.nextPrompt}
            </p>
            <p style={{ marginBottom: 0, opacity: 0.78, lineHeight: 1.55 }}>
              <strong>Source:</strong>{' '}
              {voiceResult.source === 'backend'
                ? 'backend placeholder response'
                : 'local scaffold interpretation'}
            </p>
          </div>
        </div>
      </GlassCard>
    </PageLayout>
  )
}
