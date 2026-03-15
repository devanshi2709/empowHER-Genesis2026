import type { ReactNode } from 'react';
import styles from './PageLayout.module.scss';

type PageLayoutProps = {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
  gradient?: 'blue' | 'purple' | 'mixed';
};

export function PageLayout({
  eyebrow,
  title,
  titleAccent,
  description,
  actions,
  children,
  gradient = 'mixed',
}: PageLayoutProps) {
  return (
    <div className={styles.page}>
      {/* Hero header */}
      <header className={`${styles.hero} ${styles[`hero--${gradient}`]}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroContent}>
            {eyebrow && (
              <p className={`${styles.eyebrow} label`}>{eyebrow}</p>
            )}
            <h1 className={styles.title}>
              {title}
              {titleAccent && (
                <> <span className={styles.titleAccent}>{titleAccent}</span></>
              )}
            </h1>
            {description && (
              <p className={styles.description}>{description}</p>
            )}
          </div>
          {actions && (
            <div className={styles.heroActions}>{actions}</div>
          )}
        </div>

        {/* Ambient orb decorations */}
        <span className={styles.orb1} aria-hidden="true" />
        <span className={styles.orb2} aria-hidden="true" />
      </header>

      {/* Page body */}
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {children}
        </div>
      </div>
    </div>
  );
}

// ─── Section component ────────────────────────────────────────

type SectionProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export function Section({ title, description, children, actions, className }: SectionProps) {
  return (
    <section className={`${styles.section} ${className ?? ''}`}>
      {(title || description) && (
        <div className={styles.sectionHead}>
          <div>
            {title && <h2 className={styles.sectionTitle}>{title}</h2>}
            {description && (
              <p className={styles.sectionDesc}>{description}</p>
            )}
          </div>
          {actions && <div className={styles.sectionActions}>{actions}</div>}
        </div>
      )}
      {children}
    </section>
  );
}
