import { TxTrace } from './ethereum'

export async function fetchInjectiveTrace(
  hash: string
): Promise<TxTrace | null> {
  try {
    // Injective REST API
    const res = await fetch(
      `https://sentry.lcd.injective.network/cosmos/tx/v1beta1/txs/${hash}`
    )
    if (!res.ok) {
      // Try testnet
      const testRes = await fetch(
        `https://testnet.sentry.lcd.injective.network/cosmos/tx/v1beta1/txs/${hash}`
      )
      if (!testRes.ok) return null
      const testData = await testRes.json()
      return parseInjectiveResponse(hash, testData)
    }
    const data = await res.json()
    return parseInjectiveResponse(hash, data)
  } catch (err) {
    console.error('Injective trace fetch error:', err)
    return null
  }
}

function parseInjectiveResponse(hash: string, data: any): TxTrace {
  const txResponse = data?.tx_response
  const code = txResponse?.code
  const rawLog = txResponse?.raw_log || ''
  const gasUsed = txResponse?.gas_used || '0'
  const gasWanted = txResponse?.gas_wanted || '0'

  // Extract error message from raw_log
  let errorMessage = rawLog
  let revertReason: string | undefined

  // Injective specific error patterns
  if (rawLog.includes('insufficient funds')) {
    revertReason = 'insufficient_funds'
  } else if (rawLog.includes('margin')) {
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
    revertReason = `error_code_${code}`
  }

  return {
    hash,
    status: code === 0 ? 'success' : 'failed',
    from: '',
    to: '',
    value: '0',
    gasUsed: gasUsed.toString(),
    gasLimit: gasWanted.toString(),
    gasPrice: '0',
    blockNumber: txResponse?.height || '0',
    revertReason,
    errorMessage,
    logs: txResponse?.logs || [],
    raw: data,
  }
}