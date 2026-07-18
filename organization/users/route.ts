import { NextResponse } from 'next/server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    let org
    try {
      org = await getCurrentOrganization()
    } catch (orgError) {
      console.error('Error fetching organization:', orgError)
      return NextResponse.json(
        { error: 'Failed to fetch organization' },
        { status: 500 }
      )
    }

    if (!org?.id) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    const data = await fetcher<unknown>(
      `/orgUserMapping/allOrganizationMappingsByOrgId?organizationId=${org.id}`,
      { method: 'GET' }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data?.error ?? error?.message ?? 'Failed to fetch users'
    return NextResponse.json({ error: errMsg }, { status })
  }
}
