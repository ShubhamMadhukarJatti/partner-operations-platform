'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  getDetailIdForColumn,
  useAddPartnerTableColumn,
  useOfflinePartnersTable,
  useRemovePartnerTableColumn,
  useRenamePartnerTableColumn,
  useUpdatePartnerTableColumnOrder,
  useUpdatePartnerTableRowValues
} from '@/http-hooks/offline-partners'
import { TableRow } from '@/redux/features/tableSlice'
import { ArrowLeft, ArrowRight, Check, ChevronDown, Trash2 } from 'lucide-react'

import { AdvancedTable } from '@/components/ui/advanced-table'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/components/ui/sonner'
import { CellTextWithTooltip } from '@/components/ui/table/TableCell'
import type { Column, ColumnType } from '@/components/ui/table/types'
import { showCustomToast } from '@/components/custom-toast'

import { DUMMY_PARTNERS_DATA } from '../constants'
import ActionButtons from './ActionButtons'
import DummyTag from './DummyTag'

interface Props {
  tabValue: string
}

const OfflinePartnersTable: React.FC<Props> = ({ tabValue }) => {
  const router = useRouter()
  const {
    selectedRows,
    rows,
    isLoading,
    error,
    isError,
    tableColumns,
    tableId,
    handleRowSelect
  } = useOfflinePartnersTable(tabValue)

  const addColumnMutation = useAddPartnerTableColumn()
  const renameColumnMutation = useRenamePartnerTableColumn()
  const updateColumnOrderMutation = useUpdatePartnerTableColumnOrder()
  const updateRowValuesMutation = useUpdatePartnerTableRowValues()
  const deleteColumnMutation = useRemovePartnerTableColumn()

  const mapColumnTypeToApi = (type: ColumnType): 'TEXT' | 'STATUS' | 'TAG' => {
    switch (type) {
      case 'status':
        return 'STATUS'
      case 'tags':
        return 'TAG'
      case 'text':
      case 'number':
      case 'calendar':
      default:
        return 'TEXT'
    }
  }

  const handleAddColumnRequest = React.useCallback(
    async (params: { name: string; type: ColumnType }) => {
      if (tableId == null) return
      try {
        await addColumnMutation.mutateAsync({
          tableId,
          name: params.name,
          type: mapColumnTypeToApi(params.type)
        })
        toast.success('Column added successfully')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to add column')
        throw err
      }
    },
    [tableId, addColumnMutation]
  )

  const handleRenameColumnRequest = React.useCallback(
    async (params: { columnId: number; newName: string }) => {
      try {
        await renameColumnMutation.mutateAsync({
          columnId: params.columnId,
          newName: params.newName
        })
        toast.success('Column renamed successfully')
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to rename column'
        )
        throw err
      }
    },
    [renameColumnMutation]
  )

  const handleColumnOrderChangeRequest = React.useCallback(
    async (params: { columnId: number; newOrder: number }) => {
      try {
        await updateColumnOrderMutation.mutateAsync({
          columnId: params.columnId,
          newOrder: params.newOrder
        })
        toast.success('Column order updated successfully')
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to update column order'
        )
        throw err
      }
    },
    [updateColumnOrderMutation]
  )

  const handleDeleteColumnRequest = React.useCallback(
    async (columnId: number) => {
      try {
        await deleteColumnMutation.mutateAsync(columnId)
        toast.success('Column deleted successfully')
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to delete column'
        )
        throw err
      }
    },
    [deleteColumnMutation]
  )

  const handleRowUpdateRequest = React.useCallback(
    async (params: { rowId: number; accessorKey: string; value: string }) => {
      if (!tableColumns?.length) return
      const col = tableColumns.find(
        (c) => getDetailIdForColumn(c.name) === params.accessorKey
      )
      if (!col) return
      try {
        await updateRowValuesMutation.mutateAsync({
          rowId: params.rowId,
          values: { [String(col.columnId)]: params.value }
        })
        toast.success('Cell updated successfully')
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : 'Failed to update cell'
        )
        throw err
      }
    },
    [tableColumns, updateRowValuesMutation]
  )

  console.log('rows', rows)

  // Filter dummy data based on current tab
  const getFilteredDummyData = React.useCallback((tabValue: string) => {
    if (tabValue === 'ALL') return DUMMY_PARTNERS_DATA

    return DUMMY_PARTNERS_DATA.filter((dummyRow) => {
      const status = dummyRow.rowDetails.find(
        (detail) => detail.id === 'partnerStatus'
      )?.value

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
  }, [])

  // Always combine real data with filtered dummy data
  const filteredDummyData = React.useMemo(
    () => getFilteredDummyData(tabValue) || [],
    [getFilteredDummyData, tabValue]
  )
  const displayRows = React.useMemo(
    () => (isLoading ? [] : [...(rows || []), ...filteredDummyData]),
    [isLoading, rows, filteredDummyData]
  )

  // Debug log to verify dummy data is being included
  React.useEffect(() => {
    console.log('Display rows:', {
      realRows: rows.length,
      dummyRows: filteredDummyData.length,
      total: displayRows.length,
      tabValue
    })
  }, [rows.length, filteredDummyData.length, displayRows.length, tabValue])

  // Handle dummy data actions with toast
  const handleDummyAction = React.useCallback((action: string) => {
    showCustomToast(
      'Error',
      `This is dummy data. Please import your real partners to ${action}.`,
      'error',
      5000
    )
  }, [])

  const handleDummyRowSelect = React.useCallback(
    (_href: string) => {
      handleDummyAction('select partners')
    },
    [handleDummyAction]
  )

  const handleAdvancedRowLongPress = React.useCallback(
    (row: any) => {
      if (row?.isDummy) {
        handleDummyRowSelect(row.href)
      } else if (row?.href) {
        handleRowSelect(row.href)
      }
    },
    [handleRowSelect, handleDummyRowSelect]
  )

  // if (isLoading) {
  //   return (
  //     <div className='flex flex-col gap-4 p-4 py-24 lg:p-8'>
  //       <Skeleton className='h-16 w-full' />
  //       <Skeleton className='h-16 w-full' />
  //       <Skeleton className='h-16 w-full' />
  //       <Skeleton className='h-16 w-full' />
  //       <Skeleton className='h-16 w-full' />
  //       <Skeleton className='h-16 w-full' />
  //     </div>
  //   )
  // }

  const getGroupBadge = React.useCallback((group: string) => {
    const baseClasses =
      'inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium'

    switch (group) {
      case 'Reliable Partner':
        return (
          <span className={`${baseClasses}  bg-green-50 text-green-600`}>
            {group}
          </span>
        )
      case 'Steady Partner':
        return (
          <span className={`${baseClasses}  bg-blue-50 text-blue-600`}>
            {group}
          </span>
        )
      case 'Low Impact Partner':
        return (
          <span className={`${baseClasses}   bg-orange-50 text-orange-600`}>
            {group}
          </span>
        )
      case 'Inactive Partner':
        return (
          <span className={`${baseClasses}  bg-red-50 text-red-600`}>
            {group}
          </span>
        )
      default:
        return (
          <span className={`${baseClasses}  bg-gray-50 text-gray-600`}>
            {group}
          </span>
        )
    }
  }, [])
  // replace underscores with spaces and capitalize each word
  const formatLabel = React.useCallback((str: string): string => {
    return str
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }, [])

  // Map TableRow (real + dummy) into AdvancedTable records.
  // When tableColumns from API: row has one key per column (accessorKey = getDetailIdForColumn(col.name)).
  // When static: row has partnerName, status, email, partnerGroup, remarks.
  const displayRowsAsData = React.useMemo(() => {
    return displayRows.map((row, rowIndex) => {
      const isDummyRow = 'isDummy' in row
      const base = {
        id: isDummyRow ? `dummy-${tabValue}-${rowIndex}` : row.href,
        href: row.href,
        isDummy: isDummyRow
      }
      const details = Object.fromEntries(
        row.rowDetails.map((d) => [d.id, d.value ?? ''])
      )
      if (!tableColumns) {
        return {
          ...base,
          partnerName: details.partnerName || 'N/A',
          status: details.partnerStatus || '',
          email: details.partnerEmail || 'N/A',
          partnerGroup: formatLabel(details.partnerGroup || 'N/A'),
          remarks: details.partnerRemarks || 'N/A'
        }
      }
      return { ...base, ...details }
    })
  }, [displayRows, formatLabel, tabValue, tableColumns])

  const statusOptions = React.useMemo(
    () => [
      { id: 'invited', label: 'INVITE_SENT', color: '#3B82F6' },
      { id: 'sent', label: 'SENT', color: '#3B82F6' },
      { id: 'verified', label: 'VERIFIED', color: '#10B981' },
      { id: 'onboarded', label: 'ONBOARDED', color: '#10B981' },
      { id: 'uninvited', label: 'UNINVITED', color: '#6B7280' },
      { id: 'invite_not_sent', label: 'INVITE_NOT_SENT', color: '#6B7280' },
      { id: 'pending', label: 'PENDING', color: '#F59E0B' }
    ],
    []
  )

  const mapApiColumnType = (apiType: string): 'text' | 'status' | 'tags' => {
    switch (apiType) {
      case 'STATUS':
        return 'status'
      case 'TAG':
        return 'tags'
      case 'TEXT':
      default:
        return 'text'
    }
  }

  // Columns from API when tableColumns is set; otherwise static columns for dummy/legacy.
  // Order columns by displayOrder so table shows them in API order.
  const advancedColumns = React.useMemo(() => {
    // Checkbox column (first column): same behavior as long-press row selection.
    const selectCheckboxColumn: Column = {
      id: 'col-select-checkbox',
      title: '',
      type: 'text',
      accessorKey: '__select__',
      minWidth: 48,
      disableDrag: true,
      disableHeaderMenu: true,
      pinned: 'left',
      renderHeader: () => <span className='block w-8 min-w-8' aria-hidden />,
      renderCell: ({ row }: { row: Record<string, any>; value: any }) => {
        const isSelected = !row.isDummy && selectedRows.includes(row.href)
        return (
          <div
            className='flex w-8 min-w-8 flex-shrink-0 items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleAdvancedRowLongPress(row)}
              disabled={!!row.isDummy}
              aria-label={isSelected ? 'Deselect row' : 'Select row'}
            />
          </div>
        )
      }
    }
    const checkboxCol = selectCheckboxColumn as any
    if (tableColumns && tableColumns.length > 0) {
      const sortedByDisplayOrder = [...tableColumns].sort(
        (a, b) => a.displayOrder - b.displayOrder
      )
      const dataColumns = sortedByDisplayOrder.map((col, index) => {
        const accessorKey = getDetailIdForColumn(col.name)
        const isFirstColumn = index === 0
        const isPartnerGroup = col.name === 'Partner Group'
        const isStatusType = col.type === 'STATUS'
        let renderCell:
          | ((args: {
              row: Record<string, any>
              value: any
            }) => React.ReactNode)
          | undefined
        if (isPartnerGroup) {
          renderCell = ({ value }: { value: any }) =>
            getGroupBadge(String(value || 'N/A'))
        } else if (isFirstColumn) {
          renderCell = ({
            row,
            value
          }: {
            row: Record<string, any>
            value: any
          }) => {
            const isSelected = !row.isDummy && selectedRows.includes(row.href)
            return (
              <div className='flex min-w-0 items-center gap-2'>
                {isSelected && (
                  <Check className='h-4 w-4 flex-shrink-0 text-primary-blue' />
                )}
                <div className='min-w-0 flex-1 overflow-hidden'>
                  <CellTextWithTooltip
                    text={value ? String(value) : 'N/A'}
                    className='text-sm font-medium text-gray-900 dark:text-white'
                  />
                </div>
                {row.isDummy && <DummyTag />}
              </div>
            )
          }
        }
        return {
          id: `col-${col.columnId}`,
          title: col.name,
          type: mapApiColumnType(col.type) as 'text' | 'status' | 'tags',
          accessorKey,
          ...(isStatusType && { options: statusOptions }),
          ...(renderCell && { renderCell })
        }
      })
      return [checkboxCol, ...dataColumns]
    }
    return [
      checkboxCol,
      {
        id: 'col-name',
        title: 'Partner Name',
        type: 'text' as const,
        accessorKey: 'partnerName',
        renderCell: ({
          row,
          value
        }: {
          row: Record<string, any>
          value: any
        }) => {
          const isSelected = !row.isDummy && selectedRows.includes(row.href)
          return (
            <div className='flex min-w-0 items-center gap-2'>
              {isSelected && (
                <Check className='h-4 w-4 flex-shrink-0 text-primary-blue' />
              )}
              <div className='min-w-0 flex-1 overflow-hidden'>
                <CellTextWithTooltip
                  text={value ? String(value) : 'N/A'}
                  className='text-sm font-medium text-gray-900 dark:text-white'
                />
              </div>
              {row.isDummy && <DummyTag />}
            </div>
          )
        }
      },
      {
        id: 'col-status',
        title: 'Status',
        type: 'status' as const,
        accessorKey: 'status',
        options: statusOptions
      },
      {
        id: 'col-email',
        title: "Partner's Email",
        type: 'text' as const,
        accessorKey: 'email'
      },
      {
        id: 'col-group',
        title: 'Group',
        type: 'text' as const,
        accessorKey: 'partnerGroup',
        renderCell: ({ value }: { value: any }) =>
          getGroupBadge(String(value || 'N/A'))
      },
      {
        id: 'col-remarks',
        title: 'Remark',
        type: 'text' as const,
        accessorKey: 'remarks'
      }
    ]
  }, [
    tableColumns,
    selectedRows,
    statusOptions,
    getGroupBadge,
    handleAdvancedRowLongPress
  ])

  const handleAdvancedRowClick = React.useCallback(
    (row: any) => {
      // Allow navigation for both real and dummy data (dummy flow handled in detail page)
      if (row?.href) router.push(row.href)
    },
    [router]
  )

  const handleAdvancedRowHover = React.useCallback(
    (row: any) => {
      if (row?.href && !row?.isDummy) router.prefetch(row.href)
    },
    [router]
  )

  if (isError) {
    return (
      <div className='flex items-center justify-center p-4 text-red-500'>
        Error:{' '}
        {error instanceof Error ? error.message : 'Failed to load partners'}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6 overflow-x-auto bg-white dark:bg-transparent'>
      <div className='w-full min-w-[880px]'>
        {/* Filter and Actions Section */}
        <div className='flex items-center justify-between border-b border-gray-200 px-6 py-4'>
          <div className='flex items-center gap-4'>
            {/* Group Type Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='primary'
                  className='flex items-center gap-2 text-sm font-medium'
                >
                  Group type
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-48 p-3' align='start'>
                <div className='space-y-2'>
                  <div className='text-sm font-medium text-gray-900 dark:text-white'>
                    Filter by group
                  </div>
                  <div className='space-y-1'>
                    {[
                      'Reliable Partner',
                      'Steady Partner',
                      'Low Impact Partner',
                      'Inactive Partner'
                    ].map((group) => (
                      <label
                        key={group}
                        className='flex cursor-pointer items-center gap-2 text-sm text-gray-700'
                      >
                        <Input
                          type='checkbox'
                          className='h-4 w-4 rounded border-gray-300'
                        />
                        {group}
                      </label>
                    ))}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Buttons */}
          <ActionButtons tabValue={tabValue} />
        </div>

        {/* Table */}
        <div className='px-6'>
          <div className='my-4'>
            <AdvancedTable
              readOnly
              syncFromProps
              enableColumnControls
              enableDragAndDrop
              enableAddColumn
              initialColumns={advancedColumns as any}
              initialData={displayRowsAsData}
              getRowId={(row) => String(row.id)}
              selectedRowIds={selectedRows}
              onRowClick={handleAdvancedRowClick}
              onRowHover={handleAdvancedRowHover}
              onRowLongPress={handleAdvancedRowLongPress}
              onAddColumnRequest={
                tableColumns != null && tableId != null
                  ? handleAddColumnRequest
                  : undefined
              }
              onRenameColumnRequest={
                tableColumns != null && tableId != null
                  ? handleRenameColumnRequest
                  : undefined
              }
              onColumnOrderChangeRequest={
                tableColumns != null && tableId != null
                  ? handleColumnOrderChangeRequest
                  : undefined
              }
              onRowUpdateRequest={
                tableColumns != null && tableId != null
                  ? handleRowUpdateRequest
                  : undefined
              }
              onDeleteColumnRequest={
                tableColumns != null && tableId != null
                  ? handleDeleteColumnRequest
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfflinePartnersTable
