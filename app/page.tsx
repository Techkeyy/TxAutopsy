'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const pageCss = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  html { font-size: 16px; scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Space Grotesk', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--text-dim); }
  ::-webkit-scrollbar-thumb:hover { background: var(--lime); }

  nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    background: rgba(0,0,0,0.95);
    border-bottom: 1px solid var(--border);
    backdrop-filter: blur(8px);
    height: 52px;
    display: flex;
    align-items: center;
    padding: 0 40px;
    justify-content: space-between;
  }

  .nav-logo {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 0.3em;
    color: var(--lime);
    text-decoration: none;
    text-transform: uppercase;
  }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 28px;
  }

  .nav-tag {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--gray-dim);
    text-transform: uppercase;
  }

  .nav-live {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--lime);
    text-transform: uppercase;
  }

  .live-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--lime);
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  .nav-link {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--gray-dim);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .nav-link:hover { color: var(--white); }

  .hero {
    padding: 140px 40px 100px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .hero-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: var(--gray-dim);
    text-transform: uppercase;
    margin-bottom: 32px;
  }

  .hero-headline {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    line-height: 0.88;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    margin-bottom: 40px;
  }

  .hero-line-1 {
    display: block;
    font-size: clamp(4rem, 11vw, 10rem);
    color: var(--white);
  }

  .hero-line-2 {
    display: block;
    font-size: clamp(4rem, 11vw, 10rem);
    color: transparent;
    -webkit-text-stroke: 2.5px var(--white);
  }

  .hero-line-3 {
    display: block;
    font-size: clamp(4rem, 11vw, 10rem);
    color: var(--lime);
  }

  .hero-desc {
    font-family: 'Space Mono', monospace;
    font-size: 13px;
    color: var(--gray);
    max-width: 420px;
    line-height: 1.8;
    margin-bottom: 60px;
  }

  .stats {
    display: flex;
    gap: 48px;
    flex-wrap: wrap;
    margin-bottom: 56px;
  }

  .stat-value {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 42px;
    color: var(--white);
    line-height: 1;
    margin-bottom: 4px;
  }

  .stat-label {
    font-family: 'Space Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.2em;
    color: var(--gray-dim);
    text-transform: uppercase;
  }

  .divider {
    border: none;
    border-top: 1px solid var(--border);
    margin-bottom: 56px;
  }

  .input-section { max-width: 720px; }

  .input-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.25em;
    color: var(--gray-dim);
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .hash-input {
    width: 100%;
    padding: 16px 20px;
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--white);
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 10px;
  }

  .hash-input::placeholder { color: var(--gray-dark); }
  .hash-input:focus { border-color: var(--lime); }

  .cta-btn {
    width: 100%;
    padding: 16px;
    background: var(--lime);
    color: var(--btn-text);
    border: none;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 0.15s;
  }
  .cta-btn:hover { background: var(--accent-hover); }
  .cta-btn:active { background: var(--accent-hover); }

  .ticker-wrap {
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
    overflow: hidden;
    padding: 12px 0;
    background: var(--black);
  }

  .ticker-track {
    display: flex;
    white-space: nowrap;
    animation: ticker 28s linear infinite;
  }

  .ticker-text {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.18em;
    color: var(--lime);
    text-transform: uppercase;
    flex-shrink: 0;
  }

  @keyframes ticker {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .section {
    border-top: 1px solid var(--border);
    padding: 80px 40px;
  }

  .section-inner { max-width: 1200px; margin: 0 auto; }

  .section-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: var(--gray-dim);
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .section-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    text-transform: uppercase;
    letter-spacing: -0.01em;
    line-height: 1.1;
    color: var(--white);
    margin-bottom: 56px;
  }

  .section-heading .accent { color: var(--lime); }

  .problem-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
  }

  @media (max-width: 768px) {
    .problem-grid { grid-template-columns: 1fr; }
  }

  .problem-card {
    background: var(--black);
    padding: 36px 32px;
    transition: background 0.2s;
  }
  .problem-card:hover { background: #08080f; }

  .problem-q {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: var(--white);
    margin-bottom: 14px;
  }

  .problem-a {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.8;
  }

  .steps-list { border: 1px solid var(--border); }

  .step {
    display: flex;
    gap: 32px;
    padding: 36px 32px;
    border-bottom: 1px solid var(--border);
    transition: background 0.2s;
  }
  .step:last-child { border-bottom: none; }
  .step:hover { background: #08080f; }

  .step-num {
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    font-size: 36px;
    color: var(--lime);
    line-height: 1;
    flex-shrink: 0;
    width: 64px;
  }

  .step-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--white);
    margin-bottom: 8px;
  }

  .step-body {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.8;
    max-width: 560px;
  }

  .feature-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1px;
    background: var(--border);
  }

  @media (max-width: 900px) {
    .feature-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .feature-grid { grid-template-columns: 1fr; }
  }

  .feature-card {
    background: var(--black);
    padding: 36px 32px;
    transition: background 0.2s;
  }
  .feature-card:hover { background: #06060f; }

  .feature-icon {
    color: var(--lime);
    font-size: 16px;
    margin-bottom: 20px;
    display: block;
  }

  .feature-title {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--white);
    margin-bottom: 12px;
  }

  .feature-body {
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--text-muted);
    line-height: 1.8;
  }

  .inj-box {
    border: 1px solid var(--lime-border);
    background: var(--lime-dim);
    padding: 48px;
  }

  .inj-label {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.3em;
    color: rgba(79,142,247,0.6);
    text-transform: uppercase;
    margin-bottom: 20px;
  }

  .inj-heading {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 28px;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 16px;
    letter-spacing: -0.01em;
  }

  .inj-body {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: var(--text-secondary);
    max-width: 580px;
    line-height: 1.8;
    margin-bottom: 32px;
  }

  .tags { display: flex; flex-wrap: wrap; gap: 10px; }

  .tag {
    padding: 6px 14px;
    border: 1px solid var(--lime-border);
    color: var(--lime);
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .cta-box {
    border: 1px solid var(--border);
    padding: 72px 40px;
    text-align: center;
  }

  .cta-heading-1 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: clamp(2.5rem, 6vw, 5rem);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: var(--white);
    line-height: 0.95;
    margin-bottom: 4px;
  }

  .cta-heading-2 {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: clamp(2.5rem, 6vw, 5rem);
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: var(--lime);
    line-height: 0.95;
    margin-bottom: 28px;
  }

  .cta-sub {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    color: var(--gray-dim);
    margin-bottom: 36px;
  }

  .cta-link {
    display: inline-block;
    padding: 16px 48px;
    background: var(--lime);
    color: var(--text-primary);
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-decoration: none;
    transition: background 0.15s;
  }
  .cta-link:hover { background: var(--accent-hover); }

  footer {
    border-top: 1px solid var(--border);
    padding: 36px 40px;
  }

  .footer-inner {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
  }

  .footer-logo {
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 12px;
    letter-spacing: 0.3em;
    color: var(--lime);
    text-transform: uppercase;
    text-decoration: none;
  }

  .footer-links {
    display: flex;
    gap: 28px;
  }

  .footer-link {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--gray-dim);
    text-decoration: none;
    text-transform: uppercase;
    transition: color 0.2s;
  }
  .footer-link:hover { color: var(--white); }

  .footer-note {
    font-family: 'Space Mono', monospace;
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--text-dim);
    text-transform: uppercase;
  }

  @media (max-width: 900px) {
    .hero, .section, footer {
      padding-left: 24px;
      padding-right: 24px;
    }
    .nav-right { gap: 18px; }
    .hero { padding-top: 120px; padding-bottom: 80px; }
  }

  @media (max-width: 640px) {
    nav { padding: 0 20px; }
    .nav-tag { display: none; }
    .nav-live { display: none; }
    .hero { padding-top: 100px; padding-bottom: 60px; }
    .hero-line-1,
    .hero-line-2,
    .hero-line-3 {
      font-size: clamp(3.2rem, 18vw, 5rem) !important;
    }
    .hero-desc { font-size: 12px; }
    .stats { gap: 20px; }
    .stat-value { font-size: 32px; }
    .stat-label { font-size: 8px; }
    .input-section { max-width: 100%; }
    .hash-input { font-size: 11px; padding: 14px 16px; }
    .cta-btn { font-size: 11px; padding: 14px; letter-spacing: 0.15em; }
    .problem-grid { grid-template-columns: 1fr; }
    .steps-list .step { flex-direction: column; gap: 8px; padding: 24px 20px; }
    .step-num { font-size: 28px; width: auto; }
    .feature-grid { grid-template-columns: 1fr; }
    .feature-card { padding: 24px 20px; }
    .inj-box { padding: 28px 20px; }
    .cta-box { padding: 48px 20px; }
    .cta-heading-1,
    .cta-heading-2 { font-size: clamp(2rem, 10vw, 3.5rem); }
    .section { padding: 48px 20px; }
    .section-heading { font-size: clamp(1.5rem, 7vw, 2.2rem); margin-bottom: 32px; }
    .ticker-text { font-size: 9px; letter-spacing: 0.1em; }
    footer { padding: 28px 20px; }
    .footer-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
    .footer-links { gap: 20px; flex-wrap: wrap; }
  }

  @media (max-width: 400px) {
    .hero-line-1,
    .hero-line-2,
    .hero-line-3 { font-size: 15vw !important; }
    .stats { gap: 16px; }
    .stat-value { font-size: 28px; }
  }
