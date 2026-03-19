import { useEffect, useState } from 'react'
import { getHealth } from '../lib/api'

function MetricCard(props: { label: string; value: string; hint: string; tone?: 'indigo' | 'emerald' | 'pink' }) {
  const tone =
    props.tone === 'emerald'
      ? 'from-emerald-500/20 to-emerald-500/5'
      : props.tone === 'pink'
        ? 'from-pink-500/20 to-pink-500/5'
        : 'from-indigo-500/20 to-indigo-500/5'
  return (
    <div className="card-surface rounded-2xl border p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs text-slate-600 dark:text-slate-300">{props.label}</div>
          <div className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-50">{props.value}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">{props.hint}</div>
        </div>
        <div className={`h-12 w-12 shrink-0 rounded-2xl bg-gradient-to-br ${tone}`} />
      </div>
    </div>
  )
}

export function DashboardHome() {
  const [health, setHealth] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    getHealth()
      .then((h) => {
        setHealth(h)
        setErr(null)
      })
      .catch((e) => setErr(e?.message ?? String(e)))
  }, [])

  return (
    <div className="space-y-4">
      <div className="card-surface rounded-2xl border p-5 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">Career cockpit</div>
        <div className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Your career, run like a product.
        </div>
        <div className="mt-2 text-sm text-slate-700 dark:text-slate-300">
          Upload once, then iterate: ATS score → job match → market skills → interview feedback.
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-slate-200">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          API:{' '}
          {err ? (
            <span className="text-rose-600 dark:text-rose-300">{err}</span>
          ) : (
            <span className="text-emerald-700 dark:text-emerald-300">{health?.status ?? 'ok'}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="ATS readiness" value="—" hint="Run ATS check to score" tone="indigo" />
        <MetricCard label="Job match" value="—" hint="Compare resume ↔ JD" tone="pink" />
        <MetricCard label="Market skills" value="—" hint="See demand for your role" tone="emerald" />
        <MetricCard label="Interview readiness" value="—" hint="Practice & get feedback" tone="indigo" />
      </div>
    </div>
  )
}

