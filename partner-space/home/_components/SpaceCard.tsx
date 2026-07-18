import React from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  NotificationMessage,
  PinIcon,
  SettingPin
} from '@/components/icons/icons'

import SettingsDrawer from './SettingsDrawer'

// import { formatDate } from '@/lib/dates'

interface SpaceCardProp {
  id: number
  spaceName: string
  createdAt: string
  members: number
  channels: number
  messages: number
}

const SpaceCard: React.FC<SpaceCardProp> = ({
  id,
  spaceName,
  createdAt,
  members,
  channels,
  messages
}) => {
  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='flex gap-8'>
        <div className='grow'>
          <h2 className='text-shark-lg/7 font-bold'>{spaceName}</h2>
          {/* <p className=' text-shark-sm text-[#535862]'>Created { formatDate(createdAt)}</p> */}
        </div>
        <PinIcon stroke='#94A3B8' />
        <NotificationMessage />
        <SettingsDrawer />
      </div>

      <div className='flex justify-between'>
        <div className='flex w-full max-w-[75%] justify-between'>
          <div>
            <p className='text-shark-sm/6 text-[#92A0B9]'>Members</p>
            <p className='text-shark-base/5 font-bold text-[#181D27]'>
              {members} Companies
            </p>
          </div>
          <div className='flex'>
            <div className='w-[136px]'>
              <p className='text-shark-sm/6 text-[#92A0B9]'>Channels</p>
              <p className='text-shark-base/5 font-bold text-[#181D27]'>
                {channels}
              </p>
            </div>
            <div className='w-[136px]'>
              <p className='text-shark-sm/6 text-[#92A0B9]'>Messages</p>
              <p className='text-shark-base/5 font-bold text-[#181D27]'>
                {messages}
              </p>
            </div>
          </div>
        </div>
        <Link
          className='flex items-center rounded-lg bg-[#3E50F7] px-3.5 py-2.5 text-sm font-semibold text-white'
          href={`/partner-space/${id}`}
        >
          Open Space
        </Link>
      </div>
    </div>
  )
}

export default SpaceCard
