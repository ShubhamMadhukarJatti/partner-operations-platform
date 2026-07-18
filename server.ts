'use server'

import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import axios, { AxiosRequestConfig } from 'axios'
import jwt from 'jsonwebtoken'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 7 * 100
}

export const getServerUser = async () => {
  const cookieStore = cookies()
  const headersList = headers()

  let accessToken = cookieStore.get('accessToken')?.value
  const authHeader = headersList.get('authorization')
  if (!accessToken && authHeader?.startsWith('Bearer ')) {
    accessToken = authHeader.slice(7).trim()
  }

  const userCookie = cookieStore.get('user')?.value
  let user = null
  if (userCookie) {
    try {
      user = JSON.parse(userCookie)
    } catch (error) {
      console.error('Failed to parse user cookie:', error)
    }
  }

  if (!accessToken) {
    return { token: null, user: null }
  }

  return { token: accessToken, user }
}

/**
 * Get a valid access token, attempting refresh if token is missing but refreshToken exists
 * Use this in server actions that need a token
 */
export async function getValidToken(): Promise<string | null> {
  const tokenObj = await getServerUser()
  let token = tokenObj.token

  // If token is null but refreshToken exists, attempt to refresh
  if (!token) {
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (refreshToken) {
      const newTokens = await refreshTokens()
      if (newTokens) {
        token = newTokens.accessToken
      }
    }
  }

  return token
}

export async function getValidPartnerToken(): Promise<string | null> {
  const cookieStore = cookies()
  let token = cookieStore.get('partnerAccessToken')?.value || null

  let isExpired = false
  if (token) {
    try {
      const decoded = jwt.decode(token) as { exp?: number } | null
      if (decoded?.exp) {
        isExpired = decoded.exp * 1000 - 10000 < Date.now()
      } else {
        isExpired = true
      }
    } catch {
      isExpired = true
    }
  }

  // If token is null/expired but partnerRefreshToken exists, attempt to refresh
  if (!token || isExpired) {
    const refreshToken = cookieStore.get('partnerRefreshToken')?.value

    if (refreshToken) {
      const newTokens = await refreshPartnerTokens()
      if (newTokens) {
        token = newTokens.accessToken
      } else {
        token = null
      }
    } else {
      token = null
    }
  }

  return token
}

function readUserCookieUid(): string | null {
  const cookieStore = cookies()
  const raw = cookieStore.get('user')?.value
  if (!raw) return null
  try {
    const u = JSON.parse(raw) as { uid?: unknown }
    return typeof u.uid === 'string' ? u.uid : null
  } catch {
    return null
  }
}

function uidFromAccessToken(accessToken: string): string | null {
  try {
    const decoded = jwt.decode(accessToken, { json: true }) as {
      sub?: unknown
    } | null
    return typeof decoded?.sub === 'string' ? decoded.sub : null
  } catch {
    return null
  }
}

/**
 * For API routes: valid bearer token plus uid from `user` cookie, or JWT `sub` if cookie is absent
 * (e.g. immediately after email verify before the cookie is readable on the next request).
 */
export async function getAuthenticatedSession(): Promise<{
  token: string
  uid: string
} | null> {
  const token = await getValidToken()
  if (!token) return null

  const fromCookie = readUserCookieUid()
  if (fromCookie) return { token, uid: fromCookie }

  const fromJwt = uidFromAccessToken(token)
  if (!fromJwt) return null
  return { token, uid: fromJwt }
}

// Request cache to prevent duplicate in-flight requests (same endpoint + options)
const requestCache = new Map<string, Promise<any>>()

export type FetcherOptions = AxiosRequestConfig & {
  /** When true, 401 from backend will throw instead of redirecting to login.
   * Use for endpoints (e.g. LinkedIn) that may return 401 for feature-unavailable, not session expiry. */
  noRedirectOn401?: boolean
}

/**
 * Use this for every backend API call. Deduplicates identical concurrent requests
 * and ensures consistent token refresh + retry-on-401 logic, reducing logout races.
 */
export async function fetcher<T>(
  endpoint: string,
  options?: FetcherOptions
): Promise<T> {
  // Skip cache for FormData (file uploads) - each upload is unique and FormData doesn't serialize
  const isFormData = options?.data instanceof FormData
  const cacheKey = isFormData ? null : `${endpoint}-${JSON.stringify(options)}`

  if (cacheKey && requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey)!
  }

  const requestPromise = performRequest<T>(endpoint, options ?? {})
  if (cacheKey) {
    requestCache.set(cacheKey, requestPromise)
    requestPromise
      .finally(() => {
        requestCache.delete(cacheKey)
      })
      .catch(() => {}) // We don't want the rejection to bubble from the .finally() chain directly as an unhandled promise.
  }

  return requestPromise
}

