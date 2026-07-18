import { NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  const body = await req.json()
  const { hubspotApiKey } = body

  try {
    const response = await fetch(
      'https://api.hubapi.com/contacts/v1/lists/all/contacts/all',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${hubspotApiKey}`
        }
        // body: JSON.stringify(sendData)
      }
    )

    if (!response?.ok) {
      console.log('contacts/v1/lists/all/contacts/all;:::::', response)
      throw new Error('FAILED TO CREATE CONTACT')
    }

    const data = await response.json()

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    // console.error('FAILED TO CREATE CONTACT', error)
    return NextResponse.error()
  }
}
