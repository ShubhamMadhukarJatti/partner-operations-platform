import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const res = await fetch('https://auth.hyperverge.co/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      appId: process.env.HYPERVERGE_APP_ID,
      appKey: process.env.HYPERVERGE_APP_KEY,
      expiry: 300
    })
  })
  const data = await res.json()

  return NextResponse.json({ data })
}
