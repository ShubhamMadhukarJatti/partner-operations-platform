import axios from 'axios'

export interface PersonaApiResponse {
  success: boolean
  message?: string
  data?: any
}

/**
 * Send a reminder notification to an organization
 */
export const sendPersonaReminder = async (
  senderId: number,
  notifyId: number
): Promise<PersonaApiResponse> => {
  try {
    const response = await axios.post(
      '/api/persona/notify',
      {},
      {
        params: {
          senderId,
          notifyId
        }
      }
    )

    return {
      success: true,
      data: response.data,
      message: 'Reminder sent successfully'
    }
  } catch (error) {
    console.error('Error sending reminder:', error)
    return {
      success: false,
      message: 'Failed to send reminder'
    }
  }
}

/**
 * Send a request to an organization to complete their profile
 */
export const requestOrganizationProfile = async (
  senderId: number,
  notifyId: number
): Promise<PersonaApiResponse> => {
  try {
    const response = await axios.post(
      '/api/persona/notify',
      {},
      {
        params: {
          senderId,
          notifyId
        }
      }
    )

    return {
      success: true,
      data: response.data,
      message: 'Request sent successfully'
    }
  } catch (error) {
    console.error('Error sending request:', error)
    return {
      success: false,
      message: 'Failed to send request'
    }
  }
}
