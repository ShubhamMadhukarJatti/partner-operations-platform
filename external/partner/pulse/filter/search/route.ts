'use server'

import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')
  const page = searchParams.get('page') ?? '1'
  const size = searchParams.get('size') ?? '100'

  if (!email) {
    return NextResponse.json(
      { message: 'Query parameter `email` is required.' },
      { status: 400 }
    )
  }

  try {
    const endpoint = `/api/external/partner/pulse/filter/search?email=${email}&page=${encodeURIComponent(page)}&size=${encodeURIComponent(size)}`
    const data = await fetcher(endpoint)
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to fetch partner pulse data.'

    return NextResponse.json({ message }, { status: 500 })
  }
}