function messageFromPublicApiErrorBody(
  data: unknown,
  httpStatus: number
): string {
  if (data && typeof data === 'object') {
    const o = data as Record<string, unknown>
    for (const key of ['message', 'error', 'detail', 'title'] as const) {
      const v = o[key]
      if (typeof v === 'string' && v.trim()) return v.trim()
    }
  }
  return `Upstream request failed (HTTP ${httpStatus})`
}

/**
 * Public fetcher for marketing/public API routes – no access token.
 * Use for endpoints that must work without authentication (e.g. demo-book, email subscribe, talent forms).
 */
export async function publicFetcher<T>(
  endpoint: string,
  options?: {
    method?: string
    headers?: Record<string, string>
    data?: unknown
  }
): Promise<T> {
  const apiUrl =
    process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
  if (!apiUrl) {
    throw new Error('API URL not configured')
  }

  const url = `${apiUrl.replace(/\/$/, '')}${endpoint}`
  const method = options?.method ?? 'GET'
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/hal+json',
    ...options?.headers
  }

  const init: RequestInit = {
    method,
    headers
  }
  if (options?.data !== undefined && method !== 'GET') {
    init.body = JSON.stringify(options.data)
  }

  const response = await fetch(url, init)
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    const err = new Error(
      messageFromPublicApiErrorBody(data, response.status)
    ) as Error & {
      response?: { status: number; data?: unknown }
    }
    err.response = { status: response.status, data }
    throw err
  }

  return data as T
}

// Track ongoing refresh to prevent multiple simultaneous refresh attempts
let refreshPromise: Promise<{
  accessToken: string
  refreshToken: string
} | null> | null = null

const REFRESH_RETRY_DELAY_MS = 500

/** Clear auth cookies and redirect to login. Prevents redirect loop when
 * middleware sees stale accessToken and redirects /login → /dashboard. */
function clearAuthAndRedirectToLogin() {
  const cookieStore = cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
  cookieStore.delete('user')
  redirect('/login')
}

async function doRefreshAttempt(): Promise<{
  accessToken: string
  refreshToken: string
} | null> {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('refreshToken')?.value

  if (!refreshToken) return null

  const apiUrl =
    process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
  if (!apiUrl) return null

  const refreshResponse = await axios.post(
    `${apiUrl}/v1/users/refresh-token`,
    { token: refreshToken },
    {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    }
  )

  const newAccessToken = refreshResponse.data.accessToken
  const newRefreshToken = refreshResponse.data.refreshToken

  if (!newAccessToken || !newRefreshToken) return null

  cookieStore.set('accessToken', newAccessToken, COOKIE_OPTIONS)
  cookieStore.set('refreshToken', newRefreshToken, COOKIE_OPTIONS)

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

async function refreshTokens(): Promise<{
  accessToken: string
  refreshToken: string
} | null> {
  if (refreshPromise) return refreshPromise

  refreshPromise = (async () => {
    try {
      return await doRefreshAttempt()
    } catch (error: any) {
      const status = error?.response?.status
      const isRetryable = status >= 500 || status === undefined

      if (isRetryable) {
        await new Promise((r) => setTimeout(r, REFRESH_RETRY_DELAY_MS))
        try {
          return await doRefreshAttempt()
        } catch {
          // fall through
        }
      }

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      if (process.env.NODE_ENV === 'development') {
        console.error('[Server Refresh] Token refresh error:', error)
      } else if (process.env.NODE_ENV === 'production') {
        console.error('[Server Refresh] Token refresh failed:', {
          message: errorMessage,
          status,
          timestamp: new Date().toISOString()
        })
      }
      return null
    } finally {
      refreshPromise = null
    }
  })()

  return refreshPromise
}

let partnerRefreshPromise: Promise<{
  accessToken: string
  refreshToken: string
} | null> | null = null

async function doPartnerRefreshAttempt(): Promise<{
  accessToken: string
  refreshToken: string
} | null> {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get('partnerRefreshToken')?.value

  if (!refreshToken) return null

  const apiUrl =
    process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
  if (!apiUrl) return null

  const refreshResponse = await axios.post(
    `${apiUrl}/v1/users/refresh-token`,
    { token: refreshToken },
    {
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' }
    }
  )

  const newAccessToken = refreshResponse.data.accessToken
  const newRefreshToken = refreshResponse.data.refreshToken

  if (!newAccessToken || !newRefreshToken) return null

  cookieStore.set('partnerAccessToken', newAccessToken, COOKIE_OPTIONS)
  cookieStore.set('partnerRefreshToken', newRefreshToken, COOKIE_OPTIONS)

  return { accessToken: newAccessToken, refreshToken: newRefreshToken }
}

async function refreshPartnerTokens(): Promise<{
  accessToken: string
  refreshToken: string
} | null> {
  if (partnerRefreshPromise) return partnerRefreshPromise

  partnerRefreshPromise = (async () => {
    try {
      return await doPartnerRefreshAttempt()
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[Partner Server Refresh] Token refresh error:', error)
      }
      return null
    } finally {
      partnerRefreshPromise = null
    }
  })()

  return partnerRefreshPromise
}

