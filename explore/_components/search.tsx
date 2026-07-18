'use client'

import React, { useCallback } from 'react'
import { Search } from 'lucide-react'

interface SearchInputProp {
  searchQuery: string
  handleInput: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchInput: React.FC<SearchInputProp> = ({
  searchQuery,
  handleInput
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleInput(e)
    },
    [handleInput]
  )

  return (
    <div className='flex h-10 flex-1 items-center gap-2 overflow-hidden rounded-full bg-white px-5'>
      <Search size={18} className='shrink-0 text-[#667085]' />
      <input
        type='text'
        placeholder='Search partners'
        value={searchQuery}
        onChange={handleChange}
        className='flex-1 bg-transparent text-sm text-[#4D5C78] placeholder:text-[#4D5C78] focus:outline-none'
      />
    </div>
  )
}

export default React.memo(SearchInput)
