'use server'

import {
  CollabarationResponse,
  CollaborationResponseUpdated,
  CollaborationType,
  OrganizationType
} from '@/types'

import { getCurrentOrganization } from '@/lib/db/organization'
import { fetcher, getServerUser } from '@/lib/server'

export const getCollaborationByTwoOrgs = async (
  org1: OrganizationType,
  org2: OrganizationType
): Promise<CollaborationType | null> => {
  try {
    const collaboration = await fetcher<CollaborationType>(
      `/organizationCollaboration/betweenTwoOrganizationsByTheirIds?firstOrganizationId=${org1.id}&secondOrganizationId=${org2.id}`
    )
    return collaboration || null
  } catch (error) {
    console.error('Error getting collaboration by two orgs:', error)
    return null
  }
}

// IMPROVE Currently we only get 20 collaborations at a time so maybe we should add pagination
export const getCollaborationsBySender = async (): Promise<
  CollaborationType[]
> => {
  try {
    const org = await getCurrentOrganization()
    const collaborations = await fetcher<CollabarationResponse>(
      `/organizationCollaboration/senderOrganizationId?senderOrganizationId=${org.id}`
    )

    return Array.isArray(collaborations?.content) &&
      collaborations?.content?.length > 0
      ? collaborations.content
      : []
  } catch (error) {
    console.error('Error getting collaborations by sender:', error)
    return []
  }
}

export const getCollaborationsByReceiver = async (): Promise<
  CollaborationType[]
> => {
  try {
    const org = await getCurrentOrganization()
    const collaborations = await fetcher<CollabarationResponse>(
      `/organizationCollaboration/receiverOrganizationId?receiverOrganizationId=${org.id}`
    )

    return collaborations?.content || []
  } catch (error) {
    console.error('Error getting collaborations by receiver:', error)
    return []
  }
}

export const getAllCollaborations = async (): Promise<any> => {
  try {
    const { id } = await getCurrentOrganization()

    const collaborations = await fetcher<CollaborationResponseUpdated>(
      `/organizationCollaboration/partner-details?organizationId=${id}`
    )

    return [collaborations?.partners?.content || [], collaborations?.credits]
  } catch (error) {
    console.error('Error fetching all collaborations:', error)
    return [[], null]
  }
}

export const getCollaborationDetailsById = async (
  id: string | number
): Promise<any | null> => {
  try {
    const collaboration = await fetcher<any>(
      `/organizationCollaboration/id?id=${id}`
    )

    return collaboration || null
  } catch (error) {
    console.error('Error getting collaboration details by id:', error)
    return null
  }
}

export const getTimeline = async (id: string | number): Promise<any | null> => {
  try {
    const timeline = await fetcher<any>(
      `/organizationCollaboration/timeline?orgCollaborationId=${id}`
    )

    return timeline || null
  } catch (error) {
    console.error('Error getting timeline details:', error)
    return null
  }
}

export const getOrganizationCollaborationHistory = async (
  id: string | number
): Promise<any | null> => {
  try {
    const history = await fetcher<any>(
      `/organizationCollaboration/${id}/history`
    )
    return history || null
  } catch (error) {
    console.error('Error getting history details:', error)
    return null
  }
}
export const getDocuments = async (
  id: string | number
): Promise<any | null> => {
  try {
    const documents = await fetcher<any>(
      `/organizationCollaboration/documents?organizationIdCollaborationId=${id}`
    )
    return documents
  } catch (error) {
    console.error('Error getting documents:', error)
    return null
  }
}

export const notifyPersonaMatch = async (
  senderId: string | number,
  notifyId: string | number
): Promise<any | null> => {
  try {
    const result = await fetcher<any>(`/persona/notify`, {
      method: 'POST',
      data: JSON.stringify({ senderId, notifyId }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return result || null
  } catch (error) {
    console.error('Error notifying persona match:', error)
    return null
  }
}
