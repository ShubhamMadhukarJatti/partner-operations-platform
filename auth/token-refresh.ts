'use client'

/**
 * Client-side token refresh utility
 * Handles proactive token refresh before expiry
 */

let refreshTimer: NodeJS.Timeout | null = null
let isRefreshing = false
let refreshPromise: Promise<boolean> | null = null
let lastRefreshTime: number | null = null
let refreshCount = 0 // Track number of successful refreshes
let isLoggedOut = false // Flag to prevent refresh after logout
let lastRefreshAttempt: number = 0 // Track last refresh attempt for debouncing
const REFRESH_DEBOUNCE_MS = 5000 // 5 seconds debounce to prevent rapid-fire calls
let lastEventTime: number = 0 // Track last event to combine visibilitychange + focus
const EVENT_COALESCE_MS = 100 // Combine events within 100ms

// Event listener references for cleanup
let visibilityChangeHandler: (() => void) | null = null
let focusHandler: (() => void) | null = null
let loadHandler: (() => void) | null = null
let beforeunloadHandler: (() => void) | null = null

// Token expiry configuration
// Defaults are used when env values are missing/invalid.
// - NEXT_PUBLIC_TOKEN_EXPIRY_MINUTES: access token expiry in minutes (default: 15)
// - NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL_MINUTES: refresh cadence in minutes (default: derived)
// - NEXT_PUBLIC_TOKEN_REFRESH_RATIO: ratio of expiry to refresh at (default: 0.8)
// - NEXT_PUBLIC_MIN_REFRESH_INTERVAL_MINUTES: minimum minutes between refreshes (default: 5)
const DEFAULT_TOKEN_EXPIRY_MINUTES = 15
const DEFAULT_TOKEN_REFRESH_RATIO = 0.8
const DEFAULT_MIN_REFRESH_INTERVAL_MINUTES = 5

const tokenExpiryMinutes = (() => {
  const raw = process.env.NEXT_PUBLIC_TOKEN_EXPIRY_MINUTES
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_TOKEN_EXPIRY_MINUTES
})()

const tokenRefreshRatio = (() => {
  const raw = process.env.NEXT_PUBLIC_TOKEN_REFRESH_RATIO
  const parsed = raw ? Number.parseFloat(raw) : Number.NaN
  return Number.isFinite(parsed) && parsed > 0 && parsed < 1
    ? parsed
    : DEFAULT_TOKEN_REFRESH_RATIO
})()

const tokenRefreshIntervalMinutes = (() => {
  const raw = process.env.NEXT_PUBLIC_TOKEN_REFRESH_INTERVAL_MINUTES
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN
  if (Number.isFinite(parsed) && parsed > 0) return parsed
  // Default: refresh before expiry (e.g. 80% of expiry time)
  return Math.max(1, Math.floor(tokenExpiryMinutes * tokenRefreshRatio))
})()

const minRefreshIntervalMinutes = (() => {
  const raw = process.env.NEXT_PUBLIC_MIN_REFRESH_INTERVAL_MINUTES
  const parsed = raw ? Number.parseInt(raw, 10) : Number.NaN
  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : DEFAULT_MIN_REFRESH_INTERVAL_MINUTES
})()

const TOKEN_EXPIRY_TIME = tokenExpiryMinutes * 60 * 1000
const TOKEN_REFRESH_INTERVAL = tokenRefreshIntervalMinutes * 60 * 1000
const MIN_REFRESH_INTERVAL = minRefreshIntervalMinutes * 60 * 1000

/**
 * Refresh tokens by calling the refresh API endpoint
 */
