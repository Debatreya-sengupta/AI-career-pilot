import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export function Account() {
  const { user, requestEmailVerification, verifyEmail, forgotPassword, resetPassword } = useAuth()

  const [verifyToken, setVerifyToken] = useState('')
  const [resetEmail, setResetEmail] = useState(user?.email ?? '')
  const [resetToken, setResetToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-black/30">
        <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Account</div>
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Email: <span className="font-semibold">{user?.email}</span> ·{' '}
          {user?.is_email_verified ? 'Verified' : 'Not verified'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-black/30">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Email verification</div>
          <div className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            In dev mode, the API returns the verification token directly.
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"
              onClick={async () => {
                setErr(null)
                setMsg(null)
                try {
                  const r = await requestEmailVerification()
                  setMsg(`Token (dev): ${r.token ?? '(not returned)'}`)
                } catch (e: any) {
                  setErr(e?.message ?? String(e))
                }
              }}
            >
              Request verification
            </button>
            <input
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder="Paste token"
              className="flex-1 rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
            <button
              className="rounded-xl border border-slate-900/10 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              onClick={async () => {
                setErr(null)
                setMsg(null)
                try {
                  await verifyEmail(verifyToken)
                  setMsg('Email verified.')
                } catch (e: any) {
                  setErr(e?.message ?? String(e))
                }
              }}
            >
              Verify
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-black/30">
          <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">Reset password</div>
          <div className="mt-3 space-y-2">
            <input
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              placeholder="Email"
              className="w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
            <button
              className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white"
              onClick={async () => {
                setErr(null)
                setMsg(null)
                try {
                  const r = await forgotPassword(resetEmail)
                  setMsg(`Reset token (dev): ${r.token ?? '(not returned)'}`)
                } catch (e: any) {
                  setErr(e?.message ?? String(e))
                }
              }}
            >
              Request reset
            </button>
            <input
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Paste reset token"
              className="w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8)"
              type="password"
              className="w-full rounded-xl border border-slate-900/10 bg-white/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-black/20 dark:text-slate-100"
            />
            <button
              className="rounded-xl border border-slate-900/10 bg-white/60 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
              onClick={async () => {
                setErr(null)
                setMsg(null)
                try {
                  await resetPassword(resetToken, newPassword)
                  setMsg('Password updated. Please login again.')
                } catch (e: any) {
                  setErr(e?.message ?? String(e))
                }
              }}
            >
              Reset password
            </button>
          </div>
        </div>
      </div>

      {msg ? <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-800 dark:text-emerald-200">{msg}</div> : null}
      {err ? <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-700 dark:text-rose-200">{err}</div> : null}
    </div>
  )
}

