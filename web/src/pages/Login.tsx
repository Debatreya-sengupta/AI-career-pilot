import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

function Card(props: { children: React.ReactNode }) {
  return (
    <div className="card-surface rounded-2xl border p-5 shadow-sm backdrop-blur">
      {props.children}
    </div>
  )
}

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
    e.preventDefault()
    setErr(null)
    setLoading(true)
    try {
      await login(email, password)
      nav(from, { replace: true })
    } catch (e: any) {
      setErr(e?.message ?? String(e))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-6 px-4 py-10 lg:grid-cols-2">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-900/10 bg-white/60 px-3 py-1 text-xs text-slate-700 backdrop-blur dark:border-white/10 dark:bg-black/20 dark:text-slate-200">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-br from-indigo-500/70 to-pink-500/60">
              🚀
            </span>
            AI Career Copilot
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Welcome back.
          </h1>
          <p className="mt-2 max-w-xl text-sm text-slate-700 dark:text-slate-300">
            Pick up where you left off — ATS wins, sharper job matches, and interview feedback that actually moves the needle.
          </p>
          <button
            onClick={toggle}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white/90 dark:border-white/10 dark:bg-black/20 dark:text-slate-200 dark:hover:bg-black/30"
          >
            {mode === 'dark' ? '🌙 Night mode' : '☀️ Day mode'} · Toggle
          </button>
        </div>

        <Card>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Account</div>
              <div className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-50">Login</div>
            </div>
            <Link className="text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-300" to="/signup">
              Create account
            </Link>
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <label className="block">
              <div className="text-xs text-slate-600 dark:text-slate-300">Email</div>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="you@domain.com"
                className="mt-1 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500/60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
              />
            </label>

            <label className="block">
              <div className="text-xs text-slate-600 dark:text-slate-300">Password</div>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500/60 dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
              />
            </label>

            {err ? (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">
                {err}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit || loading}
              className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600/90 to-pink-600/80 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </Card>
      </div>
    </div>
  )
}

