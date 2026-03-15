import { PageLayout, Section } from '@/components/PageLayout';
import { GlassCard, GlassCardHeader, GlassCardBody } from '@/components/GlassCard';
import styles from './Advocacy.module.scss';

// ─── Data ─────────────────────────────────────────────────────

const featuredTopics = [
  {
    id: 1,
    category: 'Reproductive Health',
    title: 'Understanding Your Menstrual Cycle',
    description: 'A comprehensive guide to cycle phases, hormonal changes, and how they affect your energy, mood, and physical health throughout the month.',
    readTime: '8 min read',
    color: 'purple',
    icon: '🌸',
  },
  {
    id: 2,
    category: 'Mental Wellness',
    title: 'Managing Hormonal Mood Changes',
    description: 'Evidence-based strategies for navigating emotional shifts tied to hormonal fluctuations — from PMS to perimenopause.',
    readTime: '6 min read',
    color: 'blue',
    icon: '🧠',
  },
  {
    id: 3,
    category: 'Advocacy',
    title: 'Know Your Rights as a Patient',
    description: 'What women need to know about navigating the healthcare system, including the right to second opinions, informed consent, and equal treatment.',
    readTime: '10 min read',
    color: 'green',
    icon: '⚖️',
  },
];

const resources = [
  { title: 'Insurance & Coverage Guide', desc: 'Understand what your plan covers for women\'s preventive care.', icon: '🛡️', type: 'Guide' },
  { title: 'Find a Specialist', desc: 'Locate gynecologists, endocrinologists, and women\'s health specialists.', icon: '🔍', type: 'Tool' },
  { title: 'Symptom Checker', desc: 'AI-assisted symptom analysis to help prepare for appointments.', icon: '📱', type: 'Tool' },
  { title: 'Care Plan Templates', desc: 'Downloadable templates to organize your health goals and treatment notes.', icon: '📋', type: 'Template' },
  { title: 'Community Stories', desc: 'Lived experiences from women navigating similar health journeys.', icon: '❤️', type: 'Community' },
  { title: 'Medication Database', desc: 'Evidence-based information on common women\'s health medications.', icon: '💊', type: 'Reference' },
];

const stats = [
  { label: 'Articles Published', value: '240+' },
  { label: 'Topics Covered', value: '48' },
  { label: 'Community Members', value: '12k' },
  { label: 'Clinical Partners', value: '32' },
];

const communityPosts = [
  {
    id: 1,
    author: 'Priya M.',
    time: '2 days ago',
    title: 'Finally got a correct diagnosis after 3 years',
    excerpt: 'After years of being dismissed, I advocated for myself and pushed for more testing. Sharing my journey in case it helps others.',
    replies: 47,
    likes: 128,
  },
  {
    id: 2,
    author: 'Tamara K.',
    time: '4 days ago',
    title: 'Tips for talking to your OB about pain',
    excerpt: 'A list of questions I bring to every appointment that has helped me feel heard and get the care I actually need.',
    replies: 31,
    likes: 96,
  },
  {
    id: 3,
    author: 'Sofia R.',
    time: '1 week ago',
    title: 'Navigating PCOS and insurance coverage',
    excerpt: 'I compiled everything I learned about what treatments are typically covered and how to appeal denials.',
    replies: 22,
    likes: 84,
  },
];

// ─── Component ────────────────────────────────────────────────

export function Advocacy() {
  return (
    <PageLayout
      eyebrow="Women's Health Advocacy"
      title="Your Voice."
      titleAccent="Your Health."
      description="Evidence-based education, advocacy tools, and a supportive community — because every woman deserves to be heard."
      gradient="purple"
      actions={
        <>
          <button className="btn btn--primary">Join Community</button>
          <button className="btn btn--ghost">Browse Resources</button>
        </>
      }
    >
      {/* ── Stats ── */}
      <Section>
        <div className={styles.statsRow}>
          {stats.map((s) => (
            <GlassCard key={s.label} variant="flat" padding="md">
              <div className={styles.statItem}>
                <span className="stat-value">{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ── Featured Articles ── */}
      <Section
        title="Featured Articles"
        description="Carefully curated, clinically reviewed content to inform and empower"
        actions={<button className="btn btn--ghost" style={{ fontSize: '0.8rem' }}>View all →</button>}
      >
        <div className={styles.articlesGrid}>
          {featuredTopics.map((topic) => (
            <GlassCard
              key={topic.id}
              variant={topic.color === 'purple' ? 'tinted-purple' : topic.color === 'blue' ? 'tinted-blue' : 'default'}
              hover
              padding="lg"
            >
              <GlassCardHeader
                eyebrow={topic.category}
                title={topic.title}
                icon={<span className={styles.articleEmoji}>{topic.icon}</span>}
              />
              <GlassCardBody>
                <p className={styles.articleDesc}>{topic.description}</p>
                <div className={styles.articleMeta}>
                  <span className="badge badge--blue">{topic.readTime}</span>
                  <button className="btn btn--ghost" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                    Read →
                  </button>
                </div>
              </GlassCardBody>
            </GlassCard>
          ))}
        </div>
      </Section>

      {/* ── Resources + Community ── */}
      <div className={styles.lowerGrid}>
        {/* Resources */}
        <Section
          title="Health Resources"
          description="Tools, guides, and references for your care journey"
        >
          <div className={styles.resourcesList}>
            {resources.map((r) => (
              <GlassCard key={r.title} variant="flat" hover padding="md">
                <button className={styles.resourceBtn}>
                  <span className={styles.resourceIcon}>{r.icon}</span>
                  <span className={styles.resourceText}>
                    <span className={styles.resourceTitle}>{r.title}</span>
                    <span className={styles.resourceDesc}>{r.desc}</span>
                  </span>
                  <span className={`badge badge--${r.type === 'Tool' ? 'blue' : r.type === 'Guide' ? 'purple' : r.type === 'Community' ? 'green' : 'amber'}`}>
                    {r.type}
                  </span>
                </button>
              </GlassCard>
            ))}
          </div>
        </Section>

        {/* Community */}
        <Section
          title="Community Stories"
          description="Shared experiences from women navigating similar journeys"
        >
          <div className={styles.communityList}>
            {communityPosts.map((post) => (
              <GlassCard key={post.id} variant="default" hover padding="md">
                <div className={styles.post}>
                  <div className={styles.postMeta}>
                    <span className={styles.postAuthor}>{post.author}</span>
                    <span className="body-sm">{post.time}</span>
                  </div>
                  <h4 className={styles.postTitle}>{post.title}</h4>
                  <p className={styles.postExcerpt}>{post.excerpt}</p>
                  <div className={styles.postStats}>
                    <span className="body-sm">💬 {post.replies} replies</span>
                    <span className="body-sm">♥ {post.likes}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>
      </div>
    </PageLayout>
  );
}
