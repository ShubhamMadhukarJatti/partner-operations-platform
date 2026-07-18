'use server'

import { fetcher } from '@/lib/server'

export const unsubscribeEmail = async (email: string) => {
  try {
    const data = await fetcher(
      `/organization/emailUnsubscribe?email=${email}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    return data
  } catch (error) {
    console.error('Error unsubscribe:', error)
    throw error
  }
}
