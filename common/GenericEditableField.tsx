import React from 'react'

import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface Option {
  value: string
  label: string
}

interface GenericEditableFieldProps {
  label: string
  value: string | string[]
  isEditing: boolean
  onChange: (value: string | string[]) => void
  type?: 'text' | 'textarea' | 'select' | 'multiselect' | 'date'
  options?: Option[]
  placeholder?: string
  className?: string
  labelColor?: string
  valueColor?: string
}

const GenericEditableField: React.FC<GenericEditableFieldProps> = ({
  label,
  value,
  isEditing,
  onChange,
  type = 'text',
  options = [],
  placeholder,
  className = '',
  labelColor = '#666666', // text-gray-500 dark:text-white
  valueColor = '#111111' // text-gray-900 dark:text-white equivalent or custom
}) => {
  const isEmptyValue = () => {
    if (Array.isArray(value)) return value.length === 0
    return value === null || value === undefined || value === ''
  }

  const getDisplayValue = () => {
    if (Array.isArray(value)) {
      if (options.length > 0) {
        return value
          .map((v) => options.find((o) => o.value === v)?.label || v)
          .join(', ')
      }
      return value.join(', ')
    }

    // Format date values
    if (type === 'date' && value) {
      try {
        const date = new Date(value as string)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        })
      } catch {
        return value
      }
    }

    if (options.length > 0) {
      const displayValue =
        options.find((o) => o.value === value)?.label || value
      // Show placeholder for empty select values
      if (type === 'select' && (!value || value === '')) {
        return {
          value: `Please select ${label.toLowerCase()}`,
          isPlaceholder: true
        }
      }
      return { value: displayValue, isPlaceholder: false }
    }
    return { value: value || '', isPlaceholder: false }
  }

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            className='w-full resize-none'
            rows={3}
          />
        )
      case 'select':
        return (
          <Select
            value={value as string}
            onValueChange={(newValue) => onChange(newValue)}
          >
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case 'multiselect':
        return (
          <div className='space-y-2'>
            {options.map((option) => (
              <label
                key={option.value}
                className='flex cursor-pointer items-center space-x-2'
              >
                <Checkbox
                  checked={Array.isArray(value) && value.includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (checked) {
                      onChange([...currentValues, option.value])
                    } else {
                      onChange(currentValues.filter((v) => v !== option.value))
                    }
                  }}
                />
                <span className='text-sm text-[#2A3241] dark:text-white'>
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )
      case 'date':
        return (
          <Input
            type='date'
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Select ${label.toLowerCase()}`}
            className='w-full font-medium [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0'
            style={{ cursor: 'pointer' }}
          />
        )
      case 'text':
      default:
        return (
          <Input
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || `Enter ${label.toLowerCase()}`}
            className='w-full font-medium'
          />
        )
    }
  }

  if (isEditing) {
    return (
      <div className={className}>
        <label className='mb-1 block text-xs text-[#6B7280] dark:text-white'>
          {label}
        </label>
        {renderInput()}
      </div>
    )
  }

  const isEmpty = isEmptyValue()
  const displayResult = getDisplayValue()

  const displayValue = isEmpty
    ? '-'
    : typeof displayResult === 'object'
      ? displayResult.value
      : displayResult
  const isPlaceholder = isEmpty
    ? false
    : typeof displayResult === 'object'
      ? displayResult.isPlaceholder
      : false

  return (
    <div className={className}>
      <span className='text-xs text-[#6B7280] dark:text-white'>{label}</span>
      <div
        className={`break-words text-base font-medium text-[#2A3241] dark:text-white ${
          isPlaceholder ? 'italic text-gray-400 dark:text-white' : ''
        }`}
      >
        {displayValue}
      </div>
    </div>
  )
}

export default GenericEditableField
