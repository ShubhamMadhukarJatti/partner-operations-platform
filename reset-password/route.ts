import { NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, res: Response) {
  const body = await req.json()
  const { token } = await getServerUser()

  const url = `https://us-central1-sharkdom-8800b.cloudfunctions.net/sendResetPasswordEmail`
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    const data = await response.text()

    if (response.ok) {
      return NextResponse.json(
        { email_sent: true, data: data },
        { status: 200 }
      )
    } else {
      return NextResponse.json(
        { email_sent: false, error: 'Error sending password reset email.' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('RESNED EMAIL ERROR:', error)
    return NextResponse.error()
  }
}
