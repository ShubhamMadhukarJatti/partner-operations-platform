'use server'

import { fetcher } from '@/lib/server'

export const getMeetings = async (currentId: number, otherId: number) => {
  const res = await fetcher<any>(
    `/meetings/schedule?organizationId=${currentId}&scheduledWith=${otherId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  return res
}

export const getOrganizationAvailability = async (organizationId: number) => {
  try {
    const availability = await fetcher<any>(
      `/organization/availability?organizationId=${organizationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return availability
  } catch (error) {
    console.error('Error fetching organization availability:', error)
    throw error
  }
}

export const setMeetingsAvailability = async (data: any) => {
  try {
    const result = await fetcher<any>('/organization/availability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data
    })

    console.log(result, `here is the result`)
    return result
  } catch (error) {
    console.error('Error setting meetings availability:', error)
    throw error
  }
}
