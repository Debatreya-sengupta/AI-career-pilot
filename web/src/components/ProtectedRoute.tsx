import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function ProtectedRoute() {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div className="app-bg min-h-screen">
        <div className="mx-auto max-w-4xl px-4 py-10 text-slate-700 dark:text-slate-200">Loading…</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  return <Outlet />
}

