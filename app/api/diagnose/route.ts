import { NextRequest, NextResponse } from 'next/server'
import { isValidHash } from '@/lib/chains/detector'
import { fetchEthereumTrace, fetchBaseTrace, fetchPolygonTrace, fetchArbitrumTrace } from '@/lib/chains/ethereum'
import { fetchInjectiveTrace } from '@/lib/chains/injective'
import { fetchSolanaTrace } from '@/lib/chains/solana'
import { classifyError } from '@/lib/classifier/classifier'
import { generateDiagnosis } from '@/lib/ai/claude'
import { Chain } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const { hash } = await req.json()

    if (!hash || typeof hash !== 'string') {
      return NextResponse.json(
        { error: 'Transaction hash is required.' },
        { status: 400 }
      )
    }

    const trimmedHash = hash.trim()

    if (!isValidHash(trimmedHash)) {
      return NextResponse.json(
        { error: 'Invalid transaction hash format. Please check and try again.' },
        { status: 400 }
      )
    }

    // Detect if Solana (no 0x prefix)
    const isSolana = !trimmedHash.startsWith('0x')

    if (isSolana) {
      const trace = await fetchSolanaTrace(trimmedHash)
      if (!trace) {
        return NextResponse.json(
          { error: 'Transaction not found on Solana. Check the hash and try again.' },
          { status: 404 }
        )
      }
      const classified = classifyError(trace, 'solana')
      const result = await generateDiagnosis(trace, 'solana', classified)
      return NextResponse.json(result)
    }

    // For EVM hashes — try each chain in order
    // Try Injective first (different API)
    const injectiveTrace = await fetchInjectiveTrace(trimmedHash)
    if (injectiveTrace && injectiveTrace.status !== 'success') {
      const classified = classifyError(injectiveTrace, 'injective')
      const result = await generateDiagnosis(injectiveTrace, 'injective', classified)
      return NextResponse.json({ ...result, chain: 'injective' })
    }

    // Try EVM chains in parallel
    const [ethTrace, baseTrace, polyTrace, arbTrace] = await Promise.allSettled([
      fetchEthereumTrace(trimmedHash),
      fetchBaseTrace(trimmedHash),
      fetchPolygonTrace(trimmedHash),
      fetchArbitrumTrace(trimmedHash),
    ])

    // Find the chain that has this transaction
    const chainResults: Array<{ chain: Chain; trace: any }> = [
      { chain: 'ethereum', trace: ethTrace.status === 'fulfilled' ? ethTrace.value : null },
      { chain: 'base', trace: baseTrace.status === 'fulfilled' ? baseTrace.value : null },
      { chain: 'polygon', trace: polyTrace.status === 'fulfilled' ? polyTrace.value : null },
      { chain: 'arbitrum', trace: arbTrace.status === 'fulfilled' ? arbTrace.value : null },
    ]

    // Find the first chain where the tx was found AND failed
    let foundChain: Chain = 'ethereum'
    let foundTrace = null

    for (const { chain, trace } of chainResults) {
      if (trace && trace.status === 'failed') {
        foundChain = chain
        foundTrace = trace
        break
      }
    }

    // If no failed tx found, try any tx found
    if (!foundTrace) {
      for (const { chain, trace } of chainResults) {
        if (trace) {
          foundChain = chain
          foundTrace = trace
          break
        }
      }
    }

    if (!foundTrace) {
      return NextResponse.json(
        {
          error: 'Transaction not found on any supported chain. The hash may be incorrect, from an unsupported chain, or not yet indexed.',
        },
        { status: 404 }
      )
    }

    const classified = classifyError(foundTrace, foundChain)
    const result = await generateDiagnosis(foundTrace, foundChain, classified)
    return NextResponse.json({ ...result, chain: foundChain })

  } catch (err: any) {
    console.error('Diagnose API error:', err)
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}