import { useState } from 'react'
import { marketSkills } from '../lib/api'

export function MarketSkills() {
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onAnalyze() {
    if (!role.trim()) {
      setErr('Please enter a role.')
      return
    }
    setLoading(true)
    setErr(null)
    try {
      const res = await marketSkills(role)
      setResult(res)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  const skills: Array<{ name: string; demand: number }> = Array.isArray(result?.top_skills) ? result.top_skills : []

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-black/30">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Market Skills</div>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end">
          <label className="block flex-1">
            <div className="text-xs text-slate-600 dark:text-slate-300">Role</div>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Data Scientist"
              className="mt-1 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500/60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
          </label>
          <button
            onClick={onAnalyze}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600/90 to-pink-600/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Analyzing…' : 'Analyze trends'}
          </button>
        </div>
        {err ? (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
            {err}
          </div>
        ) : null}
      </div>

      {skills.length ? (
        <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-black/30">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
            Top skills for {result?.role ?? role}
          </div>
          <div className="mt-3 space-y-2">
            {skills.slice(0, 12).map((s, i) => (
              <div key={`${s.name}-${i}`} className="flex items-center gap-3">
                <div className="w-40 truncate text-sm text-slate-800 dark:text-slate-200">{s.name}</div>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400/80 to-indigo-500/80"
                    style={{ width: `${Math.max(0, Math.min(100, s.demand ?? 0))}%` }}
                  />
                </div>
                <div className="w-12 text-right text-xs text-slate-600 dark:text-slate-300">{s.demand ?? 0}%</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

