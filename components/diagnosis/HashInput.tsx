'use client'

export default function HashInput() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5">
      <label className="block text-sm font-semibold text-text-primary mb-3">
        Transaction hash
      </label>
      <div className="flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          placeholder="0x..."
          className="flex-1 rounded-xl border border-border bg-surface-raised px-4 py-3 font-mono text-sm text-text-primary placeholder:text-text-muted outline-none focus:border-primary"
        />
        <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover transition-colors">
          Diagnose
        </button>
      </div>
    </div>
  )
}