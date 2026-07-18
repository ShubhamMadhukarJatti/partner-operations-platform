import React, { useEffect, useState } from 'react'
import { BookOpen, Info } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import CourseCard, { CourseCardProps } from './_components/CourseCard'

interface ApiCourse {
  courseId: number
  title: string
  description: string
  coverImageUrl: string | null
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  stageCount: number
  durationMinutes: number
  published: boolean
  completionPercentage: number | null
}

interface ApiResponse {
  success: boolean
  message: string
  data: ApiCourse[]
}

interface UnpublishedCourseLabel {
  id: number
  name: string
}

interface UnpublishedCourse {
  id: number
  title: string
  description: string
  coverImageUrl: string | null
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  durationMinutes: number
  published: boolean
  labels: UnpublishedCourseLabel[]
}

interface UnpublishedApiResponse {
  success: boolean
  message: string
  data: UnpublishedCourse[]
}

const CoursesTab = () => {
  const [activeTab, setActiveTab] = useState('published')
  const [publishedCourses, setPublishedCourses] = useState<CourseCardProps[]>(
    []
  )
  const [draftedCourses, setDraftedCourses] = useState<CourseCardProps[]>([])
  const [loading, setLoading] = useState(true)
  const [draftedLoading, setDraftedLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [draftedError, setDraftedError] = useState<string | null>(null)

  // Fetch published courses
  useEffect(() => {
    const fetchPublishedCourses = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/partner/training/courses', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch courses')
        }

        const data: ApiResponse = await response.json()

        if (data.success && data.data) {
          // Map API response to CourseCardProps format
          const mappedCourses: CourseCardProps[] = data.data.map((course) => {
            // Convert level from API format to component format
            const levelMap: Record<
              string,
              'Beginner' | 'Intermediate' | 'Advanced'
            > = {
              BEGINNER: 'Beginner',
              INTERMEDIATE: 'Intermediate',
              ADVANCED: 'Advanced'
            }

            // Format duration
            const duration =
              course.durationMinutes === 1
                ? '1 min'
                : `${course.durationMinutes} mins`

            return {
              id: course.courseId.toString(),
              level: levelMap[course.level] || 'Beginner',
              coverImageUrl: course.coverImageUrl || undefined,
              title: course.title,
              modulesCount: course.stageCount,
              duration,
              durationMinutes: course.durationMinutes,
              completionPercentage: course.completionPercentage,
              tags: [] // API doesn't provide tags
            }
          })

          setPublishedCourses(mappedCourses)
        } else {
          throw new Error(data.message || 'Failed to fetch courses')
        }
      } catch (err) {
        console.error('Error fetching published courses:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch courses')
      } finally {
        setLoading(false)
      }
    }

    fetchPublishedCourses()
  }, [])

  // Fetch drafted courses
  useEffect(() => {
    const fetchDraftedCourses = async () => {
      try {
        setDraftedLoading(true)
        setDraftedError(null)

        const response = await fetch(
          '/api/partner/training/courses/unpublished',
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(
            errorData.message || 'Failed to fetch unpublished courses'
          )
        }

        const data: UnpublishedApiResponse = await response.json()

        if (data.success && data.data) {
          // Map API response to CourseCardProps format
          const mappedCourses: CourseCardProps[] = data.data.map((course) => {
            // Convert level from API format to component format
            const levelMap: Record<
              string,
              'Beginner' | 'Intermediate' | 'Advanced'
            > = {
              BEGINNER: 'Beginner',
              INTERMEDIATE: 'Intermediate',
              ADVANCED: 'Advanced'
            }

            // Format duration
            const duration =
              course.durationMinutes === 1
                ? '1 min'
                : `${course.durationMinutes} mins`

            // Extract tags from labels
            const tags = course.labels?.map((label) => label.name) || []

            return {
              id: course.id.toString(),
              level: levelMap[course.level] || 'Beginner',
              coverImageUrl: course.coverImageUrl || undefined,
              title: course.title,
              modulesCount: 0, // Unpublished courses don't have stageCount in the response
              duration,
              durationMinutes: course.durationMinutes,
              completionPercentage: null, // Unpublished courses don't have completion percentage
              tags,
              isDraft: true // Mark as draft course
            }
          })

          setDraftedCourses(mappedCourses)
        } else {
          throw new Error(data.message || 'Failed to fetch unpublished courses')
        }
      } catch (err) {
        console.error('Error fetching drafted courses:', err)
        setDraftedError(
          err instanceof Error
            ? err.message
            : 'Failed to fetch unpublished courses'
        )
      } finally {
        setDraftedLoading(false)
      }
    }

    fetchDraftedCourses()
  }, [])

  const renderCoursesGrid = (
    courses: CourseCardProps[],
    isLoading: boolean,
    errorMessage: string | null
  ) => {
    if (isLoading) {
      return (
        <div className='flex items-center justify-center py-12'>
          <p className='text-gray-500 dark:text-white'>Loading courses...</p>
        </div>
      )
    }

    if (errorMessage) {
      return (
        <div className='flex items-center justify-center py-12'>
          <p className='text-red-500'>Error: {errorMessage}</p>
        </div>
      )
    }

    if (courses.length === 0) {
      return (
        <div className='flex items-center justify-center py-12'>
          <p className='text-gray-500 dark:text-white'>No courses found</p>
        </div>
      )
    }

    return (
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {courses.map((course) => (
          <CourseCard key={course.id} {...course} />
        ))}
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Header */}
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

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
        <TabsList className='inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground'>
          <TabsTrigger value='published' className='px-4'>
            Published
          </TabsTrigger>
          <TabsTrigger value='drafted' className='px-4'>
            Drafted
          </TabsTrigger>
        </TabsList>

        <TabsContent value='published' className='mt-6'>
          {renderCoursesGrid(publishedCourses, loading, error)}
        </TabsContent>

        <TabsContent value='drafted' className='mt-6'>
          {renderCoursesGrid(draftedCourses, draftedLoading, draftedError)}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CoursesTab
