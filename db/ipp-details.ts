'use server'

import { fetcher } from '@/lib/server'

export interface IppDetailsData {
  brandingPage: string | null
  activePartnerProgram: string | null
}

export interface IppDetailsResponse {
  success: boolean
  message: string
  data: IppDetailsData
}

/**
 * Fetch IPP details
 */
export const getIppDetails = async (): Promise<IppDetailsResponse> => {
  try {
    const data = await fetcher<IppDetailsResponse>(
      '/api/settings/sections/get/Ipp/details',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return data
  } catch (error) {
    console.error('Error fetching IPP details:', error)
    throw new Error('Failed to fetch IPP details')
  }
}

/**
 * Update IPP details
 */
export const updateIppDetails = async (
  payload: IppDetailsData
): Promise<IppDetailsResponse> => {
  try {
    const data = await fetcher<IppDetailsResponse>(
      '/api/settings/sections/update/Ipp/details',
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      }
    )

    return data
  } catch (error) {
    console.error('Error updating IPP details:', error)
    throw new Error('Failed to update IPP details')
  }
}
