import { fetcher } from '@/lib/server'
import { eventDuration } from '@/app/(app)/(dashboard-pages)/my-schedule/_components/FilterDropdown'

export const fetchAllEvents = async (duration: eventDuration) => {
  const response = await fetcher(
    `/meetings/meeting-event?meetingEventDuration=${duration}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const fetchOrgSettings = async (id: number) => {
  const response = await fetcher(`/meetings/schedule/settings/${id}`, {
    method: 'GET'
  })

  // console.log('Org settings response:', response)
  return response
}
export const createEvent = async (payload: any) => {
  const response = await fetcher(`/meetings/google-meet/create`, {
    method: 'POST',
    data: payload
  })

  return response
}
export const changeSetting = async (payload: any) => {
  const response = await fetcher(`/meetings/schedule/settings`, {
    method: 'PUT',
    data: payload
  })

  return response
}
