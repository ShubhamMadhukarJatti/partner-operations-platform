'use server'

import { fetcher, getServerUser } from '@/lib/server'

import {
  fetchconnectedApps,
  getCurrentOrganization,
  Postintegrationdata
} from './organization'

export const createPersona = async (
  organizationId: number,
  sites: string[]
) => {
  const res = await fetcher<any>('/persona', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data: {
      organizationId,
      sites
    }
  })

  return res
}

export const getPersonaDetails = async (organizationId: number) => {
  try {
    const data = await fetcher<any>(
      `/persona/details?organizationId=${organizationId.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error while get personal details')
  }
}

export const getHubspotColumnsList = async (organizationId: number) => {
  try {
    if (!organizationId) return new Error('Organization Id missing')

    const data = await fetcher<any>(
      `/integration/hubspot/fields?organizationId=${organizationId.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error while get personal details')
  }
}

type HubspotRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

const getHubspotPropertiesEndpoint = (recordType: HubspotRecordType) => {
  if (recordType === 'CUSTOMER') return '/integration/company-properties'
  if (recordType === 'OPPORTUNITY') return '/integration/deal-properties'
  return '/integration/hubspot/fields'
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

const fetchAllHubspotDataPages = async ({
  recordType,
  organizationId,
  fieldsParam
}: {
  recordType: HubspotRecordType
  organizationId: number
  fieldsParam: string
}) => {
  const initialEndpoint = getHubspotDataEndpoint(recordType)
  const paginatedEndpoint = getHubspotAfterLimitEndpoint(recordType)
  let after: string | null = null
  let page = 1
  const seenAfters = new Set<string>()
  const aggregatedResults: any[] = []
  const seenRecordIds = new Set<string>()
  let previousPageSignature: string | null = null
  let lastResponse: any = null

  while (true) {
    const endpoint = page === 1 ? initialEndpoint : paginatedEndpoint
    const query = new URLSearchParams()
    if (page === 1) {
      query.set('organizationId', organizationId.toString())
      query.set('fields', fieldsParam)
    } else {
      query.set('organizationId', organizationId.toString())
      query.set('fields', fieldsParam)
      query.set('after', after ?? '')
      query.set('limit', '100')
    }
    const url: string = `${endpoint}?${query.toString()}`
    const response = await fetcher<any>(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    lastResponse = response

    const currentPageResults = Array.isArray(response?.results)
      ? response.results
      : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response)
          ? response
          : []

    const currentPageIds = currentPageResults
      .map((item: any) => item?.id)
      .filter(
        (id: string | any[]): id is string =>
          typeof id === 'string' && id.length > 0
      )
    const currentPageSignature = currentPageIds.join('|')

    if (
      previousPageSignature &&
      currentPageSignature &&
      currentPageSignature === previousPageSignature
    ) {
      console.warn(
        '[HubSpot Mapping Debug] Repeated page payload detected, stopping before appending duplicates',
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
      const recordId = typeof item?.id === 'string' ? item.id : null

      if (recordId && seenRecordIds.has(recordId)) {
        continue
      }

      if (recordId) {
        seenRecordIds.add(recordId)
      }

      aggregatedResults.push(item)
    }
    const nextAfter = response?.paging?.next?.after
    previousPageSignature = currentPageSignature || previousPageSignature

    if (!nextAfter) {
      console.log(
        `[HubSpot Mapping Debug] Pagination completed at page ${page} for ${endpoint}`
      )
      break
    }
    if (seenAfters.has(String(nextAfter))) {
      console.warn(
        '[HubSpot Mapping Debug] Repeated paging cursor detected, stopping pagination',
        {
          recordType,
          endpoint,
          organizationId,
          page,
          nextAfter
        }
      )
      console.warn(
        `[HubSpot Mapping Debug] Pagination stopped at page ${page} for ${endpoint}`
      )
      break
    }

    seenAfters.add(String(nextAfter))
    after = String(nextAfter)
    page += 1

    // Add a delay to respect HubSpot's rate limit of 100 req per 10s
    await new Promise((resolve) => setTimeout(resolve, 150))
  }

  if (
    lastResponse &&
    typeof lastResponse === 'object' &&
    !Array.isArray(lastResponse)
  ) {
    return {
      ...lastResponse,
      results: aggregatedResults
    }
  }

  return aggregatedResults
}

const normalizeHubspotPropertiesResponse = (response: any) => {
  if (Array.isArray(response)) {
    return response
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') {
          return item.name || item.label || ''
        }
        return ''
      })
      .filter((item) => item.trim() !== '')
  }

  if (Array.isArray(response?.results)) {
    return response.results
      .map((item: any) => item?.name || item?.label || '')
      .filter((item: string) => item.trim() !== '')
  }

  if (response && typeof response === 'object') {
    return Object.keys(response).filter(
      (key) => !key.startsWith('additionalProp') && key.trim() !== ''
    )
  }

  return []
}

export const getHubspotDataBasedOnColumns = async (
  organizationId: number,
  columns: string[],
  recordType: HubspotRecordType = 'PROSPECT'
) => {
  try {
    if (!organizationId) return new Error('Organization Id missing')
    if (!columns || columns.length === 0) {
      return { results: [] }
    }

    const endpoint = getHubspotDataEndpoint(recordType)
    const fieldsParam = columns.join(',')
    const data = await fetchAllHubspotDataPages({
      recordType,
      organizationId,
      fieldsParam
    })
    return data
  } catch (error) {
    console.error('[HubSpot Mapping Debug] Data rows request failed', {
      recordType,
      organizationId,
      columns,
      error
    })
    throw new Error('Error while get personal details')
  }
}

export const getHubspotColumnsListByRecordType = async (
  organizationId: number,
  recordType: HubspotRecordType = 'CUSTOMER'
) => {
  try {
    if (!organizationId) return new Error('Organization Id missing')

    const endpoint = getHubspotPropertiesEndpoint(recordType)
    const data = await fetcher<any>(
      `${endpoint}?organizationId=${organizationId.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    if (recordType === 'CUSTOMER' || recordType === 'OPPORTUNITY') {
      return normalizeHubspotPropertiesResponse(data)
    }

    return data
  } catch (error) {
    console.error('[HubSpot Mapping Debug] Property columns request failed', {
      recordType,
      organizationId,
      error
    })
    throw new Error('Error while get personal details')
  }
}

export const getZohoAccessToken = async () => {
  const client_id = (process.env.NEXT_PUBLIC_ZOHO_CLIENT_ID ?? '')
    .trim()
    .replace(/\+/g, '')
  const clientSecret = process.env.NEXT_PUBLIC_ZOHO_CLIENT_SECRET

  try {
    const apps: any = await fetchconnectedApps()
    let zohoRefreshToken = apps.find(
      (app: any) => app.integrationType === 'ZOHO'
    )?.refreshToken
    const publishableKey = apps.find(
      (app: any) => app.integrationType === 'ZOHO'
    )?.publishableKey
    const payloadData = {
      grant_type: 'refresh_token',
      client_id,
      client_secret: clientSecret as string,
      refresh_token: zohoRefreshToken as string
    }

    const response = await fetch(`${publishableKey}/oauth/v2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(payloadData).toString()
    })

    const tokenResponse = await response.json()

    const accessToken = tokenResponse.access_token
    // setAccessToken(accessToken)
    if (tokenResponse?.refresh_token) {
      const { id } = await getCurrentOrganization()
      const updatePayload = {
        organizationId: id,
        refreshToken: tokenResponse?.refresh_token,
        integrationType: 'ZOHO'
      }
      await Postintegrationdata(JSON.stringify(updatePayload))
    }
    return { accessToken, publishableKey }
  } catch (error) {
    console.log(error)
  }
}

