import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import AiRecommendDialog from '../AiRecommendDialog'
import { FilterProp } from '../Filters'
import SearchInput from '../search'
import SuggestBrandDialog from '../SuggesBrandDialog'

const MobileHeader: React.FC<FilterProp> = ({
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
    <div className=' flex w-full gap-2 pb-4 lg:hidden'>
      <SearchInput
        searchQuery={searchInput}
        handleInput={(e) => setSearchInput(e.target.value)}
      />
      <AiRecommendDialog />
    </div>
  )
}

export default MobileHeader
