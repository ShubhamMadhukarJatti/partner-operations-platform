import { fetcher, getServerUser } from '@/lib/server'
import {
  GettingStartedOverviewEnvelope,
  GettingStartedOverviewResponse,
  GettingStartedStatusResponse
} from '@/app/(app)/(dashboard-pages)/getting-started/types'

export interface updateStatusParam {
  historyId: number
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED'
}

type CheckResponseType = {
  user_id: string
  is_continue_free_deal: boolean
  is_continue_free_partner_mapping: boolean
}

export async function getGettingStartedStatus(): Promise<GettingStartedStatusResponse | null> {
  try {
    const response = await fetcher('/api/getting-started/status')
    if (!response) {
      console.error('Failed to fetch getting started status data')
      return null
    }
    return response as GettingStartedStatusResponse
  } catch (error) {
    console.error('Error fetching getting started status data:', error)
    return null
  }
}

export async function getQuickStartOverviewData(): Promise<GettingStartedOverviewResponse | null> {
  try {
    const response = await fetcher<GettingStartedOverviewEnvelope>(
      '/api/getting-started/overview'
    )
    if (!response) {
      console.error('Failed to fetch getting started overview data')
      return null
    }

    return response.data
  } catch (error) {
    console.error('Error fetching getting started overview data:', error)
    return null
  }
}

export async function getPlaceholderPageStatus({
  placeholderPage
}: {
  placeholderPage: 'DEAL_PIPELINE' | 'PARTNER_MAPPING'
}) {
  try {
    const userData = await getServerUser()
    if (!userData?.user?.uid) {
      throw new Error('User ID is missing')
    }

    const url =
      placeholderPage === 'DEAL_PIPELINE'
        ? `/user/check/continue/free/deal/${userData.user.uid}`
        : placeholderPage === 'PARTNER_MAPPING'
          ? `/user/check/continue/free/pm/${userData.user.uid}`
          : null

    if (!url) {
      throw new Error('Invalid placeholderPage value')
    }

    const response = (await fetcher(url)) as CheckResponseType

    if (!response) {
      throw new Error(
        `No response from server while fetching ${placeholderPage} page status`
      )
    }

    return placeholderPage === 'DEAL_PIPELINE'
      ? response.is_continue_free_deal
      : response.is_continue_free_partner_mapping
  } catch (error) {
    console.error('Error in getPlaceholderPageStatus:', error)
    return false
  }
}

export async function updatePlaceholderPageStatus({
  placeholderPage
}: {
  placeholderPage: 'DEAL_PIPELINE' | 'PARTNER_MAPPING'
}) {
  try {
    const userData = await getServerUser()
    if (!userData?.user?.uid) {
      throw new Error('User ID is missing')
    }

    let url

    switch (placeholderPage) {
      case 'DEAL_PIPELINE':
        url = `/user/save/continue/free/deal/${userData.user.uid}`
        break
      case 'PARTNER_MAPPING':
        url = `/user/save/continue/free/pm/${userData.user.uid}`
        break
      default:
        throw new Error('Invalid placeholderPage value')
    }

    const response = await fetcher(url, {
      method: 'POST'
    })

    return response
  } catch (error) {
    console.error('Error in updatePlaceholderPageStatus:', error)
    throw error
  }
}

export const updateHistoryStatus = async (params: updateStatusParam) => {
  const { historyId, status } = params
  if (!historyId) throw new Error('Id is missing')
  const response = await fetcher(
    `/organizationCollaboration/${historyId}/update/status?status=${status}`,
    {
      method: 'POST'
    }
  )

  if (!response) {
    throw new Error('Failed to update status')
  }

  return response
}

export const getIsPartnerSpaceCreated = async (collaborationId: number) => {
  const response = await fetcher(
    `/organizationCollaboration/${collaborationId}/partner-space`
  )
  if (!response) {
    throw new Error('Failed to create partner space')
  }

  return response
}

export const addSignedDocument = async (
  params: { organizationCollaborationId: number } & { binaryPdf: File }
) => {
  const { organizationCollaborationId, binaryPdf } = params

  const formData = new FormData()
  formData.append('file', binaryPdf)

  const response = await fetcher(
    `/zoho/sign-document?organizationCollaborationId=${organizationCollaborationId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }
  )

  if (!response) {
    throw new Error('Failed to upload sign document')
  }

  return response
}
