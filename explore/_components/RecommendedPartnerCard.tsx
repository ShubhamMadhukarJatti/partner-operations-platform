'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { ArrowRightIcon, Star } from 'lucide-react'
import { useSelector } from 'react-redux'

import { useConfigData, useSpecificConfigData } from '@/lib/useConfig'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { PREFERRED_SECTORS } from '../../_components/organization-card'
import { CompanyDetailsDrawer } from '../../explore-2/_components/company-details-drawer'

const calculateMatchPercentage = (array1: any, array2: any): number => {
  if (!array1?.length || !array2?.length) {
    return 76
  }

  const set1 = new Set(array1.map((a: any) => a.area))
  const set2 = new Set(array2.map((a: any) => a.area))

  const commonElements = [...set1].filter((item) => set2.has(item)).length
  const maxSize = Math.max(set1.size, set2.size)

  return (commonElements / maxSize) * 100
}

const calculateOverallMatch = (
  organization: any,
  currentOrganization: any
): number => {
  const psMatch = calculateMatchPercentage(
    organization?.preferredSectors,
    currentOrganization?.preferredSectors
  )
  const ppMatch = calculateMatchPercentage(
    organization?.preferredPartnershipTypes,
    currentOrganization?.preferredPartnershipTypes
  )

  return Math.round((psMatch + ppMatch) / 2)
}

const RecommendedPartnerCard: React.FC<{
  filled?: boolean
  data?: any
  listView?: boolean
}> = ({ filled = true, data, listView = true }) => {
  const [openDrawer, setOpenDrawer] = useState(false)
  const { organization: currentOrganization } = useSelector(
    (state: RootState) => state.currentOrg
  )

  const { preferredSectors } = useSpecificConfigData(['PREFERRED_SECTORS'])

  // Memoize the match calculation to avoid recalculating on every render
  const overallMatch = useMemo(
    () => calculateOverallMatch(data, currentOrganization),
    [data, currentOrganization]
  )

  // Memoize the sector badge to avoid unnecessary calculations
  const sectorBadge = useMemo(() => {
    const sector = PREFERRED_SECTORS?.find((x) => x?.value === data?.sector)
    return sector ? (
      <Badge
        className='w-fit items-center rounded bg-[#F1F1F1] px-3 py-1 text-shark-xs hover:bg-[#F1F1F1]'
        variant='outline'
      >
        <span className='lowercase first-letter:uppercase'>{sector.key}</span>
      </Badge>
    ) : null
  }, [data?.sector])

  return (
    <>
      <CompanyDetailsDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        id={data.id}
        // playgroundOptions={playgroundOptions}
        // playgroundOptionHints={playgroundOptionHints}
        sectorsData={preferredSectors}
        match={overallMatch}
      />
      <div className='flex select-none flex-col justify-between gap-2 rounded-lg border border-[#E4E7EE] bg-white p-3'>
        <div className='flex flex-col gap-4'>
          <div className='flex justify-between gap-2'>
            <div className='flex w-full gap-2'>
              <div className='relative h-[50px] w-[50px] rounded-[6px]'>
                <Image
                  src={
                    data?.logoUrl ||
                    'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
                  }
                  fill
                  objectFit='contain'
                  alt='partner logo'
                />
              </div>
              <div className='flex items-center gap-5'>
                <h3 className='text-shark-base font-bold text-black'>
                  {data?.name}
                </h3>
                {sectorBadge}
              </div>
            </div>
            <Star
              stroke={filled ? '#C8CFDC' : '#6863FB'}
              size={20}
              fill={filled ? '#ffffff' : '#6863FB'}
            />
          </div>
          <p className='text-shark-sm/5 font-normal text-[#666666]'>
            {data?.briefDescription}
          </p>
        </div>
        <Button
          className='flex h-auto w-fit items-center gap-1 p-0 text-shark-sm/5 font-bold text-[#3E50F7]'
          variant='link'
          onClick={() => setOpenDrawer(true)}
        >
          View Partner Info <ArrowRightIcon />
        </Button>
      </div>
    </>
  )
}

export default React.memo(RecommendedPartnerCard)
