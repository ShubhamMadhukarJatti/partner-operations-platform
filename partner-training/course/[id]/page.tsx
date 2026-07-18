'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Clock,
  FileText,
  Play,
  Tag,
  TrendingUp,
  Video
} from 'lucide-react'
import { useSelector } from 'react-redux'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { showCustomToast } from '@/components/custom-toast'

interface StageImage {
  id: number
  imageUrl: string
  order: number
}

interface StageContent {
  stageId: number
  content: string
  contentType?: 'VIDEO' | 'DOCUMENT' | 'TEXT'
  thumbnailUrl?: string
  driveLink?: string
  documentLink?: string
  chapterTitle?: string
  images: StageImage[]
}

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  order: number
}

interface Quiz {
  quizId: number
  title: string
  questions: QuizQuestion[]
}

interface Stage {
  stageId: number
  title: string
  type: 'CONTENT' | 'QUIZ'
  order: number
  content: StageContent | null
  quiz: Quiz | null
}

interface CourseDetails {
  courseId: number
  title: string
  description: string
  coverImageUrl: string | null
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  durationMinutes: number
  published: boolean
  stageCount: number
  stages: Stage[]
  labelNames?: string[]
  labels?: string[] | { id: number; name: string }[]
  progressPercentage?: number
}

const CoursePage = () => {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  // Get organization from Redux for assignedOrgId
  const organization = useSelector(
    (state: RootState) => state.currentOrg.organization
  )

  const [courseData, setCourseData] = useState<CourseDetails | null>(null)
  const [courseLoading, setCourseLoading] = useState(true)
  const [courseError, setCourseError] = useState<string | null>(null)
  const [isStartingCourse, setIsStartingCourse] = useState(false)
  const [readinessScore, setReadinessScore] = useState<number | null>(null)
  const [readinessLoading, setReadinessLoading] = useState(false)

  // Convert level from API format to display format
  const levelMap: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
  }

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setCourseLoading(true)
        setCourseError(null)

        const response = await fetch(
          `/api/partner/training/courses/${courseId}/details`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to fetch course details')
        }

        const data = await response.json()

        if (data.success && data.data) {
          setCourseData(data.data)
        } else if (data.data) {
          // Handle case where data is directly in response
          setCourseData(data.data)
        } else {
          throw new Error(data.message || 'Failed to fetch course details')
        }
      } catch (err) {
        console.error('Error fetching course details:', err)
        setCourseError(
          err instanceof Error ? err.message : 'Failed to fetch course details'
        )
        showCustomToast('Error', 'Failed to load course details', 'error', 5000)
      } finally {
        setCourseLoading(false)
      }
    }

    if (courseId) {
      fetchCourseDetails()
    }
  }, [courseId])

  // Fetch readiness score
  useEffect(() => {
    const fetchReadinessScore = async () => {
      if (!courseId) return

      try {
        setReadinessLoading(true)
        const response = await fetch(
          `/api/partner/training/my/partner/courses/${courseId}/readiness`
        )

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.readinessScore !== undefined) {
            setReadinessScore(data.data.readinessScore)
          }
        }
      } catch (error) {
        console.error('Error fetching readiness score:', error)
      } finally {
        setReadinessLoading(false)
      }
    }

    if (courseId) {
      fetchReadinessScore()
    }
  }, [courseId])

  const handleStartLearning = async () => {
    try {
      setIsStartingCourse(true)

      // If course hasn't started yet, update status to INPROGRESS
      if (
        !courseData?.progressPercentage ||
        courseData.progressPercentage === 0
      ) {
        const assignedOrgId = organization?.id

        if (!assignedOrgId) {
          showCustomToast('Error', 'Organization ID is required', 'error', 3000)
          return
        }

        const res = await fetch(
          `/api/partner/training/my/partner/courses/assign/status/update`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              courseId: Number(courseId),
              assignedOrgId: Number(assignedOrgId),
              status: 'IN_PROGRESS'
            })
          }
        )

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to start course')
        }
      }

      // Navigate to learn page
      router.push(`/partner-training/course/${courseId}/learn`)
    } catch (error) {
      console.error('Error starting course:', error)
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to start course',
        'error',
        3000
      )
    } finally {
      setIsStartingCourse(false)
    }
  }

  if (courseLoading) {
    return (
      <div className='min-h-screen bg-white dark:bg-card'>
        <Skeleton className='h-16 w-full' />
        <div className='mx-auto max-w-7xl px-6 py-8'>
          <Skeleton className='mb-4 h-10 w-64' />
          <Skeleton className='mb-8 h-96 w-full' />
        </div>
      </div>
    )
  }

  if (courseError || !courseData) {
    return (
      <div className='min-h-screen bg-white dark:bg-card'>
        <div className='mx-auto max-w-7xl px-6 py-8'>
          <p className='text-red-500'>
            Error: {courseError || 'Course not found'}
          </p>
          <Button
            className='mt-4'
            onClick={() => router.push('/partner-training')}
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  // Convert level from API format to display format
  const displayLevel = levelMap[courseData.level] || courseData.level

  // Format duration
  const duration =
    courseData.durationMinutes === 1
      ? '1 Min'
      : `${courseData.durationMinutes} Mins`

  return (
    <div className='min-h-screen w-full bg-white px-4 py-6 dark:bg-card md:px-8 lg:px-20'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='h-auto p-0 hover:bg-transparent'
            onClick={() => router.push('/partner-training')}
          >
            <ArrowLeft className='mr-1 h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
            Course Detail
          </h1>
        </div>

        <div className='space-y-6'>
          {/* Course Thumbnail */}
          <div className='relative w-full overflow-hidden rounded-xl bg-gray-200 dark:bg-white/20'>
            {courseData.coverImageUrl ? (
              <img
                src={courseData.coverImageUrl}
                alt={courseData.title}
                className='h-[300px] w-full object-cover'
              />
            ) : (
              <div className='h-[300px] w-full bg-gray-200 dark:bg-white/20' />
            )}
          </div>

          {/* Course Title */}
          <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
            {courseData.title}
          </h2>

          {/* Course Metadata */}
          <div className='flex flex-wrap items-center gap-6'>
            <div className='flex items-center gap-2'>
              <Clock size={16} className='text-gray-500 dark:text-white' />
              <span className='text-sm font-medium text-gray-700 dark:text-white'>
                {duration}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <TrendingUp size={16} className='text-gray-500 dark:text-white' />
              <span className='text-sm font-medium text-gray-700 dark:text-white'>
                {displayLevel}
              </span>
            </div>
            {readinessScore !== null && (
              <div className='flex items-center gap-3 rounded-lg bg-orange-50 px-4 py-2'>
                <div className='relative h-12 w-12'>
                  <svg
                    className='h-12 w-12 -rotate-90 transform'
                    viewBox='0 0 36 36'
                  >
                    <circle
                      cx='18'
                      cy='18'
                      r='16'
                      fill='none'
                      stroke='#fef3e2'
                      strokeWidth='3'
                    />
                    <circle
                      cx='18'
                      cy='18'
                      r='16'
                      fill='none'
                      stroke='#ff6b35'
                      strokeWidth='3'
                      strokeDasharray={`${readinessScore}, 100`}
                      strokeLinecap='round'
                    />
                  </svg>
                  <div className='absolute inset-0 flex items-center justify-center'>
                    <span className='text-xs font-semibold text-orange-900'>
                      {readinessScore}%
                    </span>
                  </div>
                </div>
              </div>
            )}
            {((courseData.labelNames && courseData.labelNames.length > 0) ||
              (courseData.labels && courseData.labels.length > 0)) && (
              <div className='flex items-center gap-2'>
                <Tag size={16} className='text-gray-500 dark:text-white' />
                <div className='flex gap-2'>
                  {/* Prioritize labelNames over labels for backward compatibility */}
                  {(courseData.labelNames && courseData.labelNames.length > 0
                    ? courseData.labelNames
                    : courseData.labels || []
                  ).map((label, index) => {
                    const labelName =
                      typeof label === 'string' ? label : label.name
                    return (
                      <span
                        key={index}
                        className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-white'
                      >
                        {labelName}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Course Description */}
          <div className='space-y-2'>
            <p className='leading-relaxed text-gray-600 dark:text-white'>
              {courseData.description}
            </p>
          </div>

          {/* Course Content Section */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                  Course Content
                </h3>
                <span className='text-sm text-gray-500 dark:text-white'>
                  {courseData.stageCount} Stages
                </span>
              </div>
              <Button
                onClick={handleStartLearning}
                disabled={isStartingCourse}
                className='bg-blue-600 px-6 text-white hover:bg-blue-700 disabled:opacity-50'
              >
                {isStartingCourse
                  ? 'Starting...'
                  : courseData.progressPercentage &&
                      courseData.progressPercentage > 0
                    ? 'Continue Learning'
                    : 'Start Learning'}
              </Button>
            </div>

            {/* Stages Accordion */}
            <Accordion type='single' collapsible className='w-full space-y-2'>
              {courseData.stages
                .sort((a, b) => a.order - b.order)
                .map((stage) => (
                  <AccordionItem
                    key={stage.stageId}
                    value={`stage-${stage.stageId}`}
                    className='rounded-lg border border-gray-200 bg-white px-4 dark:border-border dark:bg-card'
                  >
                    <AccordionTrigger className='hover:no-underline'>
                      <div className='flex items-center gap-3'>
                        <ChevronDown
                          size={16}
                          className='text-gray-500 transition-transform duration-200 dark:text-white'
                        />
                        <span className='text-base font-medium text-gray-900 dark:text-white'>
                          Chapter {stage.order}: {stage.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className='pb-4 pt-2'>
                      {/* Quiz Stage */}
                      {stage.quiz && (
                        <div className='space-y-4'>
                          <div className='rounded-lg border border-blue-200 bg-blue-50 p-3'>
                            <div className='flex items-center gap-2'>
                              <FileText size={16} className='text-blue-600' />
                              <span className='text-sm font-semibold text-blue-900'>
                                Quiz: {stage.quiz.title}
                              </span>
                            </div>
                          </div>
                          {stage.quiz.questions
                            .sort((a, b) => a.order - b.order)
                            .map((question, qIndex) => (
                              <div
                                key={question.id}
                                className='rounded-lg border border-gray-200 bg-white p-4 dark:border-border dark:bg-card'
                              >
                                <div className='mb-3'>
                                  <span className='text-xs font-medium text-gray-500 dark:text-white'>
                                    Question {qIndex + 1}
                                  </span>
                                  <p className='mt-1 text-sm font-medium text-gray-900 dark:text-white'>
                                    {question.question}
                                  </p>
                                </div>
                                <div className='space-y-2'>
                                  {question.options.map((option, oIndex) => (
                                    <div
                                      key={oIndex}
                                      className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2 dark:border-border dark:bg-white/5'
                                    >
                                      <div className='flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs font-medium text-gray-600 dark:border-border dark:bg-card dark:text-white'>
                                        {String.fromCharCode(65 + oIndex)}
                                      </div>
                                      <span className='text-sm text-gray-700 dark:text-white'>
                                        {option}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Content Stage */}
                      {stage.content && (
                        <div className='space-y-4'>
                          {/* Chapter Title */}
                          {stage.content.chapterTitle && (
                            <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-border dark:bg-white/5'>
                              <h4 className='text-base font-semibold text-gray-900 dark:text-white'>
                                {stage.content.chapterTitle}
                              </h4>
                            </div>
                          )}

                          {/* Content Type Badge */}
                          {stage.content.contentType && (
                            <div className='flex items-center gap-2'>
                              {stage.content.contentType === 'VIDEO' && (
                                <div className='flex items-center gap-2 rounded-full bg-red-100 px-3 py-1'>
                                  <Video size={14} className='text-red-600' />
                                  <span className='text-xs font-medium text-red-700'>
                                    Video Content
                                  </span>
                                </div>
                              )}
                              {stage.content.contentType === 'DOCUMENT' && (
                                <div className='flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1'>
                                  <FileText
                                    size={14}
                                    className='text-blue-600'
                                  />
                                  <span className='text-xs font-medium text-blue-700'>
                                    Document Content
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Video Drive Link */}
                          {stage.content.contentType === 'VIDEO' &&
                            stage.content.driveLink && (
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                                  Video Link
                                </Label>
                                <div className='flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-border dark:bg-white/5'>
                                  <Play
                                    size={16}
                                    className='text-gray-500 dark:text-white'
                                  />
                                  <a
                                    href={stage.content.driveLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex-1 truncate text-sm text-blue-600 hover:underline'
                                  >
                                    {stage.content.driveLink}
                                  </a>
                                </div>
                              </div>
                            )}

                          {/* Video Thumbnail */}
                          {stage.content.contentType === 'VIDEO' &&
                            stage.content.thumbnailUrl && (
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                                  Thumbnail
                                </Label>
                                <div className='relative h-48 w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-border dark:bg-white/10'>
                                  <img
                                    src={
                                      stage.content.thumbnailUrl &&
                                      stage.content.thumbnailUrl.includes(
                                        'drive.google.com'
                                      )
                                        ? `https://drive.google.com/uc?export=view&id=${stage.content.thumbnailUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]}`
                                        : stage.content.thumbnailUrl || ''
                                    }
                                    alt='Video thumbnail'
                                    className='h-full w-full object-cover'
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src =
                                        stage.content?.thumbnailUrl || ''
                                    }}
                                  />
                                </div>
                              </div>
                            )}

                          {/* Document Link */}
                          {stage.content.contentType === 'DOCUMENT' &&
                            stage.content.documentLink && (
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                                  Document Link
                                </Label>
                                <div className='flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-border dark:bg-white/5'>
                                  <FileText
                                    size={16}
                                    className='text-gray-500 dark:text-white'
                                  />
                                  <a
                                    href={stage.content.documentLink}
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='flex-1 truncate text-sm text-blue-600 hover:underline'
                                  >
                                    {stage.content.documentLink}
                                  </a>
                                </div>
                                {/* Document Preview */}
                                <div className='relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-300 bg-white dark:border-border dark:bg-card'>
                                  <iframe
                                    src={stage.content.documentLink}
                                    className='h-full w-full'
                                    title='Document Preview'
                                    sandbox='allow-same-origin allow-scripts allow-popups allow-forms'
                                  />
                                </div>
                              </div>
                            )}

                          {/* Content Text */}
                          {stage.content.content && (
                            <div className='rounded-lg bg-gray-50 p-4 dark:bg-white/5'>
                              <Label className='mb-2 text-sm font-medium text-gray-700 dark:text-white'>
                                Content
                              </Label>
                              <p className='text-sm leading-relaxed text-gray-700 dark:text-white'>
                                {stage.content.content}
                              </p>
                            </div>
                          )}

                          {/* Content Images */}
                          {stage.content.images &&
                            stage.content.images.length > 0 && (
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700 dark:text-white'>
                                  Images
                                </Label>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                  {stage.content.images
                                    .sort((a, b) => a.order - b.order)
                                    .map((image) => (
                                      <div
                                        key={image.id}
                                        className='relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-white/20'
                                      >
                                        <img
                                          src={image.imageUrl}
                                          alt={`Stage ${stage.order} image ${image.order}`}
                                          className='h-full w-full object-cover'
                                        />
                                      </div>
                                    ))}
                                </div>
                              </div>
                            )}
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursePage
