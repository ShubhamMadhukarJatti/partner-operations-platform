const client_id = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_ID
const clientSecret = process.env.NEXT_PUBLIC_HUBSPOT_CLIENT_SECRET
const redirectUri = process.env.NEXT_PUBLIC_HUBSPOT_REDIRECTION_URL

export const handleHubspotIntegration = async (hubcode: any) => {
  const tokenUrl = 'https://api.hubapi.com/oauth/v1/token'

  const payload = `grant_type=authorization_code&client_id=${encodeURIComponent(client_id || '')}&client_secret=${encodeURIComponent(clientSecret || '')}&redirect_uri=${encodeURIComponent(redirectUri || '')}&code=${encodeURIComponent(hubcode || '')}`

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: payload
    })

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (e) {
    console.log(e)
    return 'Error--->'
  }
}

export const getHubspotToken = async (refreshToken: string | null) => {
  try {
    const tokenUrl = 'https://api.hubapi.com/oauth/v1/token'

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=refresh_token&client_id=${client_id}&client_secret=${clientSecret}&redirect_uri=${redirectUri}&refresh_token=${refreshToken}`
    })

    return await response.json()
  } catch (e) {
    return null
  }
}

export const getHubspotContact = async (refreshToken: string | null) => {
  const contactURL =
    'https://api.hubapi.com/crm/v3/objects/contacts?properties=website'

  try {
    const tokens = await getHubspotToken(refreshToken)

    const response = await fetch(contactURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${tokens.access_token}`
      }
    })

    if (!response.ok) {
      console.log('🚀🚀🚀 getHubspotContact => response :: ', response)
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (e: any) {
    console.log('🚀🚀🚀 getHubspotContact => eMessage :: ', e.message)
    return []
  }
}
