import { fetcher } from '@/lib/server'

export interface SharedContact {
  id: number
  name: string
  title: string
  source: 'YOUR_CRM' | 'PARTNER_CRM' | string
  relationship: string
  inCrm: boolean
  dealId: string
}

export interface SharedContactsResponse {
  success: boolean
  message?: string
  data: SharedContact[]
}

/**
 * Fetch shared contacts for a specific deal under a partner organization.
 * GET /api/account-mapping/shared-contacts/{partnerOrgId}/deal/{dealId}
 */
export async function fetchSharedContacts(
  partnerOrgId: number,
  dealId: string
): Promise<SharedContactsResponse> {
  return fetcher<SharedContactsResponse>(
    `/api/account-mapping/shared-contacts/${partnerOrgId}/deal/${encodeURIComponent(dealId)}`,
    {
      method: 'GET'
    }
  )
}
