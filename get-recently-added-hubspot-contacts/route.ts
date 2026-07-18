import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, res: Response) {
  const hubSpotAccessToken =
    process.env.NEXT_PUBLIC_HUBSPOT_PRIVATE_APP_ACCESS_TOKEN
  const { searchParams } = new URL(req.url)
  const count = searchParams.get('count') as string
  try {
    if (!count) {
      throw new Error('cannot proceed further...')
    }
    const response = await fetch(
      `https://api.hubapi.com/contacts/v1/lists/all/contacts/recent?count=${count}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hubSpotAccessToken}`
        }
      }
    )

    if (!response?.ok) {
      return NextResponse.json(
        { message: response?.statusText },
        { status: response?.status }
      )
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    // console.error('FAILED TO CREATE CONTACT', error)
    return NextResponse.error()
  }
}
