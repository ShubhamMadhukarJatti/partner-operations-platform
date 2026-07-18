import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const data = await fetcher(
      '/organizationCollaboration/my-partners?status=ACTIVE&page=0&size=100',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const activePartners =
      data?.content?.map((partner: any) => ({
        orgId: partner.partnerOrganizationId,
        name: partner.organizationName
      })) ?? []

    return NextResponse.json(activePartners, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        message: details?.message || 'Failed to fetch active partners',
        ...details
      },
      { status }
    )
  }
}