async function performRequest<T>(
  endpoint: string,
  options?: FetcherOptions
): Promise<T> {
  let tokenObj = await getServerUser()
  let token = tokenObj.token

  // If token is null but refreshToken exists, attempt to refresh first
  if (!token) {
    const cookieStore = cookies()
    const refreshToken = cookieStore.get('refreshToken')?.value

    if (refreshToken) {
      let newTokens = await refreshTokens()
      if (!newTokens) {
        await new Promise((r) => setTimeout(r, REFRESH_RETRY_DELAY_MS))
        newTokens = await refreshTokens()
      }
      if (newTokens) {
        token = newTokens.accessToken
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '[Server] Token refresh failed - not using potentially expired token'
          )
        } else if (process.env.NODE_ENV === 'production') {
          console.error(
            '[Server] Token refresh failed - not using potentially expired token',
            { timestamp: new Date().toISOString() }
          )
        }
        clearAuthAndRedirectToLogin()
      }
    } else {
      clearAuthAndRedirectToLogin()
    }
  }

  const apiUrl =
    process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL
  if (!apiUrl) {
    throw new Error('API URL not configured')
  }

  // Normalize base URL (strip trailing slash) to avoid double-slash in path
  const baseUrl = apiUrl.replace(/\/$/, '')

  // For FormData (file uploads), omit Content-Type so axios sets multipart/form-data with boundary
  const isFormData = options?.data instanceof FormData
  const defaultHeaders: Record<string, any> = {
    Authorization: `Bearer ${token}`,
    'x-middleware-bypass': '1',
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...options?.headers
  }

  const { noRedirectOn401, ...axiosOptions } = options ?? {}
  const axiosObj: AxiosRequestConfig = {
    url: `${baseUrl}${endpoint}`,
    timeout: options?.timeout || 300000, // Use provided timeout or default to 5 minutes
    ...axiosOptions,
    headers: defaultHeaders as any // Use type assertion to bypass AxiosHeaderValue vs string conflict
  }

  try {
    const response = await axios(axiosObj)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 401) {
      let newTokens = await refreshTokens()
      if (!newTokens) {
        await new Promise((r) => setTimeout(r, REFRESH_RETRY_DELAY_MS))
        newTokens = await refreshTokens()
      }

      if (!newTokens) {
        if (process.env.NODE_ENV === 'development') {
          console.error(
            '[Server] Token refresh failed on 401 - not using potentially expired token'
          )
        } else if (process.env.NODE_ENV === 'production') {
          console.error(
            '[Server] Token refresh failed on 401 - not using potentially expired token',
            { timestamp: new Date().toISOString() }
          )
        }
        if (noRedirectOn401) throw error
        clearAuthAndRedirectToLogin()
      }

      if (newTokens) {
        axiosObj.headers!.Authorization = `Bearer ${newTokens.accessToken}`
      }

      try {
        const retryResponse = await axios(axiosObj)
        return retryResponse.data
      } catch (retryError: any) {
        if (retryError.response?.status === 401) {
          if (noRedirectOn401) throw retryError
          clearAuthAndRedirectToLogin()
        }
        throw retryError
      }
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please try again.')
    }

    const errorData = error?.response?.data as
      | Record<string, unknown>
      | undefined
    const status = error?.response?.status
    const fromDescription =
      typeof errorData?.description === 'string' && errorData.description.trim()
        ? errorData.description.trim()
        : null
    const errorMessage =
      (typeof errorData?.errorMessage === 'string' && errorData.errorMessage) ||
      (typeof errorData?.message === 'string' && errorData.message) ||
      fromDescription ||
      (typeof status === 'number'
        ? `Upstream request failed (HTTP ${status})`
        : 'Something went wrong')
    throw new Error(errorMessage)
  }
}
