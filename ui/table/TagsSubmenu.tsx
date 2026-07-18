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

export const TagsSubmenu = ({
  onAddColumn
}: {
  onAddColumn: (
    type: ColumnType,
    options?: ColumnOption[],
    columnName?: string
  ) => void
}) => {
  const [columnName, setColumnName] = useState('Tags')
  const [options, setOptions] = useState<ColumnOption[]>([])
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')

  const handleAddTag = () => {
    if (newLabel.trim()) {
      const newTag: ColumnOption = {
        id: crypto.randomUUID(),
        label: newLabel.trim()
      }
      setOptions((prev) => [...prev, newTag])
      setNewLabel('')
      setIsAddingNew(false)
    }
  }

  const handleDeleteTag = (id: string) => {
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

  const handleClearAll = () => {
    setOptions([])
  }

  const handleCreateColumn = () => {
    onAddColumn('tags', options, columnName)
  }

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Tag className='mr-2 h-4 w-4' /> Tags
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent className='w-[260px] p-4' sideOffset={8}>
        {/* Header */}
        <div className='mb-3 flex items-center justify-between'>
          <h3 className='text-base font-semibold'>Tags</h3>
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
            placeholder='e.g., Tags, Keywords'
          />
        </div>

        <DropdownMenuSeparator className='mb-3' />

        {/* Tag Options List */}
        <div className='mb-3 max-h-[300px] space-y-2 overflow-y-auto'>
          {options.map((tag) => (
            <div
              key={tag.id}
              className='group flex items-center gap-2'
              onClick={(e) => e.stopPropagation()}
            >
              {/* Label Input */}
              {editingId === tag.id ? (
                <Input
                  autoFocus
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  onBlur={() => handleUpdateLabel(tag.id)}
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    if (e.key === 'Enter') handleUpdateLabel(tag.id)
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
                    setEditingId(tag.id)
                    setEditLabel(tag.label)
                  }}
                  className='flex-1 cursor-pointer rounded border border-gray-300 px-3 py-2 text-sm hover:border-gray-400 hover:bg-gray-50'
                >
                  {tag.label}
                </div>
              )}

              {/* Delete Button */}
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteTag(tag.id)
                }}
                className='h-9 w-9 text-gray-400 opacity-0 transition-opacity hover:bg-red-50 hover:text-red-600 group-hover:opacity-100'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>
          ))}
        </div>

        {/* Add New Tag */}
        {isAddingNew ? (
          <div
            className='space-y-2 border-t pt-3'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex items-center gap-2'>
              <Input
                autoFocus
                placeholder='Value 1'
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  e.stopPropagation()
                  if (e.key === 'Enter') handleAddTag()
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
                  handleAddTag()
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
            Add Tag
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
          Create Tags Column
        </Button>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}
