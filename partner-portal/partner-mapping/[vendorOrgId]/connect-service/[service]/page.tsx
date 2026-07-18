'use client'

import { useParams } from 'next/navigation'

import PartnerPortalConnectServicePage from '../../../connect-service/[service]/page'

export default function PartnerPortalConnectServiceWithOrgPage() {
  const params = useParams()
  const vendorOrgId = params?.vendorOrgId as string | undefined
  const service = params?.service as string | undefined

  return (
    <PartnerPortalConnectServicePage
      params={{
        service: service || 'google-sheets',
        vendorOrgId
      }}
    />
  )
}
