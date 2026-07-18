import React, { useEffect, useState } from 'react'
import Image from 'next/image'

import { getServerUser } from '@/lib/server'

export interface AIPartnerPulseData {
  id: number
  image: string
  title: string
  description: string
  tags: string[]
  chosenReason: string
}

interface PartnerPulseApiItem {
  id: number
  name: string
  about: string | null
  briefDescription: string | null
  website: string | null
  logoUrl: string | null
  preferredSectors?: string[] | null
  filters?: string[] | null
  email?: string | null
}

interface PartnerPulseApiResponse {
  content?: PartnerPulseApiItem[]
}

interface AIPartnerPulseProps {
  email?: string | null
  data?: AIPartnerPulseData[]
  isLoading?: boolean
}

const AIPartnerPulse: React.FC<AIPartnerPulseProps> = ({
  email,
  data = [],
  isLoading = false
}) => {
  const [partnerData, setPartnerData] = useState<AIPartnerPulseData[]>([])
  const [isFetching, setIsFetching] = useState(false)
  // Default dummy data when no data is provided
  const defaultData: AIPartnerPulseData[] = [
    {
      id: 1,
      image: '/api/placeholder/36/36',
      title: 'GetBee',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tags: ['Tech', 'B2C'],
      chosenReason: 'fintech.com'
    },
    {
      id: 2,
      image: '/api/placeholder/36/36',
      title: 'TechFlow',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tags: ['Tech', 'B2B'],
      chosenReason: 'saas.io'
    },
    {
      id: 3,
      image: '/api/placeholder/36/36',
      title: 'DataSync',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tags: ['Data', 'B2B'],
      chosenReason: 'analytics.com'
    },
    {
      id: 4,
      image: '/api/placeholder/36/36',
      title: 'CloudBase',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      tags: ['Cloud', 'B2C'],
      chosenReason: 'cloud.net'
    }
  ]

  const mapApiItemToPulseData = (
    item: PartnerPulseApiItem
  ): AIPartnerPulseData => {
    const tags = [
      ...(item.filters ?? []),
      ...((item.preferredSectors ?? []).filter(Boolean) as string[])
    ]

    const chosenReason =
      item.filters && item.filters.length > 0
        ? item.filters[0]
        : item.preferredSectors && item.preferredSectors.length > 0
          ? item.preferredSectors[0]
          : (item.email ?? 'your preferences')

    return {
      id: item.id,
      image: item.logoUrl ?? '/api/placeholder/36/36',
      title: item.name,
      description:
        item.briefDescription ??
        item.about ??
        'Explore this partner for more details.',
      tags: tags.length > 0 ? tags : ['Recommended'],
      chosenReason
    }
  }

  useEffect(() => {
    if (!email) {
      setPartnerData([])
      return
    }

    const controller = new AbortController()
    const fetchPartnerPulse = async () => {
      console.log('email fetchPartnerPulse', email)
      setIsFetching(true)
      try {
        const { token } = await getServerUser()
        const response = await fetch(
          `/api/external/partner/pulse/filter/search?email=${email}00`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const json: PartnerPulseApiResponse = await response.json()
        console.log('json', json)
        const items = json.content ?? []
        console.log('items', items)
        setPartnerData(items.map(mapApiItemToPulseData))
      } catch (error) {
        console.log('error fetchPartnerPulse', error)
        if ((error as Error).name === 'AbortError') return
        console.error('Failed to load AI Partner Pulse data:', error)
        setPartnerData([])
      } finally {
        setIsFetching(false)
      }
    }

    fetchPartnerPulse()

    return () => {
      controller.abort()
    }
  }, [email])

  const displayData =
    partnerData.length > 0 ? partnerData : data.length > 0 ? data : []

  if (isLoading || isFetching) {
    return (
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {[1, 2, 3, 4].map((k) => (
          <div
            key={k}
            className='rounded-2xl border border-gray-200 bg-white p-4'
          >
            <div className='mb-3 flex items-start gap-3'>
              <div className='h-9 w-9 animate-pulse rounded-md bg-gray-200' />
              <div className='flex-1'>
                <div className='mb-2 h-5 w-1/2 animate-pulse rounded bg-gray-200' />
                <div className='space-y-2'>
                  <div className='h-4 w-full animate-pulse rounded bg-gray-200' />
                  <div className='h-4 w-4/5 animate-pulse rounded bg-gray-200' />
                </div>
              </div>
            </div>
            <div className='mb-3 flex flex-wrap gap-2'>
              <div className='h-6 w-16 animate-pulse rounded-full bg-gray-200' />
              <div className='h-6 w-16 animate-pulse rounded-full bg-gray-200' />
              <div className='h-6 w-16 animate-pulse rounded-full bg-gray-200' />
            </div>
            <div className='h-3 w-2/3 animate-pulse rounded bg-gray-200' />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='w-full'>
      {displayData.length === 0 ? (
        <div className='flex w-full flex-col items-center justify-center gap-1 rounded-2xl border border-gray-200 bg-white py-10 text-center'>
          <p className='text-sm font-semibold text-gray-800'>
            No partners to show
          </p>
          <p className='text-xs text-gray-500'>
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {displayData.map((partner) => (
            <div
              key={partner.id}
              className='rounded-2xl border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm'
            >
              <div className='mb-3 flex items-start gap-3'>
                <div className='h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg border-2 border-gray-200'>
                  <Image
                    src={partner.image}
                    alt={partner.title}
                    width={36}
                    height={36}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='flex-1'>
                  <h4 className='mb-0.5 text-lg font-semibold text-gray-900'>
                    {partner.title}
                  </h4>
                  <p className='line-clamp-2 text-sm text-gray-600'>
                    {partner.description}
                  </p>
                  <div className='mt-2 flex flex-wrap gap-2'>
                    {partner.tags.slice(0, 4).map((tag, tagIndex) => (
                      <span
                        key={`${tag}-${tagIndex}`}
                        className='rounded-md border border-blue-400 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600'
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <hr className='mb-3 border-gray-200' />

              <p className='text-xs text-gray-600'>
                Showing because you chose{' '}
                <span className='font-medium text-gray-900'>
                  {partner.chosenReason}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AIPartnerPulse
