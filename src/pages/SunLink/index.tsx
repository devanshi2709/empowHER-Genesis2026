import { PageLayout, Section } from '@/components/PageLayout';
import { GlassCard, GlassCardHeader, GlassCardBody, GlassCardFooter } from '@/components/GlassCard';
import styles from './SunLink.module.scss';

// ─── Data ─────────────────────────────────────────────────────

const connectionStatus = {
  score: 78,
  tier: 'Engaged',
  streak: 12,
  nextMilestone: 'Community Leader',
  nextAt: 100,
};

const wellnessDimensions = [
  { label: 'Physical', value: 82, color: 'blue' },
  { label: 'Mental', value: 74, color: 'purple' },
  { label: 'Social', value: 68, color: 'green' },
  { label: 'Nutritional', value: 79, color: 'amber' },
  { label: 'Sleep', value: 71, color: 'blue' },
];

const networkMembers = [
  { name: 'Dr. Elena Torres', role: 'OB/GYN', status: 'online', avatar: 'ET' },
  { name: 'Coach Maria Santos', role: 'Wellness Coach', status: 'online', avatar: 'MS' },
  { name: 'Priya Mehta', role: 'Peer Mentor', status: 'away', avatar: 'PM' },
  { name: 'Dr. Anya Williams', role: 'Nutritionist', status: 'offline', avatar: 'AW' },
];

const upcomingEvents = [
  {
    id: 1,
    title: 'Hormonal Health Q&A',
    date: 'Thu, Mar 21',
    time: '3:00 PM EST',
    type: 'Live Session',
    host: 'Dr. Torres',
    spots: 8,
  },
  {
    id: 2,
    title: 'Mindful Movement Class',
    date: 'Sat, Mar 23',
    time: '10:00 AM EST',
    type: 'Wellness Class',
    host: 'Coach Santos',
    spots: 12,
  },
  {
    id: 3,
    title: 'PCOS Support Circle',
    date: 'Mon, Mar 25',
    time: '6:00 PM EST',
    type: 'Support Group',
    host: 'Community Team',
    spots: 20,
  },
];

const challenges = [
  { title: '7-Day Hydration Challenge', participants: 483, joined: true, badge: '💧', progress: 5 },
  { title: 'Morning Mindfulness Streak', participants: 271, joined: false, badge: '🌅', progress: 0 },
  { title: 'Sleep Optimization Sprint', participants: 312, joined: true, badge: '🌙', progress: 3 },
];

// ─── Component ────────────────────────────────────────────────

