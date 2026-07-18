import React from 'react'

import { Skeleton } from '../ui/skeleton'

const TopbarLoader = () => {
  return (
    <div className='flex h-24 w-full items-center justify-between bg-white px-10 py-7'>
      <div className='flex items-center gap-4'>
        <Skeleton className=' h-10 w-full min-w-[28rem] max-w-md bg-[#E9E9E9]  ' />
        <Skeleton className=' h-10 w-full min-w-24  max-w-24 bg-[#E9E9E9] ' />
        <Skeleton className=' h-10 w-full min-w-48 max-w-48 bg-[#E9E9E9] ' />
      </div>
      <div className='flex items-center gap-6'>
        <Skeleton className='size-12 flex-shrink-0  rounded-full bg-[#E9E9E9]' />
        <Skeleton className='size-12 flex-shrink-0  rounded-full bg-[#E9E9E9]' />
        <Skeleton className='size-12 flex-shrink-0  rounded-full bg-[#E9E9E9]' />
      </div>
    </div>
  )
}

export default TopbarLoader
