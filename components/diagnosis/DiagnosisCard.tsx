import type { DiagnosisResult } from '@/types'

export default function DiagnosisCard({ diagnosis }: { diagnosis: DiagnosisResult }) {
  return (
    <article className="rounded-2xl border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted">Diagnosis</p>
          <h2 className="text-2xl font-extrabold text-text-primary">{diagnosis.errorCategory}</h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-text-muted">Confidence</p>
          <p className="text-2xl font-extrabold text-primary">{diagnosis.confidence}%</p>
        </div>
      </div>

      <div className="grid gap-3 text-sm text-text-secondary">
        <div>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-1">What happened</p>
          <p>{diagnosis.whatHappened}</p>
        </div>
        <div>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-1">Why it happened</p>
          <p>{diagnosis.whyItHappened}</p>
        </div>
        <div>
          <p className="text-text-muted text-xs uppercase tracking-[0.2em] mb-1">Who is at fault</p>
          <p className="capitalize">{diagnosis.whoIsAtFault}</p>
        </div>
      </div>
    </article>
  )
}