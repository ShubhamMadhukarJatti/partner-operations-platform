import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

const MeetCardSkeleton = () => {
  return (
    <Card className='rounded-2xl border-gray-200 p-0 shadow-sm'>
      <CardContent className='p-4'>
        {/* Header Section */}
        <div className='mb-6 flex items-center gap-3'>
          <div className='relative'>
            <Skeleton className='relative z-10 h-12 w-12 rounded-full' />
            <Skeleton className='absolute -right-4 top-0 h-12 w-12 rounded-full border-2 border-gray-300' />
          </div>
          <div className='ml-6'>
            <Skeleton className='mb-2 h-4 w-24' />
            <Skeleton className='h-4 w-36' />
          </div>
        </div>

        <Separator className='mb-6' />

        {/* Time Section */}
        <div className='mb-6 flex items-center justify-center gap-8'>
          <div className='text-center'>
            <Skeleton className='mx-auto mb-1 h-4 w-10' />
            <Skeleton className='mx-auto h-4 w-6' />
          </div>

          <Skeleton className='h-5 w-5 rounded-full' />

          <div className='text-center'>
            <Skeleton className='mx-auto mb-1 h-4 w-10' />
            <Skeleton className='mx-auto h-4 w-6' />
          </div>
        </div>

        {/* Calendly Button */}
        <Skeleton className='h-10 w-full rounded-2xl' />
      </CardContent>
    </Card>
  )
}

export default MeetCardSkeleton
