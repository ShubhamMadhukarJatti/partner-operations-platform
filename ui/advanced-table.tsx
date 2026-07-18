'use client'

import React, { useEffect, useMemo, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { AddColumnMenu } from '@/components/ui/table/AddColumnMenu'
import { DraggableHeader } from '@/components/ui/table/DraggableHeader'
import { TableCell } from '@/components/ui/table/TableCell'
import { Column, ColumnOption, ColumnType } from '@/components/ui/table/types'
import { showCustomToast } from '@/components/custom-toast'

export interface AdvancedTableProps {
  initialColumns?: Column[]
  initialData?: Record<string, any>[]
  onDataUpdate?: (data: Record<string, any>[]) => void
  readOnly?: boolean
  syncFromProps?: boolean
  getRowId?: (row: Record<string, any>, rowIndex: number) => string
  onRowClick?: (row: Record<string, any>) => void
  onRowHover?: (row: Record<string, any>) => void
  onRowLongPress?: (row: Record<string, any>) => void
  selectedRowIds?: string[]
  enableColumnControls?: boolean
  enableDragAndDrop?: boolean
  enableAddColumn?: boolean
  /** When provided, add column is sent to server; table will update via syncFromProps after refetch */
  onAddColumnRequest?: (params: {
    name: string
    type: ColumnType
  }) => Promise<void>
  /** When provided, rename column is sent to server; table will update via syncFromProps after refetch */
  onRenameColumnRequest?: (params: {
    columnId: number
    newName: string
  }) => Promise<void>
  /** When provided, column reorder (drag & drop) is sent to server; table will update via syncFromProps after refetch */
  onColumnOrderChangeRequest?: (params: {
    columnId: number
    newOrder: number
  }) => Promise<void>
  /** When provided, cell edit is sent to server; table will update via syncFromProps after refetch */
  onRowUpdateRequest?: (params: {
    rowId: number
    accessorKey: string
    value: string
  }) => Promise<void>
  /** When provided, column delete is sent to server; table will update via syncFromProps after refetch */
  onDeleteColumnRequest?: (columnId: number) => Promise<void>
  /** Override container border radius (e.g. "rounded-none" for flat/filet style) */
  containerClassName?: string
  /** Cell text font weight - use "normal" for lighter look to match other tables */
  cellFontWeight?: 'normal' | 'medium'
}

export const AdvancedTable = ({
  initialColumns = [],
  initialData = [],
  onDataUpdate,
  readOnly = false,
  syncFromProps = false,
  getRowId,
  onRowClick,
  onRowHover,
  onRowLongPress,
  selectedRowIds = [],
  enableColumnControls,
  enableDragAndDrop,
  enableAddColumn,
  onAddColumnRequest,
  onRenameColumnRequest,
  onColumnOrderChangeRequest,
  onRowUpdateRequest,
  onDeleteColumnRequest,
  containerClassName,
  cellFontWeight = 'medium'
}: AdvancedTableProps) => {
  // State
  const [sortConfig, setSortConfig] = useState<{
    key: string
    direction: 'asc' | 'desc'
  } | null>(null)

  const [columns, setColumns] = useState<Column[]>(initialColumns)

  const [data, setData] = useState<Record<string, any>[]>(initialData)

  const lastColumnOrderUpdateRef = React.useRef<number>(0)

  const columnControlsEnabled = enableColumnControls ?? !readOnly
  const dragEnabled = enableDragAndDrop ?? !readOnly
  const addColumnEnabled = enableAddColumn ?? !readOnly

  useEffect(() => {
    if (!syncFromProps) return

    // Always accept when parent has more columns (add) - we never optimistically add
    const hasNewColumns = initialColumns.length > columns.length
    if (
      !hasNewColumns &&
      Date.now() - lastColumnOrderUpdateRef.current < 5000
    ) {
      return
    }
    setColumns(initialColumns)
  }, [initialColumns, syncFromProps])

  useEffect(() => {
    if (!syncFromProps) return
    // If we recently applied a local column update (reorder/delete), avoid
    // clobbering optimistic local edits for a short window.
    const hasNewColumns = initialColumns.length > columns.length
    if (
      !hasNewColumns &&
      Date.now() - lastColumnOrderUpdateRef.current < 5000
    ) {
      return
    }

    setData(initialData)
  }, [initialData, initialColumns, columns, syncFromProps])

  // Derived sorted data
  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key]
      const bValue = b[sortConfig.key]

      if (aValue === bValue) return 0

      // Handle different types if needed, for now string comparison is mostly fine
      // but numbers should be compared numerically
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      const aStr = String(aValue || '').toLowerCase()
      const bStr = String(bValue || '').toLowerCase()

      if (sortConfig.direction === 'asc') {
        return aStr < bStr ? -1 : 1
      } else {
        return aStr > bStr ? -1 : 1
      }
    })
  }, [data, sortConfig])

  // Dnd Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Require 8px movement before drag starts
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Handlers
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (active.id !== over?.id) {
      const draggedId = String(active.id)
      const isApiColumn =
        onColumnOrderChangeRequest &&
        draggedId.startsWith('col-') &&
        !Number.isNaN(parseInt(draggedId.replace(/^col-/, ''), 10))

      const originalColumns = columns

      const oldIndex = columns.findIndex((item) => item.id === active.id)
      const overIndex = columns.findIndex((item) => item.id === over?.id)
      const newItems = arrayMove(columns, oldIndex, overIndex)
      const pinnedLeft = newItems.filter((c) => c.pinned === 'left')
      const pinnedRight = newItems.filter((c) => c.pinned === 'right')
      const middle = newItems.filter((c) => !c.pinned)
      const normalized = [...pinnedLeft, ...middle, ...pinnedRight]

      setColumns(normalized)

      if (isApiColumn) {
        const newIndex = normalized.findIndex((item) => item.id === active.id)
        const columnId = parseInt(draggedId.replace(/^col-/, ''), 10)
        try {
          await onColumnOrderChangeRequest!({
            columnId,
            newOrder: newIndex + 1
          })
          console.log(
            '[API] Column Order Updated Successfully:',
            normalized.map((col) => col.id)
          )

          lastColumnOrderUpdateRef.current = Date.now()
        } catch (error) {
          console.error('[API] Column reorder failed:', error)

          setColumns(originalColumns)
          showCustomToast(
            'Error',
            'Failed to reorder column. Please try again.',
            'error',
            5000
          )
        }
        return
      }

      console.log(
        '[API] Column Order Updated:',
        normalized.map((col) => col.id)
      )
    }
  }

  const handleAddColumn = async (
    fromId: string | null,
    position: 'left' | 'right',
    type: ColumnType,
    options?: ColumnOption[],
    columnName?: string
  ) => {
    const columnTitle =
      columnName || (type === 'status' ? 'Status' : `New ${type}`)

    if (onAddColumnRequest) {
      await onAddColumnRequest({ name: columnTitle, type })
      return
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000)
    const newCol: Column = {
      id: `col-${crypto.randomUUID()}`,
      title: columnTitle,
      type: type,
      accessorKey: `${randomCode}_${columnTitle
        .toLowerCase()
        .replace(/\s+/g, '_')}`, // Using lowercase title as accessorKey with random code
      ...((type === 'status' || type === 'tags') && options && { options }) // Store options for status/tags columns
    }

    console.log('[API] New Column Created:', newCol)

    const getDefaultValue = () => {
      if (type === 'number') return 0
      if (type === 'tags') return []
      return ''
    }

    // Initialize the new field in all existing data rows (only if it doesn't exist)
    setData((prev) =>
      prev.map((row) => ({
        ...row,
        // Only set default value if the key doesn't already exist in the row
        ...(row[newCol.accessorKey] === undefined && {
          [newCol.accessorKey]: getDefaultValue()
        })
      }))
    )

    if (!fromId) {
      // Add to end
      setColumns((prev) => {
        const next = [...prev, newCol]
        const pinnedLeft = next.filter((c) => c.pinned === 'left')
        const pinnedRight = next.filter((c) => c.pinned === 'right')
        const middle = next.filter((c) => !c.pinned)
        return [...pinnedLeft, ...middle, ...pinnedRight]
      })
      return
    }

    setColumns((prev) => {
      const index = prev.findIndex((c) => c.id === fromId)
      const newCols = [...prev]
      if (position === 'left') {
        newCols.splice(index, 0, newCol)
      } else {
        newCols.splice(index + 1, 0, newCol)
      }
      const pinnedLeft = newCols.filter((c) => c.pinned === 'left')
      const pinnedRight = newCols.filter((c) => c.pinned === 'right')
      const middle = newCols.filter((c) => !c.pinned)
      return [...pinnedLeft, ...middle, ...pinnedRight]
    })
  }

  const handleUpdateColumn = async (id: string, updates: Partial<Column>) => {
    if (
      updates.title != null &&
      onRenameColumnRequest &&
      id.startsWith('col-')
    ) {
      const columnId = parseInt(id.replace(/^col-/, ''), 10)
      if (!Number.isNaN(columnId)) {
        const originalColumn = columns.find((col) => col.id === id)
        const originalTitle = originalColumn?.title

        // Apply optimistic title update immediately. Don't set lastColumnOrderUpdateRef
        // for rename - we want to accept refetched data promptly so the source of
        // truth (cache) is in sync and "add column" won't think the old name exists.
        setColumns((prev) =>
          prev.map((col) => (col.id === id ? { ...col, ...updates } : col))
        )

        try {
          await onRenameColumnRequest({ columnId, newName: updates.title })
          console.log('[API] Column renamed successfully:', {
            id,
            newName: updates.title
          })
        } catch (error) {
          console.error('[API] Column rename failed:', error)
          setColumns((prev) =>
            prev.map((col) =>
              col.id === id && originalTitle
                ? { ...col, title: originalTitle }
                : col
            )
          )
          showCustomToast(
            'Error',
            'Failed to rename column. Please try again.',
            'error',
            5000
          )
        }
        return
      }
    }
    console.log('[API] Column Updated:', { id, updates })

    // If the column's accessorKey is being changed locally, migrate existing
    // row values from the old key to the new key so the UI doesn't show
    // empty values after a rename/label change.
    const originalColumn = columns.find((c) => c.id === id)
    if (
      updates.accessorKey != null &&
      originalColumn &&
      updates.accessorKey !== originalColumn.accessorKey
    ) {
      const newKey = updates.accessorKey
      const oldKey = originalColumn.accessorKey
      setData((prev) =>
        prev.map((row) => {
          // Only copy if the old key had a value and the new key isn't already populated
          const oldVal = row[oldKey]
          if (oldVal === undefined) return row
          if (row[newKey] !== undefined) return row
          return { ...row, [newKey]: oldVal }
        })
      )
    }

    setColumns((prev) =>
      prev.map((col) => (col.id === id ? { ...col, ...updates } : col))
    )
  }

  const handleDeleteColumn = async (id: string) => {
    const isApiColumn =
      onDeleteColumnRequest &&
      id.startsWith('col-') &&
      !Number.isNaN(parseInt(id.replace(/^col-/, ''), 10))

    const originalColumns = [...columns]

    // Optimistically remove column locally and mark time to avoid sync clobber
    lastColumnOrderUpdateRef.current = Date.now()
    setColumns((prev) => prev.filter((col) => col.id !== id))

    if (isApiColumn) {
      const columnId = parseInt(id.replace(/^col-/, ''), 10)
      try {
        await onDeleteColumnRequest!(columnId)
        lastColumnOrderUpdateRef.current = Date.now()
        console.log('[API] Column Deleted Successfully:', id)
      } catch (error) {
        console.error('[API] Column delete failed:', error)
        setColumns(originalColumns)
        showCustomToast(
          'Error',
          'Failed to delete column. Please try again.',
          'error',
          5000
        )
      }
      return
    }

    console.log('[API] Column Deleted:', id)
  }

  const handleRowUpdate = async (
    rowId: string,
    accessorKey: string,
    value: any
  ) => {
    if (onRowUpdateRequest) {
      const match = String(rowId).match(/(\d+)$/)
      const parsedRowId = match
        ? parseInt(match[1], 10)
        : parseInt(String(rowId), 10)
      if (!Number.isNaN(parsedRowId)) {
        await onRowUpdateRequest({
          rowId: parsedRowId,
          accessorKey,
          value: value != null ? String(value) : ''
        })
        return
      }
    }
    console.log('[API] Row Updated:', { rowId, accessorKey, value })
    const newData = data.map((row) =>
      row.id === rowId ? { ...row, [accessorKey]: value } : row
    )
    setData(newData)
    onDataUpdate?.(newData)
  }

  const handleSort = (columnId: string, direction: 'asc' | 'desc') => {
    const column = columns.find((c) => c.id === columnId)
    if (column) {
      setSortConfig({ key: column.accessorKey, direction })
    }
  }

  const effectiveGetRowId = useMemo(() => {
    return (
      getRowId ||
      ((row: Record<string, any>, rowIndex: number) =>
        String(row.id ?? rowIndex))
    )
  }, [getRowId])

  const DraggableTableCell = React.memo(
    ({
      col,
      row,
      rowId,
      dragEnabled,
      readOnly,
      handleRowUpdate,
      textFontWeight
    }: {
      col: Column
      row: Record<string, any>
      rowId: string
      dragEnabled: boolean
      readOnly: boolean
      handleRowUpdate: (rowId: string, accessorKey: string, value: any) => void
      textFontWeight?: 'normal' | 'medium'
    }) => {
      const {
        setNodeRef,
        transform,
        transition,
        isDragging,
        attributes,
        listeners
      } = useSortable({
        id: col.id,
        disabled: col.disableDrag || !dragEnabled
      })

      const widthStyle: React.CSSProperties = col.minWidth
        ? {
            minWidth:
              typeof col.minWidth === 'number'
                ? `${col.minWidth}px`
                : col.minWidth
          }
        : {}

      const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        ...widthStyle
      }

      return (
        <td
          key={col.id}
          ref={setNodeRef}
          style={style}
          className={`min-w-0 p-2 ${
            dragEnabled && !col.disableDrag
              ? 'cursor-grab active:cursor-grabbing'
              : ''
          } ${isDragging ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
          {...(dragEnabled && !col.disableDrag ? attributes : {})}
          {...(dragEnabled && !col.disableDrag ? listeners : {})}
        >
          <TableCell
            value={row[col.accessorKey]}
            column={col}
            row={row}
            rowId={rowId}
            onUpdate={handleRowUpdate}
            readOnly={readOnly}
            textFontWeight={textFontWeight}
          />
        </td>
      )
    }
  )

  DraggableTableCell.displayName = 'DraggableTableCell'

  // Long press handler component
  const TableRow = React.memo(
    ({
      row,
      rowId,
      columns,
      readOnly,
      dragEnabled,
      onRowClick,
      onRowHover,
      onRowLongPress,
      handleRowUpdate,
      isSelected,
      textFontWeight
    }: {
      row: Record<string, any>
      rowId: string
      columns: Column[]
      readOnly: boolean
      dragEnabled: boolean
      onRowClick?: (row: Record<string, any>) => void
      onRowHover?: (row: Record<string, any>) => void
      onRowLongPress?: (row: Record<string, any>) => void
      handleRowUpdate: (rowId: string, accessorKey: string, value: any) => void
      isSelected: boolean
      textFontWeight?: 'normal' | 'medium'
    }) => {
      const longPressTimerRef = React.useRef<NodeJS.Timeout | null>(null)
      const handlePointerDown = (e: React.PointerEvent) => {
        if (!onRowLongPress) return
        longPressTimerRef.current = setTimeout(() => {
          onRowLongPress(row)
          longPressTimerRef.current = null
        }, 500) // 500ms for long press
      }

      const handlePointerUp = () => {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current)
          longPressTimerRef.current = null
        }
      }

      React.useEffect(() => {
        return () => {
          if (longPressTimerRef.current) {
            clearTimeout(longPressTimerRef.current)
          }
        }
      }, [])

      return (
        <tr
          onClick={onRowClick ? () => onRowClick(row) : undefined}
          onMouseEnter={onRowHover ? () => onRowHover(row) : undefined}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className={
            isSelected
              ? 'cursor-pointer border-b bg-blue-100 text-blue-900 transition-colors hover:bg-blue-200 dark:border-border-dark dark:bg-white/10 dark:text-white'
              : onRowClick
                ? 'cursor-pointer border-b bg-white transition-colors hover:bg-gray-50 dark:border-border-dark dark:bg-transparent dark:hover:bg-white/5'
                : 'border-b bg-white hover:bg-gray-50 dark:border-border-dark dark:bg-transparent dark:hover:bg-white/5'
          }
        >
          {columns.map((col) => (
            <DraggableTableCell
              key={col.id}
              col={col}
              row={row}
              rowId={rowId}
              dragEnabled={dragEnabled}
              readOnly={readOnly}
              handleRowUpdate={handleRowUpdate}
              textFontWeight={textFontWeight}
            />
          ))}
        </tr>
      )
    }
  )

  TableRow.displayName = 'TableRow'

  return (
    <div
      className={`flex w-full min-w-0 overflow-hidden border dark:border-border-dark ${containerClassName ?? 'rounded-3xl'}`}
    >
      <div
        className='min-w-0 flex-1 overflow-x-auto border-r bg-white dark:border-[#252666]'
        style={{ backgroundColor: 'var(--colors-background-card)' }}
      >
        {columnControlsEnabled ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className='w-full table-auto text-left text-sm text-gray-500 dark:text-gray-400'>
              <thead
                className='bg-gray-50 text-xs uppercase text-gray-700 dark:text-white'
                style={{ backgroundColor: 'var(--colors-background-card)' }}
              >
                <tr>
                  <SortableContext
                    items={columns.map((c) => c.id)}
                    strategy={horizontalListSortingStrategy}
                  >
                    {columns.map((col) => (
                      <DraggableHeader
                        key={col.id}
                        column={col}
                        onColumnUpdate={handleUpdateColumn}
                        onAddColumn={handleAddColumn}
                        onDeleteColumn={handleDeleteColumn}
                        onSortAsc={(id) => handleSort(id, 'asc')}
                        onSortDesc={(id) => handleSort(id, 'desc')}
                        dragEnabled={dragEnabled}
                      />
                    ))}
                  </SortableContext>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((row, rowIndex) => {
                  const rowId = effectiveGetRowId(row, rowIndex)
                  const isSelected = selectedRowIds.includes(rowId)
                  return (
                    <TableRow
                      key={rowId}
                      row={row}
                      rowId={rowId}
                      columns={columns}
                      readOnly={readOnly}
                      dragEnabled={dragEnabled}
                      onRowClick={onRowClick}
                      onRowHover={onRowHover}
                      onRowLongPress={onRowLongPress}
                      handleRowUpdate={handleRowUpdate}
                      isSelected={isSelected}
                      textFontWeight={
                        cellFontWeight === 'normal' ? 'normal' : undefined
                      }
                    />
                  )
                })}
                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className='px-6 py-8 text-center text-gray-500'
                    >
                      No data entries
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </DndContext>
        ) : (
          <table className='w-full table-auto text-left text-sm text-gray-500 dark:text-gray-400'>
            <thead
              className='bg-gray-50 text-xs uppercase text-gray-700 dark:text-white'
              style={{ backgroundColor: 'var(--colors-background-card)' }}
            >
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.id}
                    className='min-w-[120px] select-none border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-[#252666]'
                    style={{ backgroundColor: 'var(--colors-background-card)' }}
                  >
                    <div className='flex items-center'>
                      {typeof col.renderHeader === 'function'
                        ? col.renderHeader(col)
                        : (col.renderHeader ?? (
                            <span className='text-xs font-medium tracking-wider text-[#707070] dark:text-white'>
                              {col.title}
                            </span>
                          ))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, rowIndex) => {
                const rowId = effectiveGetRowId(row, rowIndex)
                const isSelected = selectedRowIds.includes(rowId)
                return (
                  <TableRow
                    key={rowId}
                    row={row}
                    rowId={rowId}
                    columns={columns}
                    readOnly={readOnly}
                    dragEnabled={dragEnabled}
                    onRowClick={onRowClick}
                    onRowHover={onRowHover}
                    onRowLongPress={onRowLongPress}
                    handleRowUpdate={handleRowUpdate}
                    isSelected={isSelected}
                    textFontWeight={
                      cellFontWeight === 'normal' ? 'normal' : undefined
                    }
                  />
                )
              })}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length}
                    className='px-6 py-8 text-center text-gray-500'
                  >
                    No data entries
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      {addColumnEnabled && (
        <div className='flex flex-shrink-0 items-start bg-[#F9FAFB] p-2 pt-4 dark:bg-transparent'>
          <AddColumnMenu
            trigger={
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600'
              >
                <Plus className='h-4 w-4' />
              </Button>
            }
            onAddColumn={(type, options, columnName) =>
              handleAddColumn(null, 'right', type, options, columnName)
            }
          />
        </div>
      )}
    </div>
  )
}
