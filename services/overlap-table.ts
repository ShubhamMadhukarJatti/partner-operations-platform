import { fetcher } from '@/lib/server'

const OVERLAP_TABLE_BASE = '/api/Overlap/Field/entity/table'

export interface OverlapTableColumn {
  columnId: number
  name: string
  type: string
  displayOrder: number
  visible: boolean
}

export interface OverlapTableRow {
  rowId: number
  values: Record<string, string>
}

export interface OverlapTableData {
  tableId: number
  tableName: string
  orgId: number
  columns: OverlapTableColumn[]
  rows: OverlapTableRow[]
}

export interface OverlapTableResponse {
  success: boolean
  message: string
  data: OverlapTableData
}

/** Map Overlap column names to PreviewTable field keys */
const COLUMN_TO_FIELD: Record<string, string> = {
  'Partner Name': 'companyName',
  'Company name': 'companyName',
  'Company Name': 'companyName',
  companyName: 'companyName',
  website: 'domain',
  Domain: 'domain',
  domain: 'domain',
  Name: 'name',
  name: 'name',
  Email: 'contactEmail',
  "Partner's Email": 'contactEmail',
  contactEmail: 'contactEmail',
  'Deal Stage': 'dealStage',
  dealStage: 'dealStage',
  'Created on': 'creationDate',
  'Creation Date': 'creationDate',
  creationDate: 'creationDate',
  'Closed on': 'closeDate',
  'Close Date': 'closeDate',
  closeDate: 'closeDate',
  Subscribed: 'subscribed',
  subscribed: 'subscribed',
  'Ticket Size': 'ticketSize',
  ticketSize: 'ticketSize'
}

export interface PreviewTableField {
  companyName?: string
  domain?: string
  name?: string
  contactEmail?: string
  dealStage?: string
  creationDate?: string
  closeDate?: string
  subscribed?: string
  ticketSize?: string
}

/** Transform Overlap table rows to PreviewTable fields format */
export function overlapRowsToPreviewFields(
  columns: OverlapTableColumn[],
  rows: OverlapTableRow[]
): PreviewTableField[] {
  const sortedCols = [...columns]
    .filter((c) => c.visible !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  return rows.map((row) => {
    const field: PreviewTableField = {}
    for (const col of sortedCols) {
      const fieldKey = COLUMN_TO_FIELD[col.name] ?? col.name
      const val = row.values[String(col.columnId)] ?? ''
      ;(field as Record<string, string>)[fieldKey] = val
    }
    return field
  })
}

/** Get Overlap table data - used by PreviewTable */
export const getOverlapTableData = async (
  recordType: string = 'CUSTOMER'
): Promise<OverlapTableResponse> => {
  const response = await fetcher<OverlapTableResponse>(
    `${OVERLAP_TABLE_BASE}/overlap?recordType=${encodeURIComponent(recordType)}`,
    {
      method: 'GET',
      headers: { Accept: 'application/hal+json' }
    }
  )

  if (!response?.success || !response?.data) {
    throw new Error(response?.message ?? 'Failed to fetch overlap table')
  }

  return response
}
