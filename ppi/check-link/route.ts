import { NextResponse } from 'next/server'

import { getServerUser } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const { token } = await getServerUser()
    const body = await req.json()
    const { formId, accessToken } = body

    if (!formId || !accessToken) {
      return NextResponse.json(
        { error: 'Form ID and access token are required' },
        { status: 400 }
      )
    }

    // Check if form is linked to a sheet by calling Google Forms API
    const response = await fetch(
      `https://forms.googleapis.com/v1/forms/${formId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      console.error(
        'Google Forms API error:',
        response.status,
        response.statusText
      )
      return NextResponse.json(
        { error: 'Failed to fetch form details from Google Forms API' },
        { status: response.status }
      )
    }

    const formData = await response.json()

    // Check if form has linkedSheetId property
    const isLinked = !!formData.linkedSheetId

    return NextResponse.json(
      {
        linked: isLinked,
        sheetId: formData.linkedSheetId || null,
        formTitle: formData.info?.title || null
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error checking form linking:', error)
    return NextResponse.json(
      { error: 'Internal server error while checking form linking' },
      { status: 500 }
    )
  }
}
