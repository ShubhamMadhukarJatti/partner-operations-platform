import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const CustomerSidebar: React.FC = () => {
  const renderSkeletonRow = () => (
    <div className='flex w-full gap-3'>
      <Skeleton className='h-7 w-7 rounded-full' />
      <div className='w-full'>
        <Skeleton className='h-4 w-10' />
        <Skeleton className='mt-2 h-4 w-full' />
      </div>
    </div>
  )

  return (
    <div className='w-[344px] rounded-xl border bg-white'>
      <div className='border-b border-[#EBEBEB] p-4'>
        <h2 className='text-base font-bold text-[#2A3241]'>
          Partnership Insights
        </h2>
      </div>
      <div className='flex flex-col gap-4 px-3 py-4'>
        <Skeleton className='h-4 w-[100px] rounded-xl' />
        <Skeleton className='h-4 w-[190px] rounded-xl' />
        <Skeleton className='h-[60px] w-[240px] rounded-[40px]' />
        {renderSkeletonRow()}
        {renderSkeletonRow()}
      </div>
    </div>
  )
}

export default React.memo(CustomerSidebar)
