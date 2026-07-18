import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    if (!process.env.SHARKDOM_API_URL) {
      return NextResponse.json(
        { error: 'Backend API URL not configured' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(req.url)
    const website = searchParams.get('website')

    if (!website) {
      return NextResponse.json(
        { success: false, message: 'Website parameter is required' },
        { status: 400 }
      )
    }

    const apiUrl = `${process.env.SHARKDOM_API_URL}/api/onboarding/website/check?website=${encodeURIComponent(website)}`
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { accept: 'application/hal+json' }
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Website check error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to check website',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
