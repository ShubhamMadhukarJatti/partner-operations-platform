import React from 'react'

import { Skeleton } from '../ui/skeleton'

const SidebarLoader = () => {
  return (
    <div className='flex h-full min-w-60 max-w-xs flex-shrink-0 flex-col justify-between bg-[#1A1D1F] px-6 py-8'>
      <Skeleton className=' h-12 bg-[#748090] ' />

      <div className='flex flex-col gap-8'>
        {[...Array(6)].map((_, i) => (
          <div className=' flex items-center gap-3' key={i}>
            <Skeleton className='size-6 flex-shrink-0  rounded-full bg-[#525A64]' />
            <Skeleton className='h-6 w-full rounded-[2.5rem] bg-[#525A64]' />
          </div>
        ))}
      </div>

      <div>
        <div>
          <div className=' flex items-center gap-3 border-b-2 border-[#2E2E2E] pb-4'>
            <Skeleton className='size-6 flex-shrink-0 rounded-full  bg-[#525A64]' />
            <Skeleton className='h-6 w-full rounded-[2.5rem] bg-[#525A64]' />
            <Skeleton className='h-6 w-full rounded-[2.5rem] bg-[#525A64]' />
          </div>
        </div>

        <div className='felx mt-6  flex-col rounded-xl bg-[#272B30] p-4'>
          <Skeleton className=' h-6 w-[90%] bg-[#748090] ' />
          <Skeleton className=' mt-2 h-6 w-[35%] bg-[#748090]' />

          <div className='mt-8 flex w-[80%] flex-col gap-6'>
            {[...Array(3)].map((_, i) => (
              <div className=' flex items-center gap-3' key={i}>
                <Skeleton className='size-6 flex-shrink-0 rounded-full  bg-[#525A64]' />
                <Skeleton className='h-6 w-full rounded-[2.5rem] bg-[#525A64]' />
              </div>
            ))}
          </div>
          <Skeleton className='mt-4 h-12 bg-[#748090] ' />
        </div>
      </div>
    </div>
  )
}

export default SidebarLoader
