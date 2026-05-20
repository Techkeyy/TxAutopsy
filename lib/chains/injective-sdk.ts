import {
  ChainGrpcExchangeApi,
  IndexerGrpcAccountApi,
  IndexerGrpcDerivativesApi,
} from '@injectivelabs/sdk-ts'
import { getNetworkEndpoints, Network } from '@injectivelabs/networks'

const endpoints = getNetworkEndpoints(Network.Mainnet)

const indexerAccountApi = new IndexerGrpcAccountApi(endpoints.indexer)
const indexerDerivativesApi = new IndexerGrpcDerivativesApi(endpoints.indexer)
const chainExchangeApi = new ChainGrpcExchangeApi(endpoints.grpc)

export interface InjectiveContext {
  subaccountId?: string
  subaccountAvailableBalance?: string
  subaccountTotalBalance?: string
  subaccountDenom?: string
  marketId?: string
  marketDescription?: string
  positionQuantity?: string
  positionMargin?: string
  minInitialMarginRatio?: string
  calculatedMinMarginRequired?: string
  errorCode?: number
  rawLog?: string
}

export function extractSubaccountId(rawLog: string, sender?: string): string | undefined {
  const subaccountMatch = rawLog.match(/0x[0-9a-fA-F]{64}/)
  if (subaccountMatch) return subaccountMatch[0]

  if (sender && sender.startsWith('inj')) {
    try {
      return undefined
    } catch {
      return undefined
    }
  }

  return undefined
}

export function extractMarketId(rawLog: string): string | undefined {
  const marketMatch = rawLog.match(/market_id["\s:]+["']?(0x[0-9a-fA-F]{64})["']?/i)
  return marketMatch?.[1]
}

export async function fetchSubaccountContext(
  subaccountId: string
): Promise<Partial<InjectiveContext>> {
  try {
    const balances = await indexerAccountApi.fetchSubaccountBalancesList(subaccountId)

    const usdtDenoms = [
      'peggy0xdAC17F958D2ee523a2206206994597C13D831ec7',
      'ibc/4ABBEF4C8926DDDB320AE5188CFD63267ABBCEFC0583E4AE05D6E5AA2401DDAB',
    ]

    let primaryBalance = balances[0]
    for (const balance of balances) {
      if (usdtDenoms.some((denom) => balance.denom?.includes(denom))) {
        primaryBalance = balance
        break
      }
    }

    if (!primaryBalance) {
      return { subaccountId }
    }

    const decimals = primaryBalance.denom?.includes('inj') ? 18 : 6
    const divisor = Math.pow(10, decimals)

    const available = primaryBalance.deposit?.availableBalance
      ? (parseFloat(primaryBalance.deposit.availableBalance) / divisor).toFixed(2)
      : '0.00'

    const total = primaryBalance.deposit?.totalBalance
      ? (parseFloat(primaryBalance.deposit.totalBalance) / divisor).toFixed(2)
      : '0.00'

    return {
      subaccountId,
      subaccountAvailableBalance: available,
      subaccountTotalBalance: total,
      subaccountDenom: decimals === 18 ? 'INJ' : 'USDT',
    }
  } catch (error) {
    console.error('Subaccount fetch error:', error)
    return { subaccountId }
  }
}

export async function fetchMarketContext(marketId: string): Promise<Partial<InjectiveContext>> {
  try {
    const market = await indexerDerivativesApi.fetchMarket(marketId)
    const params = await chainExchangeApi.fetchModuleParams()

    const minMarginRatio = params?.defaultInitialMarginRatio || '0.05'

    return {
      marketId,
      marketDescription: market?.ticker || 'Unknown Market',
      minInitialMarginRatio: (parseFloat(minMarginRatio) * 100).toFixed(1) + '%',
    }
  } catch (error) {
    console.error('Market fetch error:', error)
    return { marketId }
  }
}

export async function enrichInjectiveTrace(
  rawLog: string,
  errorCode: number,
  sender?: string,
): Promise<InjectiveContext> {
  const context: InjectiveContext = {
    errorCode,
    rawLog,
  }

  const subaccountId = extractSubaccountId(rawLog, sender)
  const marketId = extractMarketId(rawLog)

  const [subaccountCtx, marketCtx] = await Promise.allSettled([
    subaccountId ? fetchSubaccountContext(subaccountId) : Promise.resolve({}),
    marketId ? fetchMarketContext(marketId) : Promise.resolve({}),
  ])

  if (subaccountCtx.status === 'fulfilled') {
    Object.assign(context, subaccountCtx.value)
  }

  if (marketCtx.status === 'fulfilled') {
    Object.assign(context, marketCtx.value)
  }

  return context
}