import { NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

export interface PartnerMappingOverviewResponse {
  report_generated: number
  total_overlaps_rate: number
  my_partners: Array<{
    organizationName: string
    aCustomerOverlapCount: number
    overlapRate: number
    aOpportunityOverlapCount: number
    partnerOrganizationId: number
    logoUrl: string
    aProspectOverlapCount: number
    dataSourceConnected?: boolean
  }>
  organization_id: number
  total_overlaps: number
  active_partners: number
}

export async function GET(req: Request) {
  try {
    const data = await fetcher<PartnerMappingOverviewResponse>(
      '/api/partner-mapping/overview',
      {
        method: 'GET',
        headers: {
          accept: 'application/hal+json',
          'Content-Type': 'application/json'
        }
      }
    )
    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const errMsg =
      error?.response?.data ?? error?.message ?? 'Internal server error'
    return NextResponse.json(
      {
        error:
          typeof errMsg === 'string'
            ? errMsg
            : 'Failed to fetch partner mapping overview'
      },
      { status }
    )
  }
}
