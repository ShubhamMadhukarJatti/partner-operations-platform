'use client'

import React, { useMemo } from 'react'

import CardSkeleton from './CardSkeleton'
import PartnerCard from './PartnerCard'

interface DiscoverCarouselProps {
  pages: any[]
  observerRef: React.RefObject<HTMLDivElement>
  isFetchingNextPage: boolean
  autoplayInterval?: number
}

const DiscoverCarousel: React.FC<DiscoverCarouselProps> = ({
  pages,
  observerRef,
  isFetchingNextPage
}) => {
  const allOrgs = useMemo(
    () => pages.flatMap((p: any) => p.content) || [],
    [pages]
  )

  return (
    <>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {allOrgs.map((org: any) => (
          <PartnerCard key={org.id} data={org} />
        ))}
      </div>

      {/* sentinel + skeleton */}
      <div ref={observerRef} className='py-0 md:py-2'>
        {isFetchingNextPage && (
          <div className='mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default DiscoverCarousel
