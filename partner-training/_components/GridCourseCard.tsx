import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Clock, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface GridCourseProps {
  id: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  coverColor?: string // For placeholder
  thumbnailUrl?: string | null // For actual image
  companyName?: string
  title: string
  tags?: string[]
  modulesCount: number
  duration: string
}

const GridCourseCard = ({
  id,
  level,
  coverColor = '#E5E7EB', // Default gray
  thumbnailUrl,
  companyName,
  title,
  tags,
  modulesCount,
  duration
}: GridCourseProps) => {
  const router = useRouter()
  return (
    <div className='flex h-full flex-col justify-between overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-border dark:bg-card'>
      <div>
        {/* Cover Image */}
        <div
          className='relative h-40 w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-white/20'
          style={!thumbnailUrl ? { backgroundColor: coverColor } : undefined}
        >
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt={title}
              fill
              className='object-cover'
              onError={(e) => {
                // Fallback to placeholder color if image fails to load
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : null}
          {/* Level Badge */}
          <div className='absolute right-2 top-2 z-10 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm'>
            ^ {level}
          </div>
        </div>

        {/* Content */}
        <div className='mt-4 flex flex-col gap-3'>
          {/* Title */}
          <h3 className='line-clamp-2 text-base font-bold text-gray-900 dark:text-white'>
            {title}
          </h3>

          {/* Metadata Grid */}
          <div className='mt-1 grid grid-cols-2 gap-4'>
            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-medium text-gray-400 dark:text-white'>
                Content
              </span>
              <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-white'>
                <FileText size={12} className='text-gray-400 dark:text-white' />
                {modulesCount} Modules
              </div>
            </div>
            <div className='flex flex-col gap-1'>
              <span className='text-[10px] font-medium text-gray-400 dark:text-white'>
                Duration
              </span>
              <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-white'>
                <Clock size={12} className='text-gray-400 dark:text-white' />
                {duration}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className='mt-6 flex gap-2'>
        <Button
          variant='outline'
          className='dark:bg-white/5/50 w-full rounded-xl border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-border dark:bg-white/10 dark:text-white'
          onClick={() => {
            router.push(`/partner-training/course/${id}/learn`)
          }}
        >
          Start Course
        </Button>
        <Button
          variant='outline'
          className='dark:bg-white/5/50 w-full rounded-xl border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-border dark:bg-white/10 dark:text-white'
          onClick={() => {
            router.push(`/partner-training/course/${id}`)
          }}
        >
          View Detail
        </Button>
      </div>
    </div>
  )
}

export default GridCourseCard
