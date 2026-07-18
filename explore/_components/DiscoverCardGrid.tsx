'use client'

import React, { useEffect, useMemo } from 'react'
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult
} from '@tanstack/react-query'

import { FetchReferralsResponse } from '../../explore-2/_components/OpenForReferralTabContent'
import CardSkeleton from './CardSkeleton'
import PartnerCard from './PartnerCard'

interface DiscoverCardGridProps {
  data?: InfiniteData<FetchReferralsResponse>
  isFetchingNextPage: boolean
  observerRef: React.RefObject<HTMLDivElement>
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<FetchReferralsResponse, unknown>,
      Error
    >
  >
  hasNextPage: boolean
}

const DiscoverCardGrid = React.memo(
  ({
    data,
    isFetchingNextPage,
    observerRef,
    fetchNextPage,
    hasNextPage
  }: DiscoverCardGridProps) => {
    // Memoize the flattened list of organizations
    const allOrganizations = useMemo(
      () => data?.pages.flatMap((page) => page.content) || [],
      [data?.pages]
    ) as any

    useEffect(() => {
      if (!observerRef.current) return

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        },
        { threshold: 1.0 }
      )

      observer.observe(observerRef.current)

      return () => observer.disconnect()
    }, [hasNextPage, isFetchingNextPage, fetchNextPage, observerRef])

    return (
      <div>
        {/* Render Partner Cards */}
        <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {allOrganizations.map((org: any) => (
            <PartnerCard key={org.id} data={org} />
          ))}
        </div>

        {/* Skeleton Loader for Infinite Scroll */}
        <div ref={observerRef} className='py-0 md:py-2'>
          {isFetchingNextPage && (
            <div className='mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
)

DiscoverCardGrid.displayName = 'DiscoverCardGrid'

export default DiscoverCardGrid
