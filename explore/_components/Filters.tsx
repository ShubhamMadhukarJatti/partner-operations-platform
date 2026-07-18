'use client'

import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { FilterLinesIcon } from '@/components/icons/icons'

import SearchInput from './search'
import SuggestBrandDialog from './SuggesBrandDialog'

export interface FilterProp {
  searchQuery: string
  setSearchQuery: React.Dispatch<SetStateAction<string>>
  partnershipType: string
  sectorsCommaSeparated: string
  subSectorsCommaSeparated: string
}

const Filters: React.FC<FilterProp> = ({
  searchQuery,
  setSearchQuery,
  sectorsCommaSeparated,
  partnershipType,
  subSectorsCommaSeparated
}) => {
  const queryClient = useQueryClient()
  const [searchInput, setSearchInput] = useState('')

  const debouncedSearch = useCallback(
    (value: string) => {
      queryClient.invalidateQueries({
        queryKey: [
          'discover-page',
          sectorsCommaSeparated,
          partnershipType,
          subSectorsCommaSeparated,
          value
        ]
      })
    },
    [
      queryClient,
      sectorsCommaSeparated,
      partnershipType,
      subSectorsCommaSeparated
    ]
  )

  // Using useRef to store the timeout ID
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      debouncedSearch(searchInput)
      setSearchQuery(searchInput)
    }, 400)
  }, [searchInput])

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className='my-6 hidden justify-between gap-2 lg:flex'>
      <button className='flex h-fit items-center gap-2 rounded-lg border border-[#D5D7DA] bg-white px-3.5 py-2.5 text-shark-sm font-normal text-[#2A3241] shadow-xs'>
        <Star size={20} stroke='#717680' /> Featured
      </button>

      <SearchInput
        searchQuery={searchInput}
        handleInput={(e) => setSearchInput(e.target.value)}
      />

      <Select name='country' disabled defaultValue='IN'>
        <SelectTrigger className='flex w-[200px] rounded-lg border border-[#D5D7DA] px-3.5 py-2.5 text-shark-sm font-normal shadow-xs placeholder:text-[#2A3241]'>
          <SelectValue placeholder='Select Country' />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value='US'>US</SelectItem>
          <SelectItem value='IN'>India</SelectItem>
        </SelectContent>
      </Select>

      <div className='rounded-lg border border-[#D5D7DA] px-3.5 py-2.5'>
        <FilterLinesIcon />
      </div>

      <SuggestBrandDialog />
    </div>
  )
}

export default React.memo(Filters)
