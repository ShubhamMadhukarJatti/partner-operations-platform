'use server'

import { fetcher } from '@/lib/server'

export const getChatMessages = async (id: number) => {
  const url = `/organizationCollaboration/messages/${id}`

  try {
    const data = await fetcher<any>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return data
  } catch (error) {
    console.error(`Error fetching chat messages: ${error}`)
    throw error
  }
}

export const getInbox = async (id: number) => {
  try {
    const data = await fetcher<any>(`/organization/messages/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    return data
  } catch (error) {
    console.error('There was an error!', error)
  }
}
