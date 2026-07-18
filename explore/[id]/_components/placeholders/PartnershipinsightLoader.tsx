import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const PartnershipinsightLoader = () => {
  return (
    <div className='flex flex-wrap justify-between gap-2 p-5'>
      {/* Doughnut Skeleton */}
      <div className='relative w-full max-w-[200px]'>
        <Skeleton className='h-[200px] w-[200px] rounded-full' />
      </div>

      {/* Legend Skeleton */}
      <div className='grid max-w-[218px] grid-cols-1 gap-1 lg:gap-0'>
        {Array.from({ length: 5 }).map((_, idx) => (
          <div key={idx} className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <Skeleton className='h-2 w-2 rounded-full' />
              <Skeleton className='h-3 w-20 rounded' />
            </div>
            <Skeleton className='h-3 w-6 rounded' />
          </div>
        ))}
      </div>

      {/* Boolean Data Skeleton */}
      <div className='flex w-full flex-col gap-2 sm:w-[200px] xl:w-[300px]'>
        <div className='flex flex-col gap-2 rounded-lg bg-[#FFF6F6] p-3'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className='h-4 w-full rounded' />
          ))}
        </div>
        <div className='flex flex-col gap-2 rounded-lg bg-[#F0F8EE] p-3'>
          {Array.from({ length: 3 }).map((_, idx) => (
            <Skeleton key={idx} className='h-4 w-full rounded' />
          ))}
        </div>
      </div>
    </div>
  )
}

export default PartnershipinsightLoader
