'use server'

import { fetcher } from '@/lib/server'

export const getPartnerAlertData = async (_token: any): Promise<any> => {
  const data: any = await fetcher<any>('/partner-alert', {
    method: 'GET'
  })

  return data
}

export const updatePartnerAlert = async (
  day: string,
  disabled: boolean
): Promise<any> => {
  try {
    const result = await fetcher<any>(
      `/partner-alert?days=${day}&disable=${disabled}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: { day, disabled }
      }
    )
    // console.log('Partner Alert Updated Successfully:', result)

    return result
  } catch (error: any) {
    console.error('Error updating partner alert:', error.message || error)
    throw new Error(
      `Error updating partner alert: ${error.message || 'Unknown error'}`
    )
  }
}
