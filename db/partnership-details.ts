'use server'

import { fetcher } from '@/lib/server'

export interface PreferredPartnershipType {
  id?: number
  creationTimestamp?: string
  lastUpdatedTimestamp?: string
  area: string
}

export interface PreferredSector {
  id?: number
  creationTimestamp?: string
  lastUpdatedTimestamp?: string
  area: string
}

export interface PartnershipDetailsData {
  registrationType: string | null
  partnershipTeamSize: string | null
  goalsToUseSharkdom: string[]
  preferredPartnershipTypes: PreferredPartnershipType[]
  regionToPartnerWith: string[]
  targetMarket: string | null
  companyType: string | null
  onboardedPartners: string | null
  preferredSectors: PreferredSector[]
}

export interface PartnershipDetailsResponse {
  success: boolean
  message: string
  data: PartnershipDetailsData
}

/**
 * Fetch partnership details
 */
export const getPartnershipDetails =
  async (): Promise<PartnershipDetailsResponse> => {
    try {
      const data = await fetcher<PartnershipDetailsResponse>(
        '/api/settings/sections/get/partnership/details',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      return data
    } catch (error) {
      console.error('Error fetching partnership details:', error)
      throw new Error('Failed to fetch partnership details')
    }
  }

/**
 * Update partnership details
 */
export const updatePartnershipDetails = async (
  payload: PartnershipDetailsData
): Promise<PartnershipDetailsResponse> => {
  try {
    const data = await fetcher<PartnershipDetailsResponse>(
      '/api/settings/sections/update/partnership/details',
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
    console.error('Error updating partnership details:', error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to update partnership details')
  }
}
