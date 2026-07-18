'use client'

import React, { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { HeaderMenu } from './HeaderMenu'
import { Column, ColumnOption, ColumnType } from './types'

interface DraggableHeaderProps {
  column: Column
  onColumnUpdate: (id: string, updates: Partial<Column>) => void
  onAddColumn: (
    fromId: string,
    position: 'left' | 'right',
    type: ColumnType,
    options?: ColumnOption[],
    columnName?: string
  ) => void
  onDeleteColumn: (id: string) => void
  onSortAsc: (id: string) => void
  onSortDesc: (id: string) => void
  dragEnabled?: boolean
}

export const DraggableHeader = ({
  column,
  onColumnUpdate,
  onAddColumn,
  onDeleteColumn,
  onSortAsc,
  onSortDesc,
  dragEnabled = true
}: DraggableHeaderProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: column.id,
    disabled: column.disableDrag || !dragEnabled
  })

  const baseStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 999 : 'auto'
  }

  const widthStyle: React.CSSProperties = column.minWidth
    ? {
        minWidth:
          typeof column.minWidth === 'number'
            ? `${column.minWidth}px`
            : column.minWidth
      }
    : {}

  const style = { ...baseStyle, ...widthStyle }

  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(column.title)
  const [isEditingLabel, setIsEditingLabel] = useState(false)
  const [editLabel, setEditLabel] = useState(column.accessorKey)

  const handleRename = () => {
    onColumnUpdate(column.id, { title: editTitle })
    setIsEditing(false)
  }

  const handleChangeLabel = () => {
    onColumnUpdate(column.id, { accessorKey: editLabel })
    setIsEditingLabel(false)
  }

  // Sync editLabel when column.accessorKey changes
  React.useEffect(() => {
    setEditLabel(column.accessorKey)
  }, [column.accessorKey])

  return (
    <th
      ref={setNodeRef}
      style={{ ...style, backgroundColor: 'var(--colors-background-card)' }}
      className={`group relative select-none border-b border-gray-200 bg-gray-50 px-4 py-2 dark:border-[#252666] ${column.headerClassName ?? 'min-w-[150px]'}`}
    >
      <div className='flex items-center justify-between gap-2'>
        <div
          {...(!column.disableDrag && dragEnabled ? attributes : {})}
          {...(!column.disableDrag && dragEnabled ? listeners : {})}
          className={`flex flex-1 items-center gap-2 truncate ${
            !column.disableDrag && dragEnabled
              ? 'cursor-grab active:cursor-grabbing'
              : 'cursor-default'
          }`}
        >
          {isEditing ? (
            <Input
              autoFocus
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename()
                e.stopPropagation() // Prevent dnd events
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className='h-6 w-full rounded border px-1 text-sm'
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              {typeof column.renderHeader === 'function' ? (
                column.renderHeader(column)
              ) : column.renderHeader ? (
                column.renderHeader
              ) : (
                <span className='whitespace-nowrap text-xs font-medium tracking-wider text-[#707070] dark:text-white'>
                  {column.title}
                </span>
              )}
            </>
          )}
        </div>

        {!column.disableHeaderMenu && (
          <HeaderMenu
            columnId={column.id}
            onEditTitle={() => setIsEditing(true)}
            onAddColumn={onAddColumn}
            onDeleteColumn={onDeleteColumn}
            onSortAsc={() => onSortAsc(column.id)}
            onSortDesc={() => onSortDesc(column.id)}
          />
        )}
      </div>
    </th>
  )
}
