import { useState } from 'react'
import { resumeJobMatch } from '../lib/api'

export function JobMatch() {
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onAnalyze() {
    if (!file || !jd.trim()) {
      setErr('Please upload a resume PDF and paste a job description.')
      return
    }
    setLoading(true)
    setErr(null)
    try {
      const res = await resumeJobMatch(file, jd)
      setResult(res)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  const score = typeof result?.match_score === 'number' ? result.match_score : null

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-black/30">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Resume ↔ Job Match</div>
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <label className="block">
            <div className="text-xs text-slate-600 dark:text-slate-300">Resume (PDF)</div>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 file:mr-3 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-800 hover:file:bg-white/20 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
          </label>
          <label className="block">
            <div className="text-xs text-slate-600 dark:text-slate-300">Job description</div>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={6}
              placeholder="Paste job description here…"
              className="mt-1 w-full resize-none rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500/60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
          </label>
        </div>
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="mt-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600/90 to-pink-600/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Analyzing…' : 'Analyze match'}
        </button>
        {err ? (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
            {err}
          </div>
        ) : null}
      </div>

      {result ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-black/30">
            <div className="text-xs text-slate-600 dark:text-slate-300">Match score</div>
            <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-50">{score ?? '—'}</div>
          </div>
          <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-black/30">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Matching skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(result.matching_skills ?? []).map((k: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-900 dark:text-emerald-100"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-black/30">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Missing skills</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(result.missing_skills ?? []).map((k: string, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-1 text-xs text-amber-900 dark:text-amber-100"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-black/30 lg:col-span-2">
            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Suggestions</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
              {(result.suggestions ?? []).map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}

