'use client'

import { SetStateAction, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { getExistingOrganizations } from '@/lib/actions/onboarding'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/components/ui/multi-select'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface SuggestionInputProps {
  register: any
  setValue: (name: string, value: any) => void
  error?: string
  enableManualInput: boolean
}

export default function SuggestionInput({
  register,
  setValue,
  error,
  enableManualInput
}: SuggestionInputProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [suggestions, setSuggestions] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 500)

  const dropdownRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.trim() === '') {
        setSuggestions([])
        return
      }
      setLoading(true)
      try {
        const response = await getExistingOrganizations(debouncedSearch)

        setSuggestions(response)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }
    fetchSuggestions()
  }, [debouncedSearch])

  const isExistingSuggestion = (value: string) => {
    return suggestions.some(
      (suggestion: { organizationName: string }) =>
        suggestion.organizationName.toLowerCase() === value.toLowerCase()
    )
  }

  const handleInputChange = (e: { target: { value: string } }) => {
    const newValue = e.target.value

    // Check if the value already exists in the suggestions
    if (!isExistingSuggestion(newValue)) {
      setSearchTerm(newValue)
      setValue(register.name, newValue)
    }
  }
  const handleSuggestionClick = (suggestion: SetStateAction<string>) => {
    setSearchTerm(suggestion)

    setValue(register.name, suggestion)
    setSuggestions([])
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSuggestions([])
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className='relative w-full lg:max-w-md'>
      <div className='relative'>
        <OutlinedInput
          label='Product Name'
          type='text'
          placeholder='Enter startup name'
          value={searchTerm}
          {...register}
          disabled={enableManualInput}
          onChange={handleInputChange}
          className='font-base  bg-transparent leading-normal text-text-100'
        />
        {loading && (
          <div className='absolute inset-y-0 right-2 flex items-center'>
            <div className='h-5 w-5 text-muted-foreground' />
          </div>
        )}

        {error && <p className='text-sm text-red-500'>{error}</p>}
      </div>
      {suggestions.length > 0 && (
        <ScrollArea
          className='absolute z-10 mt-2 h-64  w-96 rounded-md bg-white p-1 shadow-md'
          ref={dropdownRef}
        >
          <ul className='space-y-0.5 py-1 text-foreground'>
            {suggestions.map(
              (suggestion: {
                organizationName: string
                existsInOrganization: boolean
                logoUrl: string
              }) => (
                <li
                  key={suggestion.organizationName}
                  className={cn(
                    "hover:bg-muted/50' flex cursor-pointer items-center  justify-between  rounded-md px-4 py-2",
                    {
                      'bg-[#F4F8FF]': suggestion.existsInOrganization
                    }
                  )}
                  onClick={() =>
                    handleSuggestionClick(suggestion.organizationName)
                  }
                >
                  <div className='flex items-center gap-2'>
                    <Image
                      src={suggestion.logoUrl}
                      alt={suggestion.organizationName}
                      width={24}
                      height={24}
                      className='rounded-full'
                    />
                    <p
                      className={cn('text-sm font-semibold  text-text-100', {
                        'text-primary-light-blue':
                          suggestion.existsInOrganization
                      })}
                    >
                      {suggestion.organizationName}
                    </p>
                  </div>

                  {suggestion.existsInOrganization ? (
                    <span className='text-xs font-bold text-primary-light-blue'>
                      Registered
                    </span>
                  ) : (
                    <span className='text-xs text-text-100 '>
                      Not Registered
                    </span>
                  )}
                </li>
              )
            )}
          </ul>

          <ScrollBar />
        </ScrollArea>
      )}
    </div>
  )
}
