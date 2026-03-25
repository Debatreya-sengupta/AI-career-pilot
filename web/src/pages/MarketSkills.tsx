import { useState } from 'react'
import { marketSkills } from '../lib/api'

export function MarketSkills() {
  const [role, setRole] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  async function onAnalyze() {
    if (!role.trim()) { setErr('Please enter a role.'); return }
    setLoading(true); setErr(null)
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
    <div className="space-y-5">
      <div className="card-surface rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{background: 'var(--color-surface-raised)', color: 'var(--color-emerald)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>Market Skill Intelligence</div>
            <div className="text-xs" style={{color: 'var(--color-text-dim)'}}>Live skill demand analysis from real job postings</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Target role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onAnalyze()}
              placeholder="e.g., Data Scientist, Frontend Engineer…"
              className="field-input"
            />
          </div>
          <button onClick={onAnalyze} disabled={loading} className="btn-primary shrink-0" style={{background: 'linear-gradient(135deg, #10b981, #6366f1)'}}>
            {loading ? <><span className="spinner" />Analyzing…</> : <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
              </svg>
              Analyze trends
            </>}
          </button>
        </div>
        {err && <div className="banner-error mt-4">{err}</div>}
      </div>

      {skills.length > 0 && (
        <div className="fade-up card-surface rounded-2xl p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="text-xs font-medium uppercase tracking-widest" style={{color: 'var(--color-text-muted)'}}>Top skills in demand for</div>
              <div className="text-xl font-bold gradient-text mt-0.5">{result?.role ?? role}</div>
            </div>
            <span className="chip chip-emerald">{skills.length} skills found</span>
          </div>

          <div className="space-y-3">
            {skills.slice(0, 15).map((s, i) => (
              <div key={`${s.name}-${i}`} className="flex items-center gap-4">
                <div className="w-6 shrink-0 text-center text-xs font-semibold" style={{color: 'var(--color-text-muted)'}}>#{i + 1}</div>
                <div className="w-36 shrink-0 truncate text-sm font-medium" style={{color: 'var(--color-text)'}}>{s.name}</div>
                <div className="flex-1 progress-track">
                  <div
                    className="progress-fill-emerald progress-fill"
                    style={{
                      width: `${Math.max(0, Math.min(100, s.demand ?? 0))}%`,
                      background: `linear-gradient(90deg, #10b981 ${s.demand}%, #6366f1 100%)`
                    }}
                  />
                </div>
                <div className="w-12 shrink-0 text-right text-xs font-semibold" style={{color: 'var(--color-emerald)'}}>{s.demand ?? 0}%</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
