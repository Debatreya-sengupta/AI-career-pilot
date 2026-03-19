import { useEffect, useState } from 'react'
import { atsCheckFile } from '../lib/api'

export function AtsChecker() {
  const [role, setRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!loading) return
    setProgress(12)
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p
        const bump = p < 60 ? 8 : p < 80 ? 5 : 2
        return Math.min(92, p + bump)
      })
    }, 350)
    return () => window.clearInterval(id)
  }, [loading])

  async function onAnalyze() {
    if (!role || !file) {
      setErr('Please enter a role and upload a resume PDF.')
      return
    }
    setLoading(true)
    setErr(null)
    setResult(null)
    try {
      const res = await atsCheckFile(role, file)
      setResult(res)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setProgress(100)
      setLoading(false)
      window.setTimeout(() => setProgress(0), 600)
    }
  }

  const score = typeof result?.ats_score === 'number' ? result.ats_score : null

  return (
    <div className="space-y-4">
      <div className="card-surface rounded-2xl border p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">ATS Resume Checker</div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="block">
            <div className="text-xs text-slate-600 dark:text-slate-300">Target role</div>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Senior Python Developer"
              className="mt-1 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500/60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
          </label>
          <label className="block">
            <div className="text-xs text-slate-600 dark:text-slate-300">Resume (PDF)</div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-800 hover:file:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
          </label>
        </div>
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600/90 to-pink-600/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Analyze resume'}
        </button>

        {loading ? (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-300">
              <span>Parsing & scoring</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-[width] duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}

        {err ? (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
            {err}
          </div>
        ) : null}
      </div>

      {result ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="card-surface rounded-2xl border p-4 shadow-sm">
            <div className="text-xs text-slate-600 dark:text-slate-300">ATS score</div>
            <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-50">{score ?? '—'}</div>
            {typeof score === 'number' ? (
              <div className="mt-3">
                <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500/90 to-indigo-500/90"
                    style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  {score >= 80 ? 'Strong' : score >= 60 ? 'Good' : 'Needs work'} ATS readiness
                </div>
              </div>
            ) : null}
          </div>
          <div className="card-surface rounded-2xl border p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Missing keywords</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(result.missing_keywords ?? []).map((k: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-900 dark:text-amber-100"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="card-surface rounded-2xl border p-4 shadow-sm">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Recommendations</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {(result.improvements ?? []).map((r: string, i: number) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}

