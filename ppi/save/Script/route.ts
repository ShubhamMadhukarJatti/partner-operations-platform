import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { sheetId, formId, scriptId, bearerToken } = body

    if (!sheetId || !formId || !scriptId || !bearerToken) {
      return NextResponse.json(
        {
          error:
            'All fields (sheetId, formId, scriptId, bearerToken) are required'
        },
        { status: 400 }
      )
    }

    const responseData = await fetcher('/ppi/save/Script', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        sheetId,
        formId,
        scriptId,
        bearerToken
      }
    })

    return NextResponse.json(responseData, { status: 200 })
  } catch (error) {
    console.error('Error saving script:', error)
    return NextResponse.json(
      { error: 'Internal server error while saving script' },
      { status: 500 }
    )
  }
}