export type ZohoRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

const getZohoFieldsEndpoint = (recordType: ZohoRecordType) => {
  if (recordType === 'CUSTOMER') return '/integration/zoho/accounts/fields'
  if (recordType === 'OPPORTUNITY') return '/integration/zoho/deals/fields'
  return '/integration/zoho/contacts/fields'
}

const getZohoDataEndpoint = (recordType: ZohoRecordType) => {
  if (recordType === 'CUSTOMER') return '/integration/zoho/accounts/data'
  if (recordType === 'OPPORTUNITY') return '/integration/zoho/deals/data'
  return '/integration/zoho/contacts/data'
}

export const getZohoDataHeaders = async (
  recordType: ZohoRecordType = 'CUSTOMER'
) => {
  try {
    const endpoint = getZohoFieldsEndpoint(recordType)
    const data = await fetcher<any>(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return data
  } catch (error) {
    throw new Error('Error while getting Zoho headers')
  }
}

export const getZohoData = async (recordType: ZohoRecordType = 'CUSTOMER') => {
  try {
    const endpoint = getZohoDataEndpoint(recordType)
    const data = await fetcher<any>(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return data
  } catch (error) {
    throw new Error('Error while getting Zoho data')
  }
}

export const getPipedriveFields = async (): Promise<{
  success: boolean
  data: Array<{ key: string; name: string }>
}> => {
  try {
    const data = await fetcher<any>('/integration/pipedrive/fields', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return data
  } catch (error) {
    console.error('[getPipedriveFields]', error)
    throw new Error('Error fetching Pipedrive fields')
  }
}

export const getPipedriveData = async (
  organizationId: number,
  fields: string[]
): Promise<any> => {
  try {
    if (!fields || fields.length === 0) {
      return []
    }
    const data = await fetcher<any>(
      `/integration/pipedrive/data?organizationId=${organizationId}&fields=${fields.join(',')}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return data
  } catch (error) {
    console.error('[getPipedriveData]', error)
    throw new Error('Error fetching Pipedrive data')
  }
}

type SalesforceRecordType = 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'

/** `fetcher` calls `redirect()` on auth failure; that throws with this digest and must not be wrapped. */
function isNextRedirectError(error: unknown): boolean {
  const digest = (error as { digest?: string })?.digest
  return typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')
}

const normalizeSalesforceFieldsResponse = (response: any) => {
  const fields = Array.isArray(response?.fields)
    ? response.fields
    : Array.isArray(response)
      ? response
      : Array.isArray(response?.data?.fields)
        ? response.data.fields
        : Array.isArray(response?.data)
          ? response.data
          : []

  return { ...response, fields }
}

const normalizeSalesforceRecordsResponse = (response: any) => {
  const records = Array.isArray(response?.records)
    ? response.records
    : Array.isArray(response)
      ? response
      : Array.isArray(response?.data?.records)
        ? response.data.records
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.results)
            ? response.results
            : []

  return { ...response, records }
}

/** HubSpot Companies → Salesforce Account object metadata. */
const getSalesforceDescribeEndpoint = (
  recordType: SalesforceRecordType = 'PROSPECT'
) => {
  if (recordType === 'CUSTOMER') {
    return '/integration/salesforce/accounts/describe'
  }

  if (recordType === 'OPPORTUNITY') {
    return '/integration/salesforce/opportunities/describe'
  }

  // PROSPECT: HubSpot Contacts → Salesforce Contact (not Lead — see pipeline docblock above).
  return '/integration/salesforce/contacts/describe'
}

/** HubSpot Companies / Contacts / Deals → Salesforce Accounts / Contacts / Opportunities data rows. */
const getSalesforceDataEndpoint = (
  recordType: SalesforceRecordType = 'PROSPECT'
) => {
  if (recordType === 'CUSTOMER') {
    return '/integration/salesforce/accounts'
  }

  if (recordType === 'OPPORTUNITY') {
    return '/integration/salesforce/opportunities'
  }

  return '/integration/salesforce/contacts'
}

export const getSalesforceFields = async (
  recordType: SalesforceRecordType = 'PROSPECT'
): Promise<any> => {
  try {
    const data = await fetcher<any>(getSalesforceDescribeEndpoint(recordType), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
    return normalizeSalesforceFieldsResponse(data)
  } catch (error) {
    if (isNextRedirectError(error)) throw error
    console.error('[getSalesforceFields]', { recordType, error })
    throw new Error('Error fetching Salesforce fields')
  }
}

export const getSalesforceData = async (
  organizationId: number,
  fields: string[],
  recordType: SalesforceRecordType = 'PROSPECT'
): Promise<any> => {
  try {
    if (!fields || fields.length === 0) {
      return { results: [], data: [] }
    }
    const params = fields.map((f) => `fields=${f}`).join('&')
    const data = await fetcher<any>(
      `${getSalesforceDataEndpoint(recordType)}?organizationId=${organizationId}&${params}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return normalizeSalesforceRecordsResponse(data)
  } catch (error) {
    if (isNextRedirectError(error)) throw error
    console.error('[getSalesforceData]', { recordType, fields, error })
    // Forward fetcher message so Server Action / UI can show the real backend error.
    // Do not wrap NEXT_REDIRECT (handled above) — wrapping breaks login redirect in prod.
    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Error fetching Salesforce data'
    throw new Error(message)
  }
}

/**
 * Fetches the associated companies for a single HubSpot contact.
 * Calls GET /integration/contact/{contactId}/companies?organizationId={orgId}
 * Returns the raw results array (each item has toObjectId + associationTypes),
 * or null if the contact has no associations or the call fails.
 */
export const getHubspotContactCompanies = async (
  organizationId: number,
  contactId: string
): Promise<string | null> => {
  try {
    const data = await fetcher<any>(
      `/integration/contact/${contactId}/companies`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )

    if (Array.isArray(data?.results) && data.results.length > 0) {
      const id = data.results[0]?.toObjectId
      return id ? String(id) : null
    }
    if (Array.isArray(data) && data.length > 0) {
      const id = data[0]?.toObjectId
      return id ? String(id) : null
    }
    return null
  } catch (error) {
    console.error(
      '[getHubspotContactCompanies] failed for contact',
      contactId,
      error
    )
    return null
  }
}

/**
 * Fetches the associated object for a single HubSpot deal.
 * Calls GET /integration/deal/{dealId}/companies
 * Returns the first associated object id from the raw results array,
 * or null if the deal has no associations or the call fails.
 */
export const getHubspotDealCompanies = async (
  organizationId: number,
  dealId: string
): Promise<string | null> => {
  try {
    const data = await fetcher<any>(`/integration/deal/${dealId}/companies`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })

    if (Array.isArray(data?.results) && data.results.length > 0) {
      const id = data.results[0]?.toObjectId
      return id ? String(id) : null
    }
    if (Array.isArray(data) && data.length > 0) {
      const id = data[0]?.toObjectId
      return id ? String(id) : null
    }
    return null
  } catch (error) {
    console.error('[getHubspotDealCompanies] failed for deal', dealId, error)
    return null
  }
}

/**
 * Fetches associated companies for a batch of HubSpot contacts.
 * Executes on the server using Promise.all to avoid browser concurrent request limits.
 */
export const getHubspotContactCompaniesBatch = async (
  organizationId: number,
  contactIds: string[]
): Promise<Record<string, string>> => {
  const uniqueIds = Array.from(new Set(contactIds.filter(Boolean)))
  const results: Record<string, string> = {}

  if (uniqueIds.length === 0) return results

  // Execute sequentially with a delay to avoid HubSpot rate limits
  for (const contactId of uniqueIds) {
    const associatedCompanyId = await getHubspotContactCompanies(
      organizationId,
      contactId
    )
    if (associatedCompanyId) {
      results[contactId] = associatedCompanyId
    }
    await new Promise((resolve) => setTimeout(resolve, 110))
  }

  return results
}

/**
 * Fetches associated contacts/companies for a batch of HubSpot deals.
 * Executes on the server using Promise.all to avoid browser concurrent request limits.
 */
export const getHubspotDealCompaniesBatch = async (
  organizationId: number,
  dealIds: string[]
): Promise<Record<string, string>> => {
  const uniqueIds = Array.from(new Set(dealIds.filter(Boolean)))
  const results: Record<string, string> = {}

  if (uniqueIds.length === 0) return results

  // Execute sequentially with a delay to avoid HubSpot rate limits
  for (const dealId of uniqueIds) {
    const associatedCompanyId = await getHubspotDealCompanies(
      organizationId,
      dealId
    )
    if (associatedCompanyId) {
      results[dealId] = associatedCompanyId
    }
    await new Promise((resolve) => setTimeout(resolve, 110))
  }

  return results
}
