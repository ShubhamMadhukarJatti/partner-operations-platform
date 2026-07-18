'use client'

import React from 'react'
import {
  ArrowUpDown,
  MoreHorizontal,
  PanelLeft,
  PanelRight,
  Pencil,
  Trash2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { ColumnTypeMenuItems } from './AddColumnMenu'
import { ColumnOption, ColumnType } from './types'

interface HeaderMenuProps {
  columnId: string
  onEditTitle: () => void
  onAddColumn: (
    fromId: string,
    position: 'left' | 'right',
    type: ColumnType,
    options?: ColumnOption[],
    columnName?: string
  ) => void
  onDeleteColumn: (id: string) => void
  onSortAsc: () => void
  onSortDesc: () => void
}

export const HeaderMenu = ({
  columnId,
  onEditTitle,
  onAddColumn,
  onDeleteColumn,
  onSortAsc,
  onSortDesc
}: HeaderMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className='h-6 w-6'>
          <MoreHorizontal className='h-4 w-4 text-gray-500' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        <DropdownMenuItem onClick={onEditTitle}>
          <Pencil className='mr-2 h-4 w-4' /> Rename
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PanelLeft className='mr-2 h-4 w-4' /> Insert Left
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ColumnTypeMenuItems
              onAddColumn={(type, options, columnName) =>
                onAddColumn(columnId, 'left', type, options, columnName)
              }
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <PanelRight className='mr-2 h-4 w-4' /> Insert Right
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <ColumnTypeMenuItems
              onAddColumn={(type, options, columnName) =>
                onAddColumn(columnId, 'right', type, options, columnName)
              }
            />
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={onSortAsc}>
          <ArrowUpDown className='mr-2 h-4 w-4' /> Sort Ascending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSortDesc}>
          <ArrowUpDown className='mr-2 h-4 w-4' /> Sort Descending
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className='text-red-600 focus:bg-red-50 focus:text-red-600'
          onClick={() => onDeleteColumn(columnId)}
        >
          <Trash2 className='mr-2 h-4 w-4' /> Delete Column
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
