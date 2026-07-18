import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, FileText } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export interface CourseCardProps {
  id: string
  coverImage: string
  companyName?: string
  title: string
  modulesCount: number
  completionPercentage: number
  timeLabel: string
  timeValue: string
  dueText?: string
  dueColor?: 'red' | 'gray'
  ctaText: string
}

const CourseCard = ({
  id,
  coverImage,
  companyName,
  title,
  modulesCount,
  completionPercentage,
  timeLabel,
  timeValue,
  dueText,
  dueColor = 'gray',
  ctaText
}: CourseCardProps) => {
  // Calculate stroke dashoffset for circular progress
  const radius = 9
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (completionPercentage / 100) * circumference

  return (
    <div className='relative flex w-full flex-col gap-6 rounded-[16px] border border-[#E5E7EB] bg-white p-4 dark:border-border dark:bg-card md:flex-row'>
      {/* Cover Image */}
      <div className='relative h-48 w-full flex-shrink-0 overflow-hidden rounded-xl md:h-[140px] md:w-[240px]'>
        <Image src={coverImage} alt={title} fill className='object-cover' />
        <div className='absolute inset-0 bg-black/5' />
      </div>

      {/* Main Content Area */}
      <div className='flex flex-1 flex-col justify-between md:flex-row'>
        {/* Left Column: Info & Stats */}
        <div className='flex flex-1 flex-col justify-between gap-4'>
          {/* Header */}
          <div className='space-y-3'>
            {companyName && (
              <div className='flex items-center gap-2'>
                <div className='flex h-6 w-6 items-center justify-center rounded bg-purple-900 text-[10px] font-bold text-white'>
                  {companyName.charAt(0)}
                </div>
                <span className='text-sm font-medium text-gray-600 dark:text-white'>
                  {companyName}
                </span>
              </div>
            )}
            <h3 className='max-w-xl text-lg font-bold leading-tight text-gray-900 dark:text-white'>
              {title}
            </h3>
          </div>

          {/* Stats Row */}
          <div className='flex flex-wrap items-center gap-8'>
            {/* Modules */}
            <div className='flex flex-col gap-1.5'>
              <span className='text-xs font-medium text-gray-500 dark:text-white'>
                Content
              </span>
              <div className='flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white'>
                <FileText size={16} className='text-gray-400 dark:text-white' />
                {modulesCount} Modules
              </div>
            </div>

            {/* Completion */}
            <div className='flex flex-col gap-1.5'>
              <span className='text-xs font-medium text-gray-500 dark:text-white'>
                Completion
              </span>
              <div className='flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white'>
                <div className='relative h-5 w-5'>
                  <svg className='h-full w-full -rotate-90 transform'>
                    <circle
                      cx='10'
                      cy='10'
                      r={radius}
                      stroke='#E5E7EB'
                      strokeWidth='2'
                      fill='none'
                    />
                    <circle
                      cx='10'
                      cy='10'
                      r={radius}
                      stroke='currentColor'
                      strokeWidth='2'
                      fill='none'
                      className='text-blue-600 transition-all duration-500 ease-in-out'
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      strokeLinecap='round'
                    />
                  </svg>
                </div>
                {completionPercentage}%
              </div>
            </div>

            {/* Duration/Deadline */}
            <div className='flex flex-col gap-1.5'>
              <span className='text-xs font-medium text-gray-500 dark:text-white'>
                {timeLabel}
              </span>
              <div className='flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-white'>
                <Clock size={16} className='text-gray-400 dark:text-white' />
                {timeValue}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions */}
        <div className='flex flex-row items-center justify-between gap-4 md:flex-col md:items-end md:justify-between'>
          {/* Due Badge */}
          <div className='h-6'>
            {' '}
            {/* Spacer/Container height fix */}
            {dueText && (
              <div
                className={cn(
                  'absolute right-4 top-0 rounded px-2 py-1 text-xs font-medium',
                  dueColor === 'red'
                    ? 'bg-red-50 text-red-500'
                    : 'bg-gray-100 text-gray-500 dark:bg-white/10 dark:text-white'
                )}
              >
                Due: {dueText}
              </div>
            )}
          </div>

          <Link href={`/partner-training/course/${id}`}>
            <Button
              variant='outline'
              className='h-9 min-w-[100px] rounded-full border-gray-200 font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-border dark:bg-white/5 dark:text-white dark:text-white'
            >
              {ctaText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
