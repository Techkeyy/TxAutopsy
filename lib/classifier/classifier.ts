import { ERROR_TAXONOMY, ErrorCategory } from './taxonomy'
import { TxTrace } from '../chains/ethereum'
import { Chain } from '@/types'

export interface ClassifiedError {
  category: ErrorCategory
  label: string
  confidence: number
  gasLost: boolean
  matchedPattern?: string
}

export function classifyError(
  trace: TxTrace,
  chain: Chain
): ClassifiedError {
  if (!trace || trace.status === 'success') {
    return {
      category: 'unknown',
      label: 'Unknown Error',
      confidence: 0,
      gasLost: false,
    }
  }

  // Build search text from all available error info
  const searchText = [
    trace.revertReason || '',
    trace.errorMessage || '',
    JSON.stringify(trace.logs || []),
    JSON.stringify(trace.raw || {}),
  ].join(' ').toLowerCase()

  let bestMatch: ClassifiedError | null = null
  let bestScore = 0

  for (const def of ERROR_TAXONOMY) {
    // Skip chain-specific errors that don't match
    if (def.chain === 'injective' && chain !== 'injective') continue
    if (def.chain === 'solana' && chain !== 'solana') continue
    if (def.chain === 'evm' && chain === 'solana') continue
    if (def.chain === 'evm' && chain === 'injective') continue

    for (const pattern of def.patterns) {
      if (searchText.includes(pattern.toLowerCase())) {
        // Score by pattern specificity (longer = more specific)
        const score = pattern.length
        if (score > bestScore) {
          bestScore = score
          bestMatch = {
            category: def.category,
            label: def.label,
            confidence: Math.min(95, 60 + score),
            gasLost: def.gasLost,
            matchedPattern: pattern,
          }
        }
      }
    }
  }

  if (bestMatch) return bestMatch

  // Fallback: if we know it failed but can't classify
  return {
    category: 'unknown',
    label: 'Unclassified Error',
    confidence: 40,
    gasLost: true,
  }
}