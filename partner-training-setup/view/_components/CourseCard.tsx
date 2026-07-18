import React from 'react'
import Link from 'next/link'
import { CheckCircle2, Clock, FileText, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

export interface CourseCardProps {
  id: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  coverImageUrl?: string
  coverColor?: string
  companyName?: string
  title: string
  tags?: string[]
  modulesCount: number
  duration: string
  durationMinutes: number
  completionPercentage?: number | null
  isDraft?: boolean
}

const CourseCard = ({
  id,
  level,
  coverImageUrl,
  coverColor = '#E5E7EB',
  companyName,
  title,
  tags = [],
  modulesCount,
  duration,
  durationMinutes,
  completionPercentage,
  isDraft = false
}: CourseCardProps) => {
  // Calculate completion progress
  const completedMinutes = completionPercentage
    ? Math.round((completionPercentage / 100) * durationMinutes)
    : 0

  return (
    <div className='flex h-full flex-col overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-border dark:bg-card'>
      <div className='flex flex-1 flex-col'>
        {/* Cover Image */}
        <div className='relative h-40 w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-white/20'>
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={title}
              className='h-full w-full object-cover'
              onError={(e) => {
                // Fallback to color if image fails to load
                const target = e.target as HTMLImageElement
                target.style.display = 'none'
                const parent = target.parentElement
                if (parent) {
                  parent.style.backgroundColor = coverColor
                }
              }}
            />
          ) : (
            <div
              className='h-full w-full'
              style={{ backgroundColor: coverColor }}
            />
          )}

          {/* Level Badge */}
          <div className='absolute right-2 top-2 rounded bg-black/60 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm'>
            ^ {level}
          </div>
        </div>

        {/* Content */}
        <div className='mt-4 flex flex-1 flex-col gap-3'>
          {/* Company Info */}
          {companyName && (
            <div className='flex items-center gap-2'>
              <div className='flex h-5 w-5 items-center justify-center rounded bg-blue-600 text-[9px] font-bold text-white'>
                {companyName.charAt(0).toUpperCase()}
              </div>
              <span className='text-xs font-medium text-gray-600 dark:text-white'>
                {companyName}
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className='line-clamp-2 text-base font-bold text-gray-900 dark:text-white'>
            {title}
          </h3>

          {/* Tags */}
          {tags.length > 0 && (
            <div className='flex flex-wrap gap-2'>
              {tags.map((tag) => (
                <span
                  key={tag}
                  className='rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-white/10 dark:text-white'
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Metadata Grid */}
          {isDraft ? (
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'></div>
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
          ) : (
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-1'>
                <span className='text-[10px] font-medium text-gray-400 dark:text-white'>
                  Content
                </span>
                <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-white'>
                  <FileText
                    size={12}
                    className='text-gray-400 dark:text-white'
                  />
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
          )}

          {/* Completion Status */}
          {completionPercentage !== null &&
            completionPercentage !== undefined && (
              <div className='flex flex-col gap-1'>
                <span className='text-[10px] font-medium text-gray-400 dark:text-white'>
                  Completion
                </span>
                <div className='flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-white'>
                  <CheckCircle2
                    size={12}
                    className='text-gray-400 dark:text-white'
                  />
                  {completedMinutes}/{durationMinutes} mins
                </div>
              </div>
            )}
        </div>
      </div>

      {/* Footer CTA */}
      <div className='mt-6 flex flex-col gap-2'>
        {isDraft ? (
          <>
            <Link href={`/partner-training-setup/add?courseId=${id}&step=2`}>
              <Button
                variant='default'
                className='w-full rounded-xl bg-blue-600 text-sm font-medium text-white hover:bg-blue-700'
              >
                <Plus size={16} className='mr-2' />
                Add Module
              </Button>
            </Link>
            <Link href={`/partner-training-setup/course/${id}`}>
              <Button
                variant='outline'
                className='dark:bg-white/5/50 w-full rounded-xl border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-border dark:bg-white/10 dark:text-white'
              >
                View Details
              </Button>
            </Link>
          </>
        ) : (
          <Link href={`/partner-training-setup/course/${id}`}>
            <Button
              variant='outline'
              className='dark:bg-white/5/50 w-full rounded-xl border-gray-200 bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-border dark:bg-white/10 dark:text-white'
            >
              View Details
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default CourseCard
