import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    if (!process.env.SHARKDOM_API_URL) {
      return NextResponse.json(
        { error: 'Backend API URL not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const apiUrl = `${process.env.SHARKDOM_API_URL}/api/onboarding/start`
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Onboarding start error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to submit onboarding',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
