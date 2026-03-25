import { useCallback, useEffect, useRef, useState } from 'react'
import { atsCheckFile } from '../lib/api'

function ScoreRingSvg({ score }: { score: number }) {
  const r = 45
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'
  const label = score >= 80 ? 'Strong' : score >= 60 ? 'Good' : 'Needs work'

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          className="ring-circle"
          style={{filter: `drop-shadow(0 0 6px ${color})` }}
        />
        <text x="50" y="45" textAnchor="middle" dominantBaseline="middle" fill="var(--color-text)" fontSize="18" fontWeight="700">{score}</text>
        <text x="50" y="63" textAnchor="middle" dominantBaseline="middle" fill="var(--color-text-dim)" fontSize="8">/ 100</text>
      </svg>
      <span className={`chip ${score >= 80 ? 'chip-emerald' : score >= 60 ? 'chip-amber' : 'chip-rose'}`}>{label} ATS readiness</span>
    </div>
  )
}

export function AtsChecker() {
  const [role, setRole] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading) return
    setProgress(12)
    const id = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 92) return p
        return Math.min(92, p + (p < 60 ? 8 : p < 80 ? 5 : 2))
      })
    }, 350)
    return () => window.clearInterval(id)
  }, [loading])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type === 'application/pdf') setFile(f)
    else setErr('Please drop a PDF file.')
  }, [])

  async function onAnalyze() {
    if (!role || !file) { setErr('Please enter a role and upload a resume PDF.'); return }
    setLoading(true); setErr(null); setResult(null)
    try {
      const res = await atsCheckFile(role, file)
      setResult(res)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setProgress(100); setLoading(false)
      window.setTimeout(() => setProgress(0), 600)
    }
  }

  const score = typeof result?.ats_score === 'number' ? result.ats_score : null

  return (
    <div className="space-y-5">
      {/* Input card */}
      <div className="card-surface rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{background: 'var(--color-surface-raised)', color: 'var(--color-primary)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>ATS Resume Checker</div>
            <div className="text-xs" style={{color: 'var(--color-text-dim)'}}>AI-powered ATS score against your target role</div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Target role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Senior Python Developer"
              className="field-input"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Resume (PDF)</label>
            <div
              className={`dropzone flex flex-col items-center justify-center p-4 text-center cursor-pointer ${dragOver ? 'drag-over' : ''}`}
              style={{minHeight: '80px'}}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>
              </svg>
              {file ? (
                <span className="text-xs font-medium" style={{color: 'var(--color-primary)'}}>{file.name}</span>
              ) : (
                <span className="text-xs" style={{color: 'var(--color-text-muted)'}}>Drop PDF here or <span style={{color: 'var(--color-primary)'}}>browse</span></span>
              )}
              <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            </div>
          </div>
        </div>

        <button onClick={onAnalyze} disabled={loading} className="btn-primary mt-4">
          {loading ? <><span className="spinner" />Analyzing…</> : <>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            Analyze resume
          </>}
        </button>

        {loading && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5" style={{color: 'var(--color-text-dim)'}}>
              <span>Parsing &amp; scoring with AI…</span><span>{progress}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{width: `${progress}%`}} />
            </div>
          </div>
        )}

        {err && <div className="banner-error mt-4">{err}</div>}
      </div>

      {/* Results */}
      {result && (
        <div className="fade-up grid gap-4 lg:grid-cols-3">
          {/* Score ring */}
          <div className="card-surface flex flex-col items-center rounded-2xl p-6">
            <div className="text-xs font-medium mb-4" style={{color: 'var(--color-text-dim)'}}>ATS Score</div>
            {score !== null ? <ScoreRingSvg score={score} /> : <div className="text-3xl font-bold gradient-text">—</div>}
          </div>

          {/* Missing keywords */}
          <div className="card-surface rounded-2xl p-5">
            <div className="text-xs font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--color-text)'}}>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Missing Keywords
            </div>
            <div className="flex flex-wrap gap-2">
              {(result.missing_keywords ?? []).map((k: string, i: number) => (
                <span key={i} className="chip chip-amber">{k}</span>
              ))}
              {(result.missing_keywords ?? []).length === 0 && <span className="text-xs" style={{color:'var(--color-text-muted)'}}>None found</span>}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-surface rounded-2xl p-5">
            <div className="text-xs font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--color-text)'}}>
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
              Recommendations
            </div>
            <ul className="space-y-2">
              {(result.improvements ?? []).map((r: string, i: number) => (
                <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{color:'var(--color-text-dim)'}}>
                  <span className="mt-0.5 shrink-0 text-indigo-400">→</span>{r}
                </li>
              ))}
            </ul>
          </div>

          {/* Strengths (full width) */}
          {(result.strengths ?? []).length > 0 && (
            <div className="card-surface rounded-2xl p-5 lg:col-span-3">
              <div className="text-xs font-semibold mb-3 flex items-center gap-2" style={{color: 'var(--color-text)'}}>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Strengths
              </div>
              <div className="flex flex-wrap gap-2">
                {(result.strengths ?? []).map((s: string, i: number) => (
                  <span key={i} className="chip chip-emerald">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
