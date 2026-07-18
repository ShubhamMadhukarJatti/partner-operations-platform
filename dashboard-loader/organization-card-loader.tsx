import React from 'react'

import { Card, CardContent, CardFooter } from '../ui/card'
import { Skeleton } from '../ui/skeleton'

const OrganizationCardLoader = () => {
  return (
    <Card className='flex h-full w-full max-w-sm flex-col gap-2'>
      <CardContent className='flex flex-1 flex-col gap-2 overflow-hidden'>
        <div className='flex items-center gap-3  border-b-2 border-[#F4F4F4]  pb-4 '>
          <Skeleton className='size-14 flex-shrink-0 rounded-full bg-[#E9E9E9] ' />
          <Skeleton className='h-4 w-32 bg-[#E9E9E9] ' />
          <Skeleton className='h-7 w-14  bg-[#E9E9E9] ' />
        </div>

        <Skeleton className='h-7 w-1/2' />
        <div className='flex flex-col gap-0.5'>
          <Skeleton className='h-4 w-full bg-[#E9E9E9]' />
          <Skeleton className='h-4 w-4/5 bg-[#E9E9E9]' />
          <Skeleton className='h-4 w-1/2 bg-[#E9E9E9]' />
        </div>
      </CardContent>
      <CardFooter className='mt-2  flex flex-wrap items-center  gap-4'>
        <Skeleton className='h-6 w-24 rounded-lg bg-[#E9E9E9]' />
        <Skeleton className='h-6 w-20 rounded-lg bg-[#E9E9E9]' />

        <Skeleton className='h-6 w-16 rounded-lg bg-[#E9E9E9]' />

        <Skeleton className='h-6 w-24 rounded-lg bg-[#E9E9E9]' />

        <Skeleton className='h-6 w-24 rounded-lg bg-[#E9E9E9]' />
      </CardFooter>
    </Card>
  )
}

export default OrganizationCardLoader
