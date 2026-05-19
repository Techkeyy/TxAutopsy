import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function DocsPage() {
  const styles = `
    .docs-wrap {
      min-height: 100vh;
      background: var(--bg);
      padding: 120px 40px 80px;
    }
    .docs-inner {
      max-width: 860px;
      margin: 0 auto;
    }
    .page-label {
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.3em;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 20px;
    }
    .page-heading {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: clamp(2.5rem, 6vw, 4.5rem);
      text-transform: uppercase;
      letter-spacing: -0.02em;
      color: var(--text-primary);
      line-height: 1;
      margin-bottom: 16px;
    }
    .page-sub {
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      color: var(--text-muted);
      margin-bottom: 64px;
      line-height: 1.8;
    }
    .doc-section {
      border-top: 1px solid var(--border);
      padding: 48px 0;
    }
    .doc-section:last-child {
      border-bottom: 1px solid var(--border);
    }
    .doc-section-label {
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.35em;
      color: var(--text-dim);
      text-transform: uppercase;
      margin-bottom: 16px;
    }
    .doc-section-title {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 20px;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: -0.01em;
      margin-bottom: 20px;
    }
    .doc-body {
      font-family: 'Space Mono', monospace;
      font-size: 12px;
      color: var(--text-secondary);
      line-height: 1.9;
      max-width: 640px;
      margin-bottom: 20px;
    }
    .doc-body strong { color: var(--text-primary); font-weight: 700; }
    .error-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    .error-table th {
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.2em;
      color: var(--text-dim);
      text-transform: uppercase;
      text-align: left;
      padding: 10px 16px;
      border-bottom: 1px solid var(--border);
    }
    .error-table td {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      padding: 12px 16px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
      line-height: 1.6;
    }
    .error-table tr:hover td { background: var(--card-hover); }
    .error-table td:first-child { color: var(--text-primary); font-weight: 700; }
    .chain-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: var(--border);
      margin-top: 8px;
    }
    .chain-card {
      background: var(--bg);
      padding: 24px;
    }
    .chain-name {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: var(--text-primary);
      text-transform: uppercase;
      margin-bottom: 6px;
      letter-spacing: 0.05em;
    }
    .chain-detail {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.7;
    }
    .chain-badge {
      display: inline-block;
      margin-top: 8px;
      padding: 3px 10px;
      border: 1px solid var(--border);
      font-family: 'Space Mono', monospace;
      font-size: 9px;
      letter-spacing: 0.15em;
      color: var(--accent);
      text-transform: uppercase;
    }
    .step-flow {
      display: flex;
      flex-direction: column;
      gap: 1px;
      background: var(--border);
    }
    .step-row {
      display: flex;
      gap: 24px;
      background: var(--surface);
      padding: 24px 28px;
      align-items: flex-start;
      transition: background 0.2s;
    }
    .step-row:hover { background: var(--card-hover); }
    .step-n {
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      font-size: 22px;
      color: var(--accent);
      width: 48px;
      flex-shrink: 0;
      line-height: 1;
    }
    .step-text-title {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 700;
      font-size: 14px;
      color: var(--text-primary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 6px;
    }
    .step-text-body {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--text-muted);
      line-height: 1.7;
    }
    .inj-box {
      border: 1px solid var(--inj-border);
      background: var(--inj-bg);
      padding: 32px;
      margin-top: 8px;
    }
    .inj-sub {
      font-family: 'Space Mono', monospace;
      font-size: 11px;
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 20px;
    }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .tag {
      padding: 5px 12px;
      border: 1px solid var(--tag-border);
      color: var(--accent);
      font-family: 'Space Mono', monospace;
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    @media (max-width: 768px) {
      .docs-wrap { padding-left: 24px; padding-right: 24px; }
      .chain-list { grid-template-columns: 1fr; }
      .step-row { flex-direction: column; gap: 12px; }
    }
  `

  const errorTypes = [
    { name: 'Slippage Exceeded', chains: 'All EVM', desc: 'Price moved beyond your tolerance during pending confirmation.' },
    { name: 'Approval Missing', chains: 'All EVM', desc: 'Contract not authorized to spend your token. Pre-approval step skipped.' },
    { name: 'Insufficient Gas', chains: 'All EVM', desc: 'Gas limit set too low for the complexity of the transaction.' },
    { name: 'Nonce Conflict', chains: 'All EVM', desc: 'A pending transaction is blocking this one. Stuck nonce.' },
    { name: 'Contract Paused', chains: 'All EVM', desc: 'Protocol has paused the contract. Usually a security measure.' },
    { name: 'Deadline Expired', chains: 'All EVM', desc: 'Transaction sat in mempool past its deadline parameter.' },
    { name: 'Reentrancy Blocked', chains: 'All EVM', desc: 'A contract guard blocked a suspicious call pattern.' },
    { name: 'Margin Insufficient', chains: 'Injective', desc: 'Subaccount balance too low for the leverage level selected.' },
    { name: 'Oracle Price Stale', chains: 'Injective', desc: 'Price feed was stale when the order landed on-chain.' },
    { name: 'Subaccount Error', chains: 'Injective', desc: 'Wrong subaccount selected or insufficient funds in subaccount.' },
    { name: 'Leverage Exceeded', chains: 'Injective', desc: 'Requested leverage above maximum for this market.' },
    { name: 'Order Type Mismatch', chains: 'Injective', desc: 'Order type not supported in current market state.' },
    { name: 'NFT Sale Not Active', chains: 'Ethereum', desc: 'Mint attempted before public sale opened or after it closed.' },
    { name: 'Max Wallet Exceeded', chains: 'Ethereum', desc: 'Wallet already holds the maximum allowed NFTs for this collection.' },
    { name: 'RPC Timeout', chains: 'All', desc: 'Node timed out. Funds are safe — retry or switch RPC.' },
    { name: 'Program Error', chains: 'Solana', desc: 'Solana program returned an error code. Includes compute and rent failures.' },
  ]

  const chains = [
    { name: 'Ethereum', detail: 'Full trace via Alchemy + Etherscan', badge: 'MAINNET' },
    { name: 'Injective', detail: 'Exchange module, oracle, subaccount, margin errors', badge: 'DEEPEST SUPPORT' },
    { name: 'Base', detail: 'Full trace via BaseScan API', badge: 'MAINNET' },
    { name: 'Polygon', detail: 'Full trace via PolygonScan', badge: 'MAINNET' },
    { name: 'Arbitrum', detail: 'Full trace via Arbiscan', badge: 'MAINNET' },
    { name: 'Solana', detail: 'Program errors, compute units, rent failures', badge: 'MAINNET' },
  ]

  return (
    <>
      <style>{styles}</style>
      <Navbar />
      <div className="docs-wrap">
        <div className="docs-inner">
          <p className="page-label">Documentation</p>
          <h1 className="page-heading">How It Works.</h1>
          <p className="page-sub">
            Everything you need to know about TxAutopsy —<br />
            supported chains, error types, and how the AI diagnoses failures.
          </p>

          <div className="doc-section">
            <p className="doc-section-label">01</p>
            <p className="doc-section-title">The Diagnosis Flow</p>
            <p className="doc-body">
              TxAutopsy takes any failed transaction hash, fetches the full on-chain trace, classifies the error type,
              and uses AI to generate a plain English explanation with a specific fix and a prevention rule.
            </p>
            <div className="step-flow">
              {[
                { n: '01', t: 'Paste Hash', b: 'You provide any failed transaction hash. We auto-detect the chain — no manual selection needed.' },
                { n: '02', t: 'Fetch Trace', b: 'We pull the full transaction trace from the chain\'s RPC or explorer API including event logs, revert reasons, and module errors.' },
                { n: '03', t: 'Classify Error', b: 'The error is matched against 20+ known failure patterns across all supported chains.' },
                { n: '04', t: 'AI Generates Diagnosis', b: 'Claude reads the classified error with full chain context and writes a plain English explanation, fix steps, and prevention rule.' },
                { n: '05', t: 'You Get the Answer', b: 'Displayed in under 4 seconds. Shareable link included. No Discord. No waiting.' },
              ].map((step) => (
                <div key={step.n} className="step-row">
                  <span className="step-n">{step.n}</span>
                  <div>
                    <p className="step-text-title">{step.t}</p>
                    <p className="step-text-body">{step.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="doc-section">
            <p className="doc-section-label">02</p>
            <p className="doc-section-title">Supported Chains</p>
            <p className="doc-body">
              Chain is auto-detected from the hash format. No dropdown. No manual selection. Just paste and go.
            </p>
            <div className="chain-list">
              {chains.map((chain) => (
                <div key={chain.name} className="chain-card">
                  <p className="chain-name">{chain.name}</p>
                  <p className="chain-detail">{chain.detail}</p>
                  <span className="chain-badge">{chain.badge}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="doc-section">
            <p className="doc-section-label">03</p>
            <p className="doc-section-title">Error Taxonomy</p>
            <p className="doc-body">20+ classified error types covering every major failure pattern across all supported chains.</p>
            <table className="error-table">
              <thead>
                <tr>
                  <th>Error Type</th>
                  <th>Chains</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {errorTypes.map((errorType) => (
                  <tr key={errorType.name}>
                    <td>{errorType.name}</td>
                    <td>{errorType.chains}</td>
                    <td>{errorType.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="doc-section">
            <p className="doc-section-label">04</p>
            <p className="doc-section-title">Injective Deep Support</p>
            <div className="inj-box">
              <p className="inj-sub">
                Injective&apos;s architecture is fundamentally different from standard EVM chains. It has exchange modules,
                subaccounts, oracle price feeds, margin systems, and insurance funds — all of which produce unique errors
                that no generic tool explains. TxAutopsy has the deepest Injective error taxonomy available.
              </p>
              <div className="tags">
                {[
                  'Margin Insufficient',
                  'Subaccount Error',
                  'Oracle Price Stale',
                  'Leverage Limit Exceeded',
                  'Order Type Mismatch',
                  'Insurance Fund Error',
                  'Auction Module Error',
                  'Position Below Minimum',
                  'Market Not Found',
                  'Self Relaying Disabled',
                ].map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="doc-section">
            <p className="doc-section-label">05</p>
            <p className="doc-section-title">The Prevention Layer</p>
            <p className="doc-body">
              Every diagnosis includes a <strong>Prevention Layer</strong> — a permanent rule and quick habit derived from the error class.
              The goal is not just to fix the current failure, but to ensure you never hit the same class of error again.
              This is the feature that separates TxAutopsy from a simple debugger and makes it an intelligent assistant.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}