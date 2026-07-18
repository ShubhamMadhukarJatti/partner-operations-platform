'use server'

import { fetcher, getServerUser } from '@/lib/server'

export const acceptScheduledMeeting = async (
  meetingId: number,
  timing: string
) => {
  await getServerUser()
  const response = await fetcher<string>('/meetings/schedule', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      id: meetingId,
      meetingTime: timing
    }
  })

  return response
}

type CreateMeeting = {
  senderOrganizationId: number
  receiverOrganizationId: number
  title: string
  description: string
  availability: { time: string }[]
}

type CreateGoogleMeeting = {
  senderOrganizationId: number
  receiverOrganizationId: number
  title: string
  description: string
  startDateTime: string
  endDateTime: string
}

export const createMeeting = async (body: CreateMeeting) => {
  try {
    await getServerUser()
    const res = await fetcher<any>('/meetings/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        ...body
      }
    })

    return res
  } catch (error) {
    console.error('Error creating meeting:', error)
    throw error
  }
}

export const createGoogleMeeting = async (body: CreateGoogleMeeting) => {
  try {
    await getServerUser()

    const res = await fetcher<any>('/meetings/google-meet/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        ...body
      }
    })

    return res
  } catch (error) {
    console.error('Error creating meeting:', error)
    throw error
  }
}

export const setMeetingsAvailability = async (data: any) => {
  await getServerUser()
  console.log(data, `data in server`)

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

export const rescheduleMeeting = async (body: any) => {
  try {
    await getServerUser()
    const res = await fetcher<string>('/meetings/reschedule', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        ...body
      }
    })

    return res
  } catch (error) {
    console.error('Error reschedule meeting:', error)
    throw error
  }
}
