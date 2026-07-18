import { NextResponse } from 'next/server'
import { CONFIGURATION_TYPE } from '@/types'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const configType = searchParams.get('type') as CONFIGURATION_TYPE

    const responseData = await fetcher(
      `/configuration/allByType?type=${configType}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    return NextResponse.json(responseData, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data ?? error?.message
    return NextResponse.json(
      { error: 'Failed to fetch configuration by type', details },
      { status }
    )
  }
}
