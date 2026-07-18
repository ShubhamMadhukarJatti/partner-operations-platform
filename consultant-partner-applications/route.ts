import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()

  const apiBaseUrl =
    process.env.SHARKDOM_API_URL || process.env.NEXT_PUBLIC_SHARKDOM_API_URL

  if (!apiBaseUrl) {
    return NextResponse.json(
      { error: 'API URL not configured' },
      { status: 500 }
    )
  }

  // Backend swagger indicates the controller path is under `/api`.
  const url = `${apiBaseUrl.replace(/\/$/, '')}/api/consultant-partner-applications`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: '*/*'
      },
      body: JSON.stringify(body)
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      const d = data as {
        message?: string
        error?: string
        errorMessage?: string
      }
      return NextResponse.json(
        {
          error: d?.errorMessage || d?.message || d?.error || 'Failed'
        },
        { status: response.status }
      )
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error('CONSULTANT PARTNER APPLICATION ERROR:', error)
    return NextResponse.error()
  }
}
