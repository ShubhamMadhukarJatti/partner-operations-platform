import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type HubspotRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

type HubspotPagedResponse = {
  results?: unknown[]
  data?: unknown[]
  totalElements?: number
  message?: string
  paging?: {
    next?: {
      after?: string
      link?: string
    }
  }
}

const getHubspotDataEndpoint = (recordType: HubspotRecordType) => {
  if (recordType === 'CUSTOMER') return '/integration/companies'
  if (recordType === 'OPPORTUNITY') return '/integration/deals'
  return '/integration/hubspot'
}

const getHubspotAfterLimitEndpoint = (recordType: HubspotRecordType) => {
  if (recordType === 'CUSTOMER') return '/integration/companies/after/limit'
  if (recordType === 'OPPORTUNITY') return '/integration/deals/after/limit'
  return '/integration/hubspot/limit/after'
}

const fetchAllHubspotPages = async ({
  recordType,
  organizationId,
  fields
}: {
  recordType: HubspotRecordType
  organizationId: string
  fields: string
}) => {
  const initialEndpoint = getHubspotDataEndpoint(recordType)
  const paginatedEndpoint = getHubspotAfterLimitEndpoint(recordType)
  let after: string | null = null
  let page = 1
  const seenAfters = new Set<string>()
  const aggregatedResults: unknown[] = []
  const seenRecordIds = new Set<string>()
  let previousPageSignature: string | null = null
  let lastResponse: HubspotPagedResponse | unknown[] = []

  while (true) {
    const endpoint = page === 1 ? initialEndpoint : paginatedEndpoint
    const query = new URLSearchParams()
    if (page === 1) {
      query.set('organizationId', organizationId)
      query.set('fields', fields)
    } else {
      query.set('fields', fields)
      query.set('after', after ?? '')
      query.set('limit', '100')
    }

    console.log(
      `[api/hubspot-data] Page ${page} request started for ${endpoint}`
    )
    const response = await fetcher<HubspotPagedResponse>(
      `${endpoint}?${query.toString()}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    lastResponse = response

    const currentPageResults = Array.isArray(response?.results)
      ? response.results
      : Array.isArray(response?.data)
        ? response.data
        : []

    const currentPageIds = currentPageResults
      .map((item: any) => item?.id)
      .filter((id): id is string => typeof id === 'string' && id.length > 0)
    const currentPageSignature = currentPageIds.join('|')

    if (
      previousPageSignature &&
      currentPageSignature &&
      currentPageSignature === previousPageSignature
    ) {
      console.warn(
        '[api/hubspot-data] Repeated page payload detected, stopping before appending duplicates',
        {
          recordType,
          endpoint,
          organizationId,
          page,
          currentPageIds
        }
      )
      break
    }

    for (const item of currentPageResults) {
      const recordId =
        typeof (item as any)?.id === 'string' ? (item as any).id : null

      if (recordId && seenRecordIds.has(recordId)) {
        continue
      }

      if (recordId) {
        seenRecordIds.add(recordId)
      }

      aggregatedResults.push(item)
    }

    const nextAfter = response?.paging?.next?.after

    console.log('[api/hubspot-data] Paginated page fetched', {
      recordType,
      endpoint,
      organizationId,
      page,
      pageSize: Array.isArray(response?.results)
        ? response.results.length
        : Array.isArray(response?.data)
          ? response.data.length
          : 0,
      totalAccumulated: aggregatedResults.length,
      nextAfter
    })

    previousPageSignature = currentPageSignature || previousPageSignature

    if (!nextAfter) {
      console.log(
        `[api/hubspot-data] Pagination completed at page ${page} for ${endpoint}`
      )
      break
    }
    if (seenAfters.has(String(nextAfter))) {
      console.warn(
        '[api/hubspot-data] Repeated paging cursor detected, stopping pagination',
        {
          recordType,
          endpoint,
          organizationId,
          page,
          nextAfter
        }
      )
      console.warn(
        `[api/hubspot-data] Pagination stopped at page ${page} for ${endpoint}`
      )
      break
    }

    seenAfters.add(String(nextAfter))
    after = String(nextAfter)
    page += 1
  }

  if (
    !Array.isArray(lastResponse) &&
    lastResponse &&
    typeof lastResponse === 'object'
  ) {
    return {
      ...lastResponse,
      results: aggregatedResults
    }
  }

  return aggregatedResults
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const fields = searchParams.get('fields')
    const rawRecordType = searchParams.get('recordType')
    const recordType: HubspotRecordType =
      rawRecordType === 'CUSTOMER' ||
      rawRecordType === 'OPPORTUNITY' ||
      rawRecordType === 'PROSPECT'
        ? rawRecordType
        : 'PROSPECT'

    if (!organizationId || !fields) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const endpoint = getHubspotDataEndpoint(recordType)
    const data = await fetchAllHubspotPages({
      recordType,
      organizationId,
      fields
    })

    const result = {
      success: true,
      data: Array.isArray(data) ? data : (data.results ?? data.data ?? []),
      totalElements:
        !Array.isArray(data) && typeof data === 'object'
          ? (data.totalElements ?? 0)
          : 0
    }

    console.log('result', result)

    return NextResponse.json(result)
  } catch (error: any) {
    const status = error?.response?.status ?? 500
    const details = error?.response?.data
    return NextResponse.json(
      {
        success: false,
        error: details?.message || 'Failed to fetch HubSpot data',
        details
      },
      { status }
    )
  }
}
