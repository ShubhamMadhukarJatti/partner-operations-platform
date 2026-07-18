'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// Sample data structure based on your JSON
interface SegmentData {
  key: string
  percentage: number
}

// Sample colors for the icons - in a real app, this could be more dynamic
const colorMapping: Record<string, string> = {
  B2B: 'bg-blue-500',
  B2C: 'bg-blue-500',
  D2C: 'bg-black',
  B2B2C: 'bg-blue-500'
}

interface MarketSegmentDistributionProps {
  data: SegmentData[]
}

export default function MarketSegmentDistribution({
  data
}: MarketSegmentDistributionProps) {
  const [expanded, setExpanded] = useState<string | null>(null)

  // Function to format the segment key for display (e.g., "B2B" to "B2b")
  const formatSegmentKey = (key: string) => {
    if (key === 'B2B' || key === 'B2C' || key === 'D2C') {
      return key.charAt(0) + key.substring(1).toLowerCase()
    }
    return key
  }

  // Function to get a rounded percentage value
  const getRoundedPercentage = (percentage: number) => {
    return Math.round(percentage)
  }

  return (
    <div className='w-full  rounded-lg border border-[#E9EAEB] bg-white '>
      <div className='flex flex-row items-center justify-between p-4 pb-2'>
        <h2 className='text-shark-lg font-semibold text-text-100'>
          Market Segment Distribution
        </h2>
        {/* <div className='flex items-center space-x-2'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='text-muted-foreground'
          >
            <circle cx='12' cy='12' r='1' />
            <circle cx='19' cy='12' r='1' />
            <circle cx='5' cy='12' r='1' />
          </svg>
        </div> */}
      </div>
      <div>
        {data?.map((segment, index) => (
          <div key={segment.key}>
            <div
              className='flex cursor-pointer items-center justify-between p-4 hover:bg-muted/50'
              onClick={() =>
                setExpanded(expanded === segment.key ? null : segment.key)
              }
            >
              <div className='flex items-center space-x-3'>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${colorMapping[segment.key] || 'bg-blue-500'}`}
                >
                  {segment.key === 'D2C' ? (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-white'
                    >
                      <path
                        d='M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                      <path
                        d='M8 8H16'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                      <path
                        d='M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                      <path
                        d='M6 16C6 17.5913 6.63214 19.1174 7.75736 20.2426C8.88258 21.3679 10.4087 22 12 22C13.5913 22 15.1174 21.3679 16.2426 20.2426C17.3679 19.1174 18 17.5913 18 16'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                      <path
                        d='M8 16H16'
                        stroke='white'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                    </svg>
                  ) : (
                    <svg
                      width='24'
                      height='24'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-white'
                    >
                      <rect
                        x='3'
                        y='5'
                        width='18'
                        height='14'
                        rx='2'
                        stroke='white'
                        strokeWidth='2'
                      />
                      <path d='M3 10H21' stroke='white' strokeWidth='2' />
                    </svg>
                  )}
                </div>
                <div className='font-medium'>
                  {formatSegmentKey(segment.key)}
                </div>
              </div>
              <div className='flex items-center space-x-2'>
                <Badge
                  variant='outline'
                  className='bg-green-100 text-green-800 hover:bg-green-100'
                >
                  {getRoundedPercentage(segment.percentage)}
                </Badge>
                {/* <ChevronRight className='h-5 w-5 text-muted-foreground' /> */}
              </div>
            </div>
            {index < data.length - 1 && <Separator />}
          </div>
        ))}
      </div>
    </div>
  )
}
