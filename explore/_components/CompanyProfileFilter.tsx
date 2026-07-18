'use client'

import React from 'react'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import { ChevronDown } from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible'

import { PREFERRED_SECTORS } from '../../_components/organization-card'

const CompanyProfileFilter = () => {
  const [isOpen, setIsOpen] = React.useState(true)
  const { organization } = useSelector((state: RootState) => state.currentOrg)

  const getSectorName = (sector: string | undefined) => {
    const sectorData = PREFERRED_SECTORS?.find((x) => x?.value === sector)
    return sectorData ? sectorData.key : '-'
  }

  const profileDetails = [
    { label: 'Company Name', value: organization?.name || '-' },
    { label: 'Industry', value: getSectorName(organization?.sector) },
    {
      label: 'Segment & Size',
      value: `${organization?.companyType || '-'} | - Employees`
    },
    {
      label: 'Description',
      value: organization?.briefDescription || '-'
    },
    { label: 'Products & Services', value: '-' },
    { label: 'Current Partners', value: '-' }
  ]

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className='flex w-full flex-col gap-2 rounded-lg border border-[#E9EAEB] bg-white p-6 shadow-xs'
    >
      <div className='flex items-center justify-between'>
        <h4 className='text-shark-sm font-bold text-[#181D27]'>
          Company Profile
        </h4>
        <CollapsibleTrigger asChild>
          <button>
            <ChevronDown className='h-4 w-4' />
            <span className='sr-only'>Toggle</span>
          </button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className='flex flex-col gap-4'>
        <div>
          {profileDetails.map((detail, index) => (
            <div
              key={index}
              className='flex flex-col gap-1 border-b border-[#E9EAEB] py-2'
            >
              <p className='text-shark-xs text-[#535862]'>{detail.label}</p>
              <p className='text-shark-xs font-semibold text-[#181D27]'>
                {detail.value}
              </p>
            </div>
          ))}
        </div>
        <Link
          href='/settings/profile'
          className='h-auto w-fit p-0 text-sm font-bold text-[#3E50F7] hover:no-underline'
        >
          Edit Profile
        </Link>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default CompanyProfileFilter
