import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '36px 40px',
        background: 'var(--bg)',
        transition: 'background 0.25s ease, border-color 0.25s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '20px',
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            fontSize: '12px',
            letterSpacing: '0.3em',
            color: 'var(--accent)',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          TXAUTOPSY
        </Link>
        <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
          <Link
            href="/diagnose"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Diagnose
          </Link>
          <Link
            href="/docs"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Docs
          </Link>
          <a
            href="https://github.com/Techkeyy/TxAutopsy"
            target="_blank"
            rel="noreferrer"
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: '10px',
              letterSpacing: '0.2em',
              color: 'var(--text-muted)',
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            GitHub
          </a>
        </div>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '10px',
            letterSpacing: '0.1em',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
          }}
        >
          Injective Solo AI Builder Sprint · 2026
        </p>
      </div>
    </footer>
  )
}