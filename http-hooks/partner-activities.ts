'use client'

import {
  CreateActivityPayload,
  createPartnerActivity,
  fetchPartnerActivities
} from '@/services/account-mapping-activities'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const partnerActivityTimelineQueryKeyRoot = [
  'partner-activity-timeline'
] as const

export function partnerActivityTimelineQueryKey(
  partnerOrgId: number | null,
  dealId: string | null | undefined
) {
  return [...partnerActivityTimelineQueryKeyRoot, partnerOrgId, dealId] as const
}

export function usePartnerActivityTimeline(
  partnerOrgId: number | null,
  dealId: string | null | undefined
) {
  return useQuery({
    queryKey: partnerActivityTimelineQueryKey(partnerOrgId, dealId),
    queryFn: async () => {
      const res = await fetchPartnerActivities(partnerOrgId!, dealId!)
      if (!res.success) {
        throw new Error(
          res.message?.trim() || 'Failed to load activity timeline'
        )
      }
      return res.data
    },
    enabled: !!partnerOrgId && partnerOrgId > 0 && !!dealId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export function useCreatePartnerActivity(
  partnerOrgId: number | null,
  dealId: string | null | undefined
) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateActivityPayload) =>
      createPartnerActivity(payload),
    onSuccess: () => {
      if (partnerOrgId && dealId) {
        void queryClient.invalidateQueries({
          queryKey: partnerActivityTimelineQueryKey(partnerOrgId, dealId)
        })
      }
    }
  })
}
