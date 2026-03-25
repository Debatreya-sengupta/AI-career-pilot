import { useState } from 'react'
import { finishInterview, startInterview, submitInterviewAnswer } from '../lib/api'

function isObj(x: unknown): x is Record<string, any> {
  return !!x && typeof x === 'object' && !Array.isArray(x)
}

function ScoreRingSvg({ value, label }: { value: number; label: string }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const pct = Math.max(0, Math.min(100, value))
  const offset = circ - (pct / 100) * circ
  const color = pct >= 70 ? '#10b981' : pct >= 45 ? '#f59e0b' : '#ef4444'
  return (
    <div className="flex items-center gap-3">
      <svg width="86" height="86" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-border)" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          className="ring-circle" style={{filter:`drop-shadow(0 0 5px ${color})` }} />
        <text x="40" y="38" textAnchor="middle" dominantBaseline="middle" fill="var(--color-text)" fontSize="15" fontWeight="700">{pct}</text>
        <text x="40" y="54" textAnchor="middle" dominantBaseline="middle" fill="var(--color-text-dim)" fontSize="7">/100</text>
      </svg>
      <div>
        <div className="text-xs" style={{color: 'var(--color-text-dim)'}}>{label}</div>
        <div className={`chip mt-1 ${pct >= 70 ? 'chip-emerald' : pct >= 45 ? 'chip-amber' : 'chip-rose'}`}>
          {pct >= 70 ? 'Strong' : pct >= 45 ? 'Average' : 'Needs work'}
        </div>
      </div>
    </div>
  )
}

