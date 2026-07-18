'use client'

import { RootState } from '@/redux/store'
import { fetchPartnerReport } from '@/services/partner-match'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

/** Kept separate from `partner-match.ts` so pages do not pull in unrelated hooks / UI (avoids broken client chunks). */
export const useGetPartnerReport = (
  partnerId: number | null,
  type: string | null
) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useQuery({
    queryKey: ['get-partner-persona', partnerId, type],
    queryFn: async () =>
      await fetchPartnerReport(organization?.id, partnerId, type),
    enabled: !!(organization?.id && partnerId && type),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}
