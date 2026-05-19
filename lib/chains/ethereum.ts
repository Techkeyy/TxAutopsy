export interface TxTrace {
  hash: string
  status: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasLimit: string
  gasPrice: string
  blockNumber: string
  revertReason?: string
  errorMessage?: string
  logs: any[]
  raw: any
}

export async function fetchEVMTrace(
  hash: string,
  apiKey: string,
  baseUrl: string
): Promise<TxTrace | null> {
  try {
    // Fetch tx receipt
    const receiptRes = await fetch(
      `${baseUrl}?module=proxy&action=eth_getTransactionReceipt&txhash=${hash}&apikey=${apiKey}`
    )
    const receiptData = await receiptRes.json()
    const receipt = receiptData?.result

    if (!receipt) return null

    // Fetch tx details
    const txRes = await fetch(
      `${baseUrl}?module=proxy&action=eth_getTransactionByHash&txhash=${hash}&apikey=${apiKey}`
    )
    const txData = await txRes.json()
    const tx = txData?.result

    // Try to get revert reason
    let revertReason: string | undefined
    try {
      const traceRes = await fetch(
        `${baseUrl}?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${apiKey}`
      )
      const traceData = await traceRes.json()
      if (traceData?.result?.status === '0') {
        // Try to get internal tx for revert reason
        const internalRes = await fetch(
          `${baseUrl}?module=account&action=txlistinternal&txhash=${hash}&apikey=${apiKey}`
        )
        const internalData = await internalRes.json()
        if (internalData?.result?.[0]?.errCode) {
          revertReason = internalData.result[0].errCode
        }
        if (internalData?.result?.[0]?.traceId) {
          revertReason = internalData.result[0].traceId
        }
      }
    } catch {}

    const gasUsed = parseInt(receipt?.gasUsed || '0x0', 16)
    const gasLimit = parseInt(tx?.gas || '0x0', 16)
    const gasPrice = parseInt(tx?.gasPrice || '0x0', 16)

    return {
      hash,
      status: receipt?.status === '0x1' ? 'success' : 'failed',
      from: tx?.from || '',
      to: tx?.to || '',
      value: tx?.value || '0x0',
      gasUsed: gasUsed.toString(),
      gasLimit: gasLimit.toString(),
      gasPrice: gasPrice.toString(),
      blockNumber: parseInt(receipt?.blockNumber || '0x0', 16).toString(),
      revertReason,
      logs: receipt?.logs || [],
      raw: { receipt, tx },
    }
  } catch (err) {
    console.error('EVM trace fetch error:', err)
    return null
  }
}

export async function fetchEthereumTrace(hash: string): Promise<TxTrace | null> {
  const apiKey = process.env.ETHERSCAN_API_KEY || ''
  return fetchEVMTrace(hash, apiKey, 'https://api.etherscan.io/api')
}

export async function fetchBaseTrace(hash: string): Promise<TxTrace | null> {
  const apiKey = process.env.BASESCAN_API_KEY || process.env.ETHERSCAN_API_KEY || ''
  return fetchEVMTrace(hash, apiKey, 'https://api.basescan.org/api')
}

export async function fetchPolygonTrace(hash: string): Promise<TxTrace | null> {
  const apiKey = process.env.POLYGONSCAN_API_KEY || process.env.ETHERSCAN_API_KEY || ''
  return fetchEVMTrace(hash, apiKey, 'https://api.polygonscan.com/api')
}

export async function fetchArbitrumTrace(hash: string): Promise<TxTrace | null> {
  const apiKey = process.env.ARBISCAN_API_KEY || process.env.ETHERSCAN_API_KEY || ''
  return fetchEVMTrace(hash, apiKey, 'https://api.arbiscan.io/api')
}