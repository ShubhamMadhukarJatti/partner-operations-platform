import { importPartnersParams } from '@/http-hooks/offline-partners'

import { fetcher } from '@/lib/server'

// Types for GET /api/external/partner/table/org
export interface PartnerTableColumn {
  columnId: number
  name: string
  type: string
  displayOrder: number
  visible: boolean
}

export interface PartnerTableRow {
  rowId: number
  values: Record<string, string>
}

export interface PartnerTableData {
  tableId: number
  tableName: string
  orgId: number
  columns: PartnerTableColumn[]
  rows: PartnerTableRow[]
}

export interface PartnerTableByOrgResponse {
  success: boolean
  message: string
  data: PartnerTableData
}

export const getPartnerTableByOrg =
  async (): Promise<PartnerTableByOrgResponse> => {
    const response = await fetcher<PartnerTableByOrgResponse>(
      '/api/external/partner/table/org',
      {
        method: 'GET',
        headers: {
          Accept: 'application/hal+json'
        }
      }
    )

    if (!response?.success || !response?.data) {
      throw new Error(response?.message ?? 'Failed to fetch partner table')
    }

    return response
  }

export interface AddPartnerTableColumnParams {
  tableId: number
  name: string
  type: 'TEXT' | 'STATUS' | 'TAG'
}

export interface AddPartnerTableColumnResponse {
  success: boolean
  message: string
  data: {
    id: number
    creationTimestamp: string
    lastUpdatedTimestamp: string
    name: string
    type: string
    displayOrder: number
    visible: boolean
    table: { id: number; orgId: number; tableName: string }
  }
}

export const addPartnerTableColumn = async (
  params: AddPartnerTableColumnParams
): Promise<AddPartnerTableColumnResponse> => {
  const response = await fetcher<AddPartnerTableColumnResponse>(
    '/api/external/partner/table/column',
    {
      method: 'POST',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        tableId: params.tableId,
        name: params.name,
        type: params.type
      }
    }
  )

  if (!response?.success) {
    throw new Error(response?.message ?? 'Failed to add column')
  }

  return response
}

export interface RenamePartnerTableColumnParams {
  columnId: number
  newName: string
}

export interface RenamePartnerTableColumnResponse {
  success: boolean
  message: string
  data: null
}

export const renamePartnerTableColumn = async (
  params: RenamePartnerTableColumnParams
): Promise<RenamePartnerTableColumnResponse> => {
  const response = await fetcher<RenamePartnerTableColumnResponse>(
    '/api/external/partner/table/column/rename',
    {
      method: 'PUT',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        columnId: params.columnId,
        newName: params.newName
      }
    }
  )

  if (!response?.success) {
    throw new Error(response?.message ?? 'Failed to rename column')
  }

  return response
}

export interface UpdatePartnerTableColumnOrderParams {
  columnId: number
  newOrder: number
}

export interface UpdatePartnerTableColumnOrderResponse {
  success: boolean
  message: string
  data: null
}

export const updatePartnerTableColumnOrder = async (
  params: UpdatePartnerTableColumnOrderParams
): Promise<UpdatePartnerTableColumnOrderResponse> => {
  const response = await fetcher<UpdatePartnerTableColumnOrderResponse>(
    '/api/external/partner/table/column/order',
    {
      method: 'PUT',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        columnId: params.columnId,
        newOrder: params.newOrder
      }
    }
  )

  if (!response?.success) {
    throw new Error(response?.message ?? 'Failed to update column order')
  }

  return response
}

export interface RemovePartnerTableColumnResponse {
  success: boolean
  message: string
  data: null
}

export const removePartnerTableColumn = async (
  columnId: number
): Promise<RemovePartnerTableColumnResponse> => {
  const response = await fetcher<RemovePartnerTableColumnResponse>(
    `/api/external/partner/table/column/${columnId}`,
    {
      method: 'DELETE',
      headers: {
        Accept: 'application/hal+json'
      }
    }
  )

  if (!response?.success) {
    throw new Error(response?.message ?? 'Failed to remove column')
  }

  return response
}

export interface UpdatePartnerTableRowValuesParams {
  rowId: number
  values: Record<string, string>
}

export interface UpdatePartnerTableRowValuesResponse {
  success: boolean
  message: string
  data: null
}

export const updatePartnerTableRowValues = async (
  params: UpdatePartnerTableRowValuesParams
): Promise<UpdatePartnerTableRowValuesResponse> => {
  const response = await fetcher<UpdatePartnerTableRowValuesResponse>(
    '/api/external/partner/table/row/values',
    {
      method: 'PUT',
      headers: {
        Accept: 'application/hal+json',
        'Content-Type': 'application/json'
      },
      data: {
        rowId: params.rowId,
        values: params.values
      }
    }
  )

  if (!response?.success) {
    throw new Error(response?.message ?? 'Failed to update row values')
  }

  return response
}

export const getOfflinePartners = async (
  tab: string = 'ALL',
  organizationId?: number | null
): Promise<any> => {
  // Allow empty payload - API might handle it differently
  // If organizationId is missing, still make the request (API will handle it)
  const url = organizationId
    ? `/v2/offline-partner?organizationId=${organizationId}&status=${tab}`
    : `/v2/offline-partner?status=${tab}`

  const response = await fetcher(url, {
    method: 'GET'
  })

  if (!response) {
    throw new Error('Failed to fetch offline partners')
  }

  return response
}

export const getAllOfflinePartners = async (
  organizationId?: number | null
): Promise<any> => {
  // Allow empty payload - API might handle it differently
  // If organizationId is missing, still make the request (API will handle it)
  const url = organizationId
    ? `/v2/offline-partner?organizationId=${organizationId}`
    : `/v2/offline-partner`

  const response = await fetcher(url, {
    method: 'GET'
  })

  if (!response) {
    throw new Error('Failed to fetch offline partners')
  }

  return response
}

export const addPartnersToGroup = async (params: {
  emails: string[]
  organizationId: number | undefined
  partnerGroup: string
}) => {
  const { emails, organizationId, partnerGroup } = params

  console.log({ params })

  const response = await fetcher(`/v2/offline-partner/group`, {
    method: 'POST',
    data: {
      emails,
      organizationId,
      partnerGroup
    }
  })

  if (!response) {
    throw new Error('Failed to add partners to group')
  }

  return response
}

export const saveOfflinePartnerAssignment = async (params: {
  userId: string
  partnerOrgId: number | string
}) => {
  const numericPartnerOrgId = Number(params.partnerOrgId)

  if (Number.isNaN(numericPartnerOrgId)) {
    throw new Error('Invalid partnerOrgId provided for assignment')
  }

  const response = await fetcher(`/v2/offline-partner/save/assignment`, {
    method: 'POST',
    data: {
      ...params,
      partnerOrgId: numericPartnerOrgId
    }
  })

  if (!response) {
    throw new Error('Failed to save partner assignment')
  }

  return response
}

export const getOfflinePartnerAssignment = async (
  partnerOrgId: number | string
) => {
  const response = await fetcher(
    `/v2/offline-partner/get/partner/assignment/${partnerOrgId}`,
    {
      method: 'GET'
    }
  )

  if (!response) {
    throw new Error('Failed to fetch partner assignment')
  }

  return response
}

export const deleteOfflinePartners = async (
  organizationId: number,
  email: string
) => {
  const response = await fetcher(`/v2/offline-partner`, {
    method: 'DELETE',
    data: {
      email,
      organizationId
    }
  })

  if (!response) {
    throw new Error('Failed to send invite')
  }

  return response
}

export const sendInvite = async (params: {
  organizationId: number
  email: string
  name: string
}) => {
  const { organizationId, email, name } = params

  const response = await fetcher(`/v2/offline-partner/invites`, {
    method: 'POST',
    data: {
      organizationId,
      email,
      name
    }
  })

  if (!response) {
    throw new Error('Failed to send invite')
  }

  return response
}

export type ImportPartnersResult =
  | { success: true; data: any }
  | { success: false; errorMessage: string }

export const importPartners = async (
  params: importPartnersParams
): Promise<ImportPartnersResult> => {
  const { partnerInviteDetails, organizationId } = params

  try {
    const response = await fetcher(`/v2/offline-partner/save`, {
      method: 'POST',
      data: {
        partnerInviteDetails,
        organizationId
      }
    })

    if (!response) {
      return { success: false, errorMessage: 'Failed to import partners' }
    }

    return { success: true, data: response }
  } catch (e: any) {
    const errorMessage =
      e?.response?.data?.errorMessage ??
      e?.response?.data?.message ??
      e?.message ??
      'Failed to import partners'
    return {
      success: false,
      errorMessage
    }
  }
}

export const getOfflinePartnerById = async (id: number) => {
  const response = await fetcher(`/v2/offline-partner/details/id?id=${id}`, {
    method: 'GET'
  })

  if (!response) {
    throw new Error('Failed to fetch partner details')
  }

  return response
}

export const getOfflinePartnerByCode = async (externalPartnerCode: string) => {
  const response = await fetcher(
    `/v2/offline-partner/details/externalPartnerCode?externalPartnerCode=${encodeURIComponent(externalPartnerCode)}`,
    {
      method: 'GET'
    }
  )

  if (!response) {
    throw new Error('Failed to fetch partner details by code')
  }

  return response
}

export type UpdateOfflinePartnerParams = {
  organizationId: number
  email: string
  partnerName: string
  remarks: string
  docId?: string
  effectiveDate?: string
  count?: number
}
export type signedDocumentParams = {
  organizationId: number
  partnerEmail: string
}

export const updateOfflinePartner = async (
  params: UpdateOfflinePartnerParams
) => {
  const { organizationId, email, partnerName, remarks } = params

  const response = await fetcher(`/v2/offline-partner/partner-details`, {
    method: 'PATCH',
    data: {
      organizationId,
      email,
      partnerName,
      remarks
    }
  })

  if (!response) {
    throw new Error('Failed to fetch partner details')
  }

  return response
}

export const uploadContractFile = async (
  params: UpdateOfflinePartnerParams & { binaryPdf: File }
) => {
  const { organizationId, email, binaryPdf, docId, effectiveDate, count } =
    params

  const formData = new FormData()
  formData.append('pdf', binaryPdf) // Attach file
  formData.append(
    'offlinePartnerDocumentRequest',
    JSON.stringify({
      organizationId,
      email,
      effectiveDate: effectiveDate || '',
      expiringDate: '',
      docId: docId || '',
      count: count || 0
    })
  )

  const response = await fetcher(`/v2/offline-partner/uploadContract`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data: formData
  })
  console.log({ response })

  if (!response) {
    throw new Error('Failed to fetch partner details')
  }

  return response
}

export const addSignedDocument = async (
  params: signedDocumentParams & { binaryPdf: File }
) => {
  const { organizationId, partnerEmail, binaryPdf } = params

  const formData = new FormData()
  formData.append('file', binaryPdf)

  const response = await fetcher(
    `/v2/offline-partner/sign-document?organizationId=${organizationId}&partnerEmail=${partnerEmail}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formData
    }
  )

  if (!response) {
    throw new Error('Failed to fetch partner details')
  }

  return response
}

export type GetContractByEmailParams = {
  organizationId: number
  email: string
}

export type OfflinePartnerTableColumnPayload = {
  name: string
  type: 'TEXT' | 'NUMBER' | 'TAG' | 'STATUS' | 'DATE'
  displayOrder: number
  visible: boolean
}

export const getOfflinePartnerDocumentTableByEmail = async (email: string) => {
  const response = await fetcher(
    `/v2/offline-partner/document/table/by-email?email=${encodeURIComponent(email)}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/hal+json'
      }
    }
  )

  if (!response) {
    throw new Error('Failed to fetch offline partner documents table')
  }

  return response
}

export const addOfflinePartnerDocumentColumn = async (
  tableId: number,
  email: string,
  payload: OfflinePartnerTableColumnPayload
) => {
  const response = await fetcher(
    `/v2/offline-partner/document/table/${tableId}/columns?email=${encodeURIComponent(email)}`,
    {
      method: 'POST',
      headers: {
        accept: 'application/hal+json'
      },
      data: payload
    }
  )

  if (!response) {
    throw new Error('Failed to add offline partner document column')
  }

  return response
}

export type RenameOfflinePartnerTableColumnPayload = {
  name: string
}

export const renameOfflinePartnerDocumentColumn = async (
  tableId: number,
  columnId: number,
  email: string,
  payload: RenameOfflinePartnerTableColumnPayload
) => {
  const response = await fetcher(
    `/v2/offline-partner/document/table/${tableId}/columns/${columnId}/rename?email=${encodeURIComponent(email)}`,
    {
      method: 'PATCH',
      headers: {
        accept: 'application/hal+json'
      },
      data: payload
    }
  )

  if (!response) {
    throw new Error('Failed to rename offline partner document column')
  }

  return response
}

export const deleteOfflinePartnerDocumentColumn = async (
  tableId: number,
  columnId: number,
  email: string
) => {
  const response = await fetcher(
    `/v2/offline-partner/document/table/${tableId}/columns/${columnId}?email=${encodeURIComponent(email)}`,
    {
      method: 'DELETE',
      headers: {
        accept: 'application/hal+json'
      }
    }
  )

  if (!response) {
    throw new Error('Failed to delete offline partner document column')
  }

  return response
}

export const getContractByEmail = async (params: GetContractByEmailParams) => {
  const { organizationId, email } = params

  const response = await fetcher(
    `/v2/offline-partner/contract?organizationId=${organizationId}&email=${email}`,
    {
      method: 'GET'
    }
  )

  if (!response) {
    throw new Error('Failed to fetch partner details')
  }

  return response
}
export const getDocumentsByOrgId = async (orgId: number) => {
  const response = await fetch(
    `/api/offline-partner/documents?organizationId=${orgId}`,
    {
      method: 'GET',
      credentials: 'include'
    }
  )

  if (!response.ok) {
    throw new Error('Failed to fetch documents')
  }

  return await response.json()
}

export const uploadFileToExtractAPI = async (params: { binaryPdf: File }) => {
  const { binaryPdf } = params

  const formData = new FormData()
  formData.append('file', binaryPdf)

  // Call the Next.js API route which will handle the backend call with proper timeout
  const response = await fetch('/api/docfetcher/extract-agreement', {
    method: 'POST',
    body: formData,
    // Add timeout for the API call (5 minutes)
    signal: AbortSignal.timeout(300000)
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Document extraction API error:', response.status, errorText)
    throw new Error(`Document extraction failed: ${response.statusText}`)
  }

  const data = await response.json()
  return data
}
