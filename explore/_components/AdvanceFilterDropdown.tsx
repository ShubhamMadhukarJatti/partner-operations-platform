'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

interface FilterOption {
  id: string
  label: string
  value: string
}

interface FilterPopoverProps {
  title: string
  options?: FilterOption[] | []
  onSelectionChange: (selectedIds: string[]) => void
  label?: string
}

export const AdvanceFilterDropdown = React.memo(function AdvanceFilterDropdown({
  title,
  options = [],
  onSelectionChange,
  label
}: FilterPopoverProps) {
  const [selectedOptions, setSelectedOptions] = React.useState<Set<string>>(
    new Set()
  )
  const [isOpen, setIsOpen] = React.useState(false)

  const handleCheckboxChange = React.useCallback(
    (optionId: string, checked: boolean) => {
      const newSelection = new Set(selectedOptions)
      if (checked) {
        newSelection.add(optionId)
      } else {
        newSelection.delete(optionId)
      }
      setSelectedOptions(newSelection)
      onSelectionChange(Array.from(newSelection))
    },
    [selectedOptions, onSelectionChange]
  )

  const isSelected = React.useCallback(
    (value: string) => selectedOptions.has(value),
    [selectedOptions]
  )

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className='flex flex-col gap-1'>
          {/* <span className='text-sm font-semibold text-[#414651]'>{label}</span> */}
          <Button
            variant='outline'
            className='h-11 w-full justify-between rounded-lg border border-[#D5D7DA] text-shark-sm font-bold text-text-80 shadow-xs'
            role='combobox'
            aria-expanded={isOpen}
          >
            {title}
            <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className='max-w-xs p-0' align='start'>
        <ScrollArea className='h-[250px]'>
          {/* Adjust height as needed */}
          <div>
            {options.map((option) => (
              <div
                key={option.id}
                className={`flex cursor-pointer items-center space-x-2 px-2 py-2.5 transition-all ${isSelected(option.value)
                    ? 'bg-shark-blue-50'
                    : 'hover:bg-shark-blue-50'
                  }`}
              >
                <Checkbox
                  id={option.id}
                  checked={isSelected(option.value)}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(option.value, checked as boolean)
                  }
                />
                <label
                  htmlFor={option.id}
                  className='flex-grow text-base font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                >
                  {option.label.toLowerCase()}
                </label>
              </div>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
})
