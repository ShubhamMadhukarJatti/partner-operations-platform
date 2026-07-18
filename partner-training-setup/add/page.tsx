'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  ArrowRight,
  BookOpen,
  FileText,
  Layers,
  UserPlus,
  X
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { showCustomToast } from '@/components/custom-toast'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import AssignmentRulesStep from './_components/AssignmentRulesStep'
import CourseDetailsStep, {
  CourseData,
  Label
} from './_components/CourseDetailsStep'
import CreateLearningPathStep from './_components/CreateLearningPathStep'
import SetStagesStep from './_components/SetStagesStep'

const STEPS = [
  {
    id: 1,
    title: 'Course Details',
    icon: FileText
  },
  {
    id: 2,
    title: 'Create Learning Path',
    icon: BookOpen
  },
  {
    id: 3,
    title: 'Assignment Rules',
    icon: UserPlus
  },
  {
    id: 4,
    title: 'Set Stages of The Course',
    icon: Layers
  }
]

const AddCoursePage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState<CourseData>({
    title: '',
    description: '',
    coverImage: null,
    duration: '',
    level: '',
    labels: []
  })
  const [availableLabels, setAvailableLabels] = useState<Label[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [courseId, setCourseId] = useState<number | null>(null)

  // Get courseId from URL params on mount
  useEffect(() => {
    const courseIdParam = searchParams.get('courseId')
    const stepParam = searchParams.get('step')

    if (courseIdParam) {
      setCourseId(parseInt(courseIdParam, 10))
    }
    if (stepParam) {
      setCurrentStep(parseInt(stepParam, 10))
    }
  }, [searchParams])

  // Parse duration string to minutes
  const parseDurationToMinutes = (duration: string): number => {
    if (!duration || !duration.trim()) return 0

    const durationLower = duration.toLowerCase().trim()

    // Match patterns like "2 hours", "30 minutes", "1.5 hours", etc.
    const hourMatch = durationLower.match(/(\d+(?:\.\d+)?)\s*(?:hour|hr|h)/)
    const minuteMatch = durationLower.match(
      /(\d+(?:\.\d+)?)\s*(?:minute|min|m)/
    )

    let totalMinutes = 0

    if (hourMatch) {
      totalMinutes += parseFloat(hourMatch[1]) * 60
    }

    if (minuteMatch) {
      totalMinutes += parseFloat(minuteMatch[1])
    }

    // If no match found, try to parse as just a number (assume minutes)
    if (totalMinutes === 0) {
      const numberMatch = durationLower.match(/(\d+(?:\.\d+)?)/)
      if (numberMatch) {
        totalMinutes = parseFloat(numberMatch[1])
      }
    }

    return Math.round(totalMinutes)
  }

  // Map level to uppercase format
  const mapLevelToAPI = (level: string): string => {
    const levelMap: Record<string, string> = {
      Beginner: 'BEGINNER',
      Intermediate: 'INTERMEDIATE',
      Advanced: 'ADVANCED'
    }
    return levelMap[level] || level.toUpperCase()
  }

  // Map label names to IDs
  const getLabelIds = (labelNames: string[]): number[] => {
    return labelNames
      .map((name) => availableLabels.find((label) => label.name === name)?.id)
      .filter((id): id is number => id !== undefined)
  }

  const handleNext = async () => {
    // Clear any previous errors at the start
    setSubmitError(null)

    if (currentStep === 1) {
      // Validate required fields
      if (!courseData.title?.trim()) {
        const errorMsg = 'Title is required'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }
      if (!courseData.description?.trim()) {
        const errorMsg = 'Description is required'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }
      if (!courseData.coverImage) {
        const errorMsg = 'Cover image is required'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }
      if (!courseData.level) {
        const errorMsg = 'Level is required'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }
      if (!courseData.duration) {
        const errorMsg = 'Duration is required'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const durationMinutes = parseDurationToMinutes(courseData.duration)
        if (durationMinutes <= 0) {
          throw new Error(
            'Invalid duration. Please enter a valid duration (e.g., "2 hours" or "30 minutes")'
          )
        }

        const labelIds = getLabelIds(courseData.labels || [])

        const payload = {
          title: courseData.title.trim(),
          description: courseData.description.trim(),
          coverImageUrl: courseData.coverImage,
          level: mapLevelToAPI(courseData.level),
          durationMinutes,
          labelIds
        }

        const response = await fetch('/api/partner/training/courses/add', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to create course')
        }

        const result = await response.json()

        if (result.success && result.data?.id) {
          // Store course ID
          const newCourseId = result.data.id
          setCourseId(newCourseId)

          // Update URL params
          const params = new URLSearchParams()
          params.set('courseId', newCourseId.toString())
          params.set('step', '2')
          router.push(`?${params.toString()}`, { scroll: false })

          // Course created successfully, move to next step
          setCurrentStep(2)
        } else {
          throw new Error(result.message || 'Failed to create course')
        }
      } catch (error) {
        console.error('Error creating course:', error)
        const errorMsg =
          error instanceof Error ? error.message : 'Failed to create course'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
      } finally {
        setIsSubmitting(false)
      }
    } else if (currentStep === 2) {
      // Check that all stages have contentCreated: true
      const stages = courseData.learningPath || []
      if (stages.length === 0) {
        const errorMsg = 'Please add at least one stage'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }

      const allContentCreated = stages.every(
        (stage: any) => stage.contentCreated === true
      )

      if (!allContentCreated) {
        const errorMsg =
          'Please check that all be modules are saved before proceeding'
        setSubmitError(errorMsg)
        showCustomToast('info', errorMsg, 'error', 6000)
        return
      }

      // Move to next step
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      // Update URL params
      if (courseId) {
        const params = new URLSearchParams()
        params.set('courseId', courseId.toString())
        params.set('step', nextStep.toString())
        router.push(`?${params.toString()}`, { scroll: false })
      }
    } else if (currentStep === 3) {
      if (!courseId) {
        const errorMsg = 'Course ID missing. Please create the course first.'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const rules = courseData.assignmentRules || {
          tiers: [],
          geographies: [],
          programTypes: []
        }

        const response = await fetch(
          `/api/partner/training/courses/${courseId}/assignment/rules`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              tiers: rules.tiers || [],
              geographies: rules.geographies || [],
              programTypes: rules.programTypes || []
            })
          }
        )

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))

          if (response.status !== 404 && response.status !== 501) {
            throw new Error(
              errorData.message || 'Failed to save assignment rules'
            )
          }
        }

        // Move to next step
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)

        // Update URL params
        const params = new URLSearchParams()
        params.set('courseId', courseId.toString())
        params.set('step', nextStep.toString())
        router.push(`?${params.toString()}`, { scroll: false })
      } catch (error) {
        console.error('Error saving assignment rules:', error)
        const errorMsg =
          error instanceof Error
            ? error.message
            : 'Failed to save assignment rules'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
      } finally {
        setIsSubmitting(false)
      }
    } else if (currentStep < 4) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      // Update URL params
      if (courseId) {
        const params = new URLSearchParams()
        params.set('courseId', courseId.toString())
        params.set('step', nextStep.toString())
        router.push(`?${params.toString()}`, { scroll: false })
      }
    } else {
      if (!courseId) {
        const errorMsg = 'Course ID missing. Please create the course first.'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        return
      }

      setIsSubmitting(true)
      setSubmitError(null)

      try {
        // Publish the course
        const publishResponse = await fetch(
          `/api/partner/training/courses/${courseId}/publish?published=true`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )

        if (!publishResponse.ok) {
          const errorData = await publishResponse.json().catch(() => ({}))
          throw new Error(errorData.message || 'Failed to publish course')
        }

        const publishResult = await publishResponse.json()

        if (publishResult.success) {
          showCustomToast(
            'Success',
            'Course created and published successfully',
            'success',
            6000
          )
          router.push(`/partner-training-setup/course/${courseId}`)
        } else {
          throw new Error(publishResult.message || 'Failed to publish course')
        }
      } catch (error) {
        console.error('Error publishing course:', error)
        const errorMsg =
          error instanceof Error ? error.message : 'Failed to publish course'
        setSubmitError(errorMsg)
        showCustomToast('Error', errorMsg, 'error', 6000)
        // Still show info about manual publish option
        showCustomToast(
          'Info',
          'Course created but failed to publish. You can publish it manually from the course page.',
          'info',
          6000
        )
        router.push(`/partner-training-setup/course/${courseId}`)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <GradientPageBackground>
      <div className='flex min-h-screen w-full flex-col bg-white dark:bg-transparent'>
        {/* Stepper Header */}
        <div className='w-full  px-8'>
          <div className='flex w-full items-center justify-between gap-[20px]'>
            {STEPS.map((step) => {
              const Icon = step.icon
              const isActive = step.id === currentStep
              const isCompleted = step.id < currentStep

              return (
                <div
                  key={step.id}
                  className='relative flex flex-1 flex-col items-center gap-4 pt-6'
                >
                  <div
                    className={cn(
                      'flex items-center gap-2 text-sm font-medium transition-colors duration-200',
                      isActive || isCompleted
                        ? 'text-[#3E50F7]'
                        : 'text-gray-500 dark:text-white'
                    )}
                  >
                    <Icon size={20} />
                    <span>{step.title}</span>
                  </div>

                  {/* Progress Line */}
                  <div
                    className={cn(
                      'h-1 w-full rounded-full transition-all duration-300',
                      isActive || isCompleted ? 'bg-[#3E50F7]' : 'bg-[#E4E7EE]'
                    )}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className='flex-1 p-8'>
          {currentStep === 1 && (
            <>
              <CourseDetailsStep
                data={courseData}
                updateData={(updates) =>
                  setCourseData((prev) => ({ ...prev, ...updates }))
                }
                onLabelsChange={setAvailableLabels}
              />
            </>
          )}

          {currentStep === 2 && (
            <>
              <CreateLearningPathStep
                data={courseData}
                updateData={(updates) =>
                  setCourseData((prev) => ({ ...prev, ...updates }))
                }
                courseId={courseId}
              />
            </>
          )}

          {currentStep === 3 && (
            <AssignmentRulesStep
              data={courseData}
              updateData={(updates) =>
                setCourseData((prev) => ({ ...prev, ...updates }))
              }
              courseId={courseId}
            />
          )}

          {currentStep === 4 && (
            <SetStagesStep
              data={courseData}
              updateData={(updates) =>
                setCourseData((prev) => ({ ...prev, ...updates }))
              }
              courseId={courseId}
            />
          )}

          {/* Footer Actions */}
        </div>
        <div className='sticky bottom-0 mt-auto flex w-full items-center justify-end gap-3 border-t border-gray-200 bg-white px-8 py-4 dark:border-border dark:bg-card'>
          <button
            onClick={() => {
              if (currentStep > 1) {
                const prevStep = currentStep - 1
                setCurrentStep(prevStep)

                // Update URL params
                if (courseId) {
                  const params = new URLSearchParams()
                  params.set('courseId', courseId.toString())
                  params.set('step', prevStep.toString())
                  router.push(`?${params.toString()}`, { scroll: false })
                }
              } else {
                // Cancel action
              }
            }}
            className='flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-border dark:bg-white/5 dark:text-white'
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
            {currentStep === 1 && (
              <X size={16} className='text-gray-400 dark:text-white' />
            )}
          </button>
          <button
            onClick={handleNext}
            disabled={isSubmitting}
            className='flex items-center gap-2 rounded-lg bg-[#3E50F7] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isSubmitting
              ? 'Creating...'
              : currentStep === 4
                ? 'Finish'
                : 'Next'}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </GradientPageBackground>
  )
}

export default AddCoursePage
