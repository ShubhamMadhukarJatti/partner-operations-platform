import React, { useState } from 'react'
import { Plus, Tag, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'

import { ColumnOption, ColumnType } from './types'

export const StatusPillsSubmenu = ({
  onAddColumn
}: {
  onAddColumn: (
    type: ColumnType,
    options?: ColumnOption[],
    columnName?: string
  ) => void
}) => {
  const [columnName, setColumnName] = useState('Status')
  const [options, setOptions] = useState<ColumnOption[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newColor, setNewColor] = useState('#3B82F6')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  const handleAddStatus = () => {
    if (newLabel.trim()) {
      const newStatus: ColumnOption = {
        id: crypto.randomUUID(),
        label: newLabel.trim(),
        color: newColor
      }
      setOptions((prev) => [...prev, newStatus])
      setNewLabel('')
      setNewColor('#3B82F6')
      setIsAddingNew(false)
    }
  }

  const handleDeleteStatus = (id: string) => {
    setOptions((prev) => prev.filter((s) => s.id !== id))
  }

  const handleUpdateLabel = (id: string) => {
    if (editLabel.trim()) {
      setOptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, label: editLabel.trim() } : s))
      )
    }
    setEditingId(null)
    setEditLabel('')
  }

  const handleUpdateColor = (id: string, color: string) => {
    setOptions((prev) => prev.map((s) => (s.id === id ? { ...s, color } : s)))
  }

  const handleClearAll = () => {
    setOptions([])
  }

  const handleCreateColumn = () => {
    onAddColumn('status', options, columnName)
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Tag className='mr-2 h-4 w-4' /> Status Pills
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className='w-[260px] p-4' sideOffset={8}>
        {/* Header */}
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-base font-semibold'>Status Pills</h3>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClearAll}
            className='h-7 text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700'
            disabled={options.length === 0}
          >
            Clear all
          </Button>
        </div>

        <DropdownMenuSeparator className='mb-3' />

        {/* Column Name Input */}
        <div className='mb-3' onClick={(e) => e.stopPropagation()}>
          <label className='mb-1 block text-xs font-medium text-gray-700'>
            Column Name
          </label>
          <Input
            value={columnName}
            onChange={(e) => setColumnName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            className='h-9'
            placeholder='e.g., Status, Priority'
          />
        </div>

        <DropdownMenuSeparator className='mb-3' />

        {/* Status Options List */}
        <div className='mb-3 max-h-[300px] space-y-2 overflow-y-auto'>
          {options.map((status) => (
            <div
              key={status.id}
              className='group flex items-center gap-2'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Color Picker */}
              <div className='relative'>
                <Input
                  type='color'
                  value={status.color}
                  onChange={(e) => handleUpdateColor(status.id, e.target.value)}
                  className='h-9 w-9 cursor-pointer rounded border border-gray-300 p-0'
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Label Input */}
              {editingId === status.id ? (
                <Input
                  autoFocus
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onBlur={() => handleUpdateLabel(status.id)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') handleUpdateLabel(status.id)
                    if (e.key === 'Escape') {
                      setEditingId(null)
                      setEditLabel('')
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className='h-9 flex-1'
                />
              ) : (
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    setEditingId(status.id)
                    setEditLabel(status.label)
                  }}
                  className='flex-1 cursor-pointer rounded border border-gray-300 px-3 py-2 text-sm hover:border-gray-400 hover:bg-gray-50'
                >
                  {status.label}
                </div>
              )}

              {/* Delete Button */}
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteStatus(status.id)
                }}
                className='h-9 w-9 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Status */}
        {isAddingNew ? (
          <div
            className='space-y-2 border-t pt-3'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center gap-2'>
              <Input
                type='color'
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                className='h-9 w-9 cursor-pointer rounded border border-gray-300 p-0'
                onClick={(e) => e.stopPropagation()}
              />
              <Input
                autoFocus
                placeholder='Status name'
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') handleAddStatus()
                  if (e.key === 'Escape') {
                    setIsAddingNew(false)
                    setNewLabel('')
                  }
                }}
                onClick={(e) => e.stopPropagation()}
                className='h-9 flex-1'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                size='sm'
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddStatus()
                }}
                disabled={!newLabel.trim()}
                className='h-8'
              >
                Add
              </Button>
              <Button
                size='sm'
                variant='ghost'
                onClick={(e) => {
                  e.stopPropagation()
                  setIsAddingNew(false)
                  setNewLabel('')
                }}
                className='h-8'
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant='ghost'
            className='h-9 w-full justify-start text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            onClick={(e) => {
              e.stopPropagation()
              setIsAddingNew(true)
            }}
          >
            <Plus className='mr-2 h-4 w-4' />
            Add Status
          </Button>
        )}

        {/* Create Column Button */}
        <DropdownMenuSeparator className='my-3' />
        <Button
          className='w-full bg-blue-600 text-white hover:bg-blue-700'
          onClick={(e) => {
            e.stopPropagation()
            handleCreateColumn()
          }}
          disabled={options.length === 0}
        >
          Create Status Column
        </Button>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
