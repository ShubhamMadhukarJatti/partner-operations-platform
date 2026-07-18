import { NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  const hubSpotAccessToken =
    process.env.NEXT_PUBLIC_HUBSPOT_PRIVATE_APP_ACCESS_TOKEN

  const body = await req.json()
  try {
    const response = await fetch(
      `https://api.hubapi.com/crm-associations/v1/associations/create-batch`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hubSpotAccessToken}`
        },
        body: JSON.stringify(body)
      }
    )

    if (!response?.ok) {
      return NextResponse.json(
        { message: response?.statusText },
        { status: response?.status }
      )
    }

    if (response?.status === 204) {
      return NextResponse.json(
        {
          success: true,
          message: 'company and contact association done successfully'
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error('FAILED TO CREATE associations', error)
    return NextResponse.error()
  }
}
