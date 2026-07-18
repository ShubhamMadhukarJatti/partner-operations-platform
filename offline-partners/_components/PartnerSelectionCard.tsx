'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import { IconCircleCheck, IconCircleCheckFilled } from '@tabler/icons-react'
import { ArrowRightIcon } from 'lucide-react'
import { useSelector } from 'react-redux'

import { useSpecificConfigData } from '@/lib/useConfig'

import { PREFERRED_SECTORS } from '../../_components/organization-card'
import BriefcaseIcon from '../../../../../../public/briefcase-icon.svg'
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

const matchPillColor = (match: number) => {
  if (match >= 60) {
    return {
      bg: 'bg-[#ECFDF3]',
      border: 'border-[#ABEFC6]',
      text: 'text-[#067647]',
      labelBg: 'bg-[#25B35A]'
    }
  }
  if (match >= 40) {
    return {
      bg: 'bg-[#FFFBEB]',
      border: 'border-[#FCE1A8]',
      text: 'text-[#B47A00]',
      labelBg: 'bg-[#F7DB3E]'
    }
  }
  return {
    bg: 'bg-[#FEF2F2]',
    border: 'border-[#F5C2C2]',
    text: 'text-[#B72B2B]',
    labelBg: 'bg-[#F43F5E]'
  }
}

interface PartnerSelectionCardProps {
  data: any
  selected: boolean
  onSelect: (selected: boolean) => void
  listView?: boolean
  disabled?: boolean
}

const PartnerSelectionCard: React.FC<PartnerSelectionCardProps> = ({
  data,
  selected,
  onSelect,
  listView = true,
  disabled = false
}) => {
  console.log('disabled', disabled)
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
      <span className='rounded-md border border-[#B2DDFF] bg-[#EFF8FF] px-2 py-0.5 text-xs font-medium lowercase text-[#175CD3] first-letter:uppercase'>
        <span className='lowercase first-letter:uppercase'>{sector.key}</span>
      </span>
    ) : null
  }, [data?.sector])

  const pill = matchPillColor(overallMatch)

  return (
    <>
      <CompanyDetailsDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        id={data.id}
        sectorsData={preferredSectors}
        match={overallMatch}
      />

      {/* card wrapper */}
      <div
        onClick={() => !disabled && onSelect(!selected)}
        className={`${!disabled ? 'group' : ''} relative rounded-xl border bg-white p-4 transition-colors duration-200 ${
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'cursor-pointer hover:bg-[#EEF3FF]'
        } ${selected ? 'border-[#3E50F7] bg-[#EEF3FF]' : 'border-[#E6E9F0]'}`}
      >
        <div className='flex flex-col gap-4'>
          {/* top section with logo and radio button */}
          <div className='flex justify-between'>
            <div className='relative h-[100px] w-[250px] shrink-0 rounded-[6px]'>
              <Image
                loading='lazy'
                src={
                  data?.logoUrl ||
                  'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
                }
                fill
                objectFit='contain'
                alt='partner logo'
              />
            </div>

            {/* Check icon */}
            <div className='flex items-start'>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (!disabled) {
                    onSelect(!selected)
                  }
                }}
                disabled={disabled}
                className={`transition-colors ${
                  disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                }`}
              >
                {selected || disabled ? (
                  <IconCircleCheckFilled
                    className='transition-colors'
                    color={disabled ? '#D3D3D3' : ''}
                    size={24}
                  />
                ) : (
                  <IconCircleCheck
                    size={24}
                    className='transition-colors'
                    color='#C4CDD5'
                    strokeWidth={1.5}
                  />
                )}
              </button>
            </div>
          </div>

          {/* center: content */}
          <div className='flex flex-1 flex-col justify-between gap-3'>
            <div>
              <div className='flex flex-wrap items-center gap-2'>
                <h3 className='text-lg font-semibold text-black'>
                  {data?.name}
                </h3>
              </div>

              <div
                className='mt-2 hidden items-center gap-2 opacity-0 transition-all duration-200
                 group-hover:flex group-hover:opacity-100'
              >
                <Image src={BriefcaseIcon} alt='' />
                <span className='text-xs text-[#475569]'>Open for:</span>
                <div className='flex flex-wrap gap-2'>
                  {data?.preferredPartnershipTypes?.length > 0 ? (
                    <>
                      {data.preferredPartnershipTypes
                        .slice(0, 3)
                        .map((tag: any, idx: number) => (
                          <span
                            key={idx}
                            className='rounded bg-[#F8F8F8] px-2 py-1 text-xs font-medium lowercase text-[#2A3241] first-letter:uppercase'
                          >
                            {tag.area}
                          </span>
                        ))}
                    </>
                  ) : (
                    <span className='text-xs text-[#94A3B8]'>Strategic</span>
                  )}

                  {data?.preferredPartnershipTypes?.length > 3 && (
                    <span className='text-xs text-[#94A3B8]'>
                      +{data.preferredPartnershipTypes.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* description */}
              <p
                className='mt-2 line-clamp-2 text-sm text-[#7C838D] transition-opacity duration-200
             group-hover:invisible group-hover:opacity-0'
              >
                {data?.briefDescription}
              </p>

              {/* small pills: sector and company type */}
              <div
                className='flex items-center gap-2 pt-2 transition-opacity duration-200
             group-hover:invisible group-hover:opacity-0'
              >
                {sectorBadge}
                {data?.companyType && (
                  <span className='rounded-md border border-[#B2DDFF] bg-[#EFF8FF] px-2 py-0.5 text-xs font-medium text-[#175CD3]'>
                    {data?.companyType}
                  </span>
                )}
              </div>
            </div>

            {/* metrics row */}
            <div className='mt-2 flex w-full items-center justify-between gap-4 pt-3 text-sm'>
              <div className='flex items-center gap-6 group-hover:hidden'>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>
                    {data?.activePartnerships > 0
                      ? data.activePartnerships
                      : '-'}
                  </span>
                  <span className='text-xs font-medium text-[#7688A8]'>
                    Active Partners
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>
                    {data?.pipelinePartnerships > 0
                      ? data.pipelinePartnerships
                      : '-'}
                  </span>
                  <span className='text-xs font-medium text-[#7688A8]'>
                    In-line Partners
                  </span>
                </div>
                <div className='flex flex-col'>
                  <span className='text-sm font-medium'>
                    {data?.acknowledgmentTime
                      ? `${data.acknowledgmentTime} hr`
                      : '-'}
                  </span>
                  <span className='text-xs font-medium text-[#7688A8]'>
                    Ack. time
                  </span>
                </div>
              </div>

              {/* right side: view link on hover */}
              <div
                className={`pointer-events-none absolute bottom-4 right-4 flex translate-y-2 items-center gap-4 opacity-0
             transition-all duration-200 ${!disabled ? 'group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100' : ''}`}
              >
                <Link
                  href={`/explore/${data.id}`}
                  className={`group inline-flex items-center gap-1 text-sm font-semibold text-[#3E50F7] ${disabled ? 'pointer-events-none' : ''}`}
                  onClick={(e) => disabled && e.preventDefault()}
                >
                  View Partner Info
                  <ArrowRightIcon
                    className='transition-transform group-hover:translate-x-1'
                    size={16}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default React.memo(PartnerSelectionCard)
