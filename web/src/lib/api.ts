export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8001'

async function parseJsonSafe(res: Response) {
  const text = await res.text()
  try {
    return text ? JSON.parse(text) : null
  } catch {
    return { raw: text }
  }
}

export async function authRegister(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Register failed (${res.status})`)
  return data
}

export async function authLogin(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Login failed (${res.status})`)
  return data as { access_token: string }
}

export async function authMe(accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Me failed (${res.status})`)
  return data
}

export async function authRefresh() {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Refresh failed (${res.status})`)
  return data as { access_token: string }
}

export async function authLogout() {
  await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
}

export async function requestEmailVerification(accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/request-email-verification`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Request verification failed (${res.status})`)
  return data as { status: string; token?: string }
}

export async function verifyEmail(token: string) {
  const res = await fetch(`${API_BASE_URL}/auth/verify-email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Verify email failed (${res.status})`)
  return data
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Forgot password failed (${res.status})`)
  return data as { status: string; token?: string }
}

export async function resetPassword(token: string, new_password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password }),
    credentials: 'include',
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.detail || data.error)) || `Reset password failed (${res.status})`)
  return data
}

export async function getHealth() {
  const res = await fetch(`${API_BASE_URL}/health`, { method: 'GET' })
  if (!res.ok) throw new Error(`Health check failed (${res.status})`)
  return parseJsonSafe(res)
}

// ===== Career analysis endpoints =====

export async function atsCheckFile(role: string, resumeFile: File) {
  const form = new FormData()
  form.append('resume_file', resumeFile)
  const url = new URL(`${API_BASE_URL}/ats-check-file`)
  url.searchParams.set('role', role)

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: form,
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || `ATS check failed (${res.status})`)
  return data
}

export async function resumeJobMatch(resumeFile: File, jobDescription: string) {
  const form = new FormData()
  form.append('resume_file', resumeFile)
  const url = new URL(`${API_BASE_URL}/resume-job-match`)
  url.searchParams.set('job_description', jobDescription)

  const res = await fetch(url.toString(), {
    method: 'POST',
    body: form,
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || `Job match failed (${res.status})`)
  return data
}

export async function marketSkills(role: string) {
  const url = new URL(`${API_BASE_URL}/market-skills`)
  url.searchParams.set('role', role)
  const res = await fetch(url.toString(), { method: 'GET' })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || `Market skills failed (${res.status})`)
  return data
}

export async function startInterview(role: string) {
  const res = await fetch(`${API_BASE_URL}/start-interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ role }),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || `Start interview failed (${res.status})`)
  return data as { session_id: string; question: string }
}

export async function submitInterviewAnswer(sessionId: string, answer: string) {
  const res = await fetch(`${API_BASE_URL}/submit-answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, answer }),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || `Submit answer failed (${res.status})`)
  return data as { evaluation: unknown; next_question: string }
}

export async function finishInterview(sessionId: string) {
  const res = await fetch(`${API_BASE_URL}/finish-interview`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId }),
  })
  const data = await parseJsonSafe(res)
  if (!res.ok) throw new Error((data && (data.error || data.detail)) || `Finish interview failed (${res.status})`)
  return data
}


