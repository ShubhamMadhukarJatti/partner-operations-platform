import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    if (!id) {
      return NextResponse.json(
        { error: 'Collaboration ID is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/organizationCollaboration/get/partner/assignment/${id}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        timeout: 5000
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    if (status === 404 || status === 500) {
      return NextResponse.json(
        { message: 'No assignment found' },
        { status: 404 }
      )
    }
    if (
      error?.code === 'ECONNABORTED' ||
      error?.message?.includes?.('timeout')
    ) {
      return NextResponse.json({ message: 'Request timeout' }, { status: 408 })
    }
    const errMsg =
      error?.response?.data?.error ??
      error?.message ??
      'Failed to fetch assignment'
    return NextResponse.json({ error: errMsg }, { status })
  }
}
