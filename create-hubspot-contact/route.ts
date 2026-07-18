import { NextResponse } from 'next/server'

export async function POST(req: Request, res: Response) {
  const body = await req.json()
  const authHeader = req.headers.get('authorization')
  const sendData = body
  console.log(sendData)

  try {
    const response = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts/batch/create',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader ?? ''
        },
        body: JSON.stringify(sendData)
      }
    )

    if (!response?.ok) {
      // console.log('contacts;:::::', response)
      if (response.status === 409 && response?.statusText === 'Conflict') {
        return NextResponse.json(
          {
            message: 'The data is Conflicting',
            conflictData: sendData
          },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { message: response?.statusText },
        { status: response?.status }
      )
    }

    const sCodes = [204, 201, 202, 200]
    if (sCodes?.includes(response?.status)) {
      return NextResponse.json(
        {
          success: true,
          message: 'batch contact added successfully'
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error('FAILED TO CREATE CONTACT', error)
    return NextResponse.error()
  }
}
