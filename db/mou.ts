'use server'

import { fetcher } from '@/lib/server'

export const getPendingMou = async (organizationId: number) => {
  try {
    const mous = await fetcher<any>(
      `/organizationCollaboration/pending-mous?organizationId=${organizationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return mous
  } catch (error) {
    console.error('Error fetching pending mou:', error)
    throw error
  }
}

export const getMouPdf = async (collabId: number, organizationId: number) => {
  try {
    const mousPdf = await fetcher<any>(
      `/organizationCollaboration/mou-pdf?organizationCollaborationId=${collabId}&organizationId=${organizationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return mousPdf
  } catch (error) {
    console.error('Failed to fetch pending mous pdf:', error)
    throw error
  }
}
