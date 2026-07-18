'use client'

import * as React from 'react'
import { Check, ChevronDown, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export type eventDuration = 'TODAY' | 'TOMORROW' | 'WEEK' | 'MONTH'

interface dataType {
  value: eventDuration
  label: string
}

const data: dataType[] = [
  {
    value: 'TODAY',
    label: 'Today'
  },
  {
    value: 'TOMORROW',
    label: 'Tomorrow'
  },
  {
    value: 'WEEK',
    label: 'This Week'
  },
  {
    value: 'MONTH',
    label: 'This Month'
  }
]

const FilterDropdown: React.FC<{
  value: eventDuration
  setValue: React.Dispatch<React.SetStateAction<eventDuration>>
}> = ({ value, setValue }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='gap-1 border-2 border-[#3E50F7] bg-white text-sm font-semibold text-[#3E50F7]'
        >
          {data.find((framework) => framework.value === value)?.label}
          <ChevronDown stroke='#3E50F7' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandGroup>
              {data.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue: any) => {
                    setValue(currentValue)
                    setOpen(false)
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === framework.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default FilterDropdown
