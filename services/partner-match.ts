import { fetcher } from '@/lib/server'
import { recordType } from '@/app/(app)/(dashboard-pages)/my-data/_components/Segment'

export const fetchMyPersona = async (organizationId: number) => {
  const query = organizationId
    ? `/persona/details?organizationId=${organizationId}`
    : `/persona/details?page=0&size=20`
  const response = await fetcher(query, {
    method: 'GET'
  })

  return response
}
export const fetchPartnerPersona = async (
  organizationId: number,
  partnerId: number | null
) => {
  const response = await fetcher(
    `/persona/partner/data?organizationId=${organizationId}&partnerId=${partnerId}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const fetchPartnerReport = async (
  organizationId: number,
  partnerId: number | null,
  type: string | null
) => {
  const response = await fetcher(
    `/persona/partner/data?organizationId=${organizationId}&partnerId=${partnerId}&type=${type}`,
    {
      method: 'GET'
    }
  )

  return response
}
export const fetchPermission = async (organizationId: number) => {
  const response = await fetcher(
    `/persona/partner-data-permissions/${organizationId}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const createNewPersona = async (params: any) => {
  const response = await fetcher('/persona', {
    method: 'POST',
    data: params
  })

  if (!response) {
    throw new Error('Failed to create persona!')
  }

  return response
}
export const createNewPersonaOverlap = async (params: any) => {
  const response = await fetcher('/persona/overlap', {
    method: 'POST',
    data: params
  })

  if (!response) {
    throw new Error('Failed to create persona!')
  }

  return response
}

export const changePermission = async (params: any) => {
  const response = await fetcher('/persona/partner/permissions', {
    method: 'POST',
    data: params
  })

  if (!response) {
    throw new Error('Failed to create persona!')
  }

  return response
}

export const fetchPreview = async (
  organizationId: number,
  recordType?: recordType
) => {
  if (recordType) {
    const response = await fetcher(
      `/persona/overlap/my-records?organizationId=${organizationId}&recordType=${recordType}`,
      {
        method: 'GET'
      }
    )

    return response
  }

  const response = await fetcher(
    `/persona/overlap/my-records?organizationId=${organizationId}`,
    {
      method: 'GET'
    }
  )

  return response
}
export const deletePreview = async (
  organizationId: number,
  recordType?: recordType
) => {
  const response = await fetcher(
    `/persona/overlap/my-records?organizationId=${organizationId}&recordType=${recordType}`,
    {
      method: 'DELETE'
    }
  )

  return response
}

export const disconnectPersonaCrm = async (
  integrationType: string,
  recordType: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY' = 'CUSTOMER'
) => {
  const response = await fetcher('/persona/crm/disconnect', {
    method: 'POST',
    data: {
      integrationType,
      recordType
    }
  })

  return response
}

export const createPersonaOverlapCustomer = async (payload: {
  organizationId: number
  recordType: string
  fileName: string
  source: string
  frequency: string
  googleSheetLink?: string
  fields: Record<string, string>[]
  fieldToColumnMapping: Record<string, string>
  userId?: string
}) => {
  const response = await fetch('/api/persona/overlap/customer', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(json.error || 'Failed to save customer data')
  }

  return json.data
}

const RECORD_TYPE_ENDPOINT: Record<string, string> = {
  CUSTOMER: '/api/persona/overlap/customer',
  PROSPECT: '/api/persona/overlap/prospects',
  OPPORTUNITY: '/api/persona/overlap/opportunity'
}

/**
 * Generic helper — saves overlap records for any record type (CUSTOMER / PROSPECT / OPPORTUNITY).
 * Routes to the correct backend endpoint automatically.
 */
export const createPersonaOverlapRecord = async (payload: {
  organizationId: number
  recordType: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'
  fileName: string
  source: string
  frequency: string
  googleSheetLink?: string
  fields: Record<string, string | null>[]
  fieldToColumnMapping: Record<string, string>
  userId?: string
}) => {
  const endpoint = RECORD_TYPE_ENDPOINT[payload.recordType]
  if (!endpoint) {
    throw new Error(`Unknown recordType: ${payload.recordType}`)
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const json = await response.json()

  if (!response.ok || !json.success) {
    throw new Error(
      json.error || `Failed to save ${payload.recordType.toLowerCase()} data`
    )
  }

  return json.data
}
