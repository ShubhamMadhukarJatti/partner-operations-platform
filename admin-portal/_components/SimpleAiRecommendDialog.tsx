'use client'

import React, { useEffect, useRef, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import { getSearchResult } from '@/lib/db/search'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import { AiStarIcon, CirclesContent } from '@/components/icons/icons'
import CardSkeleton from '@/app/(app)/(dashboard-pages)/explore/_components/CardSkeleton'
import RecommendedPartnerCard from '@/app/(app)/(dashboard-pages)/explore/_components/RecommendedPartnerCard'

const SimpleAiRecommendDialog = () => {
  const [recommendation, setRecommendation] = useState<{
    subsector: string[]
    sector: string[]
    partnership_type: string[]
  } | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [organizations, setOrganizations] = useState<any[]>([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)
  const { organization } = useSelector((state: RootState) => state.currentOrg)

  const handleSubmit = async () => {
    try {
      if (input === '') return
      setLoading(true)

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
      await fetchOrganizations(0, true)
    } catch (e) {
      showCustomToast('Error', 'Failed to get recommendations', 'error', 5000)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrganizations = async (
    pageNum: number,
    reset: boolean = false
  ) => {
    try {
      setIsLoadingMore(true)
      const response = await getSearchResult({
        page: pageNum,
        size: 20,
        partnershipType: recommendation?.partnership_type.join(','),
        exactMatch: 'true',
        organizationId: organization?.id,
        queryingOrganizationId: organization?.id
      })

      if (reset) {
        setOrganizations(response.content)
      } else {
        setOrganizations((prev) => [...prev, ...response.content])
      }

      setHasMore(!response.last)
      setPage(pageNum)
    } catch (error) {
      showCustomToast('Error', 'Failed to fetch organizations', 'error', 5000)
    } finally {
      setIsLoadingMore(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          fetchOrganizations(page + 1)
        }
      },
      { threshold: 1.0 }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => observer.disconnect()
  }, [hasMore, isLoadingMore, page])

  return (
    <div className='mx-auto w-full max-w-[596px]'>
      <div className='relative'>
        <ScrollArea
          className={cn(organizations.length > 0 ? 'h-[82vh]' : 'h-auto')}
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
              <h3 className='text-lg font-semibold text-[#181D27]'>
                AI Partnership Assistant
              </h3>
              <p className='text-sm text-[#535862]'>
                Describe your business goals and what you are looking for in a
                partnership. Our AI will suggest the best matches for you.
              </p>
            </div>
            <Textarea
              className='mb-1 mt-4 rounded-lg border border-[#D5D7DA] px-3.5 py-3 shadow-xs'
              placeholder="e.g., I'm a D2C fashion brand looking to expand distribution channels in the US market..."
              rows={6}
              value={input}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setInput(e.target.value)
              }
            />

            <div>
              {loading && (
                <div className='flex flex-col items-center justify-center py-8'>
                  <div className='relative h-12 w-12'>
                    <div className='absolute h-12 w-12 rounded-full border-4 border-[#DEE8FF]'></div>
                    <div className='absolute h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent'></div>
                  </div>
                  <p className='mt-4 text-sm font-medium text-gray-600'>
                    Analyzing your request...
                  </p>
                </div>
              )}

              {organizations.length > 0 && (
                <div className='mt-6 pb-2'>
                  <h2 className='mb-4 text-lg font-semibold text-[#181D27]'>
                    Recommended Partners
                  </h2>
                  <div>
                    <div className='grid w-full grid-cols-1 gap-4'>
                      {organizations.map((org) => (
                        <RecommendedPartnerCard key={org.id} data={org} />
                      ))}
                    </div>
                    <div ref={observerRef} className=''>
                      {isLoadingMore && (
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
      <div className='flex flex-col items-start p-6 pt-8 sm:justify-start'>
        <Button
          loading={loading}
          onClick={handleSubmit}
          className='w-[268px] px-4 py-2.5'
        >
          Get Recommendations
        </Button>
      </div>
    </div>
  )
}

export default SimpleAiRecommendDialog