export function Interview() {
  const [role, setRole] = useState('')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [question, setQuestion] = useState<string | null>(null)
  const [answer, setAnswer] = useState('')
  const [evaluation, setEvaluation] = useState<any>(null)
  const [summary, setSummary] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [questionNum, setQuestionNum] = useState(0)

  async function onStart() {
    if (!role.trim()) { setErr('Please enter a target role.'); return }
    setLoading(true); setErr(null); setSummary(null); setEvaluation(null); setQuestionNum(1)
    try {
      const data = await startInterview(role)
      setSessionId(data.session_id); setQuestion(data.question); setAnswer('')
    } catch (e: any) { setErr(e?.message ?? String(e)) }
    finally { setLoading(false) }
  }

  async function onSubmit() {
    if (!sessionId || !answer.trim()) { setErr('Please enter an answer.'); return }
    setLoading(true); setErr(null)
    try {
      const data = await submitInterviewAnswer(sessionId, answer)
      setEvaluation(data.evaluation)
      setQuestion(data.next_question)
      setAnswer('')
      setQuestionNum(n => n + 1)
    } catch (e: any) { setErr(e?.message ?? String(e)) }
    finally { setLoading(false) }
  }

  async function onFinish() {
    if (!sessionId) return
    setLoading(true); setErr(null)
    try {
      const data = await finishInterview(sessionId)
      setSummary(data)
    } catch (e: any) { setErr(e?.message ?? String(e)) }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-5">
      {/* Setup card */}
      <div className="card-surface rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{background: 'var(--color-surface-raised)', color: 'var(--color-primary-end)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>AI Interview Simulator</div>
            <div className="text-xs" style={{color: 'var(--color-text-dim)'}}>Adaptive questioning · structured scoring · actionable feedback</div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Target role</label>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !loading && onStart()}
              placeholder="e.g., Senior Software Engineer, Data Analyst…"
              className="field-input"
            />
          </div>
          <button onClick={onStart} disabled={loading} className="btn-primary shrink-0" style={{background: 'linear-gradient(135deg, #8b5cf6, #6366f1)'}}>
            {loading ? <><span className="spinner" />Starting…</> : <>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              Start interview
            </>}
          </button>
        </div>
        {err && <div className="banner-error mt-4">{err}</div>}
      </div>

      {/* Active interview */}
      {question && !summary && (
        <div className="fade-up grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Question + answer */}
          <div className="card-surface rounded-2xl p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip chip-indigo">Question {questionNum}</span>
              {sessionId && <span className="chip chip-slate">Session {sessionId.slice(0, 8)}…</span>}
            </div>

            {/* AI bubble */}
            <div className="bubble-ai p-4 text-sm leading-relaxed">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md" style={{background: 'var(--color-primary-end)', opacity: 0.8}}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <span className="text-[11px] font-semibold" style={{color: 'var(--color-primary)'}}>AI Interviewer</span>
              </div>
              {question}
            </div>

            {/* Answer textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Your answer</label>
                <span className="text-[11px]" style={{color: 'var(--color-text-muted)'}}>{answer.length} chars</span>
              </div>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                placeholder="Type your answer here… Be clear and specific."
                className="field-input resize-none"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={onSubmit} disabled={loading || !answer.trim()} className="btn-primary" style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
                {loading ? <><span className="spinner" />Evaluating…</> : <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  Submit answer
                </>}
              </button>
              <button onClick={onFinish} disabled={loading} className="btn-ghost">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Finish &amp; get summary
              </button>
            </div>
          </div>

          {/* Live evaluation panel */}
          <div>
            {evaluation ? (
              <div className="fade-up card-surface rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>Last answer</div>
                  <span className="chip chip-emerald">Evaluated</span>
                </div>

                {isObj(evaluation) && typeof evaluation.score === 'number' && (
                  <ScoreRingSvg value={Math.round((evaluation.score / 10) * 100)} label="Answer score" />
                )}

                {isObj(evaluation) && Array.isArray(evaluation.strengths) && (
                  <div>
                    <div className="text-xs font-semibold mb-2 flex items-center gap-2" style={{color: 'var(--color-emerald)'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Strengths
                    </div>
                    <ul className="space-y-1.5">
                      {evaluation.strengths.map((s: string, i: number) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{color: 'var(--color-text-dim)'}}>
                          <span className="shrink-0 text-emerald-400">✓</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {isObj(evaluation) && Array.isArray(evaluation.improvements) && (
                  <div>
                    <div className="text-xs font-semibold mb-2 flex items-center gap-2" style={{color: 'var(--shadow-amber)'}}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                      Improve
                    </div>
                    <ul className="space-y-1.5">
                      {evaluation.improvements.map((s: string, i: number) => (
                        <li key={i} className="flex gap-2 text-xs leading-relaxed" style={{color:'#94a3b8'}}>
                          <span className="shrink-0 text-amber-400">→</span>{s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="card-surface rounded-2xl p-6 text-center" style={{border: '1px dashed var(--color-border)'}}>
                <div className="text-xs" style={{color: 'var(--color-text-muted)'}}>Submit an answer to see live evaluation here</div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Summary */}
      {summary && (
        <div className="fade-up card-surface rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="font-semibold text-base" style={{color: 'var(--color-text)'}}>Interview Summary</div>
            <span className="chip chip-amber">Final report</span>
          </div>

          {isObj(summary) && typeof summary.final_score === 'number' && (
            <ScoreRingSvg value={Math.round(summary.final_score)} label="Overall interview score" />
          )}

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {isObj(summary) && Array.isArray(summary.strengths) && (
              <div className="rounded-xl p-4" style={{background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)'}}>
                <div className="text-xs font-semibold mb-2" style={{color: 'var(--color-emerald)'}}>Strengths</div>
                <ul className="space-y-1.5">
                  {summary.strengths.map((s: string, i: number) => (
                    <li key={i} className="flex gap-2 text-xs" style={{color: 'var(--color-text-dim)'}}><span className="text-emerald-400">✓</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            {isObj(summary) && Array.isArray(summary.weaknesses) && (
              <div className="rounded-xl p-4" style={{background: 'var(--color-surface-raised)', border: '1px solid var(--color-border)'}}>
                <div className="text-xs font-semibold mb-2" style={{color: 'var(--shadow-amber)'}}>Areas to improve</div>
                <ul className="space-y-1.5">
                  {summary.weaknesses.map((s: string, i: number) => (
                    <li key={i} className="flex gap-2 text-xs" style={{color: 'var(--color-text-dim)'}}><span className="text-amber-400">→</span>{s}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {isObj(summary) && typeof summary.recommendation === 'string' && (
            <div className="mt-4 rounded-xl p-4" style={{background: 'var(--color-surface)', border: '1px solid var(--color-border)'}}>
              <div className="text-xs font-semibold mb-1" style={{color: 'var(--color-primary)'}}>Coach recommendation</div>
              <div className="text-sm leading-relaxed" style={{color: 'var(--color-text-dim)'}}>{summary.recommendation}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
