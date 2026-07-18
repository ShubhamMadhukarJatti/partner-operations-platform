import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const data = await fetcher<unknown>('/ppi/getAllForms', {
      method: 'GET',
      headers: {
        accept: 'application/hal+json',
        'Content-Type': 'application/json'
      }
    })
    if (!Array.isArray(data)) {
      const obj = data as any
      const possibleArray =
        obj?.data ?? obj?.forms ?? obj?.items ?? obj?._embedded?.forms ?? []
      if (Array.isArray(possibleArray)) {
        return NextResponse.json(possibleArray, { status: 200 })
      }
      return NextResponse.json([], { status: 200 })
    }
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to fetch forms', details },
      { status }
    )
  }
}
