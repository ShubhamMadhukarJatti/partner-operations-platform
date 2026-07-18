import React from 'react'
import { ArrowRight, Info, LucideIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import GridCourseCard, { GridCourseProps } from './GridCourseCard'

interface CourseGridSectionProps {
  title: string
  icon: React.ReactNode
  infoTooltip?: string
  courses: GridCourseProps[]
}

const CourseGridSection = ({
  title,
  icon,
  infoTooltip,
  courses
}: CourseGridSectionProps) => {
  return (
    <div className='flex flex-col gap-6'>
      {/* Section Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white'>
            {icon}
          </div>
          <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
            {title}
          </h2>
          {infoTooltip && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info
                    size={16}
                    className='text-gray-400 hover:text-gray-600 dark:text-white dark:text-white'
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{infoTooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
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

      {/* Grid */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {courses.map((course) => (
          <GridCourseCard key={course.id} {...course} />
        ))}
      </div>
    </div>
  )
}

export default CourseGridSection
