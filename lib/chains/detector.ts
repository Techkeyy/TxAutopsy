import { Chain } from '@/types'

export function detectChain(hash: string): Chain {
  const h = hash.trim().toLowerCase()

  // Solana: base58, 87-88 chars, no 0x prefix
  if (!h.startsWith('0x') && h.length >= 80 && h.length <= 90) {
    return 'solana'
  }

  // All EVM chains use 0x + 64 hex chars = 66 total
  if (!h.startsWith('0x') || h.length !== 66) {
    return 'unknown'
  }

  // For EVM chains we can't tell from hash alone
  // We'll try each chain's API and see which responds
  // Default to ethereum, the fetcher will handle routing
  return 'ethereum'
}

export function isValidHash(hash: string): boolean {
  const h = hash.trim()
  // EVM
  if (/^0x[0-9a-fA-F]{64}$/.test(h)) return true
  // Solana base58
  if (/^[1-9A-HJ-NP-Za-km-z]{80,90}$/.test(h)) return true
  return false
}

export const CHAIN_NAMES: Record<Chain, string> = {
  ethereum: 'Ethereum',
  injective: 'Injective',
  base: 'Base',
  polygon: 'Polygon',
  arbitrum: 'Arbitrum',
  solana: 'Solana',
  unknown: 'Unknown',
}

export const CHAIN_EXPLORERS: Record<Chain, string> = {
  ethereum: 'https://etherscan.io/tx/',
  injective: 'https://explorer.injective.network/transaction/',
  base: 'https://basescan.org/tx/',
  polygon: 'https://polygonscan.com/tx/',
  arbitrum: 'https://arbiscan.io/tx/',
  solana: 'https://solscan.io/tx/',
  unknown: '',
}