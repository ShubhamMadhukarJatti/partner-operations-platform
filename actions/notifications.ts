'use server'

import { fetcher, getServerUser } from '@/lib/server'

interface NotificationPayload {
  notificationType: string // The type of notification, e.g., 'Persona Created'
  method: 'email' | 'inApp' // The method of notification (email or in-app)
}

// Subscribe to a specific notification type
export async function subscribeNotification(payload: NotificationPayload) {
  await getServerUser()

  try {
    const data = await fetcher<any>('/notification/subscribe', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        notificationType: payload.notificationType,
        method: payload.method
      }
    })

    return data // return the data to be used in the frontend
  } catch (error) {
    console.error('Error subscribing to notification', error)
    throw new Error('Something went wrong, please try again.')
  }
}

// Unsubscribe from a specific notification type
export async function unsubscribeNotification(payload: NotificationPayload) {
  await getServerUser()

  try {
    const data = await fetcher<any>('/notification/unsubscribe', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        notificationType: payload.notificationType,
        method: payload.method
      }
    })

    return data // return the data to be used in the frontend
  } catch (error) {
    console.error('Error unsubscribing from notification', error)
    throw new Error('Something went wrong, please try again.')
  }
}
