import type { ReactNode, HTMLAttributes } from 'react';
import styles from './GlassCard.module.scss';

type CardVariant = 'default' | 'elevated' | 'tinted-blue' | 'tinted-purple' | 'flat';

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  variant?: CardVariant;
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl' | 'none';
};

export function GlassCard({
  variant = 'default',
  children,
  className,
  hover = false,
  padding = 'lg',
  ...props
}: GlassCardProps) {
  const classes = [
    styles.card,
    styles[`variant--${variant}`],
    hover && styles['hover'],
    padding !== 'none' && styles[`padding--${padding}`],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────

type CardHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  icon?: ReactNode;
};

export function GlassCardHeader({
  eyebrow,
  title,
  description,
  actions,
  icon,
}: CardHeaderProps) {
  return (
    <div className={styles.header}>
      {icon && <div className={styles.headerIcon}>{icon}</div>}
      <div className={styles.headerText}>
        {eyebrow && (
          <p className={`${styles.eyebrow} label`}>{eyebrow}</p>
        )}
        <h3 className={styles.title}>{title}</h3>
        {description && (
          <p className={styles.description}>{description}</p>
        )}
      </div>
      {actions && (
        <div className={styles.headerActions}>{actions}</div>
      )}
    </div>
  );
}

export function GlassCardBody({ children }: { children: ReactNode }) {
  return <div className={styles.body}>{children}</div>;
}

export function GlassCardFooter({
  children,
  border = false,
}: {
  children: ReactNode;
  border?: boolean;
}) {
  return (
    <div className={`${styles.footer}${border ? ` ${styles.footerBorder}` : ''}`}>
      {children}
    </div>
  );
}
