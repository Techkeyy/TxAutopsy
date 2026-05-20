import { buildDiagnosisPrompt } from './prompts'
import { TxTrace } from '../chains/ethereum'
import { ClassifiedError } from '../classifier/classifier'
import { Chain } from '@/types'
import { DiagnosisResult } from '@/types'

export async function generateDiagnosis(
  trace: TxTrace,
  chain: Chain,
  classified: ClassifiedError
): Promise<DiagnosisResult> {
  const prompt = buildDiagnosisPrompt(trace, chain, classified)

  const response = await fetch(
    'https://api.deepseek.com/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY || ''}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content:
              'You are TxAutopsy, an expert Web3 transaction failure analyst. You always respond with valid JSON only. No markdown. No explanation. Just the raw JSON object.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    }
  )

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  // Parse JSON response — strip any markdown if present
  const clean = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim()

  let parsed: any
  try {
    parsed = JSON.parse(clean)
  } catch {
    // Fallback if Claude doesn't return valid JSON
    parsed = {
      whatHappened: 'Transaction failed — could not fully parse the error.',
      whyItHappened: text.slice(0, 300),
      whoIsAtFault: 'unknown',
      gasLost: classified.gasLost,
      fixes: [{
        rank: 1,
        title: 'Check the error details',
        description: 'Review the raw error message and try again.',
      }],
      prevention: {
        title: 'Unknown Error',
        rule: 'Review the transaction parameters before retrying.',
        habit: 'Always simulate transactions before submitting.',
      },
      confidence: 40,
    }
  }

  // Calculate margin deficit if Injective balance data is available
  let marginDeficit: any = null
  if (
    chain === 'injective' &&
    (trace as any).injectiveContext
  ) {
    const ctx = (trace as any).injectiveContext
    const available = parseFloat(
      ctx.subaccountAvailableBalance || '0'
    )
    const total = parseFloat(
      ctx.subaccountTotalBalance || '0'
    )

    if (available > 0 || total > 0) {
      marginDeficit = {
        available: ctx.subaccountAvailableBalance || '0',
        total: ctx.subaccountTotalBalance || '0',
        denom: ctx.subaccountDenom || 'USDT',
        subaccountId: ctx.subaccountId,
        marketDescription: ctx.marketDescription,
      }
    }
  }

  return {
    chain,
    txHash: trace.hash,
    status: 'failed',
    errorCategory: classified.category as any,
    confidence: parsed.confidence || classified.confidence,
    whatHappened: parsed.whatHappened,
    whyItHappened: parsed.whyItHappened,
    whoIsAtFault: parsed.whoIsAtFault || 'unknown',
    gasLost: parsed.gasLost ?? classified.gasLost,
    gasAmountLost: parsed.gasAmountLost || undefined,
    fixes: parsed.fixes || [],
    prevention: parsed.prevention || {
      title: 'Unknown',
      rule: 'Review before retrying.',
      habit: 'Double-check parameters.',
    },
    marginDeficit,
  }
}