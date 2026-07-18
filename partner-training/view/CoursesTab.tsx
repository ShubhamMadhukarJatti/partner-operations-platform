import React, { useMemo, useState } from 'react'
import { BookOpen, Info } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import ContinueLearningCarousel from '../_components/ContinueLearningCarousel'
import { CourseCardProps } from '../_components/CourseCard'
import GridCourseCard, { GridCourseProps } from '../_components/GridCourseCard'

interface ApiCourse {
  courseId: number
  title: string
  thumbnailUrl: string | null
  modules: number
  durationInMinutes: number
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  status: string
  progressPercentage: number
}

interface CoursesTabProps {
  continueCourses: ApiCourse[]
  allCourses: ApiCourse[]
  loading?: boolean
  onFilterChange?: (status: string | null) => void
}

// Helper function to map API course to GridCourseProps
const mapApiCourseToGridCourse = (
  course: ApiCourse,
  index: number
): GridCourseProps => {
  const levelMap: Record<string, 'Beginner' | 'Intermediate' | 'Advanced'> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
  }

  // Generate a color based on index for placeholder
  const colors = ['#1e293b', '#fbbf24', '#d8b4fe', '#10b981', '#3b82f6']
  const coverColor = colors[index % colors.length]

  return {
    id: course.courseId.toString(),
    level: levelMap[course.level] || 'Beginner',
    coverColor,
    thumbnailUrl: course.thumbnailUrl,
    title: course.title,
    modulesCount: course.modules,
    duration:
      course.durationInMinutes === 1
        ? '1 Min'
        : `${course.durationInMinutes} Mins`
  }
}

// Helper function to map API course to CourseCardProps
const mapApiCourseToCourseCard = (
  course: ApiCourse,
  index: number
): CourseCardProps => {
  return {
    id: course.courseId.toString(),
    coverImage:
      course.thumbnailUrl ||
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    title: course.title,
    modulesCount: course.modules,
    completionPercentage: course.progressPercentage || 0,
    timeLabel: course.progressPercentage > 0 ? 'Deadline' : 'Duration',
    timeValue:
      course.durationInMinutes === 1
        ? '1 Min'
        : `${course.durationInMinutes} Mins`,
    dueText: course.progressPercentage > 0 ? undefined : undefined,
    dueColor: course.progressPercentage > 0 ? 'red' : 'gray',
    ctaText: course.progressPercentage > 0 ? 'Continue' : 'Start'
  }
}

const FILTERS = [
  'All',
  'Assigned Courses',
  'Not Started',
  'In Progress',
  'Completed'
]

// Map filter names to API status values
const getStatusFromFilter = (filter: string): string | null => {
  switch (filter) {
    case 'All':
      return null // null means fetch all
    case 'Assigned Courses':
      return 'ASSIGNED'
    case 'Not Started':
      return 'ASSIGNED' // Not started courses are typically ASSIGNED with 0% progress
    case 'In Progress':
      return 'IN_PROGRESS'
    case 'Completed':
      return 'COMPLETED'
    case 'Other Courses':
      return null // Handle separately if needed
    default:
      return null
  }
}

const CoursesTab = ({
  continueCourses,
  allCourses,
  loading = false,
  onFilterChange
}: CoursesTabProps) => {
  const [activeFilter, setActiveFilter] = useState('All')

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter)
    const status = getStatusFromFilter(filter)
    onFilterChange?.(status)
  }

  // Map continue courses for carousel
  const mappedContinueCourses = useMemo(
    () => continueCourses.map(mapApiCourseToCourseCard),
    [continueCourses]
  )

  // Map all courses for grid
  const mappedAllCourses = useMemo(
    () => allCourses.map(mapApiCourseToGridCourse),
    [allCourses]
  )

  // Filter courses based on active filter (client-side for progress-based filters)
  const filteredCourses = useMemo(() => {
    if (activeFilter === 'All') {
      return mappedAllCourses
    }

    // For "Not Started", filter by progress percentage
    if (activeFilter === 'Not Started') {
      return allCourses
        .filter((course) => course.progressPercentage === 0)
        .map((course, index) => mapApiCourseToGridCourse(course, index))
    }

    // For other filters, the API handles the filtering via status
    // But we can also do client-side filtering as a fallback
    return mappedAllCourses
  }, [mappedAllCourses, allCourses, activeFilter])

  return (
    <div className='flex flex-col gap-10'>
      {/* Carousel Section */}
      <ContinueLearningCarousel
        courses={mappedContinueCourses}
        loading={loading}
      />

      {/* Courses Section */}
      <div className='flex flex-col gap-6'>
        {/* Header & Filters */}
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white'>
              <BookOpen size={14} className='fill-current' />
            </div>
            <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
              Courses
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
                  <p>Browse all available courses</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* Filter Pills */}
          <div className='flex flex-wrap items-center gap-2'>
            {FILTERS.map((filter) => (
              <Button
                key={filter}
                variant='ghost'
                size='sm'
                onClick={() => handleFilterChange(filter)}
                className={cn(
                  '!h-auto rounded-md border border-solid px-2 py-1 text-xs font-medium transition-colors',
                  activeFilter === filter
                    ? 'border-[#BEDBFF] bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700'
                    : 'border-[#E5E7EB] bg-transparent text-gray-500 hover:bg-gray-50 hover:text-gray-900 dark:border-border dark:bg-white/5 dark:text-white dark:text-white'
                )}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className='h-80 w-full rounded-[16px]' />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {filteredCourses.map((course) => (
              <GridCourseCard key={course.id} {...course} />
            ))}
          </div>
        ) : (
          <div className='flex items-center justify-center py-12'>
            <p className='text-gray-500 dark:text-white'>
              No courses available
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursesTab
