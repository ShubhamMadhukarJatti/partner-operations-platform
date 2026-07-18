'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { ArrowRightIcon, Sparkle, Star, Zap } from 'lucide-react'
import { useSelector } from 'react-redux'

import { useSpecificConfigData } from '@/lib/useConfig'
import { Badge } from '@/components/ui/badge'

import { PREFERRED_SECTORS } from '../../_components/organization-card'
import { CompanyDetailsDrawer } from '../../explore-2/_components/company-details-drawer'
import ShortListDialog from './ShortListDialog'

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

const PartnerCard: React.FC<{
  filled?: boolean
  data?: any
  listView?: boolean
}> = ({ filled = true, data, listView = true }) => {
  const router = useRouter()
  const [openDrawer, setOpenDrawer] = useState(false)
  const [imageError, setImageError] = useState(false)

  const { organization: currentOrganization } = useSelector(
    (state: RootState) => state.currentOrg
  )

  const { preferredSectors } = useSpecificConfigData(['PREFERRED_SECTORS'])

  // Reset image error state when logoUrl changes
  useEffect(() => {
    setImageError(false)
  }, [data?.logoUrl])

  // Memoize the match calculation to avoid recalculating on every render
  const overallMatch = useMemo(
    () => calculateOverallMatch(data, currentOrganization),
    [data, currentOrganization]
  )
  console.log('data', { data })

  // Memoize the sector label
  const sectorLabel = useMemo(() => {
    const sector = PREFERRED_SECTORS?.find((x) => x?.value === data?.sector)
    if (!sector?.key) return null
    const trimmedKey = sector.key.trim()
    return (
      trimmedKey.charAt(0).toUpperCase() + trimmedKey.slice(1).toLowerCase()
    )
  }, [data?.sector])

  // Determine if partner is shortlisted from data
  const isShortlisted = !!data?.shortlisted
  const starFilled = isShortlisted ? false : filled

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
        onClick={() => router.push(`/explore/${data.id}`)}
        className='relative flex h-full cursor-pointer flex-col gap-[16px] rounded-[16px] border border-[var(--colors/border/border-base,#e5e7eb)] bg-[rgba(255,255,255,0.75)] p-[16px] shadow-[0px_2px_6px_#0C0C0D0D] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_30px_-4px_rgba(12,12,13,0.15)] dark:border-border dark:bg-[var(--colors-background-card)] dark:hover:shadow-[0_12px_30px_-4px_rgba(0,0,0,0.5)]'
      >
        {/* main content */}
        <div className='flex flex-1 flex-col gap-3'>
          {/* Logo row — shortlist button flex row matching Figma */}
          <div className='relative flex w-full items-start justify-between'>
            <div className='relative h-[48px] w-[48px] shrink-0 overflow-hidden rounded-[8px] border border-[#F2F4F7] bg-white'>
              <Image
                loading='lazy'
                src={
                  imageError
                    ? '/placeholder.svg'
                    : data?.logoUrl ||
                      'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
                }
                fill
                className='object-contain'
                alt='partner logo'
                onError={() => setImageError(true)}
              />
            </div>

            {/* Shortlist indicator */}
            <div
              className='flex shrink-0 items-center gap-1'
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
            >
              <ShortListDialog
                filled={starFilled}
                id={data.id}
                name={data.name}
                isShortlisted={isShortlisted}
              />
            </div>
          </div>

          {/* Company name and match score row */}
          <div className='flex w-full items-start justify-between gap-2'>
            <h3 className='text-[18px] font-bold leading-normal tracking-[-0.5px] text-[#0e1012] dark:text-foreground'>
              {data?.name}
            </h3>
            {data?.matchScore > 0 && (
              <Badge
                variant='outline'
                className={`h-auto shrink-0 whitespace-nowrap rounded-[16px] border-none px-[8px] py-[2px] text-[12px] font-medium leading-[18px] ${
                  data.matchScore >= 70
                    ? 'bg-[#D1FADF] text-[#027A48]'
                    : data.matchScore >= 40
                      ? 'bg-[#FEF0C7] text-[#DC6803]'
                      : 'bg-[#facccc] text-[#b70000]'
                }`}
              >
                {data.matchScore}% match
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className='line-clamp-3 text-[12px] leading-[18px] text-[var(--colors-text-text-body-subtle,#6A7282)] dark:text-muted-foreground'>
            {data?.briefDescription}
          </p>

          {/* Badges row */}
          <div className='flex flex-wrap items-center gap-2'>
            {/* Sector badge */}
            {sectorLabel && (
              <Badge
                variant='outline'
                className='h-auto whitespace-nowrap rounded-[4px] border-none bg-[#eef6ff] px-[6px] py-[2px] text-[10px] font-medium leading-[16px] text-[#1447e6]'
              >
                {sectorLabel}
              </Badge>
            )}

            {/* Company type badge */}
            {data?.companyType && (
              <Badge
                variant='outline'
                className='h-auto whitespace-nowrap rounded-[4px] border-none bg-[#eef6ff] px-[6px] py-[2px] text-[10px] font-medium leading-[16px] text-[#1447e6]'
              >
                {data.companyType}
              </Badge>
            )}
          </div>

          {/* Metrics */}
          {(data?.activePartnerships > 0 ||
            data?.pipelinePartnerships > 0 ||
            data?.acknowledgmentTime) && (
            <div className='flex flex-col overflow-hidden rounded-[8px] border-[0.5px] border-[var(--colors-border-border-light,#F3F4F6)] bg-transparent text-[12px] dark:border-border dark:bg-transparent'>
              {(data?.activePartnerships > 0 ||
                data?.pipelinePartnerships > 0) && (
                <div className='flex divide-x divide-[var(--colors-border-border-light,#F3F4F6)] border-b border-[var(--colors-border-border-light,#F3F4F6)] dark:divide-border dark:border-border'>
                  {data?.activePartnerships > 0 && (
                    <div className='flex-1 whitespace-nowrap px-3 py-2'>
                      <span className='font-semibold text-[#101828] dark:text-foreground'>
                        {data.activePartnerships}
                      </span>{' '}
                      <span className='text-[var(--colors-text-text-body-subtle,#6A7282)] dark:text-muted-foreground'>
                        Active partners
                      </span>
                    </div>
                  )}
                  {data?.pipelinePartnerships > 0 && (
                    <div className='flex-1 whitespace-nowrap px-3 py-2'>
                      <span className='font-semibold text-[#101828] dark:text-foreground'>
                        {data.pipelinePartnerships}
                      </span>{' '}
                      <span className='text-[var(--colors-text-text-body-subtle,#6A7282)] dark:text-muted-foreground'>
                        In-line partners
                      </span>
                    </div>
                  )}
                </div>
              )}
              {data?.acknowledgmentTime && (
                <div className='whitespace-nowrap px-3 py-2'>
                  <span className='font-semibold text-[#101828] dark:text-foreground'>
                    {data.acknowledgmentTime}hr
                  </span>{' '}
                  <span className='text-[var(--colors-text-text-body-subtle,#6A7282)] dark:text-muted-foreground'>
                    Acknowledgement time
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Certifications */}
          {data?.certifications?.length > 0 && (
            <div className='flex w-full items-center justify-between gap-[8px]'>
              <span className='whitespace-nowrap text-[12px] font-normal text-[#6A7282] dark:text-muted-foreground'>
                Certifications
              </span>
              <div className='flex items-center justify-end gap-1.5 overflow-hidden'>
                {data.certifications.map((cert: string, idx: number) => (
                  <Badge
                    key={idx}
                    variant='outline'
                    className='h-auto shrink-0 gap-[4px] whitespace-nowrap rounded-[4px] border-[0.5px] border-[var(--colors-border-border-light,#F3F4F6)] bg-[var(--colors-background-bg-secondary-strong,#F9FAFB)] px-[6px] py-[1px] text-[10px] font-normal leading-[14px] text-[#4b5563] dark:border-border dark:bg-muted/50 dark:text-foreground'
                  >
                    <Image
                      src={
                        cert.toLowerCase().includes('partner')
                          ? '/partner.svg'
                          : '/green-tick.svg'
                      }
                      alt='verified'
                      width={10}
                      height={10}
                      className='shrink-0'
                    />
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default React.memo(PartnerCard)
