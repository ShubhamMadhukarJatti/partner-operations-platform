'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { RootState } from '@/redux/store'
import { Bell, Check, ChevronDown, Settings, X } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { VidstackPlayer } from '@/components/ui/vidstack-player'
import { showCustomToast } from '@/components/custom-toast'
import { DocumentPreview } from '@/components/document-preview'
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

interface Chapter {
  id: string
  order: number
  title: string
  subtitle: string
  isActive: boolean
  isCompleted: boolean
  isNext: boolean
  stageId?: number
  type?: 'CONTENT' | 'QUIZ'
}

const CourseLearnPage = () => {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const courseId = params.id as string
  const [activeTab, setActiveTab] = useState<'home' | 'courses'>('courses')
  const [activeChapter, setActiveChapter] = useState<string | null>(null)
  const [courseTitle, setCourseTitle] = useState<string>(
    'A course about xyz.com and entreprise ready suite'
  )
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [stages, setStages] = useState<Stage[]>([])
  const [currentStage, setCurrentStage] = useState<Stage | null>(null)
  const [stageLoading, setStageLoading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [progressLoading, setProgressLoading] = useState(true)
  const [progressError, setProgressError] = useState<string | null>(null)
  const [completedStageIds, setCompletedStageIds] = useState<Set<string>>(
    () => new Set()
  )

  // Quiz-specific state
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<number, number>
  >({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompletingStage, setIsCompletingStage] = useState(false)
  const [courseStarted, setCourseStarted] = useState(false)

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

  // Get organization from Redux for assignedOrgId
  const organization = useSelector(
    (state: RootState) => state.currentOrg.organization
  )

  // Fetch progress data
  const fetchProgress = useCallback(async () => {
    if (!courseId) return
    try {
      setProgressLoading(true)
      const res = await fetch(
        `/api/partner/training/my/partner/courses/${courseId}/progress`
      )
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to fetch progress')
      }

      const progressList: any[] = data?.data || data || []
      const completedIds = progressList
        .filter((p) => p?.completed)
        .map((p) => p?.stageId?.toString() || p?.id?.toString())
        .filter(Boolean)
      setCompletedStageIds(new Set(completedIds))
      setProgressError(null)
    } catch (error) {
      console.error('Error fetching progress:', error)
      setProgressError((error as Error)?.message || 'Failed to fetch progress')
      setCompletedStageIds(new Set())
    } finally {
      setProgressLoading(false)
    }
  }, [courseId])

  // Update course assignment status
  const updateCourseStatus = useCallback(
    async (status: 'INPROGRESS' | 'COMPLETED') => {
      try {
        const assignedOrgId = organization?.id

        if (!assignedOrgId) {
          throw new Error('Organization ID is required')
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
              status: status
            })
          }
        )

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to update course status')
        }

        const data = await res.json()
        return data
      } catch (error) {
        console.error('Error updating course status:', error)
        throw error
      }
    },
    [courseId, organization?.id]
  )

  // Complete stage
  const completeStage = useCallback(
    async (stageId: number) => {
      try {
        setIsCompletingStage(true)
        const res = await fetch(
          `/api/partner/training/my/partner/courses/${courseId}/stages/${stageId}/complete`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to complete stage')
        }

        const data = await res.json()

        // Refresh progress after completion
        await fetchProgress()

        return data
      } catch (error) {
        console.error('Error completing stage:', error)
        throw error
      } finally {
        setIsCompletingStage(false)
      }
    },
    [courseId, fetchProgress]
  )

  // Check if all stages are completed and update course status
  useEffect(() => {
    if (
      stages.length > 0 &&
      completedStageIds.size > 0 &&
      !progressLoading &&
      stages.every((stage) => completedStageIds.has(stage.stageId.toString()))
    ) {
      // All stages are completed
      updateCourseStatus('COMPLETED')
        .then(() => {
          showCustomToast(
            'Congratulations!',
            'You have completed all stages of this course.',
            'success',
            5000
          )
        })
        .catch((error) => {
          console.error('Error updating course status to COMPLETED:', error)
        })
    }
  }, [stages, completedStageIds, progressLoading, updateCourseStatus])

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true)
        // Fetch course details with full stage information
        const detailRes = await fetch(
          `/api/partner/training/courses/${courseId}/details`
        )
        const detailData = await detailRes.json()

        if (!detailRes.ok) {
          throw new Error(
            detailData?.message || 'Failed to fetch course details'
          )
        }

        const courseDetails = detailData?.data || detailData
        if (courseDetails?.title) {
          setCourseTitle(courseDetails.title)
        }

        // Store full stages data
        const courseStages: Stage[] = courseDetails?.stages || []
        setStages(courseStages)

        // Map stages to chapters
        const mapped: Chapter[] = courseStages.map(
          (stage: Stage, idx: number) => {
            const id = stage.stageId.toString()
            return {
              id,
              stageId: stage.stageId,
              order: stage.order ?? idx + 1,
              title: stage.title || `Chapter ${idx + 1}`,
              subtitle:
                stage.type === 'QUIZ'
                  ? 'Quiz stage'
                  : stage.content?.chapterTitle ||
                    stage.content?.content?.substring(0, 50) ||
                    'Get access to over 20+ partnership',
              type: stage.type,
              isActive: false,
              isCompleted: false,
              isNext: false
            }
          }
        )

        setChapters(mapped)
      } catch (error) {
        console.error('Error fetching course details:', error)
        showCustomToast('Error', 'Failed to load course details', 'error', 5000)
        setChapters([])
      } finally {
        setLoading(false)
      }
    }

    if (courseId) {
      fetchCourseDetails()
      fetchProgress()
    }
  }, [courseId, fetchProgress])

  const loadStageDetails = useCallback(
    async (stageId: number, forceReload = false) => {
      try {
        setStageLoading(true)
        // Find stage from already loaded stages
        const stage = stages.find((s) => s.stageId === stageId)

        if (stage) {
          // Only update if it's a different stage or force reload is requested
          if (forceReload || currentStage?.stageId !== stageId) {
            setCurrentStage(stage)

            // If it's a QUIZ stage, extract quiz and reset quiz state
            if (stage.type === 'QUIZ' && stage.quiz) {
              setQuiz(stage.quiz)
              setCurrentQuestionIndex(0)
              setSelectedAnswers({})
            } else {
              setQuiz(null)
              setCurrentQuestionIndex(0)
              setSelectedAnswers({})
            }

            // Check if this is the first stage and course hasn't started
            if (!courseStarted && stage.order === 1) {
              try {
                await updateCourseStatus('INPROGRESS')
                setCourseStarted(true)
              } catch (error) {
                console.error('Error starting course:', error)
              }
            }
          }
        } else {
          // Fallback: fetch stage details if not in loaded stages
          const res = await fetch(
            `/api/partner/training/courses/${courseId}/details`
          )
          const data = await res.json()
          const courseDetails = data?.data || data
          const foundStage = courseDetails?.stages?.find(
            (s: Stage) => s.stageId === stageId
          )

          if (foundStage) {
            setCurrentStage(foundStage)
            if (foundStage.type === 'QUIZ' && foundStage.quiz) {
              setQuiz(foundStage.quiz)
              setCurrentQuestionIndex(0)
              setSelectedAnswers({})
            } else {
              setQuiz(null)
              setCurrentQuestionIndex(0)
              setSelectedAnswers({})
            }
          }
        }
      } catch (error) {
        console.error('Error loading stage details:', error)
        showCustomToast('Error', 'Failed to load stage details', 'error', 3000)
      } finally {
        setStageLoading(false)
      }
    },
    [courseId, stages, currentStage, courseStarted, updateCourseStatus]
  )

  // Handle stageId from query params
  useEffect(() => {
    if (chapters.length > 0 && !loading && !progressLoading) {
      const stageIdParam = searchParams.get('stageId')

      if (stageIdParam) {
        const stageId = parseInt(stageIdParam)
        const chapterFromQuery = chapters.find((ch) => ch.stageId === stageId)
        if (chapterFromQuery && chapterFromQuery.stageId) {
          setActiveChapter(chapterFromQuery.id)
          loadStageDetails(chapterFromQuery.stageId, true)
          return
        }
      }
    }
  }, [searchParams, chapters, loading, progressLoading, loadStageDetails])

  // Set active chapter after chapters and progress are loaded (default behavior)
  useEffect(() => {
    if (chapters.length > 0 && !loading && !progressLoading) {
      const stageIdParam = searchParams.get('stageId')
      if (stageIdParam) {
        return // Let the previous effect handle it
      }

      // If no query param, use default logic
      if (!activeChapter) {
        const firstIncomplete = chapters.find(
          (ch) => !completedStageIds.has(ch.id)
        )
        if (firstIncomplete && firstIncomplete.stageId) {
          setActiveChapter(firstIncomplete.id)
          loadStageDetails(firstIncomplete.stageId)
        } else if (chapters[0]?.stageId) {
          setActiveChapter(chapters[0].id)
          loadStageDetails(chapters[0].stageId)
        }
      }
    }
  }, [
    chapters,
    completedStageIds,
    loading,
    progressLoading,
    activeChapter,
    loadStageDetails,
    searchParams
  ])

  const hydratedChapters = useMemo(() => {
    const updated = chapters.map((ch) => ({
      ...ch,
      isCompleted: completedStageIds.has(ch.id)
    }))

    // Determine active chapter
    let activeIdx: number | null = null
    if (activeChapter) {
      activeIdx = updated.findIndex((ch) => ch.id === activeChapter)
    }
    if (activeIdx === null || activeIdx === -1) {
      activeIdx = updated.findIndex((ch) => !ch.isCompleted)
      if (activeIdx === -1) activeIdx = 0
    }

    const nextIdx =
      activeIdx !== null && activeIdx < updated.length - 1
        ? activeIdx + 1
        : activeIdx

    return updated.map((ch, idx) => ({
      ...ch,
      isActive: idx === activeIdx,
      isNext: idx === nextIdx && idx !== activeIdx
    }))
  }, [chapters, completedStageIds, activeChapter])

  const handleChapterClick = (chapterId: string) => {
    setActiveChapter(chapterId)
    const chapter = chapters.find((ch) => ch.id === chapterId)

    if (chapter?.stageId) {
      loadStageDetails(chapter.stageId)
    }
  }

  // Quiz handlers
  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNextQuestion = async () => {
    if (!quiz || !currentStage) return

    const currentQuestion = quiz.questions[currentQuestionIndex]
    if (
      selectedAnswers[currentQuestion.id] === undefined &&
      selectedAnswers[currentQuestion.id] !== 0
    ) {
      showCustomToast('Error', 'Please select an answer', 'error', 3000)
      return
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Last question - submit quiz
      await handleSubmitQuiz()
    }
  }

  const handleSubmitQuiz = async () => {
    if (!quiz || !currentStage) return

    const currentQuestion = quiz.questions[currentQuestionIndex]
    const currentAnswerIndex = selectedAnswers[currentQuestion.id]

    if (currentAnswerIndex === undefined) {
      showCustomToast('Error', 'Please select an answer', 'error', 3000)
      return
    }

    setIsSubmitting(true)

    try {
      // Get the selected answer text
      const selectedAnswer = currentQuestion.options[currentAnswerIndex]

      // Call the verification API
      const response = await fetch(
        `/api/partner/training/courses/course/stage/${currentStage.stageId}/quiz/answer/verify?answer=${encodeURIComponent(selectedAnswer)}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to verify quiz answer')
      }

      const data = await response.json()

      // Check if answer is correct
      // Response format: {"success":true,"message":"Quiz answer verified successfully","data":true}
      const isCorrect = data.success === true && data.data === true

      if (isCorrect) {
        showCustomToast(
          'Success',
          'Correct answer! Moving to next stage...',
          'success',
          3000
        )

        // Complete the stage
        await completeStage(currentStage.stageId)

        // Move to next stage after a short delay
        setTimeout(() => {
          handleContinue()
        }, 1500)
      } else {
        // Answer is incorrect
        showCustomToast(
          'Error',
          'Incorrect answer. Please try again.',
          'error',
          3000
        )
        // Don't complete stage or move forward
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to submit quiz',
        'error',
        3000
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleContinue = async () => {
    if (!currentStage) return

    // For CONTENT stages, complete the stage first
    if (currentStage.type === 'CONTENT') {
      try {
        await completeStage(currentStage.stageId)
      } catch (error) {
        showCustomToast(
          'Error',
          'Failed to complete stage. Please try again.',
          'error',
          3000
        )
        return
      }
    }

    // Find next stage in the sorted order
    const sortedChapters = [...hydratedChapters].sort(
      (a, b) => a.order - b.order
    )
    const currentIndex = sortedChapters.findIndex(
      (ch) => ch.stageId === currentStage.stageId
    )

    // Find next stage
    const nextChapter = sortedChapters.find((ch, idx) => idx > currentIndex)

    if (nextChapter && nextChapter.stageId) {
      // Load next stage in the same page
      setActiveChapter(nextChapter.id)
      loadStageDetails(nextChapter.stageId)
    } else {
      // All stages completed - redirect to course page
      // Note: Course status update to COMPLETED is handled in completeStage
      showCustomToast('Success', 'Course completed!', 'success', 3000)
      setTimeout(() => {
        router.push(`/partner-training/course/${courseId}`)
      }, 1500)
    }
  }

  const currentQuestion = quiz?.questions[currentQuestionIndex]
  const currentAnswer = currentQuestion
    ? selectedAnswers[currentQuestion.id]
    : undefined

  // Check if current stage is completed
  const isCurrentStageCompleted = currentStage
    ? completedStageIds.has(currentStage.stageId.toString())
    : false

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-white/5'>
        <Skeleton className='h-16 w-full' />
        <div className='mx-auto max-w-7xl p-6'>
          <Skeleton className='h-96 w-full' />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-white/5'>
      {/* Main Content */}
      <div className='mx-auto max-w-7xl p-6 pb-24'>
        <div className='rounded-2xl bg-white p-6 shadow-lg dark:bg-card'>
          <div className='flex gap-6'>
            {/* Left Sidebar - Chapters */}
            <div className='w-64 shrink-0 space-y-4'>
              {hydratedChapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterClick(chapter.id)}
                  className={`w-full rounded-lg border-2 p-4 text-left transition-all ${
                    chapter.isActive
                      ? 'border-blue-600 bg-blue-50'
                      : chapter.isNext
                        ? 'border-blue-300 bg-blue-50/50'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-border dark:border-border dark:bg-card'
                  }`}
                >
                  <div className='flex items-start gap-3'>
                    <div
                      className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                        chapter.isCompleted
                          ? 'border-green-600 bg-green-600'
                          : chapter.isActive
                            ? 'border-blue-600 bg-blue-600'
                            : chapter.isNext
                              ? 'border-blue-600 bg-white dark:bg-card'
                              : 'border-gray-300 bg-white dark:border-border dark:bg-card'
                      }`}
                    >
                      {chapter.isCompleted ? (
                        <Check className='h-4 w-4 text-white' />
                      ) : chapter.isActive ? (
                        <div className='h-2 w-2 rounded-full bg-white dark:bg-card' />
                      ) : null}
                    </div>
                    <div className='flex-1'>
                      <div
                        className={`text-sm font-semibold ${
                          chapter.isActive
                            ? 'text-blue-900'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        Chapter {chapter.order}
                      </div>
                      <div
                        className={`mt-1 text-xs ${
                          chapter.isActive
                            ? 'text-blue-700'
                            : 'text-gray-600 dark:text-white'
                        }`}
                      >
                        {chapter.title}
                      </div>
                      <div className='mt-1 text-xs text-gray-500 dark:text-white'>
                        {chapter.subtitle}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Main Section - Content or Quiz Display */}
            <div className='flex-1'>
              {stageLoading ? (
                <div className='space-y-4'>
                  <Skeleton className='aspect-video w-full rounded-xl' />
                  <Skeleton className='h-32 w-full' />
                </div>
              ) : currentStage ? (
                <>
                  {/* QUIZ STAGE */}
                  {currentStage.type === 'QUIZ' && quiz && currentQuestion ? (
                    <>
                      {/* Quiz Title */}
                      {quiz.title && (
                        <div className='mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4'>
                          <h2 className='text-lg font-semibold text-blue-900'>
                            {quiz.title}
                          </h2>
                        </div>
                      )}

                      {/* Question Progress */}
                      <div className='mb-4 flex items-center justify-between'>
                        <span className='text-sm font-medium text-gray-600 dark:text-white'>
                          Question {currentQuestionIndex + 1} of{' '}
                          {quiz.questions.length}
                        </span>
                        <div className='mx-4 h-2 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-white/20'>
                          <div
                            className='h-full bg-blue-600 transition-all'
                            style={{
                              width: `${
                                ((currentQuestionIndex + 1) /
                                  quiz.questions.length) *
                                100
                              }%`
                            }}
                          />
                        </div>
                      </div>

                      {/* Question */}
                      <div className='mb-6'>
                        <h3 className='mb-4 text-2xl font-bold text-gray-900 dark:text-white'>
                          {currentQuestion.question}
                        </h3>
                      </div>

                      {/* Multiple Choice Options */}
                      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                        {currentQuestion.options.map((option, optionIndex) => (
                          <button
                            key={optionIndex}
                            onClick={() =>
                              handleAnswerSelect(
                                currentQuestion.id,
                                optionIndex
                              )
                            }
                            className={`flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-all ${
                              currentAnswer === optionIndex
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-border dark:border-border dark:bg-card'
                            }`}
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                                currentAnswer === optionIndex
                                  ? 'border-blue-600 bg-blue-600'
                                  : 'border-gray-300 bg-white dark:border-border dark:bg-card'
                              }`}
                            >
                              {currentAnswer === optionIndex && (
                                <div className='h-2 w-2 rounded-full bg-white dark:bg-card' />
                              )}
                            </div>
                            <span className='font-medium text-gray-900 dark:text-white'>
                              {String.fromCharCode(65 + optionIndex)}. {option}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  ) : currentStage.type === 'CONTENT' ? (
                    <>
                      {/* Video Content */}
                      {currentStage.content?.contentType === 'VIDEO' &&
                        currentStage.content?.driveLink && (
                          <div className='mb-6'>
                            {isGoogleDriveLink(
                              currentStage.content.driveLink
                            ) ? (
                              <div className='relative aspect-video w-full overflow-hidden rounded-xl'>
                                <iframe
                                  src={`https://drive.google.com/file/d/${extractDriveFileId(currentStage.content.driveLink)}/preview`}
                                  className='h-full w-full'
                                  allow='autoplay'
                                  allowFullScreen
                                  title='Video player'
                                />
                              </div>
                            ) : (
                              <VidstackPlayer
                                src={currentStage.content.driveLink}
                                poster={
                                  currentStage.content.thumbnailUrl
                                    ? currentStage.content.thumbnailUrl.includes(
                                        'drive.google.com'
                                      )
                                      ? `https://drive.google.com/uc?export=view&id=${extractDriveFileId(currentStage.content.thumbnailUrl)}`
                                      : currentStage.content.thumbnailUrl
                                    : undefined
                                }
                                className='aspect-video w-full'
                              />
                            )}
                          </div>
                        )}

                      {/* Document Content */}
                      {currentStage.content?.contentType === 'DOCUMENT' &&
                        currentStage.content?.documentLink && (
                          <div className='mb-6'>
                            <DocumentPreview
                              documentLink={currentStage.content.documentLink}
                              height='600px'
                              showLabel={false}
                              showCloseButton={false}
                            />
                          </div>
                        )}

                      {/* Text Content or No Video/Document */}
                      {(!currentStage.content?.contentType ||
                        currentStage.content?.contentType === 'TEXT' ||
                        (!currentStage.content?.driveLink &&
                          !currentStage.content?.documentLink)) && (
                        <div className='mb-6 rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-border dark:bg-white/5'>
                          {currentStage.content?.chapterTitle && (
                            <h3 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>
                              {currentStage.content.chapterTitle}
                            </h3>
                          )}
                          {currentStage.content?.content && (
                            <div className='prose prose-sm max-w-none text-gray-700 dark:text-white'>
                              <p className='whitespace-pre-wrap'>
                                {currentStage.content.content}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Content Images */}
                      {currentStage.content?.images &&
                        currentStage.content.images.length > 0 && (
                          <div className='mb-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
                            {currentStage.content.images
                              .sort((a, b) => a.order - b.order)
                              .map((image) => (
                                <div
                                  key={image.id}
                                  className='relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-white/20'
                                >
                                  <img
                                    src={image.imageUrl}
                                    alt={`Stage ${currentStage.order} image ${image.order}`}
                                    className='h-full w-full object-cover'
                                  />
                                </div>
                              ))}
                          </div>
                        )}

                      {/* Stage Title and Description */}
                      <div className='space-y-4'>
                        <div>
                          <h2 className='mb-2 text-2xl font-bold text-gray-900 dark:text-white'>
                            {currentStage.title}
                          </h2>
                          {currentStage.content?.chapterTitle && (
                            <p className='text-lg text-gray-600 dark:text-white'>
                              {currentStage.content.chapterTitle}
                            </p>
                          )}
                          {currentStage.content?.content && (
                            <div className='prose prose-sm max-w-none text-gray-700 dark:text-white'>
                              <p className='whitespace-pre-wrap'>
                                {currentStage.content.content}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : null}
                </>
              ) : (
                <div className='flex h-96 items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-border dark:bg-white/5'>
                  <p className='text-gray-500 dark:text-white'>
                    Select a chapter to view content
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 dark:border-border dark:bg-card'>
        <div className='mx-auto flex max-w-7xl justify-between gap-4'>
          <div className='flex gap-4'>
            {/* Quiz Previous Button */}
            {currentStage?.type === 'QUIZ' && currentQuestionIndex > 0 && (
              <Button
                variant='outline'
                onClick={handlePreviousQuestion}
                className='px-6'
              >
                Previous
              </Button>
            )}
            <Button
              variant='outline'
              onClick={() =>
                router.push(`/partner-training/course/${courseId}`)
              }
              className='px-6'
            >
              {currentStage?.type === 'QUIZ' ? 'Back to Course' : 'Back'}
            </Button>
          </div>
          {currentStage?.type === 'QUIZ' ? (
            <Button
              onClick={handleNextQuestion}
              className='bg-blue-600 px-6 text-white hover:bg-blue-700'
              disabled={
                currentAnswer === undefined || isSubmitting || isCompletingStage
              }
            >
              {isSubmitting || isCompletingStage
                ? 'Processing...'
                : currentQuestionIndex < (quiz?.questions.length || 0) - 1
                  ? 'Next'
                  : 'Submit'}
            </Button>
          ) : (
            !isCurrentStageCompleted && (
              <Button
                onClick={handleContinue}
                className='bg-blue-600 px-6 text-white hover:bg-blue-700'
                disabled={!currentStage || isCompletingStage}
              >
                {isCompletingStage ? 'Completing...' : 'Continue'}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseLearnPage
