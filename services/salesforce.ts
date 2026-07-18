// src/services/salesforce.ts
import { fetcher } from '@/lib/server'

export interface SalesforceField {
  name: string
  label: string
  type: string
  nillable?: boolean
  updateable?: boolean
  calculated?: boolean
  // Add other properties if necessary based on Salesforce Describe API
}

export interface SalesforceMetadataSection {
  fields: SalesforceField[]
}

export interface SalesforceMetadataData {
  contacts?: SalesforceMetadataSection
  accounts?: SalesforceMetadataSection
  opportunities?: SalesforceMetadataSection
}

export interface SalesforceMetadataResponse {
  success: boolean
  message?: string
  data: SalesforceMetadataData
}

export interface FetchSalesforceMetadataParams {
  organizationId?: number
}

export const fetchSalesforceMetadata = async (
  params?: FetchSalesforceMetadataParams
): Promise<SalesforceMetadataResponse> => {
  const query = new URLSearchParams()

  if (params?.organizationId) {
    query.set('organizationId', String(params.organizationId))
  }

  const queryString = query.toString() ? `?${query.toString()}` : ''

  // Fetch all three endpoints concurrently
  const [contactsRes, accountsRes, opportunitiesRes] = await Promise.all([
    fetcher(`/integration/salesforce/contacts/describe${queryString}`, {
      method: 'GET'
    }).catch((e) => {
      console.error('Failed to fetch Salesforce contacts metadata', e)
      return null
    }),
    fetcher(`/integration/salesforce/accounts/describe${queryString}`, {
      method: 'GET'
    }).catch((e) => {
      console.error('Failed to fetch Salesforce accounts metadata', e)
      return null
    }),
    fetcher(`/integration/salesforce/opportunities/describe${queryString}`, {
      method: 'GET'
    }).catch((e) => {
      console.error('Failed to fetch Salesforce opportunities metadata', e)
      return null
    })
  ])

  // Helper to extract fields from the API response
  const extractFields = (res: any): SalesforceField[] => {
    if (!res) return []
    if (Array.isArray(res?.fields)) return res.fields
    if (Array.isArray(res?.data?.fields)) return res.data.fields
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.data)) return res.data
    return []
  }

  return {
    success: true,
    data: {
      contacts: { fields: extractFields(contactsRes) },
      accounts: { fields: extractFields(accountsRes) },
      opportunities: { fields: extractFields(opportunitiesRes) }
    }
  }
}
