import React, { memo } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const CardSkeleton = () => {
  return (
    <div className='flex select-none flex-col justify-between gap-4 overflow-hidden rounded-lg border border-[#E4E7EE] bg-white'>
      <div className='flex flex-col gap-4 p-5'>
        {/* Top row: logo + content + star */}
        <div className='flex min-w-0 gap-4'>
          {/* Logo Placeholder — fixed size but won't push siblings out */}
          <Skeleton className='h-[66px] w-[66px] shrink-0 rounded-[6px]' />

          {/* Right Section */}
          <div className='flex min-w-0 grow flex-col gap-2'>
            {/* Header badges */}
            <div className='flex flex-wrap items-center gap-2'>
              <Skeleton className='h-5 w-24 rounded' />
              <Skeleton className='h-5 w-12 rounded' />
              <Skeleton className='h-5 w-16 rounded' />
            </div>

            {/* Name */}
            <Skeleton className='h-4 w-full rounded' />
            <Skeleton className='h-4 w-3/4 rounded' />

            {/* Stats */}
            <div className='mt-2 flex flex-wrap items-center gap-4'>
              {[...Array(3)].map((_, idx) => (
                <div key={idx} className='flex flex-col items-center gap-1'>
                  <Skeleton className='h-3 w-14 rounded' />
                  <Skeleton className='h-4 w-6 rounded' />
                </div>
              ))}
            </div>
          </div>

          {/* Star Icon */}
          <Skeleton className='h-5 w-5 shrink-0 rounded-full' />
        </div>
      </div>

      {/* Footer Section */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-t border-[#E4E7EE] p-5'>
        {/* Tags */}
        <div className='flex flex-wrap gap-2'>
          {[...Array(3)].map((_, index) => (
            <Skeleton key={index} className='h-5 w-16 rounded' />
          ))}
        </div>

        {/* View Partner Link */}
        <Skeleton className='h-4 w-28 shrink-0 rounded' />
      </div>
    </div>
  )
}

export default memo(CardSkeleton)
