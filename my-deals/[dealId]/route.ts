import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: { dealId: string } }
) {
  try {
    const { dealId } = params

    const data = await fetcher<unknown>(`/my-deals/${dealId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch deal', details },
      { status }
    )
  }
}
