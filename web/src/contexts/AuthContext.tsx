import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  authLogin,
  authLogout,
  authMe,
  authRefresh,
  authRegister,
  forgotPassword,
  requestEmailVerification,
  resetPassword,
  verifyEmail,
} from '../lib/api'

type User = { id: number; email: string; is_email_verified: boolean }

type AuthContextValue = {
  user: User | null
  accessToken: string | null
  loading: boolean
  signup: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  requestEmailVerification: () => Promise<{ status: string; token?: string }>
  verifyEmail: (token: string) => Promise<void>
  forgotPassword: (email: string) => Promise<{ status: string; token?: string }>
  resetPassword: (token: string, newPassword: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)
const ACCESS_TOKEN_KEY = 'ai-career-copilot:access'

export function AuthProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem(ACCESS_TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  async function loadMe(token: string) {
    const me = (await authMe(token)) as User
    setUser(me)
  }

  async function refreshSession() {
    const r = await authRefresh()
    setAccessToken(r.access_token)
    localStorage.setItem(ACCESS_TOKEN_KEY, r.access_token)
    await loadMe(r.access_token)
  }

  useEffect(() => {
    ;(async () => {
      try {
        if (accessToken) {
          await loadMe(accessToken)
        } else {
          await refreshSession()
        }
      } catch {
        setUser(null)
        setAccessToken(null)
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      accessToken,
      loading,
      signup: async (email, password) => {
        await authRegister(email, password)
        const t = await authLogin(email, password)
        setAccessToken(t.access_token)
        localStorage.setItem(ACCESS_TOKEN_KEY, t.access_token)
        await loadMe(t.access_token)
      },
      login: async (email, password) => {
        const t = await authLogin(email, password)
        setAccessToken(t.access_token)
        localStorage.setItem(ACCESS_TOKEN_KEY, t.access_token)
        await loadMe(t.access_token)
      },
      logout: async () => {
        await authLogout()
        setUser(null)
        setAccessToken(null)
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      },
      refreshSession,
      requestEmailVerification: async () => {
        if (!accessToken) throw new Error('Not authenticated')
        return await requestEmailVerification(accessToken)
      },
      verifyEmail: async (token: string) => {
        await verifyEmail(token)
        if (accessToken) await loadMe(accessToken)
      },
      forgotPassword: async (email: string) => {
        return await forgotPassword(email)
      },
      resetPassword: async (token: string, newPassword: string) => {
        await resetPassword(token, newPassword)
      },
    }),
    [user, accessToken, loading],
  )

  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

