'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Legacy route: /partner-portal/dashboard (no vendorOrgId).
 * Redirects to dashboard with org from session, or to login.
 */
export default function PartnerPortalDashboardRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = sessionStorage.getItem('partnerPortalOrgId')
    if (stored) {
      router.replace(`/partner-portal/dashboard/${stored}`)
      return
    }
    router.replace('/partner-portal/login')
  }, [router])

  return null
}
