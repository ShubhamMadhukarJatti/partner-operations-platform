import { fetcher } from '@/lib/server'

export const fetchSwaggerEndpoints = async (url: string) => {
  if (!url) return
  try {
    const response = await fetch('/api/fetch-swagger-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.statusText}`)
    }

    const data = await response.json()

    return data.data
  } catch (error) {
    throw new Error(
      'Failed to fetch swagger endpoints. Make sure the URL is publicly accessible.'
    )
  }
}

export const fetchPostmanCollection = async (url: string) => {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch collection: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(
      'Failed to fetch Postman collection. Make sure the URL is publicly accessible.'
    )
  }
}

export const fetchPartnershipIntegrations = async (organizationId: number) => {
  const response = await fetcher(
    `/partnership-integration?organizationId=${organizationId}`,
    {
      method: 'GET'
    }
  )

  return response
}
