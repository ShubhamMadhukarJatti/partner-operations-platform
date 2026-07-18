// src/services/hubspot.ts
import { fetcher } from '@/lib/server'

export type HubspotObjectType = 'contacts' | 'companies' | 'deals'

export interface HubspotPropertyOption {
  label: string
  value: string
  description?: string
  displayOrder?: number
  hidden?: boolean
}

export interface HubspotProperty {
  name: string
  label: string
  type: string
  fieldType: string
  description?: string
  groupName?: string
  options?: HubspotPropertyOption[]
  displayOrder?: number
  hidden?: boolean
  hubspotDefined?: boolean
  formField?: boolean
  dataSensitivity?: string
}

export interface HubspotMetadataSection {
  results: HubspotProperty[]
}

export interface HubspotMetadataData {
  contacts?: HubspotMetadataSection
  companies?: HubspotMetadataSection
  deals?: HubspotMetadataSection
}

export interface HubspotMetadataResponse {
  success: boolean
  message: string
  data: HubspotMetadataData
}

export interface FetchHubspotMetadataParams {
  organizationId?: number
}

export const fetchHubspotMetadata = async (
  params?: FetchHubspotMetadataParams
) => {
  const query = new URLSearchParams()

  if (params?.organizationId) {
    query.set('organizationId', String(params.organizationId))
  }

  const response = await fetcher(
    `/integration/hubspot/metadata${query.toString() ? `?${query.toString()}` : ''}`,
    {
      method: 'GET'
    }
  )

  if (!response) {
    throw new Error('Failed to fetch HubSpot metadata')
  }

  return response as HubspotMetadataResponse
}
