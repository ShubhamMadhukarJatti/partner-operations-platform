'use client'

import React, { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { getSearchResult } from '@/lib/db/search'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import { AiStarIcon, CirclesContent } from '@/components/icons/icons'

import { FetchReferralsResponse } from '../../explore-2/_components/OpenForReferralTabContent'
import CardSkeleton from './CardSkeleton'
import RecommendedPartnerCard from './RecommendedPartnerCard'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

const AiRecommendDialog = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [recommendation, setRecommendation] = useState<{
    subsector: string[]
    sector: string[]
    partnership_type: string[]
  } | null>(null)
  const [input, setInput] = useState('')
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization } = saved

  console.log({ recommendation })

  const observerRef = React.useRef<HTMLDivElement>(null)

  const handleSubmit = async () => {
    try {
      if (input === '') return

      const res = await fetch('/api/ai-recommendation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          input: input
        })
      })
      const data = await res.json()
      setRecommendation(data)
    } catch (e) {
      showCustomToast(
        'Error',
        'Failed to get recommendations. Please try again',
        'error',
        5000
      )
    }
  }

  // console.log(getPartnerships(recommendation?.partnership_type))
  // console.log(recommendation?.sector)
  // console.log(recommendation?.subsector)

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [recommendation], // Dependencies to refetch on state change
      queryFn: ({ pageParam = 0 }) =>
        getSearchResult({
          page: pageParam as number,
          size: 20,
          // subSectorsCommaSeparated: recommendation?.subsector.join(','),
          // sectorsCommaSeparated: recommendation?.sector.join(','),
          partnershipType: recommendation?.partnership_type.join(','),
          exactMatch: 'true',
          organizationId: organization?.id,
          queryingOrganizationId: organization?.id
        }) as Promise<FetchReferralsResponse>,
      getNextPageParam: (lastPage) =>
        lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
      initialPageParam: 0,
      enabled: !!(organization?.id && open)
    })

  const {
    data: sector,
    fetchNextPage: sectorFetchNextPage,
    hasNextPage: sectorHasNextPage,
    isFetchingNextPage: sectorIsFetchingNextPage,
    isLoading: sectorLoading
  } = useInfiniteQuery({
    queryKey: ['ai-recommended', recommendation], // Dependencies to refetch on state change
    queryFn: ({ pageParam = 0 }) =>
      getSearchResult({
        page: pageParam as number,
        size: 20,
        // subSectorsCommaSeparated: recommendation?.subsector.join(','),
        sectorsCommaSeparated: recommendation?.sector.join(','),
        // partnershipType: recommendation?.partnership_type.join(',')
        exactMatch: 'true',
        organizationId: organization?.id,
        queryingOrganizationId: organization?.id
      }) as Promise<FetchReferralsResponse>,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    initialPageParam: 0,
    enabled: !!organization?.id
  })
  const {
    data: subsector,
    fetchNextPage: subsectorfetchNextPage,
    hasNextPage: subsectorhasNextPage,
    isFetchingNextPage: subsectorisFetchingNextPage,
    isLoading: subsectorLoading
  } = useInfiniteQuery({
    queryKey: ['ai-recommended', recommendation], // Dependencies to refetch on state change
    queryFn: ({ pageParam = 0 }) =>
      getSearchResult({
        page: pageParam as number,
        size: 20,
        subSectorsCommaSeparated: recommendation?.subsector.join(','),
        // sectorsCommaSeparated: recommendation?.sector.join(','),
        // partnershipType: recommendation?.partnership_type.join(',')
        exactMatch: 'true',
        organizationId: organization?.id,
        queryingOrganizationId: organization?.id
      }) as Promise<FetchReferralsResponse>,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    initialPageParam: 0,
    enabled: !!organization?.id
  })

  console.log({ data })

  // const allOrganizations = React.useMemo(() => {
  //   return data?.pages.flatMap((page: any) => page.content) || []
  // }, [data?.pages]) as OrganizationType[]
  const allOrganizations = React.useMemo(() => {
    if (!data && !sector && !subsector) return []

    return Array.from(
      new Map(
        [
          ...(data?.pages || []),
          ...(sector?.pages || []),
          ...(subsector?.pages || [])
        ] // Merge pages
          .flatMap((page: any) => page.content || []) // Flatten content
          .map((org) => [org.id, org]) // Map for uniqueness
      ).values()
    )
  }, [data, subsector, sector]) as OrganizationType[]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className='w-fit border border-input bg-background text-sm hover:bg-accent hover:text-accent-foreground  lg:border-0 lg:bg-primary-light-blue lg:text-text-10 lg:hover:bg-primary/90 lg:hover:text-white'>
          {' '}
          <span className='hidden lg:inline'>Get AI Recommendations</span>{' '}
          <span className='inline lg:hidden'>
            <AiStarIcon />
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className='hide-scrollbar h-auto max-h-screen w-full max-w-[596px] p-0'>
        {/* <ScrollArea className='h-full'> */}
        <div className='relative'>
          <ScrollArea
            className={cn(data && recommendation ? 'h-[82vh]' : 'h-auto')}
          >
            <div className='relative'>
              <div className='absolute z-0'>
                <CirclesContent />
              </div>
              <div className='absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#DEE8FF]'>
                <AiStarIcon />
              </div>
            </div>
            <div className='relative z-[1] mt-[72px] p-6 pb-0'>
              <div className='flex flex-col gap-1'>
                <h3 className='text-lg  font-semibold text-[#181D27]'>
                  AI Partnership Assistant
                </h3>
                <p className='text-sm text-[#535862]'>
                  Describe your business goals and what you are looking for in a
                  partnership. Our AI will suggest the best matches for you.
                </p>
              </div>
              <Textarea
                className='mb-1 mt-4 rounded-lg border border-[#D5D7DA] px-3.5 py-3 shadow-xs'
                placeholder='e.g., I’m a D2C fashion brand looking to expand distribution channels in the US market...'
                rows={6}
                onChange={(e) => setInput(e.target.value)}
              />

              <div>
                {isLoading && (
                  <div className='mx-auto h-[100px] w-[150px]'>
                    <Lottie
                      animationData={require('@/lib/lottie-json/loading.json')}
                      loop={true}
                    />
                  </div>
                )}

                {data && recommendation && (
                  <div className='mt-6 pb-2'>
                    <h2 className='mb-4 text-lg font-semibold text-[#181D27]'>
                      Recommended Partners
                    </h2>
                    <div>
                      <div className='grid w-full grid-cols-1 gap-4'>
                        {allOrganizations?.map((org) => (
                          <RecommendedPartnerCard key={org.id} data={org} />
                        ))}
                      </div>
                      <div ref={observerRef} className=''>
                        {isFetchingNextPage && (
                          <div className='mt-4 grid grid-cols-1 gap-4'>
                            {Array(2)
                              .fill(0)
                              .map((_, index) => (
                                <CardSkeleton key={index} />
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
        {/* </ScrollArea> */}
        <DialogFooter className='flex flex-col items-start p-6 pt-8 sm:justify-start'>
          <Button
            loading={isLoading}
            onClick={() => handleSubmit()}
            className='w-[268px] px-4 py-2.5'
          >
            Get Recommendations
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AiRecommendDialog
