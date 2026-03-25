import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const features = [
  { label: 'ATS scoring in seconds', icon: '✓' },
  { label: 'Resume ↔ Job match analysis', icon: '✓' },
  { label: 'Live market skill intelligence', icon: '✓' },
  { label: 'AI-powered interview simulator', icon: '✓' },
]

export function Login() {
  const { login } = useAuth()
  const { mode, toggle } = useTheme()
  const nav = useNavigate()
  const loc = useLocation()
  const from = (loc.state as any)?.from ?? '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const canSubmit = useMemo(() => email.trim().length > 0 && password.length > 0, [email, password])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setLoading(true)
    try { await login(email, password); nav(from, { replace: true }) }
    catch (e: any) { setErr(e?.message ?? String(e)) }
    finally { setLoading(false) }
  }

  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 items-center gap-8 px-5 py-12 lg:grid-cols-2">
        {/* Left panel */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <span className="text-sm font-semibold" style={{color: 'var(--color-text)'}}>AI Career Copilot</span>
          </div>

          <h1 className="text-4xl font-extrabold leading-tight">
            <span className="gradient-text">Welcome back.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed max-w-sm" style={{color: 'var(--color-text-dim)'}}>
            Pick up where you left off — ATS wins, sharper job matches, and interview feedback that actually moves the needle.
          </p>

          <div className="mt-6 space-y-2.5">
            {features.map((f) => (
              <div key={f.label} className="flex items-center gap-2.5 text-sm" style={{color: 'var(--color-text-dim)'}}>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[11px]" style={{background: 'var(--color-surface-raised)', color: 'var(--color-emerald)'}}>{f.icon}</div>
                {f.label}
              </div>
            ))}
          </div>

          <button onClick={toggle} className="btn-ghost mt-6 text-xs">
            {mode === 'dark' ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/></svg>
            )}
            {mode === 'dark' ? 'Night mode' : 'Day mode'}
          </button>
        </div>

        {/* Right — form card */}
        <div className="card-surface rounded-2xl p-7">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-widest" style={{color: 'var(--color-text-muted)'}}>Account</div>
              <div className="text-xl font-bold mt-0.5" style={{color: 'var(--color-text)'}}>Sign in</div>
            </div>
            <Link to="/signup" className="text-xs font-medium" style={{color: 'var(--color-primary)', textDecoration: 'none'}}>
              Create account →
            </Link>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="you@domain.com" className="field-input" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="current-password" placeholder="••••••••" className="field-input" />
            </div>
            {err && <div className="banner-error">{err}</div>}
            <button type="submit" disabled={!canSubmit || loading} className="btn-primary w-full">
              {loading ? <><span className="spinner" />Signing in…</> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
