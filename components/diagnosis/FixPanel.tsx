import type { Fix } from '@/types'

export default function FixPanel({ fixes }: { fixes: Fix[] }) {
  return (
    <aside className="rounded-2xl border border-border bg-surface p-6 space-y-4">
      <h2 className="text-xl font-bold text-text-primary">Fixes</h2>
      <div className="space-y-3">
        {fixes.map((fix) => (
          <div key={fix.rank} className="rounded-xl border border-border bg-surface-raised p-4">
            <p className="text-xs text-text-muted mb-1">#{fix.rank}</p>
            <h3 className="font-semibold text-text-primary">{fix.title}</h3>
            <p className="text-sm text-text-secondary mt-1">{fix.description}</p>
          </div>
        ))}
      </div>
    </aside>
  )
}