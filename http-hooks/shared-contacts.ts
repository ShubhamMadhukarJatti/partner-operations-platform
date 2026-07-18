'use client'

import { fetchSharedContacts } from '@/services/account-mapping-shared-contacts'
import { useQuery } from '@tanstack/react-query'

export const sharedContactsQueryKeyRoot = ['shared-contacts'] as const

export function sharedContactsQueryKey(
  partnerOrgId: number | null,
  dealId: string | null
) {
  return [...sharedContactsQueryKeyRoot, partnerOrgId, dealId] as const
}

export function useSharedContacts(
  partnerOrgId: number | null,
  dealId: string | null
) {
  return useQuery({
    queryKey: sharedContactsQueryKey(partnerOrgId, dealId),
    queryFn: async () => {
      if (!partnerOrgId || !dealId) return []
      const res = await fetchSharedContacts(partnerOrgId, dealId)
      if (!res.success) {
        throw new Error(res.message || 'Failed to fetch shared contacts')
      }
      return res.data
    },
    enabled: !!partnerOrgId && !!dealId
  })
}
