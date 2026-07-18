'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

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

type Option = {
  label: string
  value: string
}

type Props = {
  allOptions: string[]
  defaultOptions: string[]
  onSelect: (option: string) => void
}

export function Combobox({ allOptions, defaultOptions, onSelect }: Props) {
  const [open, setOpen] = React.useState<boolean>(false)
  const [value, setValue] = React.useState<string>('')
  const [searchInput, setSearchInput] = React.useState<string>('')

  const [options, setOptions] = React.useState<Option[]>(
    defaultOptions.map((op) => ({ label: op, value: op }))
  ) // options to be displayed in the dropdown

  const handleOnChange = (val: string) => {
    setSearchInput(val)
    if (val.length > 3) {
      const filteredOptions = allOptions
        .filter((op) => op.toLowerCase().includes(val.trim().toLowerCase()))
        .map((op) => ({ label: op, value: op }))
      setOptions(filteredOptions)
    } else setOptions(defaultOptions.map((op) => ({ label: op, value: op })))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          className='w-full justify-between rounded-md'
        >
          {value ||
            // ? options.find((opt) => opt.value === value)?.label
            // :
            'Select'}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-full p-0'>
        <Command>
          <CommandInput
            value={searchInput}
            onValueChange={handleOnChange}
            placeholder='Search...'
          />
          <CommandList>
            {options.length === 0 && (
              <CommandEmpty>No results found!</CommandEmpty>
            )}
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    onSelect(currentValue)
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === opt.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
              <CommandItem
                key={'other'}
                value='other'
                className='text-semantic-danger'
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setOpen(false)
                  onSelect(currentValue)
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    value === 'other' ? 'opacity-100' : 'opacity-0'
                  )}
                />
                Don&apos;t import
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
