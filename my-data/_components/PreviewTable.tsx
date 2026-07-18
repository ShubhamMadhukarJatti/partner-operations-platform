'use client'

import React, { useMemo } from 'react'
import type { OverlapTableData } from '@/http-hooks/overlap-table'
import { sortOverlapVersionsNewestFirst } from '@/http-hooks/persona-versions'

import { AdvancedTable } from '@/components/ui/advanced-table'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { CellTextWithTooltip } from '@/components/ui/table/TableCell'
import type { Column, ColumnType } from '@/components/ui/table/types'

const validate = (val: any) => {
  if (!val) return '-'
  const str = String(val).trim()
  if (str.toLowerCase() === 'unknown') return '-'
  return str
}

function mapOverlapType(type: string): ColumnType {
  switch (String(type).toUpperCase()) {
    case 'STATUS':
      return 'status'
    case 'TAG':
      return 'tags'
    default:
      return 'text'
  }
}

/** Transform Overlap table to AdvancedTable columns and data */
function overlapToTableFormat(data: OverlapTableData) {
  const sortedCols = [...data.columns]
    .filter((c) => c.visible !== false)
    .sort((a, b) => a.displayOrder - b.displayOrder)

  const columns: Column[] = sortedCols.map((col) => ({
    id: `col-${col.columnId}`,
    title: col.name,
    type: mapOverlapType(col.type),
    accessorKey: String(col.columnId),
    minWidth: 120
  }))

  const rows: Record<string, any>[] = data.rows.map((row) => ({
    id: row.rowId,
    ...Object.fromEntries(
      Object.entries(row.values).map(([k, v]) => [k, validate(v)])
    )
  }))

  return { columns, rows }
}

export interface PreviewTableOverlapProps {
  overlapData: OverlapTableData
  tableId: number
  title?: string
  showVersionDropdown?: boolean
  versionsData?: unknown
  selectedVersion?: number | null
  onVersionChange?: (version: number | null) => void
  isLoadingVersions?: boolean
  isLoadingVersionData?: boolean
  onAddColumn?: (params: {
    tableId: number
    name: string
    type: 'TEXT' | 'STATUS' | 'TAG'
  }) => Promise<void>
  onRenameColumn?: (params: {
    columnId: number
    newName: string
  }) => Promise<void>
  onColumnOrderChange?: (params: {
    columnId: number
    newOrder: number
  }) => Promise<void>
  onDeleteColumn?: (columnId: number) => Promise<void>
  onRowUpdate?: (params: {
    rowId: number
    accessorKey: string
    value: string
  }) => Promise<void>
}

