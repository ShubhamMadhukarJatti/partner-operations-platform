import React from 'react'

import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

const COLORS = [
  '#FFBA53',
  '#FF7A59',
  '#6A1CD8',
  '#00970A',
  '#53FF597D', // This looks like it has alpha, keeping as requested
  '#9D4430'
]

const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className='h-10 w-20 border-[#E5E7EB] bg-[#F9FAFB] transition-all focus:ring-1 focus:ring-offset-0'>
        <SelectValue>
          <div
            className='h-5 w-5 rounded-md'
            style={{ backgroundColor: value || COLORS[0] }}
          />
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className='flex gap-2 p-2'>
          {COLORS.map((color) => (
            <SelectItem
              key={color}
              value={color}
              className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-md p-0 focus:bg-accent focus:text-accent-foreground'
            >
              <div
                className='h-6 w-6 rounded-md'
                style={{ backgroundColor: color }}
              />
            </SelectItem>
          ))}
        </div>
      </SelectContent>
    </Select>
  )
}

export default ColorPicker