async function refreshTokens(): Promise<boolean> {
  // Don't refresh if user has logged out
  if (isLoggedOut) {
    return false
  }

  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing && refreshPromise) {
    return refreshPromise
  }

  const REFRESH_RETRY_DELAY_MS = 400

  isRefreshing = true
  refreshPromise = (async () => {
    const doFetch = () =>
      fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })

    try {
      let response = await doFetch()

      if (response.ok) {
        lastRefreshTime = Date.now()
        refreshCount++
        return true
      }

      if (response.status === 500) {
        if (process.env.NODE_ENV === 'development') {
          console.warn(
            '[TokenRefresh] Server error (500) - will retry on next interval'
          )
        }
        return false
      }

      if (response.status === 401) {
        await new Promise((r) => setTimeout(r, REFRESH_RETRY_DELAY_MS))
        response = await doFetch()
        if (response.ok) {
          lastRefreshTime = Date.now()
          refreshCount++
          return true
        }
        if (response.status === 401) {
          if (process.env.NODE_ENV === 'production') {
            console.error(
              '[TokenRefresh] Session expired - redirecting to login'
            )
          } else {
            console.error(
              '[TokenRefresh] Token refresh failed: 401 Unauthorized'
            )
          }
          window.location.href = '/login'
          return false
        }
      }

      const errorMessage = `Token refresh failed with status ${response.status}`
      if (process.env.NODE_ENV === 'development') {
        console.error('[TokenRefresh]', errorMessage)
      } else if (process.env.NODE_ENV === 'production') {
        console.error('[TokenRefresh]', errorMessage, {
          status: response.status,
          timestamp: new Date().toISOString()
        })
      }
      return false
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error'
      if (process.env.NODE_ENV === 'development') {
        console.error('[TokenRefresh] Network error:', error)
      } else if (process.env.NODE_ENV === 'production') {
        console.error('[TokenRefresh] Network error:', {
          message: errorMessage,
          timestamp: new Date().toISOString()
        })
      }
      return false
    } finally {
      isRefreshing = false
      refreshPromise = null
    }
  })()

  return refreshPromise
}

/**
 * Start proactive token refresh timer
 * Runs a periodic interval to refresh tokens before expiry (every ~12 min by default).
 * Also refreshes when tab becomes visible (handles browser throttling of background tabs).
 */
export function startTokenRefreshTimer(): void {
  stopTokenRefreshTimer()
  refreshTimer = setInterval(() => {
    if (!document.hidden) {
      triggerTokenRefresh(false).catch(() => {
        // Silently handle - will retry on next interval
      })
    }
  }, TOKEN_REFRESH_INTERVAL)
}

/**
 * Stop the token refresh timer
 */
export function stopTokenRefreshTimer(): void {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }
}

/**
 * Stop token refresh system and mark as logged out
 * Call this when user explicitly logs out
 */
export function stopTokenRefreshOnLogout(): void {
  isLoggedOut = true
  stopTokenRefreshTimer()
  isRefreshing = false
  refreshPromise = null
  lastRefreshTime = null
  refreshCount = 0 // Reset count on logout
}

/**
 * Get token refresh statistics for debugging
 * Used by TokenRefreshDebugger component
 */
export function getTokenRefreshStats() {
  const nextRefreshTime = lastRefreshTime
    ? lastRefreshTime + TOKEN_REFRESH_INTERVAL
    : null

  return {
    refreshCount,
    lastRefreshTime,
    nextRefreshTime,
    refreshInterval: TOKEN_REFRESH_INTERVAL,
    tokenExpiryTime: TOKEN_EXPIRY_TIME,
    isRefreshing,
    isLoggedOut
  }
}

/**
 * Manually trigger a token refresh
 * Useful when you know a token might be expiring soon
 * @param force - If true, bypasses the minimum refresh interval check
 */
export async function triggerTokenRefresh(
  force: boolean = false
): Promise<boolean> {
  // Prevent too frequent refreshes (unless forced)
  if (!force) {
    const now = Date.now()
    if (lastRefreshTime && now - lastRefreshTime < MIN_REFRESH_INTERVAL) {
      return true // Assume tokens are still valid
    }
  }

  return await refreshTokens()
}

/**
 * Check if token is still valid (not expiring soon)
 * Returns true if token is valid for at least 5 more minutes
 */
