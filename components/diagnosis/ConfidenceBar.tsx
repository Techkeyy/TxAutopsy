export default function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-text-primary">Confidence</span>
        <span className="text-sm text-text-secondary">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-surface-raised overflow-hidden">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}