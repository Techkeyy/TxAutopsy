# TxAutopsy

> AI-powered transaction failure diagnosis for Web3.
> Paste any failed transaction hash. Get the answer in plain English.

**Live Demo:** Coming soon

---

## What It Does

TxAutopsy takes any failed Web3 transaction hash, 
fetches the full on-chain trace, classifies the 
error type, and uses AI to generate:

- **Plain English explanation** of what broke and why
- **Exact fix steps** ranked by likelihood
- **Prevention layer** — the rule to never hit this error again
- **Confidence score** on every diagnosis
- **Shareable link** for support contexts

No jargon. No Discord waiting. Under 4 seconds.

---

## How AI Is Used

TxAutopsy uses **DeepSeek Chat** as its AI engine.

The AI does genuine inference work — not just Q&A:

1. Receives the raw transaction trace, event logs, 
	revert reasons, and classified error type
2. Cross-references chain-specific context 
	(Injective modules, EVM patterns, Solana programs)
3. Generates a structured JSON response containing:
	- Human-readable diagnosis
	- Ranked fix steps with specific actions
	- A prevention rule for the error class
	- Confidence assessment

The AI is a translation engine between 
machine-level blockchain state and human understanding.

---

## Injective Integration

TxAutopsy has the deepest Injective support 
of any transaction debugger:

- Fetches traces via Injective LCD REST API
- Classifies Injective-specific error types:
  - Margin Insufficient
  - Subaccount Error
  - Oracle Price Stale
  - Leverage Limit Exceeded
  - Order Type Mismatch
  - Insurance Fund Error
  - Auction Module Error
  - Position Below Minimum
- AI prompt includes full Injective architecture 
  context (subaccounts, exchange module, oracle 
  mechanics, margin systems)

---

## Supported Chains

| Chain | Data Source | Support Level |
|-------|-------------|---------------|
| Injective | Injective LCD API | Deepest |
| Ethereum | Etherscan API | Full |
| Base | BaseScan API | Full |
| Polygon | PolygonScan API | Full |
| Arbitrum | Arbiscan API | Full |
| Solana | Solana RPC | Full |

Chain is auto-detected from the hash format.
No manual selection needed.

---

## Error Taxonomy

20+ classified error types including:

**Universal**
- Slippage Exceeded
- Approval Missing
- Insufficient Gas
- Nonce Conflict
- Contract Paused
- Deadline Expired
- Insufficient Balance

**Injective-Specific**
- Margin Insufficient
- Oracle Price Stale
- Subaccount Error
- Leverage Exceeded
- Insurance Fund Error

**NFT**
- Sale Not Active
- Max Wallet Exceeded

**Solana**
- Compute Units Exceeded
- Rent Not Exempt

---

## Tech Stack

- **Frontend:** Next.js 14, TypeScript
- **Styling:** Inline CSS with CSS variables,
  Space Grotesk + Space Mono fonts
- **AI:** DeepSeek Chat API
- **Blockchain Data:**
  Etherscan API (ETH/Base/Polygon/Arbitrum),
  Injective LCD REST API,
  Solana RPC
- **Deployment:** Vercel

---

## How to Run Locally

1. Clone the repo
2. Install dependencies:
	```bash
	npm install
	```
3. Create `.env.local`:
	```
	DEEPSEEK_API_KEY=your_key
	ETHERSCAN_API_KEY=your_key
	BASESCAN_API_KEY=your_key
	POLYGONSCAN_API_KEY=your_key
	ARBISCAN_API_KEY=your_key
	```
4. Run:
	```bash
	npm run dev
	```
5. Open http://localhost:3000

---

## Project Structure

```
TxAutopsy/
├── app/
│   ├── page.tsx              # Landing page
│   ├── diagnose/page.tsx     # Diagnosis tool
│   ├── docs/page.tsx         # Documentation
│   └── api/diagnose/         # API route
├── lib/
│   ├── chains/               # Chain fetchers
│   ├── classifier/           # Error taxonomy
│   └── ai/                   # DeepSeek integration
└── types/                    # TypeScript types
```

---

## Built For

**Injective Solo AI Builder Sprint**  
May 2026 · Solo Builder
