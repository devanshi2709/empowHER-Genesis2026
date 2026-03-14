import type { ReactNode } from 'react'

export interface PageLayoutProps {
  readonly title: string
  readonly description?: string
  readonly primaryActionSlot?: ReactNode
  readonly children?: ReactNode
}

export const PageLayout = ({ title, description, primaryActionSlot, children }: PageLayoutProps) => {
  return (
    <div className="page-frame page-frame--full-height">
      <div className="glass-page-heading">
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
        {primaryActionSlot}
      </div>
      <div className="page-section-stack">{children}</div>
    </div>
  )
}

