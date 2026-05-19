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

export interface ErrorDefinition {
  category: ErrorCategory
  label: string
  chain: 'all' | 'evm' | 'injective' | 'solana'
  patterns: string[]
  gasLost: boolean
}

export const ERROR_TAXONOMY: ErrorDefinition[] = [
  {
    category: 'slippage_exceeded',
    label: 'Slippage Exceeded',
    chain: 'evm',
    patterns: [
      'insufficient output amount',
      'excessive input amount',
      'too little received',
      'slippage',
      'price impact too high',
      'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT',
      'execution reverted: slippage',
      'PRICE_IMPACT',
    ],
    gasLost: true,
  },
  {
    category: 'approval_missing',
    label: 'Token Approval Missing',
    chain: 'evm',
    patterns: [
      'allowance',
      'transfer amount exceeds allowance',
      'ERC20: insufficient allowance',
      'approve',
      'not approved',
      'transferFrom failed',
    ],
    gasLost: true,
  },
  {
    category: 'insufficient_gas',
    label: 'Insufficient Gas',
    chain: 'evm',
    patterns: ['out of gas', 'gas required exceeds allowance', 'intrinsic gas too low', 'gas limit'],
    gasLost: false,
  },
  {
    category: 'nonce_conflict',
    label: 'Nonce Conflict',
    chain: 'evm',
    patterns: ['nonce too low', 'nonce too high', 'replacement transaction underpriced', 'already known', 'nonce'],
    gasLost: false,
  },
  {
    category: 'contract_paused',
    label: 'Contract Paused',
    chain: 'evm',
    patterns: ['paused', 'contract is paused', 'Pausable: paused', 'trading not active', 'not active'],
    gasLost: true,
  },
  {
    category: 'deadline_expired',
    label: 'Transaction Deadline Expired',
    chain: 'evm',
    patterns: ['transaction too old', 'expired', 'deadline', 'EXPIRED', 'UniswapV2Router: EXPIRED'],
    gasLost: true,
  },
  {
    category: 'insufficient_balance',
    label: 'Insufficient Balance',
    chain: 'all',
    patterns: [
      'insufficient balance',
      'insufficient funds',
      'transfer amount exceeds balance',
      'ERC20: transfer amount exceeds balance',
      'not enough',
    ],
    gasLost: false,
  },
  {
    category: 'margin_insufficient',
    label: 'Margin Insufficient',
    chain: 'injective',
    patterns: ['margin', 'margin_insufficient', 'insufficient margin', 'below minimum margin', 'initial margin'],
    gasLost: false,
  },
  {
    category: 'oracle_stale',
    label: 'Oracle Price Stale',
    chain: 'injective',
    patterns: ['oracle', 'oracle_error', 'stale price', 'price not available', 'oracle price'],
    gasLost: false,
  },
  {
    category: 'subaccount_error',
    label: 'Subaccount Error',
    chain: 'injective',
    patterns: ['subaccount', 'subaccount_error', 'invalid subaccount', 'subaccount balance'],
    gasLost: false,
  },
  {
    category: 'leverage_exceeded',
    label: 'Leverage Limit Exceeded',
    chain: 'injective',
    patterns: ['leverage', 'leverage_exceeded', 'exceeds max leverage', 'leverage too high'],
    gasLost: false,
  },
  {
    category: 'insurance_fund_error',
    label: 'Insurance Fund Error',
    chain: 'injective',
    patterns: ['insurance', 'insurance_fund_error', 'insurance fund'],
    gasLost: false,
  },
  {
    category: 'nft_sale_not_active',
    label: 'NFT Sale Not Active',
    chain: 'evm',
    patterns: ['sale not active', 'sale is not active', 'minting not active', 'public sale', 'not started', 'sale has ended', 'mint not open'],
    gasLost: true,
  },
  {
    category: 'max_wallet_exceeded',
    label: 'Max Wallet Exceeded',
    chain: 'evm',
    patterns: ['max per wallet', 'wallet limit', 'maximum tokens', 'already minted', 'mint limit', 'exceeds max'],
    gasLost: true,
  },
  {
    category: 'compute_units_exceeded',
    label: 'Compute Units Exceeded',
    chain: 'solana',
    patterns: ['compute_units_exceeded', 'exceeded CUs', 'ComputationalBudgetExceeded', 'compute budget'],
    gasLost: false,
  },
  {
    category: 'rent_not_exempt',
    label: 'Rent Not Exempt',
    chain: 'solana',
    patterns: ['rent', 'rent_not_exempt', 'insufficient funds for rent'],
    gasLost: false,
  },
]