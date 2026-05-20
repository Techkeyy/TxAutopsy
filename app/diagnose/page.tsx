'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const STORAGE_KEY = 'txautopsy-diagnosis-history'
const LOADING_STEPS = ['Detecting chain', 'Fetching trace', 'Classifying failure', 'Drafting diagnosis']

const styles = `
  .diagnose-wrap { min-height: 100vh; background: var(--bg); padding: 120px 40px 80px; }
  .diagnose-inner { max-width: 860px; margin: 0 auto; }
  .page-label, .page-sub, .input-label, .hash-input, .loading-step, .loading-title, .result-section-label, .result-body, .result-title, .fix-title, .fix-desc, .prevention-title, .prevention-rule, .prevention-habit, .share-btn, .error-title { font-family: 'Space Mono', monospace; }
  .page-label { font-size: 10px; letter-spacing: 0.3em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 20px; }
  .page-heading { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: clamp(2.2rem, 5vw, 3.5rem); text-transform: uppercase; letter-spacing: -0.02em; color: var(--text-primary); line-height: 1; margin-bottom: 12px; }
  .page-sub { font-size: 12px; color: var(--text-muted); margin-bottom: 48px; line-height: 1.8; }
  .input-label { font-size: 10px; letter-spacing: 0.25em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 10px; }
  .hash-input { width: 100%; padding: 18px 20px; background: var(--surface); border: 1px solid var(--border); color: var(--text-primary); font-size: 13px; outline: none; transition: border-color 0.2s; margin-bottom: 12px; }
  .hash-input::placeholder { color: var(--text-dim); }
  .hash-input:focus { border-color: var(--accent); }
  .cta-btn { width: 100%; padding: 18px; background: var(--accent); color: var(--btn-text); border: none; font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.25em; text-transform: uppercase; cursor: pointer; transition: background 0.15s; margin-bottom: 48px; }
  .cta-btn:hover { background: var(--accent-hover); }
  .cta-btn:disabled { background: var(--border); color: var(--text-muted); cursor: not-allowed; }
  .divider { border: none; border-top: 1px solid var(--border); margin-bottom: 48px; }
  .loading-box { border: 1px solid var(--border); padding: 48px 40px; text-align: center; }
  .loading-steps { list-style: none; text-align: left; max-width: 360px; margin: 0 auto; }
  .loading-step { font-size: 11px; color: var(--text-muted); padding: 10px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 12px; transition: color 0.3s; }
  .loading-step.active { color: var(--accent); }
  .loading-step.done { color: var(--text-muted); }
  .step-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--text-dim); flex-shrink: 0; transition: background 0.3s; }
  .loading-step.active .step-dot { background: var(--accent); animation: pulse 1s infinite; }
  .loading-step.done .step-dot { background: var(--text-dim); }
  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .loading-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 18px; color: var(--text-primary); text-transform: uppercase; margin-bottom: 32px; letter-spacing: 0.05em; }
  .result-box { border: 1px solid var(--border); overflow: hidden; }
  .result-header { padding: 24px 32px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: var(--result-header); gap: 18px; flex-wrap: wrap; }
  .result-status { display: flex; align-items: center; gap: 10px; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--danger, #ef4444); flex-shrink: 0; }
  .status-label { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.2em; color: var(--danger, #ef4444); text-transform: uppercase; }
  .chain-badge { font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.15em; color: var(--text-muted); text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--border); }
  .confidence-wrap { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 0.1em; }
  .result-section { padding: 32px; border-bottom: 1px solid var(--border); }
  .result-section:last-child { border-bottom: none; }
  .result-section-label { font-size: 9px; letter-spacing: 0.3em; color: var(--text-muted); text-transform: uppercase; margin-bottom: 14px; }
  .result-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 20px; color: var(--text-primary); margin-bottom: 12px; text-transform: uppercase; letter-spacing: -0.01em; }
  .result-body { font-size: 12px; color: var(--text-secondary); line-height: 1.9; }
  .result-body strong { color: var(--text-primary); font-weight: 700; }
  .fix-list { list-style: none; display: flex; flex-direction: column; gap: 12px; }
  .fix-item { display: flex; gap: 16px; padding: 16px 20px; background: var(--card-hover); border: 1px solid var(--border); transition: border-color 0.2s; }
  .fix-item:hover { border-color: var(--accent); }
  .fix-rank { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--accent); flex-shrink: 0; width: 20px; font-weight: 700; }
  .fix-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 13px; color: var(--text-primary); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.03em; }
  .fix-desc { font-size: 11px; color: var(--text-muted); line-height: 1.7; }
  .prevention-box { background: rgba(79,142,247,0.06); border: 1px solid rgba(79,142,247,0.2); padding: 24px 28px; }
  .prevention-icon { font-family: 'Space Mono', monospace; font-size: 11px; color: var(--accent); letter-spacing: 0.1em; margin-bottom: 10px; display: block; }
  .prevention-title { font-family: 'Space Grotesk', sans-serif; font-weight: 700; font-size: 14px; color: var(--text-primary); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 10px; }
  .prevention-rule { font-size: 12px; color: var(--text-secondary); line-height: 1.8; margin-bottom: 12px; }
  .prevention-habit { font-size: 11px; color: var(--text-muted); line-height: 1.8; border-top: 1px solid rgba(79,142,247,0.15); padding-top: 12px; }
  .share-btn { display: inline-block; padding: 12px 28px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; margin-top: 32px; }
  .share-btn:hover { border-color: var(--accent); color: var(--accent); }
  .error-box { border: 1px solid rgba(239,68,68,0.2); padding: 32px; background: var(--surface); }
  .error-title { font-weight: 700; font-size: 16px; color: var(--danger, #ef4444); text-transform: uppercase; margin-bottom: 10px; }
`

