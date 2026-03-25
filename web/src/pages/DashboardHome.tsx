import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getHealth } from '../lib/api'

const tools = [
  {
    to: '/ats',
    label: 'ATS Checker',
    description: 'Score your resume against any job role',
    color: 'from-indigo-500/20 to-indigo-600/10',
    border: 'var(--color-border)',
    iconColor: 'var(--color-primary)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      </svg>
    ),
  },
  {
    to: '/job-match',
    label: 'Job Match',
    description: 'Compare your resume to a job description',
    color: 'from-pink-500/20 to-pink-600/10',
    border: 'var(--color-border)',
    iconColor: 'var(--color-accent)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    to: '/market-skills',
    label: 'Market Skills',
    description: 'See live skill demand from real job postings',
    color: 'from-emerald-500/20 to-emerald-600/10',
    border: 'var(--color-border)',
    iconColor: 'var(--color-emerald)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    to: '/interview',
    label: 'Interview Sim',
    description: 'Practice with AI-driven adaptive questioning',
    color: 'from-violet-500/20 to-violet-600/10',
    border: 'var(--color-border)',
    iconColor: 'var(--color-primary-end)',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
]

export function DashboardHome() {
  const [health, setHealth] = useState<any>(null)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    getHealth()
      .then((h) => { setHealth(h); setErr(null) })
      .catch((e) => setErr(e?.message ?? String(e)))
  }, [])

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="card-surface relative overflow-hidden rounded-2xl p-7">
        {/* Decorative orb */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full opacity-20" style={{background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)'}} />
        <div className="relative">
          <div className="chip chip-indigo mb-3 w-fit">Career Cockpit</div>
          <h2 className="text-3xl font-extrabold leading-tight">
            <span className="gradient-text">Your career,</span>
            <br />
            <span style={{color: 'var(--color-text)'}}>run like a product.</span>
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-relaxed" style={{color: 'var(--color-text-dim)'}}>
            Upload once, then iterate: ATS score → job match → market intelligence → interview-ready. Every step powered by LLMs.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${err ? 'chip-rose' : 'chip-emerald'}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${err ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
              API: {err ? 'Offline' : (health?.status ?? 'ok')}
            </div>
            <div className="chip chip-slate">Powered by Llama 3.3 70B</div>
          </div>
        </div>
      </div>

      {/* Tool cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {tools.map((tool) => (
          <Link
            key={tool.to}
            to={tool.to}
            className="card-raised block rounded-2xl p-5 no-underline"
            style={{borderColor: tool.border}}
          >
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tool.color}`} style={{color: tool.iconColor}}>
              {tool.icon}
            </div>
            <div className="mt-3 font-semibold text-sm" style={{color: 'var(--color-text)'}}>{tool.label}</div>
            <div className="mt-1 text-xs leading-relaxed" style={{color: 'var(--color-text-dim)'}}>{tool.description}</div>
            <div className="mt-3 flex items-center gap-1 text-xs font-medium" style={{color: tool.iconColor}}>
              Open
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick stats */}
      <div className="card-surface rounded-2xl p-5">
        <div className="text-xs font-semibold uppercase tracking-widest mb-4" style={{color: 'var(--color-text-muted)'}}>Quick stats</div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'ATS Readiness', value: '—', hint: 'Run ATS check', color: 'var(--color-primary)' },
            { label: 'Job Match', value: '—', hint: 'Compare resume ↔ JD', color: 'var(--color-accent)' },
            { label: 'Top Skills', value: '—', hint: 'See market demand', color: 'var(--color-emerald)' },
            { label: 'Interview Score', value: '—', hint: 'Practice to unlock', color: 'var(--color-primary-end)' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold" style={{color: s.color}}>{s.value}</div>
              <div className="text-xs font-medium mt-0.5" style={{color: 'var(--color-text)'}}>{s.label}</div>
              <div className="text-[11px] mt-0.5" style={{color: 'var(--color-text-muted)'}}>{s.hint}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
