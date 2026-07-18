import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = await fetcher<unknown>('/partnership-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.response?.statusText ??
      error?.message
    return NextResponse.json({ message }, { status })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const data = await fetcher<unknown>('/partnership-integration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: body
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.response?.statusText ??
      error?.message
    return NextResponse.json({ message }, { status })
  }
}

export async function GET(req: Request) {
  try {
    const organizationId = new URL(req.url).searchParams.get('organizationId')
    if (!organizationId) {
      return NextResponse.json(
        { message: 'Organization ID is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/partnership-integration?organizationId=${encodeURIComponent(organizationId)}`,
      { method: 'GET' }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const message =
      error?.response?.data?.message ??
      error?.response?.statusText ??
      error?.message
    return NextResponse.json({ message }, { status })
  }
}
