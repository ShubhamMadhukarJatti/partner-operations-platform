import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '0'
    const size = searchParams.get('size') || '100'
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortDir = searchParams.get('sortDir') || 'desc'
    const externalPartnerCode = searchParams.get('externalPartnerCode')

    // Validate that externalPartnerCode is provided
    if (!externalPartnerCode) {
      return NextResponse.json(
        { message: 'External Partner Code is required' },
        { status: 400 }
      )
    }

    // Build query params
    const queryParams = `page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&externalPartnerCode=${externalPartnerCode}`

    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Fetching partner tasks with params:', queryParams)
      console.log('External Partner Code:', externalPartnerCode)
    }

    const data = await fetcher<unknown>(
      `/api/tasks/list/external/partner?${queryParams}`,
      {
        method: 'GET'
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch partner tasks', details },
      { status }
    )
  }
}
