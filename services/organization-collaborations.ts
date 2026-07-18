import { fetcher } from '@/lib/server'

export const getAllCollaborations = async (
  status: string = 'ALL',
  page: number = 0,
  size: number = 8
) => {
  try {
    const response = await fetcher(
      `/organizationCollaboration/my-partners?status=${status}&page=${page}&size=${size}`,
      {
        method: 'GET'
      }
    )

    if (!response) {
      // Return safe default instead of throwing
      console.warn('getAllCollaborations: No response received')
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        first: true,
        last: true,
        number: page,
        size: size
      }
    }

    return response
  } catch (error: any) {
    // Log error but return safe default to prevent crashes
    console.error('getAllCollaborations error:', error)
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      first: true,
      last: true,
      number: page,
      size: size
    }
  }
}

export const getAllCollaborationsCredits = async () => {
  try {
    const response = await fetcher(
      `/organizationCollaboration/partner-details`,
      {
        method: 'GET'
      }
    )

    if (!response) {
      // Return safe default instead of throwing
      console.warn('getAllCollaborationsCredits: No response received')
      return {
        credits: {
          collaborationsLeft: 0,
          collaborationsAllocated: 0,
          aiProposalLeft: 0,
          aiProposalAllocated: 0
        }
      }
    }

    return response
  } catch (error: any) {
    // Log error but return safe default to prevent crashes
    console.error('getAllCollaborationsCredits error:', error)
    return {
      credits: {
        collaborationsLeft: 0,
        collaborationsAllocated: 0,
        aiProposalLeft: 0,
        aiProposalAllocated: 0
      }
    }
  }
}

export const getAsignSegmentData = async (id: string | number) => {
  try {
    const response = await fetcher(
      `/orgUserMapping/allByOrganizationId?id=${id}`,
      {
        method: 'GET'
      }
    )

    if (!response) {
      // Return empty array instead of throwing
      console.warn('getAsignSegmentData: No response received')
      return []
    }

    return response
  } catch (error: any) {
    // Log error but return empty array to prevent crashes
    console.error('getAsignSegmentData error:', error)
    return []
  }
}

export const getCollaborationById = async (id: string | number) => {
  const response = await fetcher(`/organizationCollaboration/id?id=${id}`, {
    method: 'GET'
  })

  if (!response) {
    throw new Error('Failed to fetch collaboration')
  }

  return response
}

interface CreateGroupParams {
  organizationId: number | undefined
  organizationCollaborationId: number[] | undefined
  category: string
}

export const createCollaborationGroup = async (params: CreateGroupParams) => {
  const response = await fetcher(
    '/organizationCollaboration/collaboration-category',
    {
      method: 'POST',
      data: params
    }
  )

  if (!response) {
    throw new Error('Failed to create collaboration group')
  }

  return response
}