/** PreviewTable with Overlap APIs - full edit/create column support */
export const PreviewTableOverlap: React.FC<PreviewTableOverlapProps> = ({
  overlapData,
  tableId,
  title = 'Customer Data Preview',
  showVersionDropdown,
  versionsData,
  selectedVersion,
  onVersionChange,
  isLoadingVersions,
  isLoadingVersionData,
  onAddColumn,
  onRenameColumn,
  onColumnOrderChange,
  onDeleteColumn,
  onRowUpdate
}) => {
  const { columns, rows } = useMemo(
    () => overlapToTableFormat(overlapData),
    [overlapData]
  )

  const addColumnHandler = useMemo(() => {
    if (!onAddColumn) return undefined
    return async (params: { name: string; type: ColumnType }) => {
      const typeMap = {
        text: 'TEXT' as const,
        number: 'TEXT' as const,
        calendar: 'TEXT' as const,
        status: 'STATUS' as const,
        tags: 'TAG' as const
      }
      await onAddColumn({
        tableId,
        name: params.name,
        type: typeMap[params.type] ?? 'TEXT'
      })
    }
  }, [onAddColumn, tableId])

  const renameHandler = useMemo(() => {
    if (!onRenameColumn) return undefined
    return async (params: { columnId: number; newName: string }) => {
      await onRenameColumn(params)
    }
  }, [onRenameColumn])

  const orderHandler = useMemo(() => {
    if (!onColumnOrderChange) return undefined
    return async (params: { columnId: number; newOrder: number }) => {
      await onColumnOrderChange(params)
    }
  }, [onColumnOrderChange])

  const deleteHandler = useMemo(() => {
    if (!onDeleteColumn) return undefined
    return async (columnId: number) => {
      await onDeleteColumn(columnId)
    }
  }, [onDeleteColumn])

  const rowUpdateHandler = useMemo(() => {
    if (!onRowUpdate) return undefined
    return async (params: {
      rowId: number
      accessorKey: string
      value: string
    }) => {
      await onRowUpdate(params)
    }
  }, [onRowUpdate])

  const advancedColumns = useMemo(() => {
    return columns.map((col, idx) => ({
      ...col,
      renderCell:
        idx === 0
          ? ({ value }: { value: any }) => (
              <CellTextWithTooltip
                text={value ? String(value) : '-'}
                className='text-sm font-medium text-gray-900'
              />
            )
          : undefined
    }))
  }, [columns])

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-6 flex justify-between'>
        <div>
          <h2 className='text-xl font-bold text-text-100'>{title}</h2>
          {/* <p className='text-sm font-normal text-[#4D5C78]'>
            Subtext about the create report here in less than 2 lines{' '}
          </p> */}
        </div>
        <div className='flex items-center gap-2'>
          {showVersionDropdown && (
            <>
              <label
                htmlFor='version-select-overlap'
                className='text-sm font-medium text-gray-700'
              >
                Version:
              </label>
              <Select
                value={selectedVersion != null ? String(selectedVersion) : ''}
                onValueChange={(val) => {
                  const v = parseInt(val, 10)
                  if (!isNaN(v)) onVersionChange?.(v)
                }}
                disabled={isLoadingVersions}
              >
                <SelectTrigger id='version-select-overlap' className='w-36'>
                  <SelectValue placeholder='Select version' />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const sorted = sortOverlapVersionsNewestFirst(
                      (versionsData as any)?.data
                    )
                    if (!sorted.length) {
                      return (
                        <SelectItem value='__none' disabled>
                          {isLoadingVersions ? 'Loading…' : 'No versions'}
                        </SelectItem>
                      )
                    }
                    return sorted.map((v) => (
                      <SelectItem key={v.versionId} value={String(v.versionId)}>
                        v_{v.versionId}
                      </SelectItem>
                    ))
                  })()}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      <div className='rounded-lg bg-white font-sans text-sm [&_td]:font-medium [&_td]:text-gray-900 [&_th]:text-xs [&_th]:font-medium [&_th]:tracking-wider [&_th]:text-[#707070]'>
        <div className='px-6'>
          <div className='my-4 min-w-0'>
            {isLoadingVersionData ? (
              <div className='flex items-center justify-center py-16 text-sm text-gray-400'>
                <svg
                  className='mr-2 h-4 w-4 animate-spin'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z'
                  />
                </svg>
                Loading data…
              </div>
            ) : (
              <AdvancedTable
                readOnly={false}
                syncFromProps
                enableColumnControls
                enableDragAndDrop
                enableAddColumn
                initialColumns={advancedColumns}
                initialData={rows}
                getRowId={(row) => String(row.id)}
                onAddColumnRequest={addColumnHandler}
                onRenameColumnRequest={renameHandler}
                onColumnOrderChangeRequest={orderHandler}
                onDeleteColumnRequest={deleteHandler}
                onRowUpdateRequest={rowUpdateHandler}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** Legacy PreviewTable - persona data format (read-only) */
const PreviewTableLegacy: React.FC<{
  data: any
  handleDelete?: () => void
  isDeletePending?: boolean
  title?: string
  showVersionDropdown?: boolean
  versionsData?: unknown
  selectedVersion?: number | null
  onVersionChange?: (version: number | null) => void
  isLoadingVersions?: boolean
  isLoadingVersionData?: boolean
}> = ({
  data,
  handleDelete,
  isDeletePending,
  title = 'Customer Data Preview',
  showVersionDropdown,
  versionsData,
  selectedVersion,
  onVersionChange,
  isLoadingVersions,
  isLoadingVersionData
}) => {
  // The v2 API returns: Array<{ fields: FieldObject[], fieldToColumnMapping: Record<string,string>, ... }>
  // We flatten all fields from all records in the array into one list.
  const { tableData, columns } = useMemo(() => {
    // Metadata keys to exclude from column display
    const META_KEYS = new Set([
      'id',
      'creationTimestamp',
      'lastUpdatedTimestamp',
      'version',
      'versionId',
      'organizationId',
      'recordType',
      'source',
      'frequency',
      'googleSheetLink',
      'fileName',
      'fieldToColumnMapping'
    ])

    // Collect all field rows: v2 response is [{fields: [...], fieldToColumnMapping: {...}}, ...]
    let fieldRows: any[] = []
    let mapping: Record<string, string> = {}

    if (Array.isArray(data)) {
      for (const record of data) {
        if (Array.isArray(record?.fields)) {
          fieldRows.push(...record.fields)
          if (!Object.keys(mapping).length && record.fieldToColumnMapping) {
            mapping = record.fieldToColumnMapping
          }
        } else if (record && !record.fields) {
          // Flat record (legacy format)
          fieldRows.push(record)
        }
      }
    }

    if (!fieldRows.length) {
      return { tableData: [], columns: [] }
    }

    // Discover column keys: union of all non-null, non-metadata keys across rows
    const keySet = new Set<string>()
    for (const row of fieldRows) {
      for (const [k, v] of Object.entries(row)) {
        if (!META_KEYS.has(k) && v !== null && v !== undefined && v !== '') {
          keySet.add(k)
        }
      }
    }

    // Build column list — prefer fieldToColumnMapping labels for display names
    // mapping is { sharkdomKey → hubspotColumnName }; we want { backendFieldKey → label }
    const reverseMapping: Record<string, string> = {}
    for (const [sharkKey, hubKey] of Object.entries(mapping)) {
      // sharkKey is the human-readable label direction; use it as display name
      reverseMapping[sharkKey] = sharkKey
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (s) => s.toUpperCase())
        .trim()
    }

    const cols: Column[] = [
      {
        id: 'sno',
        title: 'Sno',
        type: 'text',
        accessorKey: 'sno',
        minWidth: 48
      },
      ...[...keySet].map((key) => ({
        id: key,
        title:
          reverseMapping[key] ??
          key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (s: string) => s.toUpperCase())
            .trim(),
        type: 'text' as ColumnType,
        accessorKey: key,
        minWidth: 120
      }))
    ]

    const rows = fieldRows.map((item: any, idx: number) => {
      const row: Record<string, any> = {
        id: item?.id ?? `preview-row-${idx}`,
        sno: idx + 1
      }
      for (const key of keySet) {
        row[key] = validate(item?.[key])
      }
      return row
    })

    return { tableData: rows, columns: cols }
  }, [data])

  return (
    <div className='mx-auto max-w-7xl'>
      <div className='mb-6 flex justify-between'>
        <div>
          <h2 className='text-xl font-bold text-text-100'>{title}</h2>
        </div>
        <div className='flex items-center gap-2'>
          {showVersionDropdown && (
            <>
              <label
                htmlFor='version-select'
                className='text-sm font-medium text-gray-700'
              >
                Version:
              </label>
              <Select
                value={selectedVersion != null ? String(selectedVersion) : ''}
                onValueChange={(val) => {
                  const v = parseInt(val, 10)
                  if (!isNaN(v)) onVersionChange?.(v)
                }}
                disabled={isLoadingVersions}
              >
                <SelectTrigger id='version-select' className='w-36'>
                  <SelectValue placeholder='Select version' />
                </SelectTrigger>
                <SelectContent>
                  {(() => {
                    const sorted = sortOverlapVersionsNewestFirst(
                      (versionsData as any)?.data
                    )
                    if (!sorted.length) {
                      return (
                        <SelectItem value='__none' disabled>
                          {isLoadingVersions ? 'Loading…' : 'No versions'}
                        </SelectItem>
                      )
                    }
                    return sorted.map((v) => (
                      <SelectItem key={v.versionId} value={String(v.versionId)}>
                        v_{v.versionId}
                      </SelectItem>
                    ))
                  })()}
                </SelectContent>
              </Select>
            </>
          )}
        </div>
      </div>

      <div className='rounded-lg bg-white font-sans text-sm [&_td]:font-medium [&_td]:text-gray-900 [&_th]:text-xs [&_th]:font-medium [&_th]:tracking-wider [&_th]:text-[#707070]'>
        <div className='px-6'>
          <div className='my-4 min-w-0'>
            {isLoadingVersionData ? (
              <div className='flex items-center justify-center py-16 text-sm text-gray-400'>
                <svg
                  className='mr-2 h-4 w-4 animate-spin'
                  viewBox='0 0 24 24'
                  fill='none'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z'
                  />
                </svg>
                Loading data…
              </div>
            ) : !tableData.length ? (
              <div className='py-16 text-center text-sm text-gray-400'>
                No data available for this version.
              </div>
            ) : (
              <AdvancedTable
                readOnly
                syncFromProps
                initialColumns={columns}
                initialData={tableData}
                getRowId={(row) => String(row.id ?? row.sno)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/** PreviewTable - uses Overlap when overlapData provided, else legacy persona */
const PreviewTable: React.FC<{
  data?: any
  handleDelete?: () => void
  isDeletePending?: boolean
  title?: string
  overlapData?: OverlapTableData
  tableId?: number
  showVersionDropdown?: boolean
  versionsData?: unknown
  selectedVersion?: number | null
  onVersionChange?: (version: number | null) => void
  isLoadingVersions?: boolean
  isLoadingVersionData?: boolean
  onAddColumn?: (params: {
    tableId: number
    name: string
    type: 'TEXT' | 'STATUS' | 'TAG'
  }) => Promise<void>
  onRenameColumn?: (params: {
    columnId: number
    newName: string
  }) => Promise<void>
  onColumnOrderChange?: (params: {
    columnId: number
    newOrder: number
  }) => Promise<void>
  onDeleteColumn?: (columnId: number) => Promise<void>
  onRowUpdate?: (params: {
    rowId: number
    accessorKey: string
    value: string
  }) => Promise<void>
}> = (props) => {
  if (props.overlapData && props.tableId != null) {
    return (
      <PreviewTableOverlap
        overlapData={props.overlapData}
        tableId={props.tableId}
        title={props.title}
        showVersionDropdown={props.showVersionDropdown}
        versionsData={props.versionsData}
        selectedVersion={props.selectedVersion}
        onVersionChange={props.onVersionChange}
        isLoadingVersions={props.isLoadingVersions}
        isLoadingVersionData={props.isLoadingVersionData}
        onAddColumn={props.onAddColumn}
        onRenameColumn={props.onRenameColumn}
        onColumnOrderChange={props.onColumnOrderChange}
        onDeleteColumn={props.onDeleteColumn}
        onRowUpdate={props.onRowUpdate}
      />
    )
  }
  return (
    <PreviewTableLegacy
      data={props.data}
      handleDelete={props.handleDelete ?? (() => {})}
      isDeletePending={props.isDeletePending ?? false}
      title={props.title}
      showVersionDropdown={props.showVersionDropdown}
      versionsData={props.versionsData}
      selectedVersion={props.selectedVersion}
      onVersionChange={props.onVersionChange}
      isLoadingVersions={props.isLoadingVersions}
      isLoadingVersionData={props.isLoadingVersionData}
    />
  )
}

export default PreviewTable
