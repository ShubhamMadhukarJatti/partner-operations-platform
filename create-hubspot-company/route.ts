import { NextResponse } from 'next/server'

async function fetchHubSpot(
  endpoint: string,
  options: RequestInit,
  accessToken: string
) {
  const HUBSPOT_BASE_URL = 'https://api.hubapi.com'
  const response = await fetch(`${HUBSPOT_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  console.log(
    'return NextResponse.json(resposeData, { status: 200 });',
    response
  )

  if (!response.ok) {
    // return response
    throw new Error(`HubSpot API error: ${response.statusText}`)
  }

  return response.json()
}

async function findCompanyByName(name: string, accessToken: string) {
  const endpoint = `/crm/v3/objects/companies/search`
  const body = {
    filterGroups: [
      {
        filters: [
          {
            propertyName: 'name',
            operator: 'EQ',
            value: name
          }
        ]
      }
    ],
    properties: ['name'],
    sorts: [
      {
        propertyName: 'name',
        direction: 'DESCENDING'
      }
    ],
    limit: 1,
    after: 0,
    query: name
  }

  const response = await fetchHubSpot(
    endpoint,
    {
      method: 'POST',
      body: JSON.stringify(body)
    },
    accessToken
  )

  console.log('domain', 'name', 'description;', response)

  return response
}

export async function POST(req: Request, res: Response) {
  const body = await req.json()
  const { data: sendData, hubSpotApiKey } = body
  try {
    // Check for existing company by domain
    // let company = await findCompanyByName(name, hubSpotAccessToken as string)
    // if (company) {
    //   console.log('company', company);
    //   return NextResponse.json(
    //     company,
    //     { status: 200 }
    //   )
    // }
    // if (!company) {
    const response = await fetch(
      `https://api.hubapi.com/companies/v2/companies`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hubSpotApiKey}`
        },
        body: JSON.stringify(sendData)
      }
    )

    if (!response?.ok) {
      return NextResponse.json(
        { message: response?.statusText },
        { status: response?.status }
      )
    }

    const resposeData = await response.json()

    return NextResponse.json(resposeData, { status: 200 })
    // }
    // return NextResponse.json(
    //   { message: 'company already created ' },
    //   { status: 200 }
    // )
  } catch (error: any) {
    console.error('FAILED TO CREATE companies', error)
    return NextResponse.error()
  }
}
