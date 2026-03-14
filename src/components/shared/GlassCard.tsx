import type { ReactNode } from 'react'

export type GlassCardTone = 'neutral' | 'info' | 'success' | 'warning'

export interface GlassCardProps {
  readonly title?: string
  readonly subtitle?: string
  readonly tone?: GlassCardTone
  readonly className?: string
  readonly children?: ReactNode
}

export const GlassCard = ({ title, subtitle, tone = 'neutral', className, children }: GlassCardProps) => {
  const toneLabel: Record<GlassCardTone, string> = {
    neutral: 'Neutral panel',
    info: 'Informational panel',
    success: 'Success panel',
    warning: 'Attention panel',
  }

  const sectionClass = ['glass-surface', 'page-section-stack', className].filter(Boolean).join(' ')

  return (
    <section
      className={sectionClass}
      aria-label={title ?? toneLabel[tone]}
      aria-live="polite"
    >
      {(title || subtitle) && (
        <header className="glass-page-heading">
          <div>
            {title && <h1>{title}</h1>}
            {subtitle && <p>{subtitle}</p>}
          </div>
        </header>
      )}
      {children}
    </section>
  )
}

