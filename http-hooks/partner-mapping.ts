import { useMutation, useQuery } from '@tanstack/react-query'

export interface PartnerMappingOverviewResponse {
  report_generated: number
  total_overlaps_rate: number
  my_partners: Array<{
    organizationName: string
    aCustomerOverlapCount: number
    overlapRate: number
    aOpportunityOverlapCount: number
    partnerOrganizationId: number
    logoUrl: string
    aProspectOverlapCount: number
    dataSourceConnected?: boolean // Optional field that may be present in some responses
  }>
  organization_id: number
  total_overlaps: number
  active_partners: number
}

const fetchPartnerMappingOverview =
  async (): Promise<PartnerMappingOverviewResponse> => {
    const response = await fetch('/api/partner-mapping/overview', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies for authentication
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        'Partner Mapping Overview API Error:',
        response.status,
        errorText
      )
      throw new Error(
        `Failed to fetch partner mapping overview: ${response.status}`
      )
    }

    return response.json()
  }

export interface PartnerMappingComparisonResponse {
  my_partners_data: Array<{
    organizationName: string
    dataSourceConnected: boolean
    report: string // JSON string containing the data
    partnerOrganizationId: number
    logoUrl: string
  }>
  organization_id: number
}

const fetchPartnerMappingComparison = async (
  type: string
): Promise<PartnerMappingComparisonResponse> => {
  const response = await fetch(
    `/api/partner-mapping/comparison?typeCombination=${type}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Include cookies for authentication
    }
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error(
      'Partner Mapping Comparison API Error:',
      response.status,
      errorText
    )
    throw new Error(
      `Failed to fetch partner mapping comparison: ${response.status}`
    )
  }

  return response.json()
}

export const usePartnerMappingOverview = () => {
  return useQuery({
    queryKey: ['partner-mapping-overview'],
    queryFn: fetchPartnerMappingOverview,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

export interface SaveReportPayload {
  organization_id: number
  your_matrix: string
  partner_matrix: string
  overlap_count: number
  partner_id: number
  report_count: number
}

const savePartnerMappingReport = async (
  payload: SaveReportPayload
): Promise<any> => {
  const response = await fetch('/api/partner-mapping/report/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include', // Include cookies for authentication
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error(
      'Save Partner Mapping Report API Error:',
      response.status,
      errorText
    )
    throw new Error(`Failed to save partner mapping report: ${response.status}`)
  }

  return response.json()
}

export const usePartnerMappingComparison = (
  type: string,
  enabled: boolean = false
) => {
  return useQuery({
    queryKey: ['partner-mapping-comparison', type],
    queryFn: () => fetchPartnerMappingComparison(type),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

export const useSavePartnerMappingReport = () => {
  return useMutation({
    mutationFn: savePartnerMappingReport,
    onSuccess: () => {
      // You can add success handling here
      console.log('Report saved successfully')
    },
    onError: (error) => {
      console.error('Failed to save report:', error)
    }
  })
}

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

// Uses session user; backend is proxied to GET /api/no/auth/report/history/{userId}
const fetchReportHistory = async (): Promise<ReportHistoryResponse> => {
  const response = await fetch('/api/partner-mapping/report/history', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include' // Include cookies for authentication
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Report History API Error:', response.status, errorText)
    throw new Error(`Failed to fetch report history: ${response.status}`)
  }

  return response.json()
}

export const useReportHistory = () => {
  return useQuery({
    queryKey: ['report-history'],
    queryFn: fetchReportHistory,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

/** New flow: fetch report history by userId (GET /api/no/auth/report/history/{userId}) */
export const fetchReportHistoryByUserId = async (
  userId: string
): Promise<ReportHistoryResponse> => {
  const response = await fetch(
    `/api/no/auth/report/history/${encodeURIComponent(userId)}`,
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

export const useReportHistoryByUserId = (userId: string | null) => {
  return useQuery({
    queryKey: ['report-history', userId],
    queryFn: () => fetchReportHistoryByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

/** New flow: fetch report count by userId (GET /api/no/auth/report-count/{userId}). Backend may return { data: number } or { count: number }. */
export const fetchReportCountByUserId = async (
  userId: string
): Promise<{ count?: number; data?: number }> => {
  const response = await fetch(
    `/api/no/auth/report-count/${encodeURIComponent(userId)}`,
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

export const useReportCountByUserId = (userId: string | null) => {
  return useQuery({
    queryKey: ['report-count', userId],
    queryFn: () => fetchReportCountByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

/** Partner portal: fetch overlap my records by userId (GET /api/no/auth/overlap/my/records/{userId}) */
export const fetchOverlapMyRecordsByUserId = async (
  userId: string
): Promise<any> => {
  const response = await fetch(
    `/api/no/auth/overlap/my/records/${encodeURIComponent(userId)}`,
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

export const useOverlapMyRecordsByUserId = (userId: string | null) => {
  return useQuery({
    queryKey: ['no-auth-overlap-my-records', userId],
    queryFn: () => fetchOverlapMyRecordsByUserId(userId!),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}
