import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const data = await fetcher<unknown>('/ppi/org/branding', {
      method: 'GET',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return NextResponse.json({ success: false, data: null }, { status: 200 })
    }
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to fetch branding', details },
      { status }
    )
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, url, enabledReferralProgram } = body

    if (!title || !description || !url) {
      return NextResponse.json(
        { error: 'Title, description, and url are required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>('/ppi/branding', {
      method: 'PUT',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        title,
        description,
        url,
        enabledReferralProgram: enabledReferralProgram ?? false
      }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to update branding', details },
      { status }
    )
  }
}
