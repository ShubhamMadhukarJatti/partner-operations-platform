'use client'

import React, { SetStateAction } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { ChevronDown } from 'lucide-react'

import { useSpecificConfigData } from '@/lib/useConfig'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

import { AdvanceFilterDropdown } from './AdvanceFilterDropdown'

export interface AdvanceFilterProp {
  searchQuery: string
  setSearchQuery: React.Dispatch<SetStateAction<string>>
  setPartnershipType: React.Dispatch<SetStateAction<string>>
  partnershipType: string
  setSectorsCommaSeparated: React.Dispatch<SetStateAction<string>>
  sectorsCommaSeparated: string
  setSubSectorsCommaSeparated: React.Dispatch<SetStateAction<string>>
  subSectorsCommaSeparated: string
}

const AdvanceFilter: React.FC<AdvanceFilterProp> = React.memo(
  ({
    searchQuery,
    setSearchQuery,
    setPartnershipType,
    partnershipType,
    setSectorsCommaSeparated,
    sectorsCommaSeparated,
    setSubSectorsCommaSeparated,
    subSectorsCommaSeparated
  }) => {
    const [isOpen, setIsOpen] = React.useState(true)
    const queryClient = useQueryClient()

    const {
      isLoading,
      isError,
      preferredPartnerships,
      preferredSectors,
      preferredSubSectors
    } = useSpecificConfigData([
      'PREFERRED_PARTNERSHIPS',
      'PREFERRED_SECTORS',
      'PREFERRED_SUB_SECTORS'
    ])

    console.log('preferredPartnerships', preferredPartnerships)

    return (
      <div className='flex flex-col items-start justify-end gap-4 rounded-md bg-card p-3 sm:flex-row sm:items-center'>
        {/* <p className='text-shark-sm font-bold text-text-100'>Advanced Filters</p> */}
        <AdvanceFilterDropdown
          title={'Partnership Type'}
          options={
            isLoading
              ? []
              : preferredPartnerships?.map((item: any) => ({
                  id: item.id,
                  label: item.value,
                  value: item.value
                }))
          }
          label='Partnership Type'
          onSelectionChange={async (selectedIds: string[]) => {
            setPartnershipType(selectedIds.join(','))
            await queryClient.invalidateQueries({
              queryKey: [
                'discover-page',
                sectorsCommaSeparated,
                partnershipType,
                subSectorsCommaSeparated,
                searchQuery
              ]
            })
          }}
        />
        <AdvanceFilterDropdown
          title={'Industry'}
          options={
            isLoading
              ? []
              : preferredSectors?.map((item: any) => ({
                  id: item.id,
                  label: item.key,
                  value: item.key
                }))
          }
          label='Sector Type'
          onSelectionChange={async (selectedIds: string[]) => {
            setSectorsCommaSeparated(selectedIds.join(','))
            await queryClient.invalidateQueries({
              queryKey: [
                'discover-page',
                sectorsCommaSeparated,
                partnershipType,
                subSectorsCommaSeparated,
                searchQuery
              ]
            })
          }}
        />
        <AdvanceFilterDropdown
          title={'Use Case'}
          options={
            isLoading
              ? []
              : preferredSubSectors?.map((item: any) => ({
                  id: item.id,
                  label: item.key,
                  value: item.key
                }))
          }
          label='Tags'
          onSelectionChange={async (selectedIds: string[]) => {
            setSubSectorsCommaSeparated(selectedIds.join(','))
            await queryClient.invalidateQueries({
              queryKey: [
                'discover-page',
                sectorsCommaSeparated,
                partnershipType,
                subSectorsCommaSeparated,
                searchQuery
              ]
            })
          }}
        />
      </div>
    )
  }
)

AdvanceFilter.displayName = 'AdvanceFilter'

export default AdvanceFilter
