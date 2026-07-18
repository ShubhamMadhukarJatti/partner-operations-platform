'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Legacy route: /partner-portal/partner-mapping (no vendorOrgId).
 * Redirects to partner-mapping/{vendorOrgId} from session, or to login.
 */
export default function PartnerPortalPartnerMappingRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = sessionStorage.getItem('partnerPortalOrgId')
    if (stored) {
      router.replace(`/partner-portal/partner-mapping/${stored}`)
      return
    }
    router.replace('/partner-portal/login')
  }, [router])

  return null
}
