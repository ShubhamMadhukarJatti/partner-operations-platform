import React from 'react'
import { Info, Play } from 'lucide-react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import CourseCard, { CourseCardProps } from './CourseCard'

interface ContinueLearningCarouselProps {
  courses: CourseCardProps[]
  loading?: boolean
}

const ContinueLearningCarousel = ({
  courses,
  loading = false
}: ContinueLearningCarouselProps) => {
  if (loading) {
    return (
      <div className='flex w-full flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Skeleton className='h-8 w-8 rounded-lg' />
            <Skeleton className='h-6 w-64' />
          </div>
        </div>
        <div className='flex gap-4'>
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
    <div className='flex w-full flex-col gap-6'>
      {/* Header with Carousel Controls */}
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
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: 'start',
          loop: false
        }}
        className='w-full'
      >
        <div className='absolute -top-12 right-12 flex gap-2'>
          <CarouselPrevious className='static translate-y-0' />
          <CarouselNext className='static translate-y-0' />
        </div>

        <CarouselContent className='-ml-4'>
          {courses.map((course) => (
            <CarouselItem
              key={course.id}
              className='pl-4 md:basis-1/2 lg:basis-1/2'
            >
              <CourseCard {...course} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}

export default ContinueLearningCarousel
