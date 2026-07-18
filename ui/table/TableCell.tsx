'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon, Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import MultipleSelector, { Option } from '@/components/ui/multi-select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { StatusPill } from './StatusPill'
import { Column, ColumnOption } from './types'

const MAX_CELL_TEXT_LENGTH = 25

function truncateWithEllipsis(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text
  return text.slice(0, maxLen).trim() + '...'
}

/** Export for use in custom renderCell (e.g. OfflinePartnersTable). Truncates long text and shows full text on hover. */
export function CellTextWithTooltip({
  text,
  maxLength = MAX_CELL_TEXT_LENGTH,
  className
}: {
  text: string
  maxLength?: number
  className?: string
}) {
  const needsTruncation = text.length > maxLength
  const displayText = needsTruncation
    ? truncateWithEllipsis(text, maxLength)
    : text

  if (needsTruncation) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn('block cursor-default truncate', className)}
            title={undefined}
          >
            {displayText}
          </span>
        </TooltipTrigger>
        <TooltipContent side='top' className='max-w-[320px] break-words'>
          {text}
        </TooltipContent>
      </Tooltip>
    )
  }

  return <span className={cn(className)}>{text}</span>
}

interface TableCellProps {
  value: any
  column: Column
  row: Record<string, any>
  rowId: string
  onUpdate: (rowId: string, accessorKey: string, value: any) => void
  readOnly?: boolean
  /** Font weight for text cells - "normal" for lighter look */
  textFontWeight?: 'normal' | 'medium'
}

export const TableCell = ({
  value,
  column,
  row,
  rowId,
  onUpdate,
  readOnly = false,
  textFontWeight = 'medium'
}: TableCellProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [currentValue, setCurrentValue] = useState(value)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync currentValue when value changes
  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const handleSave = useCallback(() => {
    setIsEditing(false)
    if (JSON.stringify(currentValue) !== JSON.stringify(value)) {
      onUpdate(rowId, column.accessorKey, currentValue)
    }
  }, [currentValue, value, onUpdate, rowId, column.accessorKey])

  // Handle click outside to save and close
  useEffect(() => {
    if (isEditing) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node) &&
          // Check if the click is inside a portal (like Select or Popover content)
          !document
            .querySelector('[data-radix-popper-content-wrapper]')
            ?.contains(event.target as Node) &&
          // Also check for specific classes that might be used by Select/Popover portals if data attribute missing
          !(event.target as Element).closest('[role="listbox"]') &&
          !(event.target as Element).closest('[role="dialog"]')
        ) {
          handleSave()
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }
  }, [isEditing, handleSave])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setCurrentValue(value)
    }
  }

  if (column.renderCell) {
    return (
      <div className='w-full min-w-0 overflow-hidden'>
        {column.renderCell({ value, row, rowId, column })}
      </div>
    )
  }

  if (isEditing) {
    return (
      <div ref={containerRef} className='w-full'>
        {column.type === 'text' && (
          <Input
            autoFocus
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className='h-8 w-full'
            onBlur={handleSave}
          />
        )}

        {column.type === 'number' && (
          <Input
            autoFocus
            type='number'
            value={currentValue}
            onChange={(e) =>
              setCurrentValue(e.target.value ? Number(e.target.value) : '')
            }
            onKeyDown={handleKeyDown}
            className='h-8 w-full font-mono'
            onBlur={handleSave}
          />
        )}

        {column.type === 'status' && (
          <Select
            value={currentValue}
            onValueChange={(val) => {
              setCurrentValue(val)
              onUpdate(rowId, column.accessorKey, val)
              setIsEditing(false)
            }}
            defaultOpen
          >
            <SelectTrigger className='h-8 w-full'>
              <SelectValue placeholder='Select status' />
            </SelectTrigger>
            <SelectContent>
              {column.options?.map((opt) => (
                <SelectItem key={opt.id} value={opt.label}>
                  <StatusPill value={opt.label} options={column.options} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {column.type === 'calendar' && (
          <Popover defaultOpen onOpenChange={(open) => !open && handleSave()}>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className={cn(
                  'h-8 w-full justify-start text-left font-normal',
                  !currentValue && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className='mr-2 h-4 w-4' />
                {currentValue ? (
                  format(new Date(currentValue), 'PPP')
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={currentValue ? new Date(currentValue) : undefined}
                onSelect={(date) => {
                  const newVal = date ? format(date, 'yyyy-MM-dd') : ''
                  setCurrentValue(newVal)
                  onUpdate(rowId, column.accessorKey, newVal)
                  setIsEditing(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}

        {column.type === 'tags' && (
          <div className='flex items-center gap-1'>
            <div className='flex-1'>
              <MultipleSelector
                defaultOptions={
                  column.options?.map((opt) => ({
                    label: opt.label,
                    value: opt.label
                  })) || []
                }
                value={(Array.isArray(currentValue) ? currentValue : []).map(
                  (val: string) => ({ label: val, value: val })
                )}
                onChange={(options) => {
                  const newTags = options.map((o) => o.value)
                  setCurrentValue(newTags)
                }}
                className='min-w-[150px]'
                badgeClassName='bg-gray-200 text-gray-800 hover:bg-gray-300'
              />
            </div>
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8 text-green-600 hover:bg-green-50'
              onClick={handleSave}
            >
              <Check className='h-4 w-4' />
            </Button>
          </div>
        )}
      </div>
    )
  }

  // Display Mode
  return (
    <div
      className={cn(
        'flex min-h-[32px] w-full items-center rounded py-1.5',
        readOnly
          ? 'cursor-default'
          : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
      onClick={() => {
        if (!readOnly) setIsEditing(true)
      }}
    >
      {column.type === 'text' && (
        <CellTextWithTooltip
          text={value ? String(value) : '—'}
          className={`${textFontWeight === 'normal' ? 'font-normal' : 'font-medium'} text-gray-900 dark:text-white`}
        />
      )}
      {column.type === 'number' && (
        <span className='font-mono text-blue-600'>{value || '0'}</span>
      )}
      {column.type === 'calendar' && (
        <div className='flex items-center gap-2 text-gray-700 dark:text-gray-300'>
          <CalendarIcon className='h-4 w-4 text-gray-500' />
          <span>{value ? format(new Date(value), 'PPP') : 'No Date'}</span>
        </div>
      )}
      {column.type === 'status' && (
        <StatusPill value={value} options={column.options} />
      )}
      {column.type === 'tags' && (
        <span className='text-gray-700 dark:text-gray-300'>
          {Array.isArray(value) && value.length > 0 ? (
            <CellTextWithTooltip text={value.join(', ')} />
          ) : (
            <span className='text-xs italic text-gray-400'>No Tags</span>
          )}
        </span>
      )}
    </div>
  )
}
