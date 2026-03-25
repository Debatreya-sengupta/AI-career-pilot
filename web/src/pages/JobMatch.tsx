import { useCallback, useRef, useState } from 'react'
import { resumeJobMatch } from '../lib/api'

function ScoreRingSvg({ score }: { score: number }) {
  const r = 45
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'
  const label = score >= 75 ? 'Strong match' : score >= 50 ? 'Partial match' : 'Low match'

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width="130" height="130" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="ring-circle"
          style={{filter: `drop-shadow(0 0 8px ${color})` }}
        />
        <text x="50" y="44" textAnchor="middle" dominantBaseline="middle" fill="var(--color-text)" fontSize="20" fontWeight="700">{score}</text>
        <text x="50" y="62" textAnchor="middle" dominantBaseline="middle" fill="var(--color-text-dim)" fontSize="8">match score</text>
      </svg>
      <span className={`chip ${score >= 75 ? 'chip-emerald' : score >= 50 ? 'chip-amber' : 'chip-rose'}`}>{label}</span>
    </div>
  )
}

export function JobMatch() {
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') setFile(f)
    else setErr('Please drop a PDF file.')
  }, [])

  async function onAnalyze() {
    if (!file || !jd.trim()) { setErr('Please upload a resume PDF and paste a job description.'); return }
    setLoading(true); setErr(null)
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
    <div className="space-y-5">
      <div className="card-surface rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{background: 'var(--color-surface-raised)', color: 'var(--color-accent)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>Resume ↔ Job Match</div>
            <div className="text-xs" style={{color: 'var(--color-text-dim)'}}>AI comparison of your resume against a job description</div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Resume (PDF)</label>
            <div
              className={`dropzone flex flex-col items-center justify-center p-5 text-center cursor-pointer ${dragOver ? 'drag-over' : ''}`}
              style={{minHeight: '100px'}}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              {file
                ? <span className="text-xs font-medium" style={{color: 'var(--color-accent)'}}>{file.name}</span>
                : <span className="text-xs" style={{color: 'var(--color-text-muted)'}}>Drop PDF here or <span style={{color: 'var(--color-accent)'}}>browse</span></span>
              }
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Job description</label>
            <textarea
              value={jd}
              onChange={(e) => setJd(e.target.value)}
              rows={5}
              placeholder="Paste the full job description here…"
              className="field-input resize-none"
            />
          </div>
        </div>

        <button onClick={onAnalyze} disabled={loading} className="btn-primary mt-4" style={{background: 'linear-gradient(135deg, #ec4899, #8b5cf6)'}}>
          {loading ? <><span className="spinner" />Analyzing…</> : <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Analyze match
          </>}
        </button>
        {err && <div className="banner-error mt-4">{err}</div>}
      </div>

      {result && (
        <div className="fade-up grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Score */}
          <div className="card-surface flex flex-col items-center rounded-2xl p-6">
            <div className="text-xs font-medium mb-4" style={{color: 'var(--color-text-dim)'}}>Match Score</div>
            {score !== null ? <ScoreRingSvg score={score} /> : '—'}
          </div>

          {/* Matching skills */}
          <div className="card-surface rounded-2xl p-5">
            <div className="text-xs font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--color-text)'}}>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Matching Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {(result.matching_skills ?? []).map((k: string, i: number) => <span key={i} className="chip chip-emerald">{k}</span>)}
              {(result.matching_skills ?? []).length === 0 && <span className="text-xs" style={{color: 'var(--color-text-muted)'}}>None</span>}
            </div>
          </div>

          {/* Missing skills */}
          <div className="card-surface rounded-2xl p-5">
            <div className="text-xs font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--color-text)'}}>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />Missing Skills
            </div>
            <div className="flex flex-wrap gap-2">
              {(result.missing_skills ?? []).map((k: string, i: number) => <span key={i} className="chip chip-amber">{k}</span>)}
              {(result.missing_skills ?? []).length === 0 && <span className="chip chip-emerald">All skills matched!</span>}
            </div>
          </div>

          {/* Suggestions */}
          {(result.suggestions ?? []).length > 0 && (
            <div className="card-surface rounded-2xl p-5 md:col-span-2 lg:col-span-3">
              <div className="text-xs font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--color-text)'}}>
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />Action Plan
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {(result.suggestions ?? []).map((s: string, i: number) => (
                  <div key={i} className="flex gap-3 text-xs leading-relaxed rounded-xl p-3" style={{background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)', color: 'var(--color-text-dim)'}}>
                    <span className="shrink-0 font-bold text-indigo-400">{i + 1}.</span>{s}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
