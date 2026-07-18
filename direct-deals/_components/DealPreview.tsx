'use client'

import React from 'react'
import Image from 'next/image'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface dealPreviewType {
  dealPreview: boolean // used in joinDeal drawer also with dealPreview prop as false
  data: {
    creationTimestamp: string
    dealId: string
    organizationId: number
    offerDetail: string
    restrictedSectors: string[]
    channelAllowed: string[]
    quotaRemaining: string
    geography: string
    approvalRequired: boolean
    status: string
    organizationName: string
    logoUrl: string
    organizationType: string
    organizationBrief: string
  }
}

const DealPreview: React.FC<dealPreviewType> = ({ data, dealPreview }) => {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit'
    })
  }

  return (
    <div className='flex flex-col gap-3 px-6 py-4'>
      <div className='flex flex-col gap-2 rounded-xl border border-text-20 p-4'>
        <div className='flex gap-4'>
          <div className='relative h-[45px] w-[45px] overflow-hidden rounded-lg'>
            <Image src={data?.logoUrl} alt='company logo' fill />
          </div>
          <div className=''>
            <p className='text-lg/5 font-bold text-text-100'>
              {data?.organizationName}
            </p>
            <div className='mt-1 flex gap-1'>
              {
                <Badge className='rounded-[4px] bg-text-20 px-2 py-[2px] text-[12px]/[14px] text-text-100 hover:bg-text-20'>
                  {data?.organizationType}
                </Badge>
              }
            </div>
          </div>
        </div>
        <p className='text-sm font-normal text-text-100'>
          {data?.organizationBrief}
        </p>
      </div>
      <div className='flex flex-col rounded-xl border border-text-20 p-4'>
        <p className='text-shark-sm font-bold text-text-100'>About</p>
        <p className='text-shark-sm font-normal text-text-70'>
          We own esports teams, produce esports events (online & offline) and
          manage influencers from gaming category.
        </p>
      </div>

      <div className='flex flex-col rounded-xl border border-text-20'>
        <div className='border-b border-text-20 px-4 py-3'>
          <p className='text-shark-sm font-bold text-text-100'>Offer Details</p>
          <p className='text-shark-sm font-normal text-text-70'>
            {data?.offerDetail}
          </p>
        </div>
        <div className='border-b border-text-20 px-4 py-3'>
          <p className='text-shark-sm font-bold text-text-100'>
            Restricted Industry
          </p>
          <p className='text-shark-sm font-normal text-text-70'>
            {data &&
              data?.restrictedSectors
                ?.map((sectors) => sectors?.toLowerCase())
                .join(', ')}
          </p>
        </div>
        <div className='border-b border-text-20 px-4 py-3'>
          <p className='text-shark-sm font-bold text-text-100'>Geography</p>
          <p className='text-shark-sm font-normal text-text-70'>
            {data?.geography}
          </p>
        </div>
        <div className='border-b border-text-20 px-4 py-3'>
          <p className='text-shark-sm font-bold text-text-100'>
            Permitted marketing channels
          </p>
          <p className='text-shark-sm font-normal text-text-70'>
            {data &&
              data?.channelAllowed
                ?.map((channel) => channel.toLowerCase())
                .join(', ')}
          </p>
        </div>

        <div
          className={cn(
            'grid px-4 py-3 ',
            dealPreview ? 'grid-cols-2 lg:grid-cols-5' : 'grid-cols-2'
          )}
        >
          <div className='min-w-[50%]'>
            <p className='text-shark-sm font-bold text-text-100'>Website</p>
            <Button className='px-0 py-0 ' variant={'link'}>
              https://dee
            </Button>
          </div>
          <div className='min-w-[50%]'>
            <p className='text-shark-sm font-bold text-text-100'>
              Quota Remaining
            </p>
            <p className='text-shark-sm font-normal text-text-70'>
              {data?.quotaRemaining}
            </p>
          </div>
          {!dealPreview && (
            <div className='min-w-[50%]'>
              <p className='text-shark-sm font-bold text-text-100'>
                Date Created
              </p>
              <p className='text-shark-sm font-normal text-text-70'>
                {formatDate(data?.creationTimestamp)}
              </p>
            </div>
          )}

          <div className='min-w-[50%]'>
            <p className='text-shark-sm font-bold text-text-100'>
              Approval needed
            </p>
            <p className='text-shark-sm font-normal text-text-70'>
              {data?.approvalRequired ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DealPreview
