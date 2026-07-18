import { fetcher } from '@/lib/server'

/** Backend uses string enums like LOW, MEDIUM, HIGH */
export type AgreedNextStepPriority = 'LOW' | 'MEDIUM' | 'HIGH'

export interface AgreedNextStep {
  id: number
  orgId: number
  title: string
  description: string
  owner: string
  priority: string
  dueDate: string
  isCompleted: boolean
  dealId?: string | null
}

export interface AgreedNextStepsPage {
  content: AgreedNextStep[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

export interface AgreedNextStepWritePayload {
  orgId: number
  title: string
  description: string
  owner: string
  priority: string
  dueDate: string
  isCompleted: boolean
  dealId?: string | null
}

export interface AgreedNextStepsListResponse {
  success: boolean
  message?: string
  data: AgreedNextStepsPage
}

export interface AgreedNextStepMutationResponse {
  success: boolean
  message?: string
  data: AgreedNextStep
}

export interface AgreedNextStepDeleteResponse {
  success: boolean
  message?: string
  data?: unknown
}

/** Items per page for workspace list (MVP: single fetch). */
export const AGREED_NEXT_STEPS_PAGE_SIZE = 50

export async function fetchAgreedNextStepsByOrg(
  orgId: number,
  options?: { page?: number; size?: number; dealId?: string | null }
): Promise<AgreedNextStepsListResponse> {
  const page = options?.page ?? 0
  const size = options?.size ?? AGREED_NEXT_STEPS_PAGE_SIZE
  const dealId = options?.dealId

  const search = new URLSearchParams({
    page: String(page),
    size: String(size)
  })

  const path = dealId
    ? `/api/account-mapping/agreed-next-steps/org/${orgId}/deal/${encodeURIComponent(dealId)}?${search}`
    : `/api/account-mapping/agreed-next-steps/org/${orgId}?${search}`

  return fetcher<AgreedNextStepsListResponse>(path, {
    method: 'GET'
  })
}

export async function createAgreedNextStep(
  payload: AgreedNextStepWritePayload
): Promise<AgreedNextStepMutationResponse> {
  return fetcher<AgreedNextStepMutationResponse>(
    `/api/account-mapping/agreed-next-steps`,
    {
      method: 'POST',
      data: payload
    }
  )
}

export async function updateAgreedNextStep(
  id: number,
  payload: AgreedNextStepWritePayload
): Promise<AgreedNextStepMutationResponse> {
  return fetcher<AgreedNextStepMutationResponse>(
    `/api/account-mapping/agreed-next-steps/${encodeURIComponent(String(id))}`,
    {
      method: 'PUT',
      data: payload
    }
  )
}

export async function deleteAgreedNextStep(
  id: number
): Promise<AgreedNextStepDeleteResponse> {
  return fetcher<AgreedNextStepDeleteResponse>(
    `/api/account-mapping/agreed-next-steps/${encodeURIComponent(String(id))}`,
    {
      method: 'DELETE'
    }
  )
}
