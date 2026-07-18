import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, res: Response) {
  const body = await req.json()
  const { searchParams } = new URL(req.url)
  const accountServer = searchParams.get('accounts-server')!
  const authHeader = req.headers.get('authorization')
  const sendData = body
  console.log(sendData)

  const url =
    accountServer === 'https://accounts.zoho.com'
      ? 'https://www.zohoapis.com/crm/v2/Leads/upsert'
      : 'https://www.zohoapis.in/crm/v2/Leads/upsert'

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader ?? ''
      },
      body: JSON.stringify(sendData)
    })

    console.log(response)

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
      throw new Error('Failed to Sync Leads')
    }

    const sCodes = [204, 201, 202, 200]
    if (sCodes?.includes(response?.status)) {
      return NextResponse.json(
        {
          success: true,
          message: 'Leads Synced to Zoho'
        },
        { status: 200 }
      )
    }
  } catch (error: any) {
    console.error('FAILED TO SYNC LEADS', error)
    console.log(error)
    return NextResponse.error()
  }
}
