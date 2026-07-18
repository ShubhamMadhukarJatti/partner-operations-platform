import React from 'react'
import { ArrowRight, Info, Play } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import CourseCard, { CourseCardProps } from './CourseCard'

interface ContinueLearningSectionProps {
  courses: CourseCardProps[]
  loading?: boolean
}

const ContinueLearningSection = ({
  courses,
  loading = false
}: ContinueLearningSectionProps) => {
  if (loading) {
    return (
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-6 w-48' />
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          {[1, 2].map((i) => (
            <Skeleton key={i} className='h-40 w-full rounded-[16px]' />
          ))}
        </div>
      </div>
    )
  }

  if (courses.length === 0) {
    return null
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Section Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white'>
            <Play size={14} className='fill-current' />
          </div>
          <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
            Continue where you have left
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info
                  size={16}
                  className='text-gray-400 hover:text-gray-600 dark:text-white dark:text-white'
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Pick up right where you left off</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          variant='ghost'
          className='group flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-white dark:text-white'
        >
          View All
          <ArrowRight
            size={16}
            className='transition-transform group-hover:translate-x-0.5'
          />
        </Button>
      </div>

      {/* Cards List */}
      <div className='flex flex-col gap-4'>
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  )
}

export default ContinueLearningSection
