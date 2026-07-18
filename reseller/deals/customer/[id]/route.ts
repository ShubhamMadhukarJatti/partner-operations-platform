import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const customerId = params.id
    if (!customerId) {
      return NextResponse.json(
        { message: 'Customer ID is required' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(
      `/api/reseller/deals/customer/${customerId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/hal+json'
        }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to delete customer', details },
      { status }
    )
  }
}
