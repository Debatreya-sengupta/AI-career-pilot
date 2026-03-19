import { useState } from 'react'
import { finishInterview, startInterview, submitInterviewAnswer } from '../lib/api'

function isObj(x: unknown): x is Record<string, any> {
  return !!x && typeof x === 'object' && !Array.isArray(x)
}

function Pill(props: { children: React.ReactNode; tone?: 'emerald' | 'amber' | 'slate' }) {
  const cls =
    props.tone === 'emerald'
      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-100'
      : props.tone === 'amber'
        ? 'border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-100'
        : 'border-slate-900/10 bg-white/60 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-slate-200'
  return <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${cls}`}>{props.children}</span>
}

function ScoreRing(props: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, props.value))
  return (
    <div className="flex items-center gap-3">
      <div className="relative grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-pink-500/15">
        <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">{v}</div>
      </div>
      <div>
        <div className="text-xs text-slate-600 dark:text-slate-300">{props.label}</div>
        <div className="mt-1 h-2 w-48 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-pink-500"
            style={{ width: `${v}%` }}
          />
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

  async function onStart() {
    if (!role.trim()) {
      setErr('Please enter a target role.')
      return
    }
    setLoading(true)
    setErr(null)
    setSummary(null)
    try {
      const data = await startInterview(role)
      setSessionId(data.session_id)
      setQuestion(data.question)
      setAnswer('')
      setEvaluation(null)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit() {
    if (!sessionId || !answer.trim()) {
      setErr('Please enter an answer.')
      return
    }
    setLoading(true)
    setErr(null)
    try {
      const data = await submitInterviewAnswer(sessionId, answer)
      setEvaluation(data.evaluation)
      setQuestion(data.next_question)
      setAnswer('')
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  async function onFinish() {
    if (!sessionId) return
    setLoading(true)
    setErr(null)
    try {
      const data = await finishInterview(sessionId)
      setSummary(data)
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="card-surface rounded-2xl border p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">AI Interview Simulator</div>
        <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">
          Adaptive questioning + structured feedback you can act on.
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
          <label className="block">
            <div className="text-xs text-slate-600 dark:text-slate-300">Target role</div>
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Senior Software Engineer"
              className="mt-1 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500/60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
          </label>
          <button
            onClick={onStart}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600/90 to-pink-600/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Starting…' : 'Start interview'}
          </button>
        </div>
        {err ? (
          <div className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
            {err}
          </div>
        ) : null}
      </div>

      {question ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-3 rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-black/30 card-surface">
            <div className="flex flex-wrap items-center gap-2">
              <Pill tone="slate">Question</Pill>
              {sessionId ? <Pill tone="slate">Session: {sessionId.slice(0, 8)}…</Pill> : null}
            </div>
            <div className="mt-1 rounded-2xl border border-slate-900/10 bg-white/60 p-4 text-sm text-slate-900 dark:border-white/10 dark:bg-black/20 dark:text-slate-100">
              {question}
            </div>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={5}
              placeholder="Type your answer…"
              className="mt-3 w-full resize-none rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500/60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onSubmit}
                disabled={loading}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-60"
              >
                Submit answer
              </button>
              <button
                onClick={onFinish}
                disabled={loading}
                className="rounded-xl border border-slate-900/10 bg-white/60 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              >
                Finish interview
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {evaluation ? (
              <div className="card-surface rounded-2xl border p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Evaluation</div>
                  <Pill tone="emerald">Actionable feedback</Pill>
                </div>

                {isObj(evaluation) && typeof evaluation.score === 'number' ? (
                  <div className="mt-3">
                    <ScoreRing value={Math.round((evaluation.score / 10) * 100)} label="Answer score" />
                  </div>
                ) : null}

                {isObj(evaluation) && Array.isArray(evaluation.strengths) ? (
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Strengths</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {evaluation.strengths.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {isObj(evaluation) && Array.isArray(evaluation.improvements) ? (
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Improvements</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {evaluation.improvements.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {!isObj(evaluation) ? (
                  <div className="mt-3 rounded-xl border border-slate-900/10 bg-white/60 p-3 text-sm text-slate-700 dark:border-white/10 dark:bg-black/20 dark:text-slate-100">
                    {String(evaluation)}
                  </div>
                ) : null}
              </div>
            ) : null}
            {summary ? (
              <div className="card-surface rounded-2xl border p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Final summary</div>
                  <Pill tone="amber">Coaching plan</Pill>
                </div>

                {isObj(summary) && typeof summary.final_score === 'number' ? (
                  <div className="mt-3">
                    <ScoreRing value={Math.round(summary.final_score)} label="Interview readiness" />
                  </div>
                ) : null}

                {isObj(summary) && Array.isArray(summary.strengths) ? (
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Strengths</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {summary.strengths.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {isObj(summary) && Array.isArray(summary.weaknesses) ? (
                  <div className="mt-3">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Areas to improve</div>
                    <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-200">
                      {summary.weaknesses.map((s: string, i: number) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {isObj(summary) && typeof summary.recommendation === 'string' ? (
                  <div className="mt-3 rounded-2xl border border-slate-900/10 bg-gradient-to-r from-indigo-500/10 via-white/30 to-pink-500/10 p-4 text-sm text-slate-800 dark:border-white/10 dark:bg-black/20 dark:text-slate-100">
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">Recommendation</div>
                    <div className="mt-1">{summary.recommendation}</div>
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

