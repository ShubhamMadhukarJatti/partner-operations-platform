'use client'

import { useParams } from 'next/navigation'

import { PartnerPortalFieldMappingContent } from '../../field-mapping/PartnerPortalFieldMappingContent'

export default function PartnerPortalFieldMappingWithOrgPage() {
  const params = useParams()
  const vendorOrgId = params?.vendorOrgId as string | undefined
  const base = vendorOrgId
    ? `/partner-portal/partner-mapping/${vendorOrgId}`
    : '/partner-portal/partner-mapping'

  return (
    <PartnerPortalFieldMappingContent backBasePath={base} redirectTo={base} />
  )
}
