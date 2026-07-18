'use server'

import { fetcher } from '@/lib/server'

export interface CompanyDetailsData {
  name: string
  incorporationDate: string | null
  website: string
  isInHousePartnership: boolean | null
  about: string | null
  aboutProductService: string | null
  productUrl?: string
}

export interface CompanyDetailsResponse {
  success: boolean
  message: string
  data: CompanyDetailsData
}

/**
 * Fetch company details
 */
export const getCompanyDetails = async (): Promise<CompanyDetailsResponse> => {
  try {
    const data = await fetcher<CompanyDetailsResponse>(
      '/api/settings/sections/get/company/details',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return data
  } catch (error) {
    console.error('Error fetching company details:', error)
    throw new Error('Failed to fetch company details')
  }
}

/**
 * Update company details
 */
export const updateCompanyDetails = async (
  payload: CompanyDetailsData
): Promise<CompanyDetailsResponse> => {
  try {
    const data = await fetcher<CompanyDetailsResponse>(
      '/api/settings/sections/update/company/details',
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
    console.error('Error updating company details:', error)
    throw new Error('Failed to update company details')
  }
}