`

export default function HomePage() {
  const [hash, setHash] = useState('')
  const router = useRouter()

  const diagnose = () => {
    const value = hash.trim()
    router.push(value ? `/diagnose?hash=${encodeURIComponent(value)}` : '/diagnose')
  }

  return (
    <>
      <style jsx global>{pageCss}</style>
      <Navbar />
      <div>

        <section className="hero">
          <p className="hero-eyebrow">Ethereum · Injective · Base · Polygon · Arbitrum · Solana</p>

          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700,
            lineHeight: '0.88',
            letterSpacing: '-0.02em',
            textTransform: 'uppercase',
            marginBottom: '40px',
          }}>
            <span style={{
              display: 'block',
              fontSize: 'clamp(4.5rem, 12vw, 11rem)',
              color: 'var(--text-primary)',
            }}>
              DIAGNOSE
            </span>

            <span
              className="hero-outlined"
              style={{
                display: 'block',
                fontSize: 'clamp(4.5rem, 12vw, 11rem)',
                color: 'transparent',
              }}
            >
              ANY
            </span>

            <span style={{
              display: 'block',
              fontSize: 'clamp(4.5rem, 12vw, 11rem)',
              color: '#4F8EF7',
            }}>
              TX.
            </span>
          </h1>

          <p className="hero-desc">
            Paste any failed Web3 transaction hash.<br />
            Get a full AI-powered diagnosis in plain English —<br />
            the exact cause, the exact fix, and how to<br />
            prevent it from ever happening again.
          </p>

          <div className="stats">
            <div><div className="stat-value">20+</div><div className="stat-label">Error Types</div></div>
            <div><div className="stat-value">6</div><div className="stat-label">Chains</div></div>
            <div><div className="stat-value">&lt;4s</div><div className="stat-label">Diagnosis Time</div></div>
            <div><div className="stat-value">0</div><div className="stat-label">Jargon</div></div>
          </div>

          <hr className="divider" />

          <div className="input-section">
            <p className="input-label">Paste Failed Transaction Hash</p>
            <input
              id="hashInput"
              className="hash-input"
              type="text"
              placeholder="0x7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a..."
              value={hash}
              onChange={(event) => setHash(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && diagnose()}
            />
            <button className="cta-btn" onClick={diagnose}>
              DIAGNOSE THIS TRANSACTION →
            </button>
          </div>
        </section>

        <div className="ticker-wrap">
          <div className="ticker-track">
            <span className="ticker-text">
              TXAUTOPSY &nbsp;·&nbsp; AI TRANSACTION DIAGNOSIS &nbsp;·&nbsp; ANY CHAIN &nbsp;·&nbsp; ANY ERROR &nbsp;·&nbsp; PLAIN ENGLISH &nbsp;·&nbsp; INJECTIVE &nbsp;·&nbsp; ETHEREUM &nbsp;·&nbsp; BASE &nbsp;·&nbsp; POLYGON &nbsp;·&nbsp; ARBITRUM &nbsp;·&nbsp; SOLANA &nbsp;·&nbsp; NO JARGON &nbsp;·&nbsp; JUST ANSWERS &nbsp;·&nbsp;
              TXAUTOPSY &nbsp;·&nbsp; AI TRANSACTION DIAGNOSIS &nbsp;·&nbsp; ANY CHAIN &nbsp;·&nbsp; ANY ERROR &nbsp;·&nbsp; PLAIN ENGLISH &nbsp;·&nbsp; INJECTIVE &nbsp;·&nbsp; ETHEREUM &nbsp;·&nbsp; BASE &nbsp;·&nbsp; POLYGON &nbsp;·&nbsp; ARBITRUM &nbsp;·&nbsp; SOLANA &nbsp;·&nbsp; NO JARGON &nbsp;·&nbsp; JUST ANSWERS &nbsp;·&nbsp;
            </span>
          </div>
        </div>

        <div className="section">
          <div className="section-inner">
            <p className="section-label">The Problem</p>
            <h2 className="section-heading">
              Failed Transactions.<br />
              <span className="accent">Zero Answers.</span>
            </h2>
            <div className="problem-grid">
              <div className="problem-card"><p className="problem-q">What broke?</p><p className="problem-a">"Execution reverted" tells you nothing. You're staring at a hash with no idea what went wrong.</p></div>
              <div className="problem-card"><p className="problem-q">Is it safe to retry?</p><p className="problem-a">You don't know if you'll lose gas again. The anxiety keeps you from acting.</p></div>
              <div className="problem-card"><p className="problem-q">How do I fix it?</p><p className="problem-a">Google returns 3-year-old posts. Discord takes 40 minutes. Nobody has a clean answer.</p></div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-inner">
            <p className="section-label">The Solution</p>
            <h2 className="section-heading">
              Paste. Diagnose.<br />
              <span className="accent">Fix. Never Again.</span>
            </h2>
            <div className="steps-list">
              <div className="step"><div className="step-num">01</div><div><p className="step-title">Paste Your Hash</p><p className="step-body">Copy any failed transaction hash from your wallet, explorer, or error screen. Any chain. Any protocol. Any error type.</p></div></div>
              <div className="step"><div className="step-num">02</div><div><p className="step-title">AI Reads the Trace</p><p className="step-body">We fetch the full transaction trace, parse the event logs, and classify the failure type against 20+ known error patterns. Chain auto-detected.</p></div></div>
              <div className="step"><div className="step-num">03</div><div><p className="step-title">You Get the Answer</p><p className="step-body">Plain English cause. Exact fix steps. Prevention rule. No jargon. No Discord. No waiting. Under 4 seconds.</p></div></div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-inner">
            <p className="section-label">What You Get</p>
            <div className="feature-grid">
              <div className="feature-card"><span className="feature-icon">◆</span><p className="feature-title">Failure Diagnosis</p><p className="feature-body">AI reads the full trace and identifies the exact breaking point — cause, context, confidence score.</p></div>
              <div className="feature-card"><span className="feature-icon">◆</span><p className="feature-title">Plain English Output</p><p className="feature-body">No hex codes. No cryptic reverts. A clear explanation any user can read and act on immediately.</p></div>
              <div className="feature-card"><span className="feature-icon">◆</span><p className="feature-title">Exact Fix Steps</p><p className="feature-body">Step-by-step remediation specific to your error type, chain, and protocol context.</p></div>
              <div className="feature-card"><span className="feature-icon">◆</span><p className="feature-title">Prevention Layer</p><p className="feature-body">The permanent rule behind the failure — so you never hit the same class of error twice.</p></div>
              <div className="feature-card"><span className="feature-icon">◆</span><p className="feature-title">Injective Native</p><p className="feature-body">Deepest support for Injective exchange modules, subaccounts, oracles, and margin errors.</p></div>
              <div className="feature-card"><span className="feature-icon">◆</span><p className="feature-title">Auto Chain Detection</p><p className="feature-body">Paste any hash. We identify the chain automatically — Ethereum, Injective, Base, Polygon, Arbitrum, Solana.</p></div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-inner">
            <div className="inj-box">
              <p className="inj-label">Deepest Support</p>
              <h2 className="inj-heading">Built for Injective First</h2>
              <p className="inj-body">
                Injective&apos;s exchange modules, subaccounts, oracle mechanics,
                and margin systems produce errors no other tool explains.
                We built the deepest Injective error taxonomy available —
                so you always know exactly what broke and why.
              </p>
              <div className="tags">
                <span className="tag">Margin Insufficient</span>
                <span className="tag">Subaccount Error</span>
                <span className="tag">Oracle Price Stale</span>
                <span className="tag">Leverage Limit Exceeded</span>
                <span className="tag">Order Type Mismatch</span>
                <span className="tag">Insurance Fund Error</span>
                <span className="tag">Auction Module Error</span>
                <span className="tag">Position Below Minimum</span>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-inner">
            <div className="cta-box">
              <p className="cta-heading-1">Stop Guessing.</p>
              <p className="cta-heading-2">Start Fixing.</p>
              <p className="cta-sub">Paste your failed hash. Get your answer in seconds.</p>
              <a href="/diagnose" className="cta-link">DIAGNOSE A TRANSACTION →</a>
            </div>
          </div>
        </div>

        <div className="ticker-wrap" style={{ borderBottom: 'none' }}>
          <div className="ticker-track" style={{ animationDirection: 'reverse' }}>
            <span className="ticker-text" style={{ color: 'var(--accent)' }}>
              TXAUTOPSY &nbsp;·&nbsp; AI TRANSACTION DIAGNOSIS &nbsp;·&nbsp; ANY CHAIN &nbsp;·&nbsp; ANY ERROR &nbsp;·&nbsp; PLAIN ENGLISH &nbsp;·&nbsp; INJECTIVE &nbsp;·&nbsp; ETHEREUM &nbsp;·&nbsp; BASE &nbsp;·&nbsp; POLYGON &nbsp;·&nbsp; ARBITRUM &nbsp;·&nbsp; SOLANA &nbsp;·&nbsp; NO JARGON &nbsp;·&nbsp; JUST ANSWERS &nbsp;·&nbsp;
              TXAUTOPSY &nbsp;·&nbsp; AI TRANSACTION DIAGNOSIS &nbsp;·&nbsp; ANY CHAIN &nbsp;·&nbsp; ANY ERROR &nbsp;·&nbsp; PLAIN ENGLISH &nbsp;·&nbsp; INJECTIVE &nbsp;·&nbsp; ETHEREUM &nbsp;·&nbsp; BASE &nbsp;·&nbsp; POLYGON &nbsp;·&nbsp; ARBITRUM &nbsp;·&nbsp; SOLANA &nbsp;·&nbsp; NO JARGON &nbsp;·&nbsp; JUST ANSWERS &nbsp;·&nbsp;
            </span>
          </div>
        </div>

        <Footer />
      </div>
    </>
  )
}