type HistoryItem = { hash: string; chain?: string; whatHappened?: string; timestamp: number }
type DiagnosisResult = {
  chain?: string
  errorCategory?: string
  confidence?: number
  gasLost?: boolean
  gasAmountLost?: string | number
  whatHappened?: string
  whyItHappened?: string
  fixes?: Array<{ rank: number; title: string; description: string; actionUrl?: string }>
  prevention?: { title: string; rule: string; habit: string }
  actionUrl?: string
  marginDeficit?: {
    available: string
    total: string
    denom: string
    subaccountId?: string
    marketDescription?: string
  } | null
  error?: string
}

function DiagnoseContent() {
  const searchParams = useSearchParams()
  const [hash, setHash] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [error, setError] = useState('')
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setHistory(parsed.slice(0, 10))
        }
      }
    } catch {
      // Ignore malformed local cache.
    }
  }, [])

  const saveToHistory = (txHash: string, data: DiagnosisResult) => {
    const nextHistory: HistoryItem[] = [
      { hash: txHash, chain: data.chain, whatHappened: data.whatHappened, timestamp: Date.now() },
      ...history.filter((item) => item.hash !== txHash),
    ].slice(0, 10)

    setHistory(nextHistory)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextHistory))
  }

  const clearHistory = () => {
    setHistory([])
    window.localStorage.removeItem(STORAGE_KEY)
  }

  const runDiagnosis = async (txHash: string) => {
    const trimmedHash = txHash.trim()
    if (!trimmedHash || loading) {
      return
    }

    setLoading(true)
    setLoadingStep(0)
    setError('')
    setResult(null)

    const stepTimer = window.setInterval(() => {
      setLoadingStep((current) => (current + 1) % LOADING_STEPS.length)
    }, 650)

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hash: trimmedHash }),
      })

      const data = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Diagnosis failed.')
      }

      setResult(data)
      saveToHistory(trimmedHash, data)
    } catch (diagnosisError: any) {
      setError(diagnosisError?.message || 'Failed to reach the diagnosis API. Please try again.')
    } finally {
      window.clearInterval(stepTimer)
      setLoading(false)
      setLoadingStep(0)
    }
  }

  useEffect(() => {
    const initialHash = searchParams.get('hash')
    if (initialHash) {
      setHash(initialHash)
      runDiagnosis(initialHash)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const gasNoteText = result
    ? result.gasLost
      ? 'Gas lost' + (result.gasAmountLost ? ': ~' + result.gasAmountLost : '')
      : 'No gas lost - caught before execution'
    : ''

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <div className="diagnose-wrap">
        <div className="diagnose-inner">
          <p className="page-label">AI Transaction Debugger</p>
          <h1 className="page-heading">Diagnose.</h1>
          <p className="page-sub">
            Paste any failed transaction hash below.<br />
            Auto-detects chain · Plain English output · Under 4 seconds.
          </p>

          <p className="input-label">Failed Transaction Hash</p>
          <input
            className="hash-input"
            type="text"
            value={hash}
            onChange={(event) => setHash(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && runDiagnosis(hash)}
            placeholder="0x7f3a9b2c1d4e5f6a7b8c9d0e1f2a3b4c5d6e7f..."
          />
          <button className="cta-btn" onClick={() => runDiagnosis(hash)} disabled={loading || !hash.trim()}>
            {loading ? 'DIAGNOSING...' : 'DIAGNOSE THIS TRANSACTION →'}
          </button>

          <hr className="divider" />

          {loading && (
            <div className="loading-box">
              <p className="loading-title">Reading the trace...</p>
              <ul className="loading-steps">
                {LOADING_STEPS.map((step, index) => (
                  <li key={step} className={'loading-step ' + (index === loadingStep ? 'active' : index < loadingStep ? 'done' : '')}>
                    <span className="step-dot" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && !loading && (
            <div className="error-box">
              <p className="error-title">Diagnosis Failed</p>
              <p className="result-body">{error}</p>
            </div>
          )}

          {result && !loading && (
            <div className="result-box">
              <div className="result-header">
                <div className="result-status">
                  <span className="status-dot" />
                  <span className="status-label">Transaction Failed</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <span className="chain-badge">{result.chain?.toUpperCase() || 'UNKNOWN CHAIN'}</span>
                  <span className="confidence-wrap">{result.confidence || 0}% CONFIDENCE</span>
                </div>
              </div>

              <div className="result-section">
                <p className="result-section-label">Transaction Hash</p>
                <p className="result-body">{hash}</p>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 14px', border: '1px solid var(--border)', fontFamily: "'Space Mono', monospace", fontSize: '11px', color: result.gasLost ? '#ef4444' : '#22c55e', marginTop: '16px' }}>
                  {gasNoteText}
                </div>
              </div>

              {/* MARGIN DEFICIT VISUAL — only shows for Injective margin errors */}
              {result.marginDeficit &&
                result.chain === 'injective' &&
                (result.errorCategory === 'margin_insufficient' || result.errorCategory === 'subaccount_error') && (
                <div style={{
                  padding: '32px',
                  borderBottom: '1px solid var(--border)',
                  background: 'var(--surface)',
                }}>
                  <p style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '9px',
                    letterSpacing: '0.3em',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase' as const,
                    marginBottom: '20px',
                  }}>
                    Subaccount State At Time of Failure
                  </p>

                  {result.marginDeficit.marketDescription && (
                    <p style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      marginBottom: '20px',
                      letterSpacing: '0.05em',
                    }}>
                      Market: {result.marginDeficit.marketDescription}
                    </p>
                  )}

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column' as const,
                    gap: '1px',
                    background: 'var(--border)',
                    marginBottom: '20px',
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      background: 'var(--bg)',
                    }}>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                      }}>
                        Available Balance
                      </span>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '14px',
                        color: 'var(--text-primary)',
                        fontWeight: 700,
                      }}>
                        ${result.marginDeficit.available}{' '}
                        <span style={{
                          fontSize: '10px',
                          color: 'var(--text-muted)'
                        }}>
                          {result.marginDeficit.denom}
                        </span>
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      background: 'var(--bg)',
                    }}>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '11px',
                        color: 'var(--text-muted)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                      }}>
                        Total Balance
                      </span>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '14px',
                        color: 'var(--text-secondary)',
                        fontWeight: 700,
                      }}>
                        ${result.marginDeficit.total}{' '}
                        <span style={{
                          fontSize: '10px',
                          color: 'var(--text-muted)'
                        }}>
                          {result.marginDeficit.denom}
                        </span>
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      background: 'rgba(239,68,68,0.05)',
                      borderTop: '1px solid rgba(239,68,68,0.15)',
                    }}>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '11px',
                        color: '#ef4444',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase' as const,
                      }}>
                        ⚠ Estimated Deficit
                      </span>
                      <span style={{
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '14px',
                        color: '#ef4444',
                        fontWeight: 700,
                      }}>
                        ~${(
                          Math.max(
                            0,
                            parseFloat(result.marginDeficit.total || '0') * 0.5 -
                            parseFloat(result.marginDeficit.available || '0')
                          )
                        ).toFixed(2)}{' '}
                        <span style={{ fontSize: '10px' }}>
                          {result.marginDeficit.denom} needed
                        </span>
                      </span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    flexWrap: 'wrap' as const,
                  }}>
                    <a
                      href="https://helixapp.com/portfolio"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        background: 'var(--accent)',
                        color: '#ffffff',
                        fontFamily: "'Space Mono', monospace",
                        fontSize: '11px',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase' as const,
                        textDecoration: 'none',
                        fontWeight: 700,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                    >
                      FUND SUBACCOUNT ON HELIX →
                    </a>
                    <span style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: 'var(--text-dim)',
                      letterSpacing: '0.05em',
                    }}>
                      Portfolio → Deposit → Subaccount
                    </span>
                  </div>

                  {result.marginDeficit.subaccountId && (
                    <p style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: '10px',
                      color: 'var(--text-dim)',
                      marginTop: '12px',
                      wordBreak: 'break-all' as const,
                      letterSpacing: '0.02em',
                    }}>
                      Subaccount: {result.marginDeficit.subaccountId}
                    </p>
                  )}
                </div>
              )}

              <div className="result-section">
                <p className="result-section-label">What Happened</p>
                <p className="result-title">{result.whatHappened}</p>
                <p
                  className="result-body"
                  dangerouslySetInnerHTML={{
                    __html: result.whyItHappened?.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') || '',
                  }}
                />
              </div>

              {result.fixes?.length ? (
                <div className="result-section">
                  <p className="result-section-label">How to Fix It</p>
                  <ul className="fix-list">
                    {result.fixes.map((fix) => (
                      <li key={fix.rank} className="fix-item" style={{ display: 'flex', gap: '16px', padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', transition: 'border-color 0.2s', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <span style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '11px',
                            color: 'var(--accent)',
                            flexShrink: 0,
                            width: '20px',
                            fontWeight: 700,
                          }}>
                            {String(fix.rank).padStart(2, '0')}
                          </span>
                          <div>
                            <p style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontWeight: 700,
                              fontSize: '13px',
                              color: 'var(--text-primary)',
                              marginBottom: '4px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.03em',
                            }}>
                              {fix.title}
                            </p>
                            <p style={{
                              fontFamily: "'Space Mono', monospace",
                              fontSize: '11px',
                              color: 'var(--text-muted)',
                              lineHeight: '1.7',
                            }}>
                              {fix.description}
                            </p>
                          </div>
                        </div>
                        {(fix.actionUrl || (fix.rank === 1 && result.actionUrl)) ? (
                          <a
                            href={fix.actionUrl || result.actionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-block',
                              marginLeft: '36px',
                              padding: '10px 20px',
                              background: 'var(--accent)',
                              color: '#ffffff',
                              fontFamily: "'Space Mono', monospace",
                              fontSize: '11px',
                              letterSpacing: '0.15em',
                              textTransform: 'uppercase',
                              textDecoration: 'none',
                              fontWeight: 700,
                              transition: 'opacity 0.2s',
                              width: 'fit-content',
                            }}
                            onMouseEnter={(event) => (event.currentTarget.style.opacity = '0.85')}
                            onMouseLeave={(event) => (event.currentTarget.style.opacity = '1')}
                          >
                            FIX IT →
                          </a>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {result.prevention ? (
                <div className="result-section">
                  <p className="result-section-label">Prevention - Never Hit This Again</p>
                  <div className="prevention-box">
                    <span className="prevention-icon">◆ PREVENTION LAYER</span>
                    <p className="prevention-title">{result.prevention.title}</p>
                    <p className="prevention-rule">{result.prevention.rule}</p>
                    <p className="prevention-habit">Quick habit: {result.prevention.habit}</p>
                  </div>
                </div>
              ) : null}

              <div className="result-section">
                <button
                  id="share-btn"
                  className="share-btn"
                  onClick={() => {
                    const url = window.location.origin + '/diagnose?hash=' + encodeURIComponent(hash)
                    navigator.clipboard.writeText(url).then(() => {
                      const button = document.getElementById('share-btn')
                      if (button) {
                        const originalText = button.textContent
                        button.textContent = '✓ LINK COPIED'
                        window.setTimeout(() => {
                          button.textContent = originalText
                        }, 2000)
                      }
                    })
                  }}
                >
                  ◆ COPY SHAREABLE LINK
                </button>
              </div>
            </div>
          )}

          {!loading && !result && !error ? (
            <div style={{ border: '1px solid var(--border)', padding: '64px 40px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '32px', color: 'var(--border)', marginBottom: '16px' }}>◆</div>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Awaiting Transaction Hash
              </p>
              <p style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-dim)', letterSpacing: '0.1em' }}>
                Supports Ethereum · Injective · Base · Polygon · Arbitrum · Solana
              </p>
            </div>
          ) : null}

          {history.length > 0 ? (
            <div style={{ marginTop: '64px', borderTop: '1px solid var(--border)', paddingTop: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.3em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Recent Diagnoses
                </span>
                <button
                  onClick={clearHistory}
                  style={{ fontFamily: "'Space Mono', monospace", fontSize: '10px', letterSpacing: '0.15em', color: 'var(--text-dim)', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  onMouseEnter={(event) => (event.currentTarget.style.color = '#ef4444')}
                  onMouseLeave={(event) => (event.currentTarget.style.color = 'var(--text-dim)')}
                >
                  Clear History
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--border)' }}>
                {history.map((item) => (
                  <div
                    key={item.hash + item.timestamp}
                    onClick={() => {
                      setHash(item.hash)
                      runDiagnosis(item.hash)
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    style={{ background: 'var(--bg)', padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', transition: 'background 0.2s' }}
                    onMouseEnter={(event) => (event.currentTarget.style.background = 'var(--card-hover)')}
                    onMouseLeave={(event) => (event.currentTarget.style.background = 'var(--bg)')}
                  >
                    <div style={{ overflow: 'hidden', flex: 1 }}>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--accent)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '6px' }}>
                        {item.hash}
                      </div>
                      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: '11px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: '1.5' }}>
                        {item.whatHappened}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', letterSpacing: '0.15em', color: 'var(--accent)', textTransform: 'uppercase', padding: '3px 8px', border: '1px solid var(--accent-border, rgba(79,142,247,0.2))' }}>
                        {item.chain?.toUpperCase() || 'UNKNOWN'}
                      </span>
                      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: '9px', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>
                        {new Date(item.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default function DiagnosePage() {
  return (
    <Suspense>
      <DiagnoseContent />
    </Suspense>
  )
}