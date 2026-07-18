import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

interface GenericCardSkeletonProps {
  className?: string
  fieldCount?: number
}

const GenericCardSkeleton: React.FC<GenericCardSkeletonProps> = ({
  className = '',
  fieldCount = 6
}) => {
  return (
    <div className={`max-w-[600px] ${className}`}>
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
        {/* Header with icon and title */}
        <div className='mb-6 flex items-center gap-3'>
          <Skeleton className='h-6 w-6 bg-[#E9E9E9]' />
          <Skeleton className='h-6 w-40 bg-[#E9E9E9]' />
        </div>

        {/* Logo Section - Optional, could be conditional but keeping for consistency for now or we can make it optional prop */}
        <div className='mb-6'>
          <Skeleton className='mb-2 h-4 w-12 bg-[#E9E9E9]' />
          <Skeleton className='h-16 w-16 bg-[#E9E9E9]' />
        </div>

        {/* Form Fields Grid */}
        <div className='grid grid-cols-2 gap-x-8 gap-y-4'>
          {[...Array(fieldCount)].map((_, i) => (
            <div key={i} className={i >= fieldCount - 2 ? 'col-span-2' : ''}>
              <Skeleton className='mb-2 h-3 w-24 bg-[#E9E9E9]' />
              <Skeleton
                className={`h-4 bg-[#E9E9E9] ${i >= fieldCount - 2 ? 'w-full' : 'w-32'}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenericCardSkeleton
