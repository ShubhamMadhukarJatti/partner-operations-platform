'use client'

import React, { useCallback } from 'react'

import { Search } from '@/components/ui/search'

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
    <Search
      placeholder='Search'
      className='h-auto w-full items-center text-shark-sm font-normal'
      value={searchQuery}
      onChange={handleChange}
    />
  )
}

export default React.memo(SearchInput)
