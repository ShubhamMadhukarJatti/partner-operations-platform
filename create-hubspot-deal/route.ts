import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bearerToken, properties } = body

    if (!bearerToken) {
      return NextResponse.json(
        { error: 'Bearer token is required' },
        { status: 400 }
      )
    }

    if (!properties) {
      return NextResponse.json(
        { error: 'Properties are required' },
        { status: 400 }
      )
    }

    console.log('🚀 Creating HubSpot deal with properties:', properties)
    console.log('🔑 Using bearer token:', bearerToken.substring(0, 20) + '...')

    // Make request to HubSpot API to create deal
    const hubspotResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/deals',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${bearerToken}`
        },
        body: JSON.stringify({
          properties
        })
      }
    )

    if (!hubspotResponse.ok) {
      const errorText = await hubspotResponse.text()
      console.error('❌ HubSpot API error:', errorText)
      return NextResponse.json(
        {
          error: 'Failed to create deal in HubSpot',
          details: errorText,
          status: hubspotResponse.status
        },
        { status: hubspotResponse.status }
      )
    }

    const hubspotData = await hubspotResponse.json()
    console.log('✅ HubSpot deal created successfully:', hubspotData)

    return NextResponse.json({
      success: true,
      deal: hubspotData,
      message: 'Deal created successfully in HubSpot'
    })
  } catch (error: any) {
    console.error('❌ Error creating HubSpot deal:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    )
  }
}
