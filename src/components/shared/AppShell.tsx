import type { ReactNode } from 'react'
import {
  Header,
  HeaderName,
  HeaderNavigation,
  HeaderMenuItem,
  HeaderGlobalBar,
} from '@carbon/react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface AppShellProps {
  readonly children: ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  const location = useLocation()
  const navigate = useNavigate()

  const isActivePath = (path: string) => location.pathname === path

  return (
    <>
      <Header aria-label="HelioMind health and wellness shell" className="app-shell-header">
        <HeaderName prefix="" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <div className="app-shell-header__brand">
            <span className="app-shell-header__brand-mark" />
            <div className="app-shell-header__brand-text">
              <span>HelioMind</span>
              <span>Health &amp; Energy Insight</span>
            </div>
          </div>
        </HeaderName>

        <HeaderNavigation aria-label="Primary flows" className="app-shell-nav">
          <HeaderMenuItem
            isCurrentPage={isActivePath('/')}
            onClick={() => navigate('/')}
            className="app-shell-nav__link"
          >
            <span
              className={[
                'app-shell-nav__pill',
                isActivePath('/') ? 'app-shell-nav__pill--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              Dashboard
            </span>
          </HeaderMenuItem>

          <HeaderMenuItem
            isCurrentPage={isActivePath('/scan')}
            onClick={() => navigate('/scan')}
            className="app-shell-nav__link"
          >
            <span
              className={[
                'app-shell-nav__pill',
                isActivePath('/scan') ? 'app-shell-nav__pill--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              SunLink Scan
            </span>
          </HeaderMenuItem>

          <HeaderMenuItem
            isCurrentPage={isActivePath('/result')}
            onClick={() => navigate('/result')}
            className="app-shell-nav__link"
          >
            <span
              className={[
                'app-shell-nav__pill',
                isActivePath('/result') ? 'app-shell-nav__pill--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              Advocacy
            </span>
          </HeaderMenuItem>
        </HeaderNavigation>

        <HeaderGlobalBar />
      </Header>

      <main className="app-shell-main">
        <div className="app-shell-main__inner">{children}</div>
      </main>

      <footer className="app-shell-footer">
        <span className="app-shell-footer__meta">HelioMind • Health &amp; Wellness Platform Shell</span>
        <span className="app-shell-footer__team">Person 1: Frontend Architecture &amp; Integration</span>
      </footer>
    </>
  )
}

