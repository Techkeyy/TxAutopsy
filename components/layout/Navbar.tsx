'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/theme/ThemeContext'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <style jsx>{`
        nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--border);
          backdrop-filter: blur(8px);
          height: 52px;
          display: flex;
          align-items: center;
          padding: 0 40px;
        }
        .nav-inner {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
        }
        .nav-logo {
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 700;
          font-size: 13px;
          letter-spacing: 0.3em;
          color: var(--accent);
          text-decoration: none;
          text-transform: uppercase;
          flex-shrink: 0;
        }
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }
        .nav-tag,
        .nav-link,
        .nav-live,
        .mobile-link {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .nav-tag {
          color: var(--text-muted);
        }
        .nav-live {
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--accent);
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .nav-link {
          color: var(--text-secondary);
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link:hover,
        .nav-link.active {
          color: var(--text-primary);
        }
        .mobile-toggle {
          display: none;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          background: transparent;
          border: 1px solid var(--border);
          color: var(--accent);
          cursor: pointer;
          padding: 0;
        }
        .mobile-toggle span {
          display: block;
          width: 16px;
          height: 2px;
          background: var(--accent);
          position: relative;
        }
        .mobile-toggle span::before,
        .mobile-toggle span::after {
          content: '';
          position: absolute;
          left: 0;
          width: 16px;
          height: 2px;
          background: var(--accent);
          transition: transform 0.2s, top 0.2s, opacity 0.2s;
        }
        .mobile-toggle span::before { top: -5px; }
        .mobile-toggle span::after { top: 5px; }
        .mobile-toggle.open span { background: transparent; }
        .mobile-toggle.open span::before { top: 0; transform: rotate(45deg); }
        .mobile-toggle.open span::after { top: 0; transform: rotate(-45deg); }
        .mobile-panel {
          display: none;
          position: absolute;
          left: 0;
          right: 0;
          top: 52px;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--border);
          padding: 18px 24px 22px;
        }
        .mobile-panel-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .mobile-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--border);
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-top: 4px;
        }
        .mobile-link {
          color: var(--text-secondary);
          text-decoration: none;
        }
        .mobile-link.active {
          color: var(--text-primary);
        }
        @media (max-width: 860px) {
          nav {
            padding: 0 24px;
          }
          .desktop-nav {
            display: none;
          }
          .mobile-toggle {
            display: inline-flex;
          }
        }
      `}</style>
      <nav>
        <div className="nav-inner">
          <Link
            href="/"
            className="nav-logo"
            style={{
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.3em',
            }}
          >
            TXAUTOPSY
          </Link>
          <div className="desktop-nav">
            <span className="nav-tag">MULTI-CHAIN</span>
            <span className="nav-live"><span className="live-dot" />LIVE</span>
            <Link href="/diagnose" className={`nav-link ${pathname === '/diagnose' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              DIAGNOSE
            </Link>
            <Link href="/docs" className={`nav-link ${pathname === '/docs' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              DOCS
            </Link>
            <a href="https://github.com" className="nav-link" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              GITHUB
            </a>
          </div>
          <button
            type="button"
            className={`mobile-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((current) => !current)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span />
          </button>
          <button
            type="button"
            onClick={toggle}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '32px',
              height: '32px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
          >
            {theme === 'dark' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>
      </nav>
      <div className="mobile-panel" style={{ display: menuOpen ? 'block' : 'none' }}>
        <div className="mobile-panel-inner">
          <div className="mobile-meta">
            <span className="nav-tag">MULTI-CHAIN</span>
            <span className="nav-live"><span className="live-dot" />LIVE</span>
          </div>
          <div className="mobile-links">
            <Link href="/diagnose" className={`mobile-link ${pathname === '/diagnose' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              Diagnose
            </Link>
            <Link href="/docs" className={`mobile-link ${pathname === '/docs' ? 'active' : ''}`} style={{ textDecoration: 'none' }}>
              Docs
            </Link>
            <a href="https://github.com" className="mobile-link" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  )
}