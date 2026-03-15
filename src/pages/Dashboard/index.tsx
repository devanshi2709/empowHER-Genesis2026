import { PageLayout, Section } from '@/components/PageLayout';
import { GlassCard, GlassCardHeader, GlassCardBody, GlassCardFooter } from '@/components/GlassCard';
import styles from './Dashboard.module.scss';

// ─── Data ─────────────────────────────────────────────────────

const kpis = [
  {
    label: 'Wellness Score',
    value: '87',
    unit: '/100',
    delta: '+4 this week',
    trend: 'up',
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
      </svg>
    ),
  },
  {
    label: 'Active Days',
    value: '18',
    unit: '/30',
    delta: '↑ On track',
    trend: 'up',
    color: 'green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
    ),
  },
  {
    label: 'Sleep Quality',
    value: '7.4',
    unit: 'hrs avg',
    delta: '↓ -0.3 hrs',
    trend: 'down',
    color: 'purple',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    ),
  },
  {
    label: 'Next Appointment',
    value: '3',
    unit: 'days',
    delta: 'Mar 18, 2:00 PM',
    trend: 'flat',
    color: 'amber',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
];

const insights = [
  {
    id: 1,
    type: 'ai',
    badge: 'AI Insight',
    title: 'Cycle Pattern Detected',
    body: 'Based on your recent logs, your energy levels tend to peak around days 8–12 of your cycle. Consider scheduling high-effort activities during this window for best outcomes.',
    time: '2 hours ago',
  },
  {
    id: 2,
    type: 'alert',
    badge: 'Reminder',
    title: 'Symptom Log Due',
    body: 'You haven\'t logged symptoms in 3 days. Regular tracking helps your care team identify patterns early and personalize your plan.',
    time: '5 hours ago',
  },
  {
    id: 3,
    type: 'progress',
    badge: 'Milestone',
    title: '30-Day Wellness Streak',
    body: 'You\'ve consistently logged your wellness check-ins for 30 days. This consistency is significantly improving your care plan accuracy.',
    time: 'Yesterday',
  },
];

const quickActions = [
  { label: 'Log Symptoms', icon: '📋', color: 'blue', description: 'Track how you feel today' },
  { label: 'View Care Plan', icon: '📊', color: 'purple', description: 'Review your personalized plan' },
  { label: 'Chat with Care Team', icon: '💬', color: 'green', description: 'Message your provider' },
  { label: 'Resources', icon: '📚', color: 'amber', description: 'Browse health guides' },
];

const activityItems = [
  { label: 'Care plan updated', time: '2h ago', type: 'plan' },
  { label: 'Symptom log submitted', time: '1d ago', type: 'log' },
  { label: 'Wellness check-in', time: '2d ago', type: 'checkin' },
  { label: 'Telehealth session', time: '5d ago', type: 'session' },
];

const trendData = [
  { day: 'M', value: 72 },
  { day: 'T', value: 68 },
  { day: 'W', value: 80 },
  { day: 'T', value: 75 },
  { day: 'F', value: 85 },
  { day: 'S', value: 82 },
  { day: 'S', value: 87 },
];
const maxTrend = Math.max(...trendData.map(d => d.value));

// ─── Component ────────────────────────────────────────────────

