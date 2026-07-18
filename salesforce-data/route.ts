import { NextRequest, NextResponse } from 'next/server'

import { fetcher } from '@/lib/server'

export const dynamic = 'force-dynamic'

type SalesforceRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

/**
 * Same routing as `getSalesforceData` in `@/lib/db/customer-persona`:
 * CUSTOMER→Accounts, PROSPECT→Contacts, OPPORTUNITY→Opportunities (HubSpot: Companies/Contacts/Deals).
 */
const getSalesforceDataEndpoint = (recordType: SalesforceRecordType) => {
  if (recordType === 'CUSTOMER') return '/integration/salesforce/accounts'
  if (recordType === 'OPPORTUNITY')
    return '/integration/salesforce/opportunities'
  return '/integration/salesforce/contacts'
}

const normalizeRecords = (response: unknown): any[] => {
  const r = response as Record<string, unknown>
  if (Array.isArray(r?.records)) return r.records as any[]
  if (Array.isArray(response)) return response as any[]
  const d = r?.data as Record<string, unknown> | undefined
  if (d && Array.isArray(d.records)) return d.records as any[]
  if (d && Array.isArray(d)) return d as any[]
  if (Array.isArray(r?.results)) return r.results as any[]
  return []
}

/**
 * GET — parity with `/api/hubspot-data`: live CRM rows for customer-insights preview + submit.
 * Query: organizationId, recordType, fields (comma-separated Salesforce API names).
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')
    const fieldsParam = searchParams.get('fields')
    const rawRecordType = searchParams.get('recordType')
    const recordType: SalesforceRecordType =
      rawRecordType === 'CUSTOMER' ||
      rawRecordType === 'OPPORTUNITY' ||
      rawRecordType === 'PROSPECT'
        ? rawRecordType
        : 'CUSTOMER'

    if (!organizationId || !fieldsParam) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const fields = fieldsParam
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)
    if (fields.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No fields requested' },
        { status: 400 }
      )
    }

    const params = fields
      .map((f) => `fields=${encodeURIComponent(f)}`)
      .join('&')
    const endpoint = getSalesforceDataEndpoint(recordType)
    const data = await fetcher<unknown>(
      `${endpoint}?organizationId=${organizationId}&${params}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    const records = normalizeRecords(data)
    return NextResponse.json({
      success: true,
      data: records
    })
  } catch (error: unknown) {
    const err = error as {
      message?: string
      response?: { status?: number; data?: unknown }
    }
    const status = err?.response?.status ?? 500
    const details = err?.response?.data
    const message =
      (details as { message?: string })?.message ??
      err?.message ??
      'Failed to fetch Salesforce data'
    return NextResponse.json(
      {
        success: false,
        error: message,
        details
      },
      { status }
    )
  }
}
