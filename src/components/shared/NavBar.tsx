import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.scss';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '◈' },
  { to: '/advocacy', label: 'Advocacy', icon: '◉' },
  { to: '/sunlink', label: 'SunLink', icon: '◐' },
];

export function NavBar() {
  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.inner}>
        {/* Logo */}
        <NavLink to="/" className={styles.logo} aria-label="empowHER home">
          <span className={styles.logoMark} aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 12v8M9 17h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.3"/>
            </svg>
          </span>
          <span className={styles.logoText}>
            empow<span className={styles.logoAccent}>HER</span>
          </span>
        </NavLink>

        {/* Navigation links */}
        <ul className={styles.links} role="list">
          {navItems.map(item => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `${styles.link}${isActive ? ` ${styles.linkActive}` : ''}`
                }
              >
                <span className={styles.linkIcon} aria-hidden="true">{item.icon}</span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className={styles.actions}>
          <button className={styles.avatar} aria-label="User profile">
            <span aria-hidden="true">JD</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
