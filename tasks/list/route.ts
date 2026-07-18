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
    const externalPartnerId = searchParams.get('externalPartnerId')

    let queryParams = `page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
    if (externalPartnerId) {
      queryParams += `&externalPartnerId=${externalPartnerId}`
    }

    const data = await fetcher<unknown>(`/tasks/list?${queryParams}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { message: 'Failed to fetch tasks', details },
      { status }
    )
  }
}