export function SunLink() {
  const progressPct = (connectionStatus.score / connectionStatus.nextAt) * 100;

  return (
    <PageLayout
      eyebrow="SunLink Wellness Network"
      title="Your Wellness"
      titleAccent="Community"
      description="Connect with your care team, track dimensions of wellness, and grow alongside a supportive community of women on similar journeys."
      gradient="blue"
      actions={
        <>
          <button className="btn btn--primary">Explore Connections</button>
          <button className="btn btn--ghost">View My Progress</button>
        </>
      }
    >
      {/* ── Connection Status + Dimensions ── */}
      <div className={styles.topGrid}>
        {/* Connection card */}
        <GlassCard variant="tinted-blue" padding="lg" className="animate-fade-up delay-1">
          <GlassCardHeader
            eyebrow="Community Status"
            title={connectionStatus.tier}
            description={`${connectionStatus.streak}-day check-in streak`}
          />
          <GlassCardBody>
            <div className={styles.connectionScore}>
              <div className={styles.scoreRing}>
                <svg viewBox="0 0 100 100" className={styles.scoreCircle}>
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none" stroke="rgba(37,99,235,0.12)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50" cy="50" r="42"
                    fill="none" stroke="url(#scoreGrad)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - progressPct / 100)}`}
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#2563eb" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className={styles.scoreLabel}>
                  <span className="stat-value">{connectionStatus.score}</span>
                  <span className={styles.scoreSub}>score</span>
                </div>
              </div>
              <div className={styles.scoreDetails}>
                <p className={styles.scoreNextLabel}>
                  Next: <strong>{connectionStatus.nextMilestone}</strong>
                </p>
                <p className="body-sm" style={{ marginTop: 4 }}>
                  {connectionStatus.nextAt - connectionStatus.score} points to go
                </p>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${progressPct}%` }} />
                </div>
              </div>
            </div>
          </GlassCardBody>
        </GlassCard>

        {/* Wellness dimensions */}
        <GlassCard variant="default" padding="lg" className="animate-fade-up delay-2">
          <GlassCardHeader
            eyebrow="Multidimensional Health"
            title="Wellness Dimensions"
            description="Your composite scores across five pillars of wellbeing"
          />
          <GlassCardBody>
            <div className={styles.dimensionsList}>
              {wellnessDimensions.map((dim) => (
                <div key={dim.label} className={styles.dimension}>
                  <div className={styles.dimensionHead}>
                    <span className={styles.dimensionLabel}>{dim.label}</span>
                    <span className={`badge badge--${dim.color}`}>{dim.value}</span>
                  </div>
                  <div className={styles.dimTrack}>
                    <div
                      className={`${styles.dimFill} ${styles[`dimFill--${dim.color}`]}`}
                      style={{ width: `${dim.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCardBody>
        </GlassCard>
      </div>

      {/* ── Network + Events + Challenges ── */}
      <div className={styles.bottomGrid}>
        {/* Left: Network + Challenges */}
        <div className={styles.leftCol}>
          {/* Network members */}
          <Section title="Your Care Network" description="Your connected providers and mentors">
            <GlassCard variant="default" padding="md">
              <ul className={styles.memberList}>
                {networkMembers.map((member) => (
                  <li key={member.name} className={styles.member}>
                    <div className={styles.memberAvatar}>
                      {member.avatar}
                      <span className={`${styles.statusDot} ${styles[`statusDot--${member.status}`]}`} />
                    </div>
                    <div className={styles.memberInfo}>
                      <span className={styles.memberName}>{member.name}</span>
                      <span className="body-sm">{member.role}</span>
                    </div>
                    <button className="btn btn--ghost" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                      Message
                    </button>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Section>

          {/* Challenges */}
          <Section title="Active Challenges" description="Community wellness challenges you can join">
            <div className={styles.challengeList}>
              {challenges.map((c) => (
                <GlassCard
                  key={c.title}
                  variant={c.joined ? 'tinted-blue' : 'flat'}
                  hover
                  padding="md"
                >
                  <div className={styles.challenge}>
                    <span className={styles.challengeBadge}>{c.badge}</span>
                    <div className={styles.challengeInfo}>
                      <span className={styles.challengeTitle}>{c.title}</span>
                      <span className="body-sm">{c.participants.toLocaleString()} participants</span>
                      {c.joined && (
                        <div className={styles.challengeProgress}>
                          <div className={styles.challengeBar}>
                            <div className={styles.challengeFill} style={{ width: `${(c.progress / 7) * 100}%` }} />
                          </div>
                          <span className="body-sm">Day {c.progress}/7</span>
                        </div>
                      )}
                    </div>
                    <button className={`btn ${c.joined ? 'btn--ghost' : 'btn--primary'}`} style={{ fontSize: '0.75rem', padding: '5px 14px', whiteSpace: 'nowrap' }}>
                      {c.joined ? 'Continue' : 'Join'}
                    </button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </Section>
        </div>

        {/* Right: Events */}
        <Section title="Upcoming Events" description="Live sessions, classes, and support groups">
          <div className={styles.eventsList}>
            {upcomingEvents.map((event) => (
              <GlassCard key={event.id} variant="default" hover padding="md">
                <div className={styles.event}>
                  <div className={styles.eventDate}>
                    <span className={styles.eventDay}>{event.date.split(', ')[0]}</span>
                    <span className={styles.eventNum}>{event.date.split(', ')[1]}</span>
                  </div>
                  <div className={styles.eventInfo}>
                    <span className={`badge badge--${event.type === 'Live Session' ? 'blue' : event.type === 'Wellness Class' ? 'green' : 'purple'}`}>
                      {event.type}
                    </span>
                    <h4 className={styles.eventTitle}>{event.title}</h4>
                    <p className="body-sm">{event.time} · Hosted by {event.host}</p>
                    <p className="body-sm" style={{ marginTop: 2 }}>{event.spots} spots left</p>
                  </div>
                  <button className="btn btn--primary" style={{ fontSize: '0.75rem', padding: '5px 14px', whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>
                    RSVP
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* CTA card */}
          <GlassCard variant="tinted-purple" padding="lg" className={styles.ctaCard}>
            <GlassCardHeader
              eyebrow="Premium Network"
              title="Unlock Full SunLink Access"
              description="Connect with certified health coaches, access exclusive community circles, and get priority booking for live sessions."
            />
            <GlassCardFooter>
              <button className="btn btn--primary">Upgrade to Premium</button>
              <button className="btn btn--ghost">Learn More</button>
            </GlassCardFooter>
          </GlassCard>
        </Section>
      </div>
    </PageLayout>
  );
}
