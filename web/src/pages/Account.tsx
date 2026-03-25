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

  const initial = user?.email?.[0]?.toUpperCase() ?? '?'

  return (
    <div className="space-y-5">
      {/* Profile card */}
      <div className="card-surface rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold" style={{background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff'}}>
            {initial}
          </div>
          <div>
            <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>{user?.email ?? '—'}</div>
            <div className="mt-1 flex items-center gap-2 text-xs">
              <span className={`h-2 w-2 rounded-full ${user?.is_email_verified ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span style={{color: user?.is_email_verified ? 'var(--color-emerald)' : 'var(--shadow-amber)'}}>
                {user?.is_email_verified ? 'Email verified' : 'Email not verified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Email verification */}
        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>Email Verification</div>
          </div>
          <p className="text-xs mb-4" style={{color: 'var(--color-text-muted)'}}>In dev mode, the verification token is returned directly in the API response.</p>

          <div className="space-y-2">
            <button
              className="btn-primary text-xs"
              onClick={async () => {
                setErr(null); setMsg(null)
                try { const r = await requestEmailVerification(); setMsg(`Token (dev): ${r.token ?? '(not returned)'}`) }
                catch (e: any) { setErr(e?.message ?? String(e)) }
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              Request verification email
            </button>
            <div className="flex gap-2">
              <input value={verifyToken} onChange={(e) => setVerifyToken(e.target.value)} placeholder="Paste token…" className="field-input flex-1 text-xs" />
              <button
                className="btn-ghost text-xs shrink-0"
                onClick={async () => {
                  setErr(null); setMsg(null)
                  try { await verifyEmail(verifyToken); setMsg('Email verified successfully.') }
                  catch (e: any) { setErr(e?.message ?? String(e)) }
                }}
              >Verify</button>
            </div>
          </div>
        </div>

        {/* Password reset */}
        <div className="card-surface rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <div className="font-semibold text-sm" style={{color: 'var(--color-text)'}}>Reset Password</div>
          </div>
          <p className="text-xs mb-4" style={{color: 'var(--color-text-muted)'}}>Request a reset token, then use it to set a new password.</p>

          <div className="space-y-2">
            <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Email" className="field-input text-xs" />
            <button
              className="btn-primary text-xs" style={{background:'linear-gradient(135deg, #ec4899, #8b5cf6)'}}
              onClick={async () => {
                setErr(null); setMsg(null)
                try { const r = await forgotPassword(resetEmail); setMsg(`Reset token (dev): ${r.token ?? '(not returned)'}`) }
                catch (e: any) { setErr(e?.message ?? String(e)) }
              }}
            >Request reset token</button>
            <input value={resetToken} onChange={(e) => setResetToken(e.target.value)} placeholder="Paste reset token…" className="field-input text-xs" />
            <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" placeholder="New password (min 8 chars)" className="field-input text-xs" />
            <button
              className="btn-ghost text-xs w-full"
              onClick={async () => {
                setErr(null); setMsg(null)
                try { await resetPassword(resetToken, newPassword); setMsg('Password updated. Please log in again.') }
                catch (e: any) { setErr(e?.message ?? String(e)) }
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Set new password
            </button>
          </div>
        </div>
      </div>

      {msg && <div className="fade-up banner-success">{msg}</div>}
      {err && <div className="fade-up banner-error">{err}</div>}
    </div>
  )
}
