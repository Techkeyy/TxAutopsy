import { TxTrace } from './ethereum'
import { enrichInjectiveTrace } from './injective-sdk'

export interface InjectiveTxTrace extends TxTrace {
  injectiveContext?: Record<string, any>
}

export async function fetchInjectiveTrace(
  hash: string
): Promise<InjectiveTxTrace | null> {
  try {
    const res = await fetch(`https://sentry.lcd.injective.network/cosmos/tx/v1beta1/txs/${hash}`)

    let data: any = null

    if (res.ok) {
      data = await res.json()
    } else {
      const testRes = await fetch(`https://testnet.sentry.lcd.injective.network/cosmos/tx/v1beta1/txs/${hash}`)
      if (testRes.ok) {
        data = await testRes.json()
      }
    }

    if (!data) return null

    const txResponse = data?.tx_response
    const code = txResponse?.code ?? 0
    const rawLog = txResponse?.raw_log || ''
    const gasUsed = txResponse?.gas_used || '0'
    const gasWanted = txResponse?.gas_wanted || '0'
    const sender = data?.tx?.body?.messages?.[0]?.sender || ''

    let revertReason: string | undefined

    if (rawLog.includes('insufficient funds') || rawLog.includes('margin')) {
      revertReason = 'margin_insufficient'
    } else if (rawLog.includes('oracle')) {
      revertReason = 'oracle_error'
    } else if (rawLog.includes('subaccount')) {
      revertReason = 'subaccount_error'
    } else if (rawLog.includes('leverage')) {
      revertReason = 'leverage_exceeded'
    } else if (rawLog.includes('order')) {
      revertReason = 'order_error'
    } else if (rawLog.includes('insurance')) {
      revertReason = 'insurance_fund_error'
    } else if (code !== 0) {
      revertReason = `injective_error_code_${code}`
    }

    let injectiveContext: Record<string, any> = {}
    if (code !== 0) {
      try {
        injectiveContext = await enrichInjectiveTrace(rawLog, code, sender)
      } catch (error) {
        console.error('SDK enrichment failed:', error)
      }
    }

    return {
      hash,
      status: code === 0 ? 'success' : 'failed',
      from: sender,
      to: data?.tx?.body?.messages?.[0]?.receiver || '',
      value: '0',
      gasUsed: gasUsed.toString(),
      gasLimit: gasWanted.toString(),
      gasPrice: '0',
      blockNumber: txResponse?.height || '0',
      revertReason,
      errorMessage: rawLog,
      logs: txResponse?.logs || [],
      raw: data,
      injectiveContext,
    }
  } catch (err) {
    console.error('Injective trace fetch error:', err)
    return null
  }
}