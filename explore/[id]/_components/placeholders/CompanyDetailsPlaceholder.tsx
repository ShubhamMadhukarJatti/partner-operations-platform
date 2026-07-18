import React from 'react'
import Image from 'next/image'
import FlagIcon from '@/public/flag.svg' // adjust path if needed
import { Calendar, Globe, Users2 } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'

export default function CompanyDetailsSkeleton() {
  return (
    <div className='flex w-full max-w-[360px] flex-col gap-6 '>
      <div className='rounded-xl border border-[#E4E7EE] bg-white py-4  lg:pb-14'>
        <div className='flex flex-col gap-4 px-4 pb-4'>
          {/* Header */}
          <div className='flex items-center gap-4'>
            <Skeleton className='h-12 w-12 rounded-lg' />
            <Skeleton className='h-6 w-32 rounded-md' />
          </div>

          {/* Tags and description */}
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className='h-5 w-[70px] rounded-md' />
              ))}
            </div>
            <Skeleton className='h-4 w-full rounded-md' />
            <Skeleton className='h-4 w-[80%] rounded-md' />
          </div>

          <div className='h-[1px] w-full bg-[#E4E7EE]' />

          {/* Info Grid */}
          <div className='space-y-2'>
            {[
              { icon: <Globe size={16} />, label: 'Website' },
              { icon: <Calendar size={16} />, label: 'Member since' },
              { icon: <Users2 size={16} />, label: 'Active Partnerships' },
              { icon: <Users2 size={16} />, label: 'In-line Partnerships' }
            ].map((item, index) => (
              <div key={index} className='grid grid-cols-2 items-center'>
                <p className='flex items-center gap-2 text-xs font-normal text-[#7688A8]'>
                  {item.icon} {item.label}
                </p>
                <Skeleton className='h-4 w-[120px]' />
              </div>
            ))}
          </div>

          <div className='h-[1px] w-full bg-[#E4E7EE]' />

          {/* More Info */}
          <div className='grid grid-cols-2 gap-2'>
            {[
              'Legal Name',
              'Founded On',
              'Accessible APIs',
              'Meeting success rate',
              'Acknowledgement time'
            ].map((label, index) => (
              <React.Fragment key={index}>
                <p className='text-xs font-medium text-[#7688A8]'>{label}</p>
                <Skeleton className='h-4 w-[120px]' />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
