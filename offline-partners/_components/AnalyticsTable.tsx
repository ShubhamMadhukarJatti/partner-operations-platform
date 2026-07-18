import React, { ReactNode, useEffect, useState } from 'react'

import { fetchMailboxClaimStatus } from '@/lib/db/email-outreach'

interface StatCardProps {
  title: string
  value: string
  change?: string
  detail: ReactNode
  color?: string
  height?: string
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  detail,
  color = '#000',
  height
}) => (
  <div
    className='flex h-full flex-col rounded-2xl border border-[#EFF0F6] bg-white py-4 pl-3 pr-2'
    style={{ height }}
  >
    <div>
      <div className='text-base font-medium text-text-90'>{title}</div>
      <div className='mt-1 flex items-center gap-2'>
        <div className='text-2xl font-bold' style={{ color }}>
          {value}
        </div>
        {change && (
          <div className='text-xs font-medium' style={{ color }}>
            {change}
          </div>
        )}
      </div>
      <div className='mt-2 text-xs text-gray-400'>{detail}</div>{' '}
    </div>
  </div>
)

const AnalyticsTable: React.FC = () => {
  const [isClaimed, setIsClaimed] = useState(false)

  // Mock mailbox claim status for dummy flow (no API call)
  useEffect(() => {
    setIsClaimed(true) // Always show as claimed in demo mode
  }, [])

  // Only render if mailbox is claimed
  // if (!isClaimed) {
  //   return null
  // }

  return (
    <div className='flex w-full flex-col gap-4 md:flex-row'>
      {/* Left grid */}

      <div className='flex-1'>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
          <StatCard
            title='Open Rate'
            value='0%'
            change='~ 0% Since last week'
            detail={
              <div>
                <span className='font-semibold text-black'>0</span>/24 emails
                opened
              </div>
            }
            color='#38B000'
            height='20vh'
          />
          <StatCard
            title='Click Rate'
            value='0%'
            change='0% Since last week'
            detail={
              <div>
                <span className='font-semibold text-black'>0</span>/24 emails
                opened
              </div>
            }
            color='#38B000'
            height='20vh'
          />
          <StatCard
            title='Bounce Rate'
            value='+0%'
            detail={
              <div>
                <span className='font-semibold text-black'>0</span>/194 emails
                were bounced
              </div>
            }
            color='red'
            height='20vh'
          />
          <StatCard
            title='Email Sent'
            value='0'
            change='this week'
            detail='2x time more than last week'
            color='#000'
            height='20vh'
          />
        </div>
      </div>

      {/* Right card */}
      <div className='flex-1'>
        <StatCard
          title='Engagement Rate'
          value='0%'
          change='0% Since last week'
          detail={
            <div>
              Partners interacted with{' '}
              <span className='font-semibold text-[#3E50F7]'>0</span> of your
              emails out of <span className='font-semibold'>194</span> sent.
            </div>
          }
          height='42vh'
          color='#38B000'
        />
      </div>
    </div>
  )
}

export default AnalyticsTable
