'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bell,
  Bookmark,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Clock,
  Copy,
  Facebook,
  FileText,
  GraduationCap,
  Play,
  Settings,
  Share2,
  Tag,
  TrendingUp,
  Video,
  X
} from 'lucide-react'

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
import { FullLogo } from '@/components/icons/logo'

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

const CourseDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [courseData, setCourseData] = useState<CourseDetails | null>(null)
  const [courseLoading, setCourseLoading] = useState(true)
  const [courseError, setCourseError] = useState<string | null>(null)
  const [isStartingCourse, setIsStartingCourse] = useState(false)
  const [userId, setUserId] = useState<string>('')
  const [readinessScore, setReadinessScore] = useState<number | null>(null)
  const [readinessLoading, setReadinessLoading] = useState(false)
  const [playingVideoId, setPlayingVideoId] = useState<number | null>(null)

  // Convert level from API format to display format
  const levelMap: Record<string, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced'
  }

  // Fetch userId on component mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUserId(data.user?.uid || '')
        }
      } catch (error) {
        console.error('Error fetching user ID:', error)
      }
    }
    fetchUserId()
  }, [])

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setCourseLoading(true)
        setCourseError(null)

        const response = await fetch(
          `/api/partner-course/course/${courseId}/details`,
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
      if (!courseId || !userId) return

      try {
        setReadinessLoading(true)
        const response = await fetch(
          `/api/partner/training/courses/${courseId}/readiness/users/${userId}`
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

    if (courseId && userId) {
      fetchReadinessScore()
    }
  }, [courseId, userId])

  if (courseLoading) {
    return (
      <div className='min-h-screen bg-white'>
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
      <div className='min-h-screen bg-white'>
        <div className='mx-auto max-w-7xl px-6 py-8'>
          <p className='text-red-500'>
            Error: {courseError || 'Course not found'}
          </p>
          <Button
            className='mt-4'
            onClick={() => router.push('/partner-course/dashboard')}
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

  // Extract file ID from Google Drive URL
  const extractDriveFileId = (driveLink: string): string | null => {
    if (!driveLink) return null

    let match = driveLink.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      return match[1]
    }

    match = driveLink.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      return match[1]
    }

    match = driveLink.match(/\/uc\?id=([a-zA-Z0-9_-]+)/)
    if (match && match[1]) {
      return match[1]
    }

    return null
  }

  // Check if URL is a Google Drive link
  const isGoogleDriveLink = (url: string): boolean => {
    return url.includes('drive.google.com')
  }

  // Convert Google Drive URL to previewable format for iframe
  const getGoogleDrivePreviewUrl = (url: string): string => {
    if (!url || !url.trim()) return url

    try {
      // Check if it's a Google Drive URL
      if (url.includes('drive.google.com')) {
        const fileId = extractDriveFileId(url)
        if (fileId) {
          // Convert to preview format for embedding
          // This requires the file to be shared with "Anyone with the link" permission
          return `https://drive.google.com/file/d/${fileId}/preview`
        }
      }

      return url
    } catch {
      return url
    }
  }

  // Get thumbnail URL, handling Google Drive links
  const getThumbnailUrl = (thumbnailUrl?: string): string => {
    if (!thumbnailUrl) return ''
    if (thumbnailUrl.includes('drive.google.com')) {
      const fileId = extractDriveFileId(thumbnailUrl)
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }
    return thumbnailUrl
  }

  const handleStartCourse = async () => {
    setIsStartingCourse(true)

    try {
      if (!userId) {
        showCustomToast(
          'Error',
          'User information not available',
          'error',
          3000
        )
        setIsStartingCourse(false)
        return
      }

      // Update course status to IN_PROGRESS
      const res = await fetch(`/api/partner-course/course/${courseId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          courseId: parseInt(courseId),
          status: 'IN_PROGRESS'
        })
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to start course')
      }

      // Navigate to learn page
      router.push(`/partner-course/dashboard/${courseId}/learn`)
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

  return (
    <div className='min-h-screen w-full bg-white px-4 py-6 md:px-8 lg:px-20'>
      <div className='mx-auto max-w-7xl'>
        {/* Header */}
        <div className='mb-6 flex items-center gap-2'>
          <Button
            variant='ghost'
            size='sm'
            className='h-auto p-0 hover:bg-transparent'
            onClick={() => router.push('/partner-course/dashboard')}
          >
            <ArrowLeft className='mr-1 h-4 w-4' />
          </Button>
          <h1 className='text-2xl font-bold text-gray-900'>Course Detail</h1>
        </div>

        <div className='space-y-6'>
          {/* Course Thumbnail */}
          <div className='relative w-full overflow-hidden rounded-xl bg-gray-200'>
            {courseData.coverImageUrl ? (
              <img
                src={courseData.coverImageUrl}
                alt={courseData.title}
                className='h-[300px] w-full object-cover'
              />
            ) : (
              <div className='h-[300px] w-full bg-gray-200' />
            )}
            {/* Subtle gradient overlay at the bottom for button contrast */}
            <div className='absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent' />
            {/* Start Course Button */}
            {/* <div className='absolute inset-x-0 bottom-0 z-10 flex items-end justify-center pb-6'>
              <Button
                size='lg'
                className='rounded-xl bg-gray-900 px-10 py-7 text-base font-semibold text-white shadow-lg transition-all hover:bg-gray-800 hover:shadow-xl'
                onClick={handleStartCourse}
                disabled={isStartingCourse}
                loading={isStartingCourse}
                loadingText='Starting...'
              >
                Start the Course →
              </Button>
            </div> */}
          </div>

          {/* Course Title */}
          <h2 className='text-2xl font-bold text-gray-900'>
            {courseData.title}
          </h2>

          {/* Course Metadata */}
          <div className='flex flex-wrap items-center gap-6'>
            <div className='flex items-center gap-2'>
              <Clock size={16} className='text-gray-500' />
              <span className='text-sm font-medium text-gray-700'>
                {duration}
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <TrendingUp size={16} className='text-gray-500' />
              <span className='text-sm font-medium text-gray-700'>
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
                <Tag size={16} className='text-gray-500' />
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
                        className='rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600'
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
            <p className='leading-relaxed text-gray-600'>
              {courseData.description}
            </p>
          </div>

          {/* Course Content Section */}
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <div className='flex items-center gap-2'>
                <h3 className='text-lg font-bold text-gray-900'>
                  Course Content
                </h3>
                <span className='text-sm text-gray-500'>
                  {courseData.stageCount} Stages
                </span>
              </div>
            </div>

            {/* Stages Accordion */}
            <Accordion type='single' collapsible className='w-full space-y-2'>
              {courseData.stages
                .sort((a, b) => a.order - b.order)
                .map((stage) => (
                  <AccordionItem
                    key={stage.stageId}
                    value={`stage-${stage.stageId}`}
                    className='rounded-lg border border-gray-200 bg-white px-4'
                  >
                    <AccordionTrigger className='hover:no-underline'>
                      <div className='flex items-center gap-3'>
                        <ChevronDown
                          size={16}
                          className='text-gray-500 transition-transform duration-200'
                        />
                        <span className='text-base font-medium text-gray-900'>
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
                                className='rounded-lg border border-gray-200 bg-white p-4'
                              >
                                <div className='mb-3'>
                                  <span className='text-xs font-medium text-gray-500'>
                                    Question {qIndex + 1}
                                  </span>
                                  <p className='mt-1 text-sm font-medium text-gray-900'>
                                    {question.question}
                                  </p>
                                </div>
                                <div className='space-y-2'>
                                  {question.options.map((option, oIndex) => (
                                    <div
                                      key={oIndex}
                                      className='flex items-center gap-2 rounded-md border border-gray-200 bg-gray-50 p-2'
                                    >
                                      <div className='flex h-5 w-5 items-center justify-center rounded-full border-2 border-gray-300 bg-white text-xs font-medium text-gray-600'>
                                        {String.fromCharCode(65 + oIndex)}
                                      </div>
                                      <span className='text-sm text-gray-700'>
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
                            <div className='rounded-lg border border-gray-200 bg-gray-50 p-3'>
                              <h4 className='text-base font-semibold text-gray-900'>
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

                          {/* Video Player */}
                          {stage.content.contentType === 'VIDEO' &&
                            stage.content.driveLink && (
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700'>
                                  Video
                                </Label>
                                <div className='relative aspect-video w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-100'>
                                  {playingVideoId === stage.stageId ? (
                                    // Show video player when playing
                                    <>
                                      {isGoogleDriveLink(
                                        stage.content.driveLink
                                      ) ? (
                                        <iframe
                                          src={getGoogleDrivePreviewUrl(
                                            stage.content.driveLink
                                          )}
                                          className='h-full w-full'
                                          allow='autoplay; fullscreen'
                                          allowFullScreen
                                          title='Video player'
                                          sandbox='allow-same-origin allow-scripts allow-popups allow-presentation'
                                        />
                                      ) : (
                                        <video
                                          src={stage.content.driveLink}
                                          controls
                                          className='h-full w-full'
                                          autoPlay
                                        />
                                      )}
                                      <button
                                        onClick={() => setPlayingVideoId(null)}
                                        className='absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition-colors hover:bg-black/90'
                                        aria-label='Close video'
                                      >
                                        <X size={16} />
                                      </button>
                                    </>
                                  ) : (
                                    // Show thumbnail or preview with play button
                                    <>
                                      {stage.content.thumbnailUrl ? (
                                        // Show thumbnail with play button
                                        <div className='group relative h-full w-full cursor-pointer'>
                                          <img
                                            src={getThumbnailUrl(
                                              stage.content.thumbnailUrl
                                            )}
                                            alt='Video thumbnail'
                                            className='h-full w-full object-cover'
                                            onError={(e) => {
                                              ;(
                                                e.target as HTMLImageElement
                                              ).src =
                                                stage.content?.thumbnailUrl ||
                                                ''
                                            }}
                                          />
                                          <div
                                            className='absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity group-hover:bg-black/40'
                                            onClick={() =>
                                              setPlayingVideoId(stage.stageId)
                                            }
                                          >
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110'>
                                              <Play
                                                size={24}
                                                className='ml-1 text-gray-900'
                                                fill='currentColor'
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ) : isGoogleDriveLink(
                                          stage.content.driveLink
                                        ) ? (
                                        // Show video preview if no thumbnail (for Google Drive)
                                        <div className='group relative h-full w-full cursor-pointer'>
                                          <iframe
                                            src={getGoogleDrivePreviewUrl(
                                              stage.content.driveLink
                                            )}
                                            className='h-full w-full opacity-70'
                                            allow='autoplay; fullscreen'
                                            allowFullScreen
                                            title='Video preview'
                                            sandbox='allow-same-origin allow-scripts allow-popups allow-presentation'
                                          />
                                          <div
                                            className='absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity group-hover:bg-black/30'
                                            onClick={() =>
                                              setPlayingVideoId(stage.stageId)
                                            }
                                          >
                                            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110'>
                                              <Play
                                                size={24}
                                                className='ml-1 text-gray-900'
                                                fill='currentColor'
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      ) : (
                                        // Fallback: show play button on gray background
                                        <div
                                          className='flex h-full w-full cursor-pointer items-center justify-center bg-gray-200 transition-colors hover:bg-gray-300'
                                          onClick={() =>
                                            setPlayingVideoId(stage.stageId)
                                          }
                                        >
                                          <div className='flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg'>
                                            <Play
                                              size={24}
                                              className='ml-1 text-gray-900'
                                              fill='currentColor'
                                            />
                                          </div>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            )}

                          {/* Document Link */}
                          {stage.content.contentType === 'DOCUMENT' &&
                            stage.content.documentLink && (
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700'>
                                  Document Link
                                </Label>
                                <div className='flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 p-3'>
                                  <FileText
                                    size={16}
                                    className='text-gray-500'
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
                                <div className='relative h-[400px] w-full overflow-hidden rounded-lg border border-gray-300 bg-white'>
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
                            <div className='rounded-lg bg-gray-50 p-4'>
                              <Label className='mb-2 text-sm font-medium text-gray-700'>
                                Content
                              </Label>
                              <p className='text-sm leading-relaxed text-gray-700'>
                                {stage.content.content}
                              </p>
                            </div>
                          )}

                          {/* Content Images */}
                          {stage.content.images &&
                            stage.content.images.length > 0 && (
                              <div className='space-y-2'>
                                <Label className='text-sm font-medium text-gray-700'>
                                  Images
                                </Label>
                                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                                  {stage.content.images
                                    .sort((a, b) => a.order - b.order)
                                    .map((image) => (
                                      <div
                                        key={image.id}
                                        className='relative h-48 w-full overflow-hidden rounded-lg bg-gray-200'
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

export default CourseDetailPage
