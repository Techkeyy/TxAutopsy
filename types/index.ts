export type Chain =
  | 'ethereum'
  | 'injective'
  | 'base'
  | 'polygon'
  | 'arbitrum'
  | 'solana'
  | 'unknown'

export type ErrorCategory =
  | 'slippage_exceeded'
  | 'approval_missing'
  | 'insufficient_gas'
  | 'nonce_conflict'
  | 'contract_paused'
  | 'deadline_expired'
  | 'reentrancy_blocked'
  | 'insufficient_balance'
  | 'bridge_timeout'
  | 'rpc_timeout'
  | 'margin_insufficient'
  | 'oracle_stale'
  | 'subaccount_error'
  | 'leverage_exceeded'
  | 'order_type_mismatch'
  | 'insurance_fund_error'
  | 'nft_sale_not_active'
  | 'max_wallet_exceeded'
  | 'compute_units_exceeded'
  | 'rent_not_exempt'
  | 'program_error'
  | 'unknown'

export interface Fix {
  rank: number
  title: string
  description: string
  actionUrl?: string
}

export interface Prevention {
  title: string
  rule: string
  habit: string
}

export interface MarginDeficit {
  available: string
  total: string
  denom: string
  subaccountId?: string
  marketDescription?: string
}

export interface DiagnosisResult {
  chain: Chain
  txHash: string
  status: 'failed' | 'partial' | 'unknown'
  errorCategory: ErrorCategory
  errorCode?: string
  confidence: number
  whatHappened: string
  whyItHappened: string
  whoIsAtFault: 'user' | 'protocol' | 'network' | 'unknown'
  gasLost: boolean
  gasAmountLost?: string
  fixes: Fix[]
  prevention: Prevention
  actionUrl?: string
  marginDeficit?: MarginDeficit | null
}