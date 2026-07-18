'use client'

import React, { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { getCookie } from 'cookies-next'

import {
  initializeTokenRefresh,
  stopTokenRefreshTimer
} from '@/lib/auth/token-refresh'

export default function PartnerCourseLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()

  // Initialize token refresh system for partner-course routes
  // This prevents automatic logout when tokens expire
  useEffect(() => {
    // Only initialize token refresh on protected routes (dashboard)
    // Skip on login/otp-verify pages
    const isProtectedRoute =
      pathname?.startsWith('/partner-course/dashboard') ?? false

    if (isProtectedRoute) {
      // Check if user has access token
      const accessToken = getCookie('accessToken')

      if (accessToken) {
        // Start proactive token refresh immediately
        // This ensures tokens are refreshed on page load, handling sleep/wake scenarios
        // The token refresh system will handle token validation and refresh automatically
        const cleanup = initializeTokenRefresh()

        // Cleanup on unmount
        return () => {
          if (cleanup) {
            cleanup()
          }
          stopTokenRefreshTimer()
        }
      }
      // Note: If no token, middleware will handle redirect to login
      // We don't redirect here to avoid hydration issues
    }
  }, [pathname])

  return <>{children}</>
}
