import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const id = new URL(req.url).searchParams.get('id') || ''

    const data = await fetcher<{ content?: unknown[] }>(
      `/organizationCollaboration?organizationId=${id}`,
      { method: 'GET' }
    )
    const list = data?.content?.length ? data.content : []

    const lengths = await Promise.all(
      list.map((message: any) =>
        fetcher<unknown[]>(
          `/organizationCollaboration/messages/${message.id}`,
          { method: 'GET' }
        ).then((msgs) => (Array.isArray(msgs) ? msgs.length : 0))
      )
    )
    const response = list.filter((_: any, idx: number) => lengths[idx] > 0)

    return NextResponse.json(
      { message: 'Fetched Data', data: response },
      { status: 200 }
    )
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      { message: details?.message || 'Failed to fetch messages', ...details },
      { status }
    )
  }
}
