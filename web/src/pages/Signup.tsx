import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export function Signup() {
  const { signup } = useAuth()
  const { mode, toggle } = useTheme()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const passwordMatch = password.length >= 8 && password === confirm
  const canSubmit = useMemo(() => email.trim().length > 0 && passwordMatch, [email, passwordMatch])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(null); setLoading(true)
    try { await signup(email, password); nav('/', { replace: true }) }
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
            <span className="gradient-text">Let's build</span>
            <br />
            <span style={{color: 'var(--color-text)'}}>your next offer.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed max-w-sm" style={{color: 'var(--color-text-dim)'}}>
            New here? Create an account and turn your resume into a clear plan — score → gaps → roadmap → interview-ready.
          </p>

          <div className="mt-6 rounded-2xl p-4 space-y-2" style={{background: 'var(--color-surface)', border: '1px solid var(--color-border)'}}>
            <div className="text-xs font-semibold mb-3" style={{color: 'var(--color-primary)'}}>Free to get started</div>
            {['Resume ATS scoring', 'Job match analysis', 'Live skill demand data', 'AI interview practice'].map(f => (
              <div key={f} className="flex items-center gap-2 text-xs" style={{color: 'var(--color-text-dim)'}}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                {f}
              </div>
            ))}
          </div>

          <button onClick={toggle} className="btn-ghost mt-5 text-xs">
            {mode === 'dark' ? 'Night mode' : 'Day mode'}
          </button>
        </div>

        {/* Right — form */}
        <div className="card-surface rounded-2xl p-7">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-widest" style={{color: 'var(--color-text-muted)'}}>Account</div>
              <div className="text-xl font-bold mt-0.5" style={{color: 'var(--color-text)'}}>Create account</div>
            </div>
            <Link to="/login" className="text-xs font-medium" style={{color: 'var(--color-primary)', textDecoration: 'none'}}>
              Back to login
            </Link>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" placeholder="you@domain.com" className="field-input" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" autoComplete="new-password" placeholder="Minimum 8 characters" className="field-input" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{color: 'var(--color-text-dim)'}}>Confirm password</label>
              <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type="password" autoComplete="new-password" placeholder="Repeat password" className="field-input" />
              {confirm.length > 0 && !passwordMatch && (
                <p className="mt-1 text-[11px]" style={{color: 'var(--color-rose)'}}>Passwords don't match or too short</p>
              )}
            </div>
            {err && <div className="banner-error">{err}</div>}
            <button type="submit" disabled={!canSubmit || loading} className="btn-primary w-full">
              {loading ? <><span className="spinner" />Creating…</> : 'Create account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
