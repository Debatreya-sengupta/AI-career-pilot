import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const nav = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/ats', label: 'ATS Checker', icon: '🧩' },
  { to: '/job-match', label: 'Job Match', icon: '⚡' },
  { to: '/market-skills', label: 'Market Skills', icon: '📈' },
  { to: '/interview', label: 'Interview', icon: '🎤' },
  { to: '/account', label: 'Account', icon: '👤' },
]

function cx(...s: Array<string | false | null | undefined>) {
  return s.filter(Boolean).join(' ')
}

export function AppLayout() {
  const { pathname } = useLocation()
  const navg = useNavigate()
  const { user, logout } = useAuth()
  const { mode, toggle } = useTheme()

  const title =
    nav.find((n) => (n.to === '/' ? pathname === '/' : pathname.startsWith(n.to)))?.label ?? 'AI Career Copilot'

  return (
    <div className="min-h-screen app-bg">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/70 to-pink-500/50">
              🚀
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">AI Career Copilot</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">Career Intelligence Platform</div>
            </div>
          </div>

          <div className="mt-4 h-px bg-slate-900/10 dark:bg-white/10" />

          <nav className="mt-4 space-y-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cx(
                    'group flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition',
                    isActive
                      ? 'bg-slate-900/5 text-slate-900 dark:bg-white/10 dark:text-slate-50'
                      : 'text-slate-700 hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-100',
                  )
                }
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 rounded-xl border border-slate-900/10 bg-slate-900/5 p-3 dark:border-white/10 dark:bg-black/20">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Theme</div>
            <button
              onClick={toggle}
              className="mt-2 w-full rounded-xl border border-slate-900/10 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              {mode === 'dark' ? '🌙 Night mode' : '☀️ Day mode'}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-slate-900/10 bg-white/60 px-3 py-2 text-xs backdrop-blur dark:border-white/10 dark:bg-black/20">
            <div className="min-w-0">
              <div className="truncate font-semibold text-slate-800 dark:text-slate-200">{user?.email ?? '—'}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400">
                {user?.is_email_verified ? 'Email verified' : 'Email not verified'}
              </div>
            </div>
            <button
              onClick={async () => {
                await logout()
                navg('/login', { replace: true })
              }}
              className="rounded-lg border border-slate-900/10 bg-white/60 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-slate-200 dark:hover:bg-white/15"
            >
              Logout
            </button>
          </div>
        </aside>

        <main className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30">
          <header className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">AI Career Copilot</div>
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
            </div>
          </header>
          <div className="mt-5">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

