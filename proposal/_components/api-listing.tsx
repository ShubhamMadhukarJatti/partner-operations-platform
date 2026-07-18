'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import HierarchySquareImg from '@/../public/images/clients/hierarchy-square.svg'
import { useGetPartnershipIntegration } from '@/http-hooks/api-listing'
import { OrganizationType } from '@/types'

import { calculateDateDifference } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import LoadingIcon from '@/components/ui/loading-icon'

import DashboardItemWrapper from '../../(dashboard-pages)/dashboard/[id]/_components/dashboard-item-wrapper'

type Props = {
  receiverOrg: OrganizationType
  onClickApiListing: () => void
  organization?: OrganizationType
  loading?: boolean
  lastTimestamp?: string
}

const ApiListingSection = ({
  receiverOrg,
  onClickApiListing,
  organization
}: Props) => {
  const {
    data,
    error,
    isLoading: getPartnershipIntegrationLoading
  } = useGetPartnershipIntegration()

  const showCreateApiListing =
    !data?.endpoints?.length && !getPartnershipIntegrationLoading
  return (
    <DashboardItemWrapper className='relative flex h-full flex-col overflow-clip p-4'>
      {showCreateApiListing ? (
        <CreateApiListingSection
          loading={getPartnershipIntegrationLoading}
          onClickApiListing={onClickApiListing}
        />
      ) : (
        <EditApiListingSection
          loading={getPartnershipIntegrationLoading}
          receiverOrg={receiverOrg}
          onClickApiListing={onClickApiListing}
          lastTimestamp={data?.endpoints?.[0].lastUpdatedTimestamp}
        />
      )}

      <div className='absolute bottom-[-4px] right-[-2px]'>
        <Image
          src={HierarchySquareImg}
          height={100}
          width={100}
          alt='hierarchy-square png image'
          className='h-[100px] w-[100px] md:h-[152px] md:w-[152px]'
        />
      </div>
    </DashboardItemWrapper>
  )
}

export default ApiListingSection

const EditApiListingSection = ({
  receiverOrg,
  onClickApiListing,
  loading,
  lastTimestamp
}: Props) => {
  return (
    <>
      <p className='max-w-[283px] text-[16px] font-medium leading-[19.36px] text-[#3B475D]'>
        API listing was created {calculateDateDifference(lastTimestamp ?? '')}{' '}
        days back. It would be visible to {receiverOrg.name}.
      </p>

      <div className='mt-4 lg:mt-auto'>
        <Link href={'/api-listing'}>
          <Button
            onClick={onClickApiListing}
            className='h-[37px] w-[136px] rounded-lg border border-text-20 bg-white text-shark-sm font-bold text-[#2C64EF] hover:bg-[#2C64EF] hover:text-white'
          >
            {loading ? (
              <LoadingIcon className='size-4 border-[2px] border-t-muted text-primary' />
            ) : (
              'Edit API Listing'
            )}
          </Button>
        </Link>
      </div>
    </>
  )
}

const CreateApiListingSection = ({
  onClickApiListing,
  loading
}: {
  onClickApiListing: () => void
  loading: boolean
}) => {
  return (
    <>
      <p className='flex max-w-[283px] flex-col text-[#3B475D]'>
        <p className='text-shark-base font-medium'>
          Increase your chances of by 3x faster
        </p>
        <p className='text-shark-3xl font-bold'>3x faster</p>
      </p>

      <div className='mt-4 lg:mt-auto'>
        <Link href={'/api-listing'}>
          <Button
            onClick={onClickApiListing}
            className='h-[37px] w-[136px] rounded-lg border border-text-20 bg-white text-shark-sm font-bold text-[#2C64EF] hover:bg-[#2C64EF] hover:text-white'
          >
            {loading ? (
              <LoadingIcon className='size-4 border-[2px] border-t-muted text-primary' />
            ) : (
              'Create API Listing'
            )}
          </Button>
        </Link>
      </div>
    </>
  )
}
