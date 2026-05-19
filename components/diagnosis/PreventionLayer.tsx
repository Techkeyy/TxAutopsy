import type { Prevention } from '@/types'

export default function PreventionLayer({ prevention }: { prevention: Prevention }) {
  return (
    <section className="rounded-2xl border border-primary/20 bg-primary-glow p-6">
      <h2 className="text-xl font-bold text-text-primary mb-3">{prevention.title}</h2>
      <div className="grid gap-3 text-sm text-text-secondary md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-1">Rule</p>
          <p>{prevention.rule}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted mb-1">Habit</p>
          <p>{prevention.habit}</p>
        </div>
      </div>
    </section>
  )
}