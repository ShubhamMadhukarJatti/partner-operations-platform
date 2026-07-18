import { fetcher } from '@/lib/server'

export interface PartnerActivityItem {
  title: string
  description: string
  date: string
  actor: string
  type: string
}

export interface PartnerActivitiesResponse {
  success: boolean
  message?: string
  data: PartnerActivityItem[]
}

export async function fetchPartnerActivities(
  partnerOrgId: number,
  dealId: string
): Promise<PartnerActivitiesResponse> {
  return fetcher<PartnerActivitiesResponse>(
    `/api/account-mapping/activities/${encodeURIComponent(String(partnerOrgId))}/deal/${encodeURIComponent(dealId)}`,
    { method: 'GET' }
  )
}

export interface CreateActivityPayload {
  partnerOrgId: number
  title: string
  description: string
  activityType: string
  userName: string
  dealId: string
}

export interface CreateActivityResponse {
  success: boolean
  message: string
  data: string
}

export async function createPartnerActivity(
  payload: CreateActivityPayload
): Promise<CreateActivityResponse> {
  return fetcher<CreateActivityResponse>('/api/account-mapping/activities', {
    method: 'POST',
    data: payload
  })
}
