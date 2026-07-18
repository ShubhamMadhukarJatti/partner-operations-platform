'use client'

import React, { useCallback, useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'

import { useSpecificConfigData } from '@/lib/useConfig'

interface FiltersChipProps {
  searchQuery: string
  setSearchInput: (value: string) => void
  filters: {
    partnershipType: string[]
    useCase: string[]
    sector: string[]
    compliance: string[]
    region: string[]
  }
  onRemoveFilter: (sectionKey: string, value: string) => void
  onClearAll: () => void
  onPartnershipChange: (values: string[]) => void
  onUseCaseChange: (values: string[]) => void
  onSectorChange: (values: string[]) => void
  onComplianceChange: (values: string[]) => void
  onRegionChange: (values: string[]) => void
  selectedSort: string
  onSortChange: (sort: string) => void
  onToggleFilters?: () => void
  filterSidebarVisible?: boolean
  isShortlisted?: boolean
  onShortlistedChange?: (value: boolean) => void
}

const FiltersChip: React.FC<FiltersChipProps> = ({
  searchQuery,
  setSearchInput,
  filters,
  onRemoveFilter,
  selectedSort,
  onSortChange
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  // Load configuration data for display names
  const { preferredPartnerships, preferredSubSectors } = useSpecificConfigData([
    'PREFERRED_PARTNERSHIPS',
    'PREFERRED_SUB_SECTORS'
  ]) ?? {
    preferredPartnerships: [],
    preferredSubSectors: []
  }

  // prettify helper
  const prettify = (s?: string) =>
    s
      ? s
          .replace(/_/g, ' ')
          .toLowerCase()
          .split(' ')
          .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
          .join(' ')
      : ''

  const getPartnershipDisplayName = useCallback(
    (key: string) => {
      const item = preferredPartnerships?.find((p: any) => p.key === key)
      return item?.value || key
    },
    [preferredPartnerships]
  )

  const getUseCaseDisplayName = useCallback(
    (key: string) => {
      const item = preferredSubSectors?.find((s: any) => s.key === key)
      return item ? prettify(item.key) : prettify(key)
    },
    [preferredSubSectors]
  )

  const getSectorDisplayName = useCallback((key: string) => {
    const sectorMap: Record<string, string> = {
      PRODUCT: 'Product',
      SERVICE: 'Service Providers',
      AGENCY: 'Agencies'
    }
    return sectorMap[key] || key
  }, [])

  const sortOptions = [
    { label: 'Recommended', value: 'recommended' },
    { label: 'High match percentage', value: 'high_match' },
    { label: 'Popular', value: 'popular' },
    { label: 'More active partners', value: 'more_active' },
    { label: 'Less acknowledgement time', value: 'less_ack_time' }
  ]

  const activeSortLabel = useMemo(() => {
    if (!selectedSort) return null
    return sortOptions.find((o) => o.value === selectedSort)?.label || null
  }, [selectedSort])

  const Badge = ({
    label,
    onRemove
  }: {
    label: string
    onRemove: () => void
  }) => (
    <span className='inline-flex h-[24px] items-center gap-1.5 rounded-[4px] border border-[#6863FB] bg-[#6863FB]/5 px-[6px] py-[2px] text-[13px] font-medium text-[#6863FB] transition-colors dark:border-[#6863FB]/50 dark:bg-[#6863FB]/20 dark:text-[#a78bfa]'>
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className='flex h-4 w-4 items-center justify-center rounded-full hover:bg-[#6863FB]/10 dark:hover:bg-[#6863FB]/40'
        type='button'
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </span>
  )

  return (
    <div className='flex w-full flex-col'>
      {isSearchOpen ? (
        // STATE 2: Search Open
        <div className='flex w-full flex-col gap-4'>
          {/* Search Bar Row */}
          <div className='flex w-full items-center gap-3'>
            <div className='flex h-11 flex-1 items-center rounded-lg border border-[#D0D5DD] bg-white px-3 shadow-sm dark:border-border dark:bg-[var(--colors-background-card)]'>
              <Search
                size={20}
                className='text-[#667085] dark:text-muted-foreground'
              />
              <input
                type='text'
                placeholder='e.g AI enabled partners over 50% match and ISO certified'
                value={searchQuery}
                onChange={(e) => setSearchInput(e.target.value)}
                className='ml-3 flex-1 bg-transparent text-[15px] text-[#101828] placeholder:text-[#98A2B3] focus:outline-none dark:text-foreground dark:placeholder:text-muted-foreground'
                autoFocus
              />
              <button
                onClick={() => setSearchInput('')}
                className='mx-2 text-[14px] font-medium text-[#6863FB] hover:text-[#5229CC] dark:text-[#a78bfa]'
              >
                Clear
              </button>
            </div>
            {/* Close Button Outside */}
            <button
              onClick={() => {
                setIsSearchOpen(false)
                setSearchInput('')
              }}
              className='flex h-8 w-8 shrink-0 items-center justify-center text-[#667085] hover:text-[#101828] dark:text-muted-foreground dark:hover:text-foreground'
            >
              <X size={22} strokeWidth={1.5} />
            </button>
          </div>

          {/* Applied Filters below search */}
          <div className='flex flex-wrap items-center gap-2 pl-1'>
            <span className='mr-1 text-[14px] text-[#475467] dark:text-muted-foreground'>
              Filters applied:
            </span>
            {activeSortLabel && (
              <Badge
                label={activeSortLabel}
                onRemove={() => onSortChange('')}
              />
            )}
            {Object.keys(filters).map((key) =>
              (filters as Record<string, string[]>)[key]?.map((val) => {
                let displayName = val
                if (key === 'partnershipType')
                  displayName = getPartnershipDisplayName(val)
                else if (key === 'useCase')
                  displayName = getUseCaseDisplayName(val)
                else if (key === 'sector')
                  displayName = getSectorDisplayName(val)

                return (
                  <Badge
                    key={key + '-' + val}
                    label={displayName}
                    onRemove={() => onRemoveFilter(key, val)}
                  />
                )
              })
            )}
          </div>
        </div>
      ) : (
        // STATE 1: Search Closed
        <div className='flex w-full items-start justify-between'>
          <div className='flex flex-wrap items-center gap-2 pl-1 pt-1'>
            <span className='mr-1 text-[14px] text-[#475467] dark:text-muted-foreground'>
              Filters applied:
            </span>
            {activeSortLabel && (
              <Badge
                label={activeSortLabel}
                onRemove={() => onSortChange('')}
              />
            )}
            {Object.keys(filters).map((key) =>
              (filters as Record<string, string[]>)[key]?.map((val) => {
                let displayName = val
                if (key === 'partnershipType')
                  displayName = getPartnershipDisplayName(val)
                else if (key === 'useCase')
                  displayName = getUseCaseDisplayName(val)
                else if (key === 'sector')
                  displayName = getSectorDisplayName(val)

                return (
                  <Badge
                    key={key + '-' + val}
                    label={displayName}
                    onRemove={() => onRemoveFilter(key, val)}
                  />
                )
              })
            )}
          </div>

          <button
            onClick={() => setIsSearchOpen(true)}
            className='flex shrink-0 items-center gap-2 pt-1 text-[15px] font-medium text-[#6863FB] hover:text-[#5229CC] dark:text-[#a78bfa]'
          >
            <Search size={18} strokeWidth={2.5} />
            Search
          </button>
        </div>
      )}
    </div>
  )
}

export default FiltersChip
