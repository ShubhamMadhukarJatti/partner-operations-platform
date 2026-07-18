import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { message: 'Organization ID is required.' },
        { status: 400 }
      )
    }

    const data = await fetcher<unknown>(`/email/domain/${organizationId}`, {
      method: 'GET'
    })

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'An unexpected error occurred.',
        ...details
      },
      { status }
    )
  }
}
