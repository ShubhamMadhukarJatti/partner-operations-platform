'use server'

import { fetcher } from '@/lib/server'

// update organization details
export const postPublicProfileEmail = async (payload: any) => {
  try {
    const data = await fetcher('/public-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error updating organization details')
  }
}
