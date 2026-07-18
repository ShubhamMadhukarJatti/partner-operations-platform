'use server'

import { fetcher } from '@/lib/server'

export interface AddressContactData {
  address: string | null
  city: string | null
  zipCode: string | null
  state: string | null
  country: string | null
  phone: string | null
}

export interface AddressContactResponse {
  success: boolean
  message: string
  data: AddressContactData
}

/**
 * Fetch Address & Contact details
 */
export const getAddressContact = async (): Promise<AddressContactResponse> => {
  try {
    const data = await fetcher<AddressContactResponse>(
      '/api/settings/sections/get/address/contact',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return data
  } catch (error) {
    console.error('Error fetching address & contact details:', error)
    throw new Error('Failed to fetch address & contact details')
  }
}

/**
 * Update Address & Contact details
 */
export const updateAddressContact = async (
  payload: AddressContactData
): Promise<AddressContactResponse> => {
  try {
    const data = await fetcher<AddressContactResponse>(
      '/api/settings/sections/update/address/contact',
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
    console.error('Error updating address & contact details:', error)
    throw new Error('Failed to update address & contact details')
  }
}
