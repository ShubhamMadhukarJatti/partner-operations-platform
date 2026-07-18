'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { useOfflinePartnerDetails } from '@/http-hooks/offline-partners'

import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'
import { CheckIcon } from '../../dashboard/[id]/_components/proposal-status'

const OfflinePartnerStatus = () => {
  const params = useParams()
  const { data } = useOfflinePartnerDetails(Number(params?.id))

  const allStatus = [
    {
      status: `Proposal Sent`,
      date: 'September 18, 2024',
      isActive: true
    },
    {
      status: 'Invitation Viewed',
      date: 'September 20, 2024',
      isActive: data?.onboarded,
      toolTip: `Invitation not viewed`
    },
    {
      status: 'Awaiting Action',
      date: 'September 22, 2024',
      isActive: data?.onboarded,
      toolTip: `Partner Onboarding`
    }
  ]
  return (
    <DashboardItemWrapper className=' p-3 shadow-none md:p-4'>
      <div className='flex flex-col gap-4'>
        <div>
          <h3 className='text-shark-lg font-bold text-text-100'>
            Partner Status
          </h3>
        </div>

        <div className='grid grid-cols-3 gap-2'>
          {allStatus.map((status, index) => (
            <Tooltip key={index}>
              <TooltipTrigger>
                <div
                  key={index}
                  className='relative flex flex-col gap-1 md:gap-2'
                >
                  <div
                    className={cn('h-2 w-full rounded-full bg-shark-blue-50', {
                      'bg-primary-light-blue': status.isActive
                    })}
                  />
                  <div className='flex items-center md:gap-2'>
                    {status.isActive ? (
                      CheckIcon
                    ) : (
                      <span className='flex h-5 w-5 items-center justify-center rounded-full bg-text-60 text-shark-xs font-bold text-white'>
                        {index + 1}
                      </span>
                    )}

                    <div className='flex flex-col'>
                      <span className='text-shark-sm font-medium text-text-100'>
                        {status.status}
                      </span>
                      {/* <span className='text-shark-xs font-medium text-text-60'>
                {status.date}
              </span> */}
                    </div>
                  </div>
                </div>
              </TooltipTrigger>
              {status.toolTip && (
                <TooltipContent>{status?.toolTip}</TooltipContent>
              )}
            </Tooltip>
          ))}
        </div>
      </div>
    </DashboardItemWrapper>
  )
}

export default OfflinePartnerStatus
