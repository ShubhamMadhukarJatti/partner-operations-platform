'use client'

import React, { useState } from 'react'
import { Calendar, Hash, Plus, Tag, Trash2, Type } from 'lucide-react'

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
import { Input } from '@/components/ui/input'

import { StatusPillsSubmenu } from './StatusPillsSubmenu'
import { TagsSubmenu } from './TagsSubmenu'
import { ColumnOption, ColumnType } from './types'

interface ColumnTypeMenuItemsProps {
  onAddColumn: (
    type: ColumnType,
    options?: ColumnOption[],
    columnName?: string
  ) => void
  showStatusPills?: boolean
}

// Reusable menu items component
export const ColumnTypeMenuItems = ({
  onAddColumn,
  showStatusPills = true
}: ColumnTypeMenuItemsProps) => {
  return (
    <>
      <DropdownMenuItem onClick={() => onAddColumn('text')}>
        <Type className='mr-2 h-4 w-4' /> Text
      </DropdownMenuItem>
      <DropdownMenuItem onClick={() => onAddColumn('number')}>
        <Hash className='mr-2 h-4 w-4' /> Number
      </DropdownMenuItem>
      <TagsSubmenu onAddColumn={onAddColumn} />
      {showStatusPills && <StatusPillsSubmenu onAddColumn={onAddColumn} />}
      <DropdownMenuItem onClick={() => onAddColumn('calendar')}>
        <Calendar className='mr-2 h-4 w-4' /> Calendar
      </DropdownMenuItem>
    </>
  )
}

interface AddColumnMenuProps {
  trigger: React.ReactNode
  onAddColumn: (
    type: ColumnType,
    options?: ColumnOption[],
    columnName?: string
  ) => void
  align?: 'start' | 'center' | 'end'
  showStatusPills?: boolean
}

export const AddColumnMenu = ({
  trigger,
  onAddColumn,
  align = 'end',
  showStatusPills = true
}: AddColumnMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <ColumnTypeMenuItems
          onAddColumn={onAddColumn}
          showStatusPills={showStatusPills}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
