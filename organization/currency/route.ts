'use server'

import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export async function GET() {
  try {
    const data = await fetcher<unknown>('/organization/currency', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to fetch organization currency'
    return NextResponse.json({ error: errMsg }, { status })
  }
}

export async function PATCH(request: NextRequest) {
  const currency = request.nextUrl.searchParams.get('currency')
  if (!currency) {
    return NextResponse.json(
      { error: 'Currency parameter is required.' },
      { status: 400 }
    )
  }

  try {
    const data = await fetcher<unknown>(
      `/organization/currency?currency=${encodeURIComponent(currency)}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data?.message ??
      error?.message ??
      'Failed to update organization currency'
    return NextResponse.json({ error: errMsg }, { status })
  }
}
