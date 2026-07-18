import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get('id') || ''

    const data = await fetcher<unknown>(
      `/organizationCollaboration/messages/${id}`,
      { method: 'GET' }
    )

    return NextResponse.json(
      { message: 'Fetched Data', data: data ?? null },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch chat messages',
        ...details
      },
      { status }
    )
  }
}
