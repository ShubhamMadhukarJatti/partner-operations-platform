import { useQuery } from '@tanstack/react-query'

/**
 * New flow: hooks for partner portal partner-mapping using orgId and /no/auth APIs.
 * - GET /api/no/auth/overlap/my/records/{orgId}
 * - GET /api/no/auth/report-count/{orgId} (via /api/no/auth/report-count/org/{orgId})
 * - GET /api/no/auth/report/history/{orgId} (via /api/no/auth/report/history/org/{orgId})
 * Do not use these in the old partner-mapping flow; use the new screens only.
 */

export interface ReportHistoryItem {
  organizationId: number
  yourMatrix: string
  partnerMatrix: string
  overlapCount: number
  reportCount: number
  id: number
  partnerId: number
  partnerOrganization: {
    partnerName: string
    partnerId: number
    partnerLogoUrl: string
  }
}

export interface ReportHistoryResponse {
  data: ReportHistoryItem[]
  success: boolean
  count: number
}

/** New flow: fetch overlap my records by orgId (GET /api/no/auth/overlap/my/records/{orgId}) */
export const fetchOverlapMyRecordsByOrgId = async (
  orgId: string
): Promise<any> => {
  const response = await fetch(
    `/api/no/auth/overlap/my/records/${encodeURIComponent(orgId)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }
  )
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Overlap my records API Error:', response.status, errorText)
    throw new Error(`Failed to fetch overlap my records: ${response.status}`)
  }
  return response.json()
}

export const useOverlapMyRecordsByOrgId = (orgId: string | null) => {
  return useQuery({
    queryKey: ['no-auth-overlap-my-records', orgId],
    queryFn: () => fetchOverlapMyRecordsByOrgId(orgId!),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

/** New flow: fetch report count by orgId (GET /api/no/auth/report-count/org/{orgId}). Backend may return { data: number } or { count: number }. */
export const fetchReportCountByOrgId = async (
  orgId: string
): Promise<{ count?: number; data?: number }> => {
  const response = await fetch(
    `/api/no/auth/report-count/org/${encodeURIComponent(orgId)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }
  )
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Report Count API Error:', response.status, errorText)
    throw new Error(`Failed to fetch report count: ${response.status}`)
  }
  return response.json()
}

export const useReportCountByOrgId = (orgId: string | null) => {
  return useQuery({
    queryKey: ['no-auth-report-count', orgId],
    queryFn: () => fetchReportCountByOrgId(orgId!),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

/** New flow: fetch report history by orgId (GET /api/no/auth/report/history/org/{orgId}) */
export const fetchReportHistoryByOrgId = async (
  orgId: string
): Promise<ReportHistoryResponse> => {
  const response = await fetch(
    `/api/no/auth/report/history/org/${encodeURIComponent(orgId)}`,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }
  )
  if (!response.ok) {
    const errorText = await response.text()
    console.error('Report History API Error:', response.status, errorText)
    throw new Error(`Failed to fetch report history: ${response.status}`)
  }
  return response.json()
}

export const useReportHistoryByOrgId = (orgId: string | null) => {
  return useQuery({
    queryKey: ['no-auth-report-history', orgId],
    queryFn: () => fetchReportHistoryByOrgId(orgId!),
    enabled: !!orgId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}
