'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { PartnerPortalFieldMappingContent } from './PartnerPortalFieldMappingContent'

const PARTNER_MAPPING_BASE = '/partner-portal/partner-mapping'

export default function PartnerPortalFieldMappingPage() {
  const router = useRouter()

  // If vendorOrgId is in sessionStorage but not in URL, update URL so it stays in sync
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = sessionStorage.getItem('partnerPortalOrgId')
    if (stored) {
      const search = window.location.search || ''
      router.replace(
        `/partner-portal/partner-mapping/${stored}/field-mapping${search}`
      )
    }
  }, [router])

  return (
    <PartnerPortalFieldMappingContent
      backBasePath={PARTNER_MAPPING_BASE}
      redirectTo={PARTNER_MAPPING_BASE}
    />
  )
}
