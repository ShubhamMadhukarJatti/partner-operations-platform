import { NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const authHeader = req.headers.get('authorization')
    const { user } = await getServerUser()

    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      )
    }

    // Validate required fields
    const { organizationId, refreshToken, integrationType, isConnected } = body
    const userId = body.userId ?? user?.uid ?? null

    if (!organizationId || !refreshToken || !integrationType) {
      return NextResponse.json(
        {
          message:
            'Missing required fields: organizationId, refreshToken, integrationType'
        },
        { status: 400 }
      )
    }

    console.log('Creating integration:', {
      organizationId,
      integrationType,
      userId: userId ?? 'Not provided'
    })

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SHARKDOM_API_URL}/organization/integration`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authHeader
        },
        body: JSON.stringify({
          organizationId,
          refreshToken,
          integrationType,
          isConnected: isConnected ?? true,
          userId
        })
      }
    )

    if (!response?.ok) {
      const errorText = await response?.text().catch(() => 'Unknown error')
      console.error('Backend integration error:', {
        status: response?.status,
        statusText: response?.statusText,
        error: errorText
      })

      return NextResponse.json(
        {
          message:
            response?.statusText || 'Failed to create organization integration',
          details: errorText
        },
        { status: response?.status || 500 }
      )
    }

    const data = await response.json()
    console.log('Integration created successfully:', data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('ORGANIZATION INTEGRATION ERROR:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