async function isTokenStillValid(): Promise<boolean> {
  try {
    // Check if we have a valid token in localStorage/cookies
    // If token was refreshed recently (within last 5 minutes), it's still valid
    if (lastRefreshTime) {
      const timeSinceRefresh = Date.now() - lastRefreshTime
      const MIN_VALID_TIME = 5 * 60 * 1000 // 5 minutes
      if (timeSinceRefresh < MIN_VALID_TIME) {
        return true // Token was refreshed recently, still valid
      }
    }
    return false
  } catch {
    return false // If we can't check, assume we need to refresh
  }
}

/**
 * Check and refresh token if needed on page load or visibility change.
 * Refreshes proactively when tab becomes visible (handles sleep/wake, long background periods).
 */
export async function ensureTokenValid(): Promise<boolean> {
  return triggerTokenRefresh(true)
}

/**
 * Cleanup function to remove all event listeners
 */
export function cleanupTokenRefresh(): void {
  // Remove event listeners if they exist
  if (visibilityChangeHandler) {
    document.removeEventListener('visibilitychange', visibilityChangeHandler)
    visibilityChangeHandler = null
  }

  if (focusHandler) {
    window.removeEventListener('focus', focusHandler)
    focusHandler = null
  }

  if (loadHandler) {
    window.removeEventListener('load', loadHandler)
    loadHandler = null
  }

  if (beforeunloadHandler) {
    window.removeEventListener('beforeunload', beforeunloadHandler)
    beforeunloadHandler = null
  }

  // Stop the timer
  stopTokenRefreshTimer()
}

/**
 * Initialize token refresh system
 * Call this when the app loads or user logs in
 * @returns Cleanup function to remove event listeners
 */
export function initializeTokenRefresh(): (() => void) | undefined {
  // Cleanup any existing listeners first (in case of re-initialization)
  cleanupTokenRefresh()

  // Reset logout flag when initializing (user is logging in)
  isLoggedOut = false

  // Start the refresh timer first (this handles periodic refreshes)
  startTokenRefreshTimer()

  // Don't call ensureTokenValid() immediately here - it will be called once on page load below
  // This prevents duplicate calls on initialization

  // Combined handler for visibilitychange and focus events
  // Use force=false to respect MIN_REFRESH_INTERVAL (5 min) - prevents:
  // - Logout when switching tabs (rapid refresh can cause token conflicts / 401)
  // - Multiple tabs racing to refresh and invalidating each other's tokens
  // - Hammering the refresh endpoint on every tab switch
  const combinedVisibilityFocusHandler = () => {
    if (document.hidden) return
    const now = Date.now()
    if (now - lastEventTime < EVENT_COALESCE_MS) return // Coalesce visibility+focus
    lastEventTime = now
    triggerTokenRefresh(false).catch(() => {
      // Silently handle - will retry on next interval or next visibility
    })
  }

  // Refresh on visibility change (when user comes back to tab or system wakes up)
  // This is critical for handling sleep/wake scenarios
  visibilityChangeHandler = combinedVisibilityFocusHandler
  document.addEventListener('visibilitychange', visibilityChangeHandler)

  // Use same handler for focus to prevent duplicate calls
  // visibilitychange and focus fire together on tab switch
  focusHandler = combinedVisibilityFocusHandler
  window.addEventListener('focus', focusHandler)

  // SINGLE refresh on page load - ensure we only call once
  // Use a flag to prevent multiple calls even if both conditions are met
  let hasCalledInitialRefresh = false

  const callInitialRefresh = () => {
    if (!hasCalledInitialRefresh) {
      hasCalledInitialRefresh = true
      ensureTokenValid().catch(() => {
        // Silently handle
      })
    }
  }

  if (document.readyState === 'complete') {
    // Page already loaded - refresh after small delay to ensure all initialization is complete
    // This prevents race conditions with other initialization code
    setTimeout(callInitialRefresh, 100)
  } else {
    // Wait for page to load, then refresh once
    loadHandler = () => {
      callInitialRefresh()
    }
    window.addEventListener('load', loadHandler, { once: true }) // Use once: true to prevent multiple calls
  }

  // Cleanup before page unload
  beforeunloadHandler = () => {
    stopTokenRefreshTimer()
  }
  window.addEventListener('beforeunload', beforeunloadHandler)

  // Return cleanup function
  return cleanupTokenRefresh
}
