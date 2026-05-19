import { TxTrace } from './ethereum'

export async function fetchSolanaTrace(
  hash: string
): Promise<TxTrace | null> {
  try {
    const res = await fetch(
      'https://api.mainnet-beta.solana.com',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTransaction',
          params: [
            hash,
            { encoding: 'jsonParsed', maxSupportedTransactionVersion: 0 }
          ],
        }),
      }
    )
    const data = await res.json()
    const tx = data?.result

    if (!tx) return null

    const meta = tx?.meta
    const err = meta?.err
    const logMessages: string[] = meta?.logMessages || []

    let revertReason: string | undefined
    let errorMessage: string | undefined

    if (err) {
      errorMessage = JSON.stringify(err)
      const errStr = errorMessage.toLowerCase()

      if (errStr.includes('instructionerror')) {
        revertReason = 'instruction_error'
      }
      if (errStr.includes('computationalbudgetexceeded') ||
          logMessages.some(l => l.includes('exceeded CUs meter'))) {
        revertReason = 'compute_units_exceeded'
      }
      if (logMessages.some(l => l.includes('insufficient funds'))) {
        revertReason = 'insufficient_funds'
      }
      if (logMessages.some(l => l.includes('already in use'))) {
        revertReason = 'account_already_exists'
      }
      if (logMessages.some(l => l.includes('rent'))) {
        revertReason = 'rent_not_exempt'
      }
    }

    return {
      hash,
      status: err ? 'failed' : 'success',
      from: tx?.transaction?.message?.accountKeys?.[0]?.pubkey || '',
      to: tx?.transaction?.message?.accountKeys?.[1]?.pubkey || '',
      value: '0',
      gasUsed: (meta?.fee || 0).toString(),
      gasLimit: '0',
      gasPrice: '0',
      blockNumber: tx?.slot?.toString() || '0',
      revertReason,
      errorMessage,
      logs: logMessages,
      raw: data,
    }
  } catch (err) {
    console.error('Solana trace fetch error:', err)
    return null
  }
}