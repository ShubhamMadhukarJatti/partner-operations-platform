import React from 'react'

import { Skeleton } from '@/components/ui/skeleton'

const ProposalMeetSkeleton = () => {
  return (
    <div className='rounded-lg border border-[#C5C5C580] p-5'>
      <div className='flex flex-col gap-4'>
        <div>
          <Skeleton className='h-4 w-3/4' />
        </div>

        <div className='flex items-center gap-1.5'>
          <Skeleton className='h-3 w-3' /> {/* Clock icon placeholder */}
          <Skeleton className='h-3 w-16' /> {/* Start time */}
          <Skeleton className='h-3 w-3' /> {/* Arrow icon */}
          <Skeleton className='h-3 w-16' /> {/* End time */}
          <Skeleton className='h-3 w-14' /> {/* Not set text */}
        </div>
      </div>
    </div>
  )
}

export default ProposalMeetSkeleton
