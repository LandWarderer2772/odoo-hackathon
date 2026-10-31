// BrightLoop API Client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

export interface ApiFetchOptions extends RequestInit {
  data?: any
}

export async function apiFetch<T = any>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const { data, headers = {}, ...rest } = options
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  }

  // Retrieve token from localStorage if in browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('brightloop_token')
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`
    }
  }

  const response = await fetch(url, {
    ...rest,
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
    credentials: 'include',
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}