export function Dashboard() {
  return (
    <PageLayout
      eyebrow="Your Health Overview"
      title="Good morning,"
      titleAccent="Jane"
      description="Here's a snapshot of your wellness journey. Your score improved by 4 points this week."
      gradient="mixed"
      actions={
        <>
          <button className="btn btn--primary">Log Today's Check-in</button>
          <button className="btn btn--ghost">View Full Report</button>
        </>
      }
    >
      {/* ── KPI Metrics ── */}
      <Section>
        <div className={styles.kpiGrid}>
          {kpis.map((kpi, i) => (
            <GlassCard
              key={kpi.label}
              variant="default"
              hover
              padding="lg"
              className={`animate-fade-up delay-${i + 1}`}
            >
              <div className={styles.kpiCard}>
                <div className={styles.kpiTop}>
                  <span className={`icon-badge icon-badge--${kpi.color}`}>
                    {kpi.icon}
                  </span>
                  <span className={`badge badge--${kpi.color === 'green' ? 'green' : kpi.color === 'amber' ? 'amber' : kpi.color === 'purple' ? 'purple' : 'blue'}`}>
                    {kpi.label}
                  </span>
                </div>
                <div className={styles.kpiValue}>
                  <span className="stat-value">{kpi.value}</span>
                  <span className={styles.kpiUnit}>{kpi.unit}</span>
                </div>
                <p className={`stat-delta stat-delta--${kpi.trend}`}>{kpi.delta}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ── Main Content Grid ── */}
      <div className={styles.mainGrid}>
        {/* Left column */}
        <div className={styles.leftCol}>
          {/* Wellness Trend */}
          <Section>
            <GlassCard variant="default" padding="lg" className="animate-fade-up delay-1">
              <GlassCardHeader
                eyebrow="7-Day Trend"
                title="Wellness Score"
                description="Daily composite score based on your logs and check-ins"
                actions={
                  <span className="badge badge--blue">This Week</span>
                }
              />
              <GlassCardBody>
                <div className={styles.chart}>
                  {trendData.map((d) => {
                    const heightPct = (d.value / maxTrend) * 100;
                    const isLast = d === trendData[trendData.length - 1];
                    return (
                      <div key={`${d.day}-${d.value}`} className={styles.chartBar}>
                        <span className={styles.chartValue}>{d.value}</span>
                        <div className={styles.chartTrack}>
                          <div
                            className={`${styles.chartFill}${isLast ? ` ${styles.chartFillActive}` : ''}`}
                            style={{ height: `${heightPct}%` }}
                          />
                        </div>
                        <span className={styles.chartLabel}>{d.day}</span>
                      </div>
                    );
                  })}
                </div>
              </GlassCardBody>
            </GlassCard>
          </Section>

          {/* Quick Actions */}
          <Section title="Quick Actions" description="Frequently used tools for your care journey">
            <div className={styles.actionsGrid}>
              {quickActions.map((action) => (
                <GlassCard
                  key={action.label}
                  variant="flat"
                  hover
                  padding="md"
                >
                  <button className={styles.actionBtn}>
                    <span className={`icon-badge icon-badge--${action.color}`}>
                      <span className={styles.actionEmoji}>{action.icon}</span>
                    </span>
                    <span>
                      <span className={styles.actionLabel}>{action.label}</span>
                      <span className={styles.actionDesc}>{action.description}</span>
                    </span>
                  </button>
                </GlassCard>
              ))}
            </div>
          </Section>
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* AI Insights */}
          <Section
            title="Insights & Alerts"
            description="AI-powered summaries from your data"
          >
            <div className={styles.insightsList}>
              {insights.map((insight) => (
                <GlassCard
                  key={insight.id}
                  variant={insight.type === 'ai' ? 'tinted-blue' : insight.type === 'progress' ? 'tinted-purple' : 'default'}
                  padding="md"
                >
                  <div className={styles.insight}>
                    <div className={styles.insightHead}>
                      <span className={`badge badge--${insight.type === 'ai' ? 'blue' : insight.type === 'progress' ? 'purple' : 'amber'}`}>
                        {insight.badge}
                      </span>
                      <span className="body-sm" style={{ marginLeft: 'auto' }}>
                        {insight.time}
                      </span>
                    </div>
                    <h4 className={styles.insightTitle}>{insight.title}</h4>
                    <p className={styles.insightBody}>{insight.body}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
          </Section>

          {/* Recent Activity */}
          <Section title="Recent Activity">
            <GlassCard variant="default" padding="md">
              <ul className={styles.activityList}>
                {activityItems.map((item) => (
                  <li key={item.label} className={styles.activityItem}>
                    <span className={`icon-badge icon-badge--blue`} style={{ width: 32, height: 32 }}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width={14} height={14}>
                        <circle cx="8" cy="8" r="7"/>
                        <path d="M8 5v3l2 1.5"/>
                      </svg>
                    </span>
                    <div className={styles.activityText}>
                      <span className={styles.activityLabel}>{item.label}</span>
                    </div>
                    <span className="body-sm">{item.time}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Section>
        </div>
      </div>
    </PageLayout>
  );
}
