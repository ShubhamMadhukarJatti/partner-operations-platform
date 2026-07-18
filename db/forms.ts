import { getCurrentOrganization, Postintegrationdata } from './organization'

export const getFormsAccessToken = async (refresh_token: string) => {
  try {
    console.log('Getting Google Forms access token...')

    const payloadData = {
      grant_type: 'refresh_token',
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET ?? '',
      refresh_token
    }

    const response = await fetch(`https://oauth2.googleapis.com/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(payloadData).toString()
    })

    const tokenResponse = await response.json()
    console.log('Google Forms token response:', {
      hasAccessToken: !!tokenResponse.access_token,
      hasRefreshToken: !!tokenResponse.refresh_token,
      error: tokenResponse.error
    })

    if (tokenResponse.error) {
      throw new Error(`Google OAuth error: ${tokenResponse.error}`)
    }

    const accessToken = tokenResponse.access_token
    if (!accessToken) {
      throw new Error('No access token received from Google')
    }

    // Store new refresh token if provided
    if (tokenResponse?.refresh_token) {
      console.log('-----Google Forms: New Token Received---')

      const { id } = await getCurrentOrganization()

      const updatePayload = {
        organizationId: id,
        refreshToken: tokenResponse?.refresh_token,
        integrationType: 'G_FORM'
      }

      console.log('Storing Google Forms refresh token:', {
        organizationId: id,
        integrationType: 'G_FORM'
      })

      const res = await Postintegrationdata(JSON.stringify(updatePayload))
      console.log('-----Google Forms: Updated Postintegrationdata---', res)
    }

    return accessToken
  } catch (error) {
    console.error('Error getting Google Forms access token:', error)
    throw error
  }
}

// Function to get Google Forms data using the access token
export const getGoogleFormsData = async (
  accessToken: string,
  formId?: string
) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }

    // If formId is provided, get specific form data
    if (formId) {
      const response = await fetch(
        `https://forms.googleapis.com/v1/forms/${formId}`,
        { headers }
      )

      if (!response.ok) {
        throw new Error(`Failed to fetch form data: ${response.statusText}`)
      }

      return await response.json()
    }

    // Otherwise, get all forms
    const response = await fetch('https://forms.googleapis.com/v1/forms', {
      headers
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch forms: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting Google Forms data:', error)
    throw error
  }
}

// Function to get form responses
export const getFormResponses = async (accessToken: string, formId: string) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }

    const response = await fetch(
      `https://forms.googleapis.com/v1/forms/${formId}/responses`,
      { headers }
    )

    if (!response.ok) {
      throw new Error(`Failed to fetch form responses: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error getting form responses:', error)
    throw error
  }
}
