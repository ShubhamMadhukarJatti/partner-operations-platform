// src/services/zoho.ts
import { fetcher } from '@/lib/server'

export interface ZohoMetadataData {
  contacts?: string[]
  accounts?: string[]
  deals?: string[]
}

export interface ZohoMetadataResponse {
  success: boolean
  message?: string
  data: ZohoMetadataData
}

export const fetchZohoMetadata = async (): Promise<ZohoMetadataResponse> => {
  // Fetch all three endpoints concurrently
  const [contactsRes, accountsRes, dealsRes] = await Promise.all([
    fetcher<string[]>('/integration/zoho/contacts/fields', {
      method: 'GET'
    }).catch((e) => {
      console.error('Failed to fetch Zoho contacts metadata', e)
      return null
    }),
    fetcher<string[]>('/integration/zoho/accounts/fields', {
      method: 'GET'
    }).catch((e) => {
      console.error('Failed to fetch Zoho accounts metadata', e)
      return null
    }),
    fetcher<string[]>('/integration/zoho/deals/fields', {
      method: 'GET'
    }).catch((e) => {
      console.error('Failed to fetch Zoho deals metadata', e)
      return null
    })
  ])

  // Helper to extract fields from response
  const extractFields = (res: any): string[] => {
    if (!res) return []
    if (Array.isArray(res)) return res
    if (Array.isArray(res?.data)) return res.data
    return []
  }

  return {
    success: true,
    data: {
      contacts: extractFields(contactsRes),
      accounts: extractFields(accountsRes),
      deals: extractFields(dealsRes)
    }
  }
}
