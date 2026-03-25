import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

const nav = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    to: '/ats',
    label: 'ATS Checker',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    to: '/job-match',
    label: 'Job Match',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    ),
  },
  {
    to: '/market-skills',
    label: 'Market Skills',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
  {
    to: '/interview',
    label: 'Interview',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    to: '/account',
    label: 'Account',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
]

export function AppLayout() {
  const { pathname } = useLocation()
  const navg = useNavigate()
  const { user, logout } = useAuth()
  const { mode, toggle } = useTheme()

  const title = nav.find((n) => (n.to === '/' ? pathname === '/' : pathname.startsWith(n.to)))?.label ?? 'AI Career Copilot'
  const initial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="app-bg min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1400px] gap-4 p-4">

        {/* ── Sidebar ─────────────────────────────────────────── */}
        <aside className="card-surface sticky top-4 flex h-[calc(100vh-2rem)] w-64 shrink-0 flex-col rounded-2xl p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 px-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <div>
              <div className="text-sm font-bold leading-tight" style={{color: 'var(--color-text)'}}>AI Career Copilot</div>
              <div className="text-[11px]" style={{color: 'var(--color-text-dim)'}}>Career Intelligence</div>
            </div>
          </div>

          <div className="my-4 h-px" style={{background: 'var(--color-border)'}} />

          {/* Nav links */}
          <nav className="flex-1 space-y-0.5">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'nav-active'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                  }`
                }
              >
                <span className="shrink-0 opacity-80">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-4 space-y-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              className="btn-ghost w-full"
              style={{justifyContent: 'flex-start', gap: '0.5rem'}}
            >
              {mode === 'dark' ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              )}
              {mode === 'dark' ? 'Night mode' : 'Day mode'}
            </button>

            {/* User card */}
            <div className="flex items-center gap-2.5 rounded-xl p-2.5" style={{background: 'var(--color-surface)', border: '1px solid var(--color-border)'}}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold" style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff'}}>
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-medium" style={{color: 'var(--color-text)'}}>{user?.email ?? '—'}</div>
                <div className="flex items-center gap-1 text-[11px]" style={{color: 'var(--color-text-dim)'}}>
                  <span className={`h-1.5 w-1.5 rounded-full ${user?.is_email_verified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                  {user?.is_email_verified ? 'Verified' : 'Unverified'}
                </div>
              </div>
              <button
                onClick={async () => { await logout(); navg('/login', { replace: true }) }}
                className="shrink-0 rounded-lg px-2 py-1 text-[11px] font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                style={{color: 'var(--color-text-dim)'}}
                title="Logout"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </div>
        </aside>

        {/* ── Main content ─────────────────────────────────────── */}
        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="card-surface flex items-center justify-between rounded-2xl px-5 py-3.5">
            <div>
              <div className="text-[11px] font-medium uppercase tracking-widest" style={{color: 'var(--color-text-muted)'}}>AI Career Copilot</div>
              <h1 className="text-lg font-bold leading-tight gradient-text">{title}</h1>
            </div>
            <div className="flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium" style={{background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.2)', color: '#6ee7b7'}}>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              System online
            </div>
          </header>

          <div className="fade-up flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
