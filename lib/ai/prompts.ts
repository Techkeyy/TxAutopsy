import { Chain } from '@/types'
import { ClassifiedError } from '../classifier/classifier'
import { TxTrace } from '../chains/ethereum'
import { CHAIN_NAMES } from '../chains/detector'

export function buildDiagnosisPrompt(
	trace: TxTrace,
	chain: Chain,
	classified: ClassifiedError
): string {
	const chainName = CHAIN_NAMES[chain]
	const errorText = trace.errorMessage || trace.revertReason || 'unknown error'

	return `You are TxAutopsy, an expert Web3 transaction failure analyst. 
Your job is to explain failed blockchain transactions in plain English 
to users who may not be technical.

TRANSACTION DATA:
- Chain: ${chainName}
- Hash: ${trace.hash}
- Status: FAILED
- Error Category: ${classified.label}
- Raw Error: ${errorText}
- Gas Used: ${trace.gasUsed}
- Gas Limit: ${trace.gasLimit}
- Gas Lost: ${classified.gasLost ? 'YES' : 'NO'}
${trace.revertReason ? `- Revert Reason: ${trace.revertReason}` : ''}
${trace.logs?.length ? `- Event Logs: ${JSON.stringify(trace.logs).slice(0, 500)}` : ''}

CHAIN CONTEXT:
${getChainContext(chain)}

Your response must be a valid JSON object with EXACTLY this structure.
No markdown. No code blocks. Just the raw JSON:

{
	"whatHappened": "One clear sentence. What failed. No jargon.",
	"whyItHappened": "2-3 sentences explaining the root cause. Use **bold** for key terms. Include specific numbers if available in the trace data.",
	"whoIsAtFault": "user | protocol | network | unknown",
	"gasLost": ${classified.gasLost},
	"gasAmountLost": "estimated gas cost in plain terms if lost, otherwise null",
	"fixes": [
		{
			"rank": 1,
			"title": "Most likely fix — short title",
			"description": "Specific actionable step. Tell them exactly what to do, where to click, what value to change."
		},
		{
			"rank": 2,
			"title": "Alternative fix",
			"description": "Second option if first doesn't work."
		}
	],
	"prevention": {
		"title": "Short name for this class of error",
		"rule": "The permanent rule to follow to never hit this error again. 2 sentences max.",
		"habit": "One specific quick habit — a concrete action they can take every time."
	},
	"confidence": ${classified.confidence}
}`
}

function getChainContext(chain: Chain): string {
	const contexts: Record<Chain, string> = {
		ethereum: 'Standard EVM chain. Common errors: slippage, gas, approvals, contract reverts.',
		injective: `Injective is a specialized DeFi chain with unique architecture:
- Subaccounts: separate from main wallet, must be funded separately
- Exchange Module: handles all trading operations
- Oracle Module: provides price feeds, can be stale
- Margin System: requires minimum margin for leveraged positions
- Insurance Fund: backs leveraged positions
Common errors: margin insufficient, subaccount balance, oracle stale, leverage exceeded`,
		base: 'Base is an L2 on Ethereum. Same EVM errors plus L2-specific sequencer issues.',
		polygon: 'Polygon PoS chain. Same EVM errors plus checkpoint and bridge delays.',
		arbitrum: 'Arbitrum L2. Same EVM errors plus L2 sequencer and nitro-specific issues.',
		solana: 'Solana uses programs not contracts. Common errors: compute units, rent, program errors.',
		unknown: 'Unknown chain. Analyze the error as best as possible.',
	}
	return contexts[chain] || contexts.unknown
}