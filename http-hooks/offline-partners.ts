'use client'

import React from 'react'
import {
  selectAllRows,
  selectRow,
  setRows,
  TableRow,
  unselectAllRows,
  unselectRow
} from '@/redux/features/tableSlice'
import { RootState } from '@/redux/store'
import {
  addOfflinePartnerDocumentColumn,
  addPartnersToGroup,
  addPartnerTableColumn,
  AddPartnerTableColumnParams,
  addSignedDocument,
  deleteOfflinePartnerDocumentColumn,
  deleteOfflinePartners,
  getAllOfflinePartners,
  getContractByEmail,
  GetContractByEmailParams,
  getDocumentsByOrgId,
  getOfflinePartnerAssignment,
  getOfflinePartnerByCode,
  getOfflinePartnerById,
  getOfflinePartnerDocumentTableByEmail,
  getOfflinePartners,
  getPartnerTableByOrg,
  ImportPartnersResult,
  OfflinePartnerTableColumnPayload,
  PartnerTableByOrgResponse,
  PartnerTableRow,
  removePartnerTableColumn,
  renameOfflinePartnerDocumentColumn,
  RenameOfflinePartnerTableColumnPayload,
  renamePartnerTableColumn,
  RenamePartnerTableColumnParams,
  saveOfflinePartnerAssignment,
  sendInvite,
  signedDocumentParams,
  updateOfflinePartner,
  UpdateOfflinePartnerParams,
  updatePartnerTableColumnOrder,
  UpdatePartnerTableColumnOrderParams,
  updatePartnerTableRowValues,
  UpdatePartnerTableRowValuesParams,
  uploadContractFile
} from '@/services/offline-partners'
import { AddToGroupPayload, DeleteOfflinePartnersParams } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'

import { COLORS } from '@/lib/colors'
import { isDummyFlow } from '@/lib/dummy-flow'
import { showCustomToast } from '@/components/custom-toast'
import { DUMMY_PARTNERS_DATA } from '@/app/(app)/(dashboard-pages)/offline-partners/constants'

// Types and Interfaces
export interface OfflinePartner {
  id: string
  partnerName: string
  status: PartnerStatus
  email: string
  group: string
  remarks: string
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationId: number
  partnerGroup: string
  offlinePartnerMessageCode: string
}

export enum PartnerStatus {
  PENDING = 'PENDING',
  INVITE_SENT = 'INVITE_SENT',
  SENT = 'SENT',
  VERIFIED = 'VERIFIED',
  ONBOARDED = 'ONBOARDED',
  UNINVITED = 'UNINVITED',
  INVITE_NOT_SENT = 'INVITE_NOT_SENT'
}

interface TableState {
  selectedRows: string[]
  rows: TableRow[]
  isAllSelected: boolean
  orgId?: number
}

interface UseImportPartnersOptions {
  onSuccess?: () => void
  onError?: (error: any) => void
}

// Helper function to transform dummy data
const transformDummyData = (): OfflinePartner[] => {
  return DUMMY_PARTNERS_DATA.map((dummy) => ({
    id: dummy.id,
    partnerName:
      dummy.rowDetails.find((d) => d.id === 'partnerName')?.value || '',
    email: dummy.rowDetails.find((d) => d.id === 'partnerEmail')?.value || '',
    status: (dummy.rowDetails.find((d) => d.id === 'partnerStatus')?.value ||
      'PENDING') as PartnerStatus,
    partnerGroup:
      dummy.rowDetails.find((d) => d.id === 'partnerGroup')?.value || '',
    remarks:
      dummy.rowDetails.find((d) => d.id === 'partnerRemarks')?.value || '',
    organizationId: 1,
    offlinePartnerMessageCode: dummy.id,
    creationTimestamp: '2024-01-01T00:00:00Z',
    lastUpdatedTimestamp: '2024-01-01T00:00:00Z',
    group: dummy.rowDetails.find((d) => d.id === 'partnerGroup')?.value || ''
  }))
}

// Helper function to filter data by tab value
const filterPartnersByTab = (
  tabValue: string,
  data: OfflinePartner[]
): OfflinePartner[] => {
  if (tabValue === 'ALL') return data
  return data.filter((partner) => {
    switch (tabValue) {
      case 'INVITE_SENT':
        return partner.status === 'INVITE_SENT' || partner.status === 'SENT'
      case 'VERIFIED':
        return partner.status === 'VERIFIED'
      case 'ONBOARDED':
        return partner.status === 'ONBOARDED'
      case 'INVITE_NOT_SENT':
        return (
          partner.status === 'INVITE_NOT_SENT' || partner.status === 'UNINVITED'
        )
      default:
        return true
    }
  })
}

// Map API column names to table rowDetail ids (for OfflinePartnersTable)
const COLUMN_NAME_TO_DETAIL_ID: Record<string, string> = {
  'Partner Name': 'partnerName',
  Status: 'partnerStatus',
  Email: 'partnerEmail',
  'Partner Group': 'partnerGroup',
  Remarks: 'partnerRemarks',
  'Verify Email Sent': 'verifyEmailSent',
  'Message Code': 'messageCode',
  'Is Member': 'isMember'
}

/** Map API column name to row detail id (accessorKey). Exported for dynamic table columns. */
export const getDetailIdForColumn = (columnName: string): string => {
  const mapped = COLUMN_NAME_TO_DETAIL_ID[columnName]
  if (mapped) return mapped
  const slug =
    columnName
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, '')
      .toLowerCase() || `col_${columnName}`
  return slug
}

const mapColumnTypeToRowDetailType = (
  apiType: string
): 'heading' | 'badge' | 'text' | 'custom' => {
  switch (apiType) {
    case 'STATUS':
      return 'badge'
    case 'TEXT':
    case 'TAG':
    default:
      return 'text'
  }
}

/** Transform partner table API response into TableRow[] for Redux/AdvancedTable */
export function partnerTableDataToTableRows(
  data: PartnerTableByOrgResponse['data']
): TableRow[] {
  const { columns, rows, orgId } = data
  const sortedColumns = [...columns]
    .filter((c) => c.visible)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  // Find the Message Code column to use in the URL
  const messageCodeColumn = columns.find((c) => c.name === 'Message Code')
  const messageCodeColumnId = messageCodeColumn
    ? String(messageCodeColumn.columnId)
    : null

  return rows.map((row) => {
    const rowDetails = sortedColumns.map((col) => {
      const value = row.values[String(col.columnId)] ?? ''
      const detailId = getDetailIdForColumn(col.name)
      const isPartnerName = col.name === 'Partner Name'
      const type: 'heading' | 'badge' | 'text' | 'custom' = isPartnerName
        ? 'heading'
        : mapColumnTypeToRowDetailType(col.type)
      return {
        id: detailId,
        type,
        value: String(value),
        ...(isPartnerName && { className: 'text-sm font-medium' })
      }
    })

    // Use Message Code if available, otherwise fall back to rowId
    const messageCode = messageCodeColumnId
      ? row.values[messageCodeColumnId]
      : null
    const urlIdentifier = messageCode || row.rowId

    return {
      href: `/offline-partners/partnership/${urlIdentifier}`,
      orgId,
      rowDetails
    }
  })
}

/** Filter partner table rows by tab (status) */
function filterPartnerTableRowsByTab(
  data: PartnerTableByOrgResponse['data'],
  tabValue: string
): PartnerTableRow[] {
  if (tabValue === 'ALL') return data.rows
  const statusCol = data.columns.find(
    (c) => c.name === 'Status' || c.name === 'status'
  )
  if (!statusCol) return data.rows
  const statusColumnId = String(statusCol.columnId)
  return data.rows.filter((row) => {
    const status = row.values[statusColumnId] ?? ''
    switch (tabValue) {
      case 'INVITE_SENT':
        return status === 'INVITE_SENT' || status === 'SENT'
      case 'VERIFIED':
        return status === 'VERIFIED'
      case 'ONBOARDED':
        return status === 'ONBOARDED'
      case 'INVITE_NOT_SENT':
        return status === 'INVITE_NOT_SENT' || status === 'UNINVITED'
      default:
        return true
    }
  })
}

/** Filter TableRow[] by tab (status) for display. Exported for list page counts. */
export function filterTableRowsByTab(
  rows: TableRow[],
  tabValue: string
): TableRow[] {
  if (tabValue === 'ALL') return rows
  return rows.filter((row) => {
    const status =
      row.rowDetails.find((d) => d.id === 'partnerStatus')?.value ?? ''
    switch (tabValue) {
      case 'INVITE_SENT':
        return status === 'INVITE_SENT' || status === 'SENT'
      case 'VERIFIED':
        return status === 'VERIFIED'
      case 'ONBOARDED':
        return status === 'ONBOARDED'
      case 'INVITE_NOT_SENT':
        return status === 'INVITE_NOT_SENT' || status === 'UNINVITED'
      default:
        return true
    }
  })
}

/** Empty partner table response used when API returns 500 (e.g. no table for org) */
const EMPTY_PARTNER_TABLE_RESPONSE: PartnerTableByOrgResponse = {
  success: true,
  message: '',
  data: {
    tableId: 0,
    tableName: '',
    orgId: 0,
    columns: [],
    rows: []
  }
}

export const usePartnerTableByOrg = (options?: { enabled?: boolean }) => {
  return useQuery<PartnerTableByOrgResponse, Error>({
    queryKey: ['partner-table-by-org'],
    queryFn: async () => {
      try {
        const res = await getPartnerTableByOrg()
        if (!res?.success || !res?.data) {
          return EMPTY_PARTNER_TABLE_RESPONSE
        }
        return res
      } catch {
        return EMPTY_PARTNER_TABLE_RESPONSE
      }
    },
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useAddPartnerTableColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: AddPartnerTableColumnParams) =>
      addPartnerTableColumn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-table-by-org'] })
    }
  })
}

export const useRenamePartnerTableColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: RenamePartnerTableColumnParams) =>
      renamePartnerTableColumn(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-table-by-org'] })
    }
  })
}

export const useUpdatePartnerTableColumnOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdatePartnerTableColumnOrderParams) =>
      updatePartnerTableColumnOrder(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-table-by-org'] })
    }
  })
}

export const useUpdatePartnerTableRowValues = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (params: UpdatePartnerTableRowValuesParams) =>
      updatePartnerTableRowValues(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-table-by-org'] })
    }
  })
}

export const useRemovePartnerTableColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (columnId: number) => {
      const result = await removePartnerTableColumn(columnId)
      return (result as any)?.data ?? result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-table-by-org'] })
      showCustomToast('Success', 'Column deleted successfully', 'success', 3000)
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.message ?? 'Failed to delete column',
        'error',
        5000
      )
    }
  })
}

// Data Fetching Hook
export const useOfflinePartnersData = (tabValue: string) => {
  // Get organization from Redux instead of fetching it
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved
  const organizationId = organization?.id

  // Check if we're in dummy flow
  const inDummyFlow = React.useMemo(() => isDummyFlow(), [])

  // Transform dummy data once
  const mockPartnersData = React.useMemo(() => {
    if (!inDummyFlow) return null
    return transformDummyData()
  }, [inDummyFlow])

  // Filter dummy data by tab value
  const filteredMockData = React.useMemo(() => {
    if (!mockPartnersData) return null
    return filterPartnersByTab(tabValue, mockPartnersData)
  }, [mockPartnersData, tabValue])

  // Always call useQuery, but conditionally enable it
  const queryResult = useQuery<OfflinePartner[], Error>({
    queryKey: ['offline-partners', tabValue, organizationId],
    queryFn: async () => {
      try {
        // Allow empty organizationId - API will handle it
        const partners = await getOfflinePartners(tabValue, organizationId)
        return partners
      } catch (error) {
        throw new Error(
          error instanceof Error ? error.message : 'Failed to fetch partners'
        )
      }
    },
    retry: false,
    enabled: !inDummyFlow, // Allow query to run even without organizationId (API handles it)
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // If in dummy flow, return filtered mock data
  if (inDummyFlow && filteredMockData) {
    return {
      data: filteredMockData,
      isLoading: false,
      isPending: false,
      isFetching: false,
      isError: false,
      isFetched: true,
      error: null,
      status: 'success' as const,
      refetch: () => {}
    }
  }

  return queryResult
}

export const useAllOfflinePartners = (options?: { enabled?: boolean }) => {
  // Get organization from Redux instead of fetching it
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved
  const organizationId = organization?.id

  // Check if we're in dummy flow
  const inDummyFlow = isDummyFlow()

  // Always call useQuery, but conditionally enable it
  const queryResult = useQuery<any[], Error>({
    queryKey: ['offline-partners-all', organizationId],
    queryFn: async () => {
      try {
        // Allow empty organizationId - API will handle it
        const partners = await getAllOfflinePartners(organizationId)
        return partners
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : 'Failed to fetch offline partners'
        )
      }
    },
    retry: false,
    enabled: !inDummyFlow && (options?.enabled ?? true), // Allow query to run even without organizationId
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // If in dummy flow, return mock data
  if (inDummyFlow) {
    const mockPartners = [
      {
        id: 1,
        partnerName: 'TechCorp Solutions Inc.',
        email: 'contact@techcorp.com',
        status: 'VERIFIED',
        organizationId: 1
      },
      {
        id: 2,
        partnerName: 'InnovateX Labs',
        email: 'partnerships@innovatex.com',
        status: 'INVITE_SENT',
        organizationId: 1
      }
    ]

    return {
      data: mockPartners,
      isLoading: false,
      isPending: false,
      isFetching: false,
      isError: false,
      isFetched: true,
      error: null,
      status: 'success',
      refetch: () => {}
    }
  }

  return queryResult
}

export const useOfflinePartnerAssignment = (
  partnerOrgId?: string | number,
  options?: { enabled?: boolean }
) => {
  // Check if we're in dummy flow
  const inDummyFlow = isDummyFlow(partnerOrgId)

  // Always call useQuery, but conditionally enable it
  const queryResult = useQuery<any>({
    queryKey: ['offline-partner-assignment', partnerOrgId],
    queryFn: async () => {
      if (!partnerOrgId) {
        return null
      }
      return await getOfflinePartnerAssignment(partnerOrgId)
    },
    enabled: !inDummyFlow && (options?.enabled ?? true) && !!partnerOrgId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // If in dummy flow, return mock data
  if (inDummyFlow) {
    const mockAssignmentData = partnerOrgId
      ? {
          partnerOrgId: partnerOrgId,
          assignedUsers: [
            {
              userId: 'user_1',
              name: 'John Doe',
              email: 'john@company.com',
              role: 'Account Manager'
            },
            {
              userId: 'user_2',
              name: 'Jane Smith',
              email: 'jane@company.com',
              role: 'Technical Lead'
            }
          ],
          teamId: 'team_1',
          assignmentDate: '2024-01-15T10:00:00Z'
        }
      : null

    return {
      data: mockAssignmentData,
      isLoading: false,
      isFetching: false,
      isError: false,
      isFetched: true,
      error: null,
      status: 'success',
      refetch: () => {}
    }
  }

  return queryResult
}

// Table Management Hook
export const useOfflinePartnersTable = (tabValue: string) => {
  const dispatch = useDispatch()

  const { selectedRows, rows, isAllSelected } = useSelector<
    RootState,
    TableState
  >((state: RootState) => ({
    selectedRows: state.table.selectedRows,
    rows: state.table.rows,
    isAllSelected:
      state.table.rows.length > 0 &&
      state.table.selectedRows.length === state.table.rows.length
  }))

  const inDummyFlow = React.useMemo(() => isDummyFlow(), [])

  // New API: GET /api/external/partner/table/org (used when not in dummy flow)
  const {
    data: partnerTableResponse,
    isPending: isTablePending,
    error: tableError,
    isError: isTableError
  } = usePartnerTableByOrg({ enabled: !inDummyFlow })

  // Legacy API + dummy: useOfflinePartnersData (used when in dummy flow)
  const {
    data: partners,
    isPending: isPartnersPending,
    error: partnersError,
    isError: isPartnersError
  } = useOfflinePartnersData(tabValue)

  // Use appropriate loading/error states based on flow
  const isPending = inDummyFlow ? isPartnersPending : isTablePending
  const error = inDummyFlow ? partnersError : tableError
  const isError = inDummyFlow ? isPartnersError : isTableError

  // Use the partners data directly (already filtered and includes dummy data if in dummy flow)
  const finalPartners = React.useMemo(() => {
    return partners || []
  }, [partners])

  // Memoize the status classes object
  const STATUS_CLASSES = React.useMemo(
    () => ({
      [PartnerStatus.PENDING]: COLORS.WARNING,
      [PartnerStatus.INVITE_SENT]: COLORS.WARNING,
      [PartnerStatus.SENT]: COLORS.WARNING,
      [PartnerStatus.VERIFIED]: COLORS.INFO,
      [PartnerStatus.ONBOARDED]: COLORS.SUCCESS,
      [PartnerStatus.UNINVITED]: COLORS.DISABLED,
      [PartnerStatus.INVITE_NOT_SENT]: COLORS.DISABLED
    }),
    []
  )

  const getClassNameForStatus = React.useCallback(
    (status: string): string => {
      return (
        STATUS_CLASSES[status.toUpperCase() as PartnerStatus] || 'bg-default'
      )
    },
    [STATUS_CLASSES]
  )

  // When using new API: transform partner table response to TableRow[] and filter by tab
  React.useEffect(() => {
    if (inDummyFlow) return // Skip for dummy flow
    if (partnerTableResponse?.data) {
      const allRows = partnerTableDataToTableRows(partnerTableResponse.data)
      const filtered = filterTableRowsByTab(allRows, tabValue)
      dispatch(setRows(filtered))
    } else if (!isTablePending) {
      dispatch(setRows([]))
    }
  }, [
    inDummyFlow,
    partnerTableResponse?.data,
    isTablePending,
    tabValue,
    dispatch
  ])

  // When in dummy flow: transform legacy partners to TableRow[]
  React.useEffect(() => {
    if (!inDummyFlow) return // Skip for non-dummy flow
    if (finalPartners && finalPartners.length > 0) {
      const tableRows = finalPartners.map((partner) => {
        // Use offlinePartnerMessageCode for the URL, fallback to id if not available
        const urlIdentifier = partner.offlinePartnerMessageCode || partner.id

        return {
          href: `/offline-partners/partnership/${urlIdentifier}`,
          orgId: partner.organizationId,
          isDummy: true,
          rowDetails: [
            {
              type: 'heading' as const,
              value: partner.partnerName || 'N/A',
              className: 'text-sm font-medium',
              id: 'partnerName'
            },
            {
              type: 'badge' as const,
              value: partner.status || PartnerStatus.PENDING,
              className: getClassNameForStatus(
                (partner.status || PartnerStatus.PENDING).toUpperCase()
              ),
              id: 'partnerStatus'
            },
            {
              type: 'text' as const,
              value: partner.email || 'N/A',
              id: 'partnerEmail'
            },
            {
              type: 'text' as const,
              value: partner.partnerGroup || 'N/A',
              id: 'partnerGroup'
            },
            {
              type: 'text' as const,
              value: partner.remarks || 'N/A',
              id: 'partnerRemarks'
            }
          ]
        }
      })

      dispatch(setRows(tableRows))
    } else {
      // Clear rows when there's no data
      dispatch(setRows([]))
    }
  }, [finalPartners, dispatch, getClassNameForStatus, inDummyFlow])

  const handleRowSelect = React.useCallback(
    (href: string): void => {
      dispatch(
        selectedRows.includes(href) ? unselectRow(href) : selectRow(href)
      )
    },
    [dispatch, selectedRows]
  )

  const handleSelectAll = React.useCallback((): void => {
    dispatch(isAllSelected ? unselectAllRows() : selectAllRows())
  }, [dispatch, isAllSelected])

  const getSelectedRowsData = React.useCallback((): TableRow[] => {
    return rows.filter((row) => selectedRows.includes(row.href))
  }, [rows, selectedRows])

  const getSelectedRowsEmails = React.useCallback((): string[] => {
    return rows
      .filter((row) => selectedRows.includes(row.href))
      .map(
        (row) =>
          row.rowDetails.find((detail) => detail.id === 'partnerEmail')?.value
      )
      .filter((email): email is string => email !== undefined)
  }, [rows, selectedRows])

  // Sorted visible columns from API (null when dummy flow or no table data)
  const tableColumns = React.useMemo(() => {
    if (inDummyFlow || !partnerTableResponse?.data?.columns) return null
    return [...partnerTableResponse.data.columns]
      .filter((c) => c.visible)
      .sort((a, b) => a.displayOrder - b.displayOrder)
  }, [inDummyFlow, partnerTableResponse?.data?.columns])

  const tableId = partnerTableResponse?.data?.tableId ?? null

  return {
    selectedRows,
    isAllSelected,
    rows,
    isLoading: isPending,
    error,
    isError,
    tableColumns,
    tableId,
    handleRowSelect,
    handleSelectAll,
    getSelectedRowsData,
    getSelectedRowsEmails
  }
}

export const useAddPartnersToGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AddToGroupPayload) => {
      return await addPartnersToGroup(payload)
    },
    onSuccess: () => {
      // Invalidate all offline-partners queries (including all tabs)
      // This is necessary because adding to group affects all tabs
      queryClient.invalidateQueries({
        queryKey: ['offline-partners'],
        exact: false // Invalidate all queries starting with 'offline-partners'
      })
      showCustomToast(
        'Success',
        'Partners added to group successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to add partners to group',
        'error',
        5000
      )
    }
  })
}
//

export const useSaveOfflinePartnerAssignment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: {
      userId: string
      partnerOrgId: string | number
    }) => await saveOfflinePartnerAssignment(params),
    onSuccess: (_, variables) => {
      // Invalidate specific queries instead of broad invalidation
      queryClient.invalidateQueries({
        queryKey: ['offline-partners-all'],
        exact: true
      })
      queryClient.invalidateQueries({
        queryKey: ['offline-partners'],
        exact: false // Invalidate all tab variants
      })
      queryClient.invalidateQueries({
        queryKey: ['offline-partner-assignment', variables.partnerOrgId],
        exact: true
      })
      showCustomToast(
        'Success',
        'Partner manager assigned successfully',
        'success',
        5000
      )
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.message ?? 'Failed to assign partner manager. Please try again.',
        'error',
        5000
      )
    }
  })
}

export const useDeleteOfflinePartners = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()

  return useMutation({
    mutationFn: async (params: DeleteOfflinePartnersParams) => {
      return await deleteOfflinePartners(params.organizationId, params.email)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['offline-partners'],
        exact: false // Invalidate all tab variants
      })
      dispatch(unselectAllRows())
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to delete partners',
        'error',
        5000
      )
    }
  })
}

interface SendInviteParams {
  organizationId: number
  invites: { email: string; name: string }[]
}

export interface importPartnersParams {
  organizationId: number | undefined
  partnerInviteDetails: {
    partnerName: string
    remarks?: string
    email: string
    company: string
    isMember?: boolean
    partnerOrganizationId?: number
  }[]
}

export const useSendInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: SendInviteParams) => {
      const { organizationId, invites } = params
      await Promise.all(
        invites.map((inv) => {
          const payload = {
            organizationId,
            email: inv.email,
            name: inv.name || inv.email
          }
          return fetch('/api/offline-partner/invites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(payload)
          }).then(async (res) => {
            const data = await res.json()
            if (!res.ok) {
              throw new Error(
                data?.errorMessage ?? data?.message ?? 'Failed to send invite'
              )
            }
          })
        })
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['offline-partners'],
        exact: false // Invalidate all tab variants
      })
      showCustomToast('Success', 'Invite sent successfully', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to send invite',
        'error',
        5000
      )
    }
  })
}

export const useImportPartners = (options?: UseImportPartnersOptions) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      params: importPartnersParams
    ): Promise<ImportPartnersResult> => {
      const res = await fetch('/api/offline-partner/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      })
      const result = (await res.json()) as ImportPartnersResult
      return result
    },
    onSuccess: (result: ImportPartnersResult) => {
      if (!result.success) {
        showCustomToast('Error', result.errorMessage, 'error', 5000)
        options?.onError?.({ message: result.errorMessage } as Error)
        return
      }
      queryClient.invalidateQueries({
        queryKey: ['offline-partners'],
        exact: false // Invalidate all tab variants
      })
      queryClient.invalidateQueries({
        queryKey: ['partner-table-by-org']
      })
      queryClient.invalidateQueries({
        queryKey: ['offline-partners-all'],
        exact: false
      })
      // Delayed refetch to handle backend propagation delay
      setTimeout(() => {
        queryClient.refetchQueries({
          queryKey: ['partner-table-by-org']
        })
        queryClient.refetchQueries({
          queryKey: ['offline-partners'],
          exact: false
        })
        queryClient.refetchQueries({
          queryKey: ['offline-partners-all'],
          exact: false
        })
      }, 2000)
      showCustomToast(
        'Success',
        'Partners imported successfully',
        'success',
        5000
      )
      options?.onSuccess?.()
    },
    onError: (error) => {
      const rawMessage =
        error instanceof Error ? error.message : 'Failed to import partners'
      const isGeneric =
        typeof rawMessage === 'string' &&
        rawMessage.startsWith(
          'An error occurred in the Server Components render'
        )
      const message = isGeneric
        ? 'Failed to import partners. Please try again.'
        : rawMessage
      showCustomToast('Error', message, 'error', 5000)
      options?.onError?.(error)
    }
  })
}

export const useOfflinePartnerDetails = (partnerId: number) => {
  return useQuery<any>({
    queryKey: ['offline-partner-details', partnerId],
    queryFn: async () => {
      try {
        const partner = await getOfflinePartnerById(partnerId)
        return partner
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : 'Failed to fetch partner details'
        )
      }
    },
    retry: false,
    enabled: !!partnerId,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useOfflinePartnerDetailsByCode = (externalPartnerCode: string) => {
  return useQuery<any>({
    queryKey: ['offline-partner-details-by-code', externalPartnerCode],
    queryFn: async () => {
      try {
        const partner = await getOfflinePartnerByCode(externalPartnerCode)
        return partner
      } catch (error) {
        throw new Error(
          error instanceof Error
            ? error.message
            : 'Failed to fetch partner details by code'
        )
      }
    },
    retry: false,
    enabled: !!externalPartnerCode,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export const useUpdateOfflinePartner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: UpdateOfflinePartnerParams) =>
      await updateOfflinePartner(params),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['offline-partners'],
        exact: false // Invalidate all tab variants
      })
      showCustomToast(
        'Success',
        'Partner updated successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to update partner',
        'error',
        5000
      )
    }
  })
}

export const useUploadContractFile = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (
      params: UpdateOfflinePartnerParams & { binaryPdf: File }
    ) => {
      return await uploadContractFile(params)
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['contract-of-partner'] })
      // Invalidate table query to auto-fetch after contract upload
      if (variables.email) {
        queryClient.invalidateQueries({
          queryKey: ['offline-partner-document-table', variables.email]
        })
      }
      showCustomToast(
        'Success',
        'Contract uploaded successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      console.log(error)
      showCustomToast(
        'Error',
        error?.message ?? 'Failed to upload contract',
        'error',
        5000
      )
    }
  })
}

export const useUploadSignDocument = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: signedDocumentParams & { binaryPdf: File }) =>
      await addSignedDocument(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-of-partner'] })
      showCustomToast(
        'Success',
        'Signed document added successfully',
        'success',
        5000
      )
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.errorMessage ??
        error?.errorMessage ??
        error?.message ??
        'Failed to add signed document'
      showCustomToast('Error', message, 'error', 5000)
    }
  })
}

export const useFetchOfflinePartnerDocumentTable = (email?: string) => {
  const isEnabled = !!email && email.trim() !== ''

  return useQuery({
    queryKey: ['offline-partner-document-table', email],
    queryFn: async () => {
      const result = await getOfflinePartnerDocumentTableByEmail(email!)
      return (result as any)?.data ?? result
    },
    enabled: isEnabled,
    retry: false,
    refetchOnWindowFocus: false
  })
}

export const useAddOfflinePartnerDocumentColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      tableId: number
      email: string
      payload: OfflinePartnerTableColumnPayload
    }) => {
      const { tableId, email, payload } = params
      const result = await addOfflinePartnerDocumentColumn(
        tableId,
        email,
        payload
      )
      return (result as any)?.data ?? result
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['offline-partner-document-table', variables.email]
      })
      showCustomToast('Success', 'Column added successfully', 'success', 3000)
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.message ?? 'Failed to add column',
        'error',
        5000
      )
    }
  })
}

export const useRenameOfflinePartnerDocumentColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      tableId: number
      columnId: number
      email: string
      payload: RenameOfflinePartnerTableColumnPayload
    }) => {
      const { tableId, columnId, email, payload } = params
      const result = await renameOfflinePartnerDocumentColumn(
        tableId,
        columnId,
        email,
        payload
      )
      return (result as any)?.data ?? result
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['offline-partner-document-table', variables.email]
      })
      showCustomToast('Success', 'Column renamed successfully', 'success', 3000)
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.message ?? 'Failed to rename column',
        'error',
        5000
      )
    }
  })
}

export const useDeleteOfflinePartnerDocumentColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      tableId: number
      columnId: number
      email: string
    }) => {
      const { tableId, columnId, email } = params
      const result = await deleteOfflinePartnerDocumentColumn(
        tableId,
        columnId,
        email
      )
      return (result as any)?.data ?? result
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['offline-partner-document-table', variables.email]
      })
      showCustomToast('Success', 'Column deleted successfully', 'success', 3000)
    },
    onError: (error: any) => {
      showCustomToast(
        'Error',
        error?.message ?? 'Failed to delete column',
        'error',
        5000
      )
    }
  })
}

export const useFetchContractOfPartner = (params: GetContractByEmailParams) => {
  const { organizationId, email } = params
  const isEnabled =
    typeof organizationId === 'number' &&
    organizationId > 0 &&
    !!email &&
    email.trim() !== ''

  // Check if we're in dummy flow
  const inDummyFlow = isDummyFlow()

  // Always call useQuery, but conditionally enable it
  const queryResult = useQuery({
    queryKey: ['contract-of-partner', organizationId, email],
    queryFn: async () => {
      try {
        const result = await getContractByEmail(params)
        return result
      } catch (error) {
        console.error('Error fetching contract data:', error)
        throw error
      }
    },
    enabled: !inDummyFlow && isEnabled,
    retry: false,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    refetchOnReconnect: true
  })

  // If in dummy flow, return mock data
  if (inDummyFlow) {
    const mockContractData = [
      {
        id: 1,
        contractName: 'Partnership Agreement.pdf',
        status: 'SIGNED',
        signedDate: '2024-01-15T10:00:00Z',
        emailUsed: email,
        sentDate: '2024-01-10T09:00:00Z',
        type: 'PARTNERSHIP_AGREEMENT'
      },
      {
        id: 2,
        contractName: 'NDA Contract.pdf',
        status: 'SIGNED',
        signedDate: '2024-01-12T14:00:00Z',
        emailUsed: email,
        sentDate: '2024-01-08T11:00:00Z',
        type: 'NDA'
      }
    ]

    return {
      data: mockContractData,
      isLoading: false,
      isFetching: false,
      isError: false,
      isFetched: true,
      error: null,
      status: 'success',
      refetch: () => {}
    }
  }

  return queryResult
}
export const useFetchDocuments = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  // Check if we're in dummy flow
  const inDummyFlow = isDummyFlow()

  // Always call useQuery, but conditionally enable it
  const queryResult = useQuery({
    queryKey: ['document-of-partner'],
    queryFn: async () => await getDocumentsByOrgId(organization?.id),
    enabled: !inDummyFlow && !!organization?.id
  })

  // If in dummy flow, return mock data
  if (inDummyFlow) {
    const mockDocumentsData = [
      {
        id: 1,
        documentName: 'Technical Specifications.docx',
        uploadDate: '2024-01-20T16:00:00Z',
        fileSize: '2.5 MB',
        fileType: 'DOCX',
        status: 'UPLOADED'
      },
      {
        id: 2,
        documentName: 'Product Roadmap.pdf',
        uploadDate: '2024-01-18T13:00:00Z',
        fileSize: '1.8 MB',
        fileType: 'PDF',
        status: 'UPLOADED'
      }
    ]

    return {
      data: mockDocumentsData,
      isLoading: false,
      isFetching: false,
      isError: false,
      isFetched: true,
      error: null,
      status: 'success',
      refetch: () => {}
    }
  }

  return queryResult
}
