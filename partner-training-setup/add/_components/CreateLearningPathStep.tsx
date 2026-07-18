'use client'

import React, { useEffect, useState } from 'react'
import { getCookie } from 'cookies-next'
import {
  CheckCircle2,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2
} from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { CourseData } from './CourseDetailsStep'
import StageContentEditor, { ContentStageData } from './StageContentEditor'
import StageQuizEditor, { QuizStageData } from './StageQuizEditor'

// --- Types ---
export interface LearningPathStage {
  id: string
  title: string
  type: string
  order: number
  contentCreated?: boolean
  contentData?: ContentStageData
  quizData?: QuizStageData
}

interface CreateLearningPathStepProps {
  data: CourseData
  updateData: (updates: Partial<CourseData>) => void
  courseId: number | null
}

const CreateLearningPathStep = ({
  data,
  updateData,
  courseId
}: CreateLearningPathStepProps) => {
  const [activeStageId, setActiveStageId] = useState<string | null>(null)
  const [isCreatingStage, setIsCreatingStage] = useState(false)
  const [stageError, setStageError] = useState<string | null>(null)
  const [isLoadingStageData, setIsLoadingStageData] = useState(false)
  const [savedStages, setSavedStages] = useState<Set<string>>(new Set()) // Track which stages have been saved
  const [isAddStageDialogOpen, setIsAddStageDialogOpen] = useState(false)
  const [newStageTitle, setNewStageTitle] = useState('')
  const [newStageType, setNewStageType] = useState<'Content' | 'Quiz'>(
    'Content'
  )
  const [isLoadingStages, setIsLoadingStages] = useState(false)
  const [isSavingStage, setIsSavingStage] = useState(false)
  const [isDeletingStage, setIsDeletingStage] = useState(false)

  // Initialize stages if not present
  const stages = (data.learningPath || []) as LearningPathStage[]

  // Helper function to get auth headers
  const getAuthHeaders = () => {
    const token = getCookie('accessToken')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    }
  }

  const activeStage = stages.find((s) => s.id === activeStageId)

  // Fetch stages on mount
  useEffect(() => {
    if (courseId) {
      fetchStages()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId])

  const fetchStages = async () => {
    if (!courseId) return

    setIsLoadingStages(true)
    try {
      const response = await fetch(
        `/api/partner/training/courses/${courseId}/stages`,
        {
          headers: getAuthHeaders()
        }
      )

      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          // Transform API response to component format
          const apiStages: LearningPathStage[] = result.data.map(
            (stage: any) => ({
              id: stage.stageId.toString(),
              title: stage.title,
              type: stage.type === 'CONTENT' ? 'Content' : 'Quiz',
              order: stage.order,
              contentCreated: stage.contentCreated || false
            })
          )
          updateData({ learningPath: apiStages })
        }
      }
    } catch (error) {
      console.error('Error fetching stages:', error)
      // Don't show error, just log it
    } finally {
      setIsLoadingStages(false)
    }
  }

  // Fetch stage data when a stage is selected
  useEffect(() => {
    if (activeStageId && courseId) {
      const stage = stages.find((s) => s.id === activeStageId)
      if (!stage) return

      const stageId = parseInt(stage.id, 10)
      if (isNaN(stageId)) return

      // Only fetch if contentCreated is true and we don't already have the data
      if (stage.contentCreated) {
        if (
          (stage.type === 'Content' && !stage.contentData) ||
          (stage.type === 'Quiz' && !stage.quizData)
        ) {
          fetchStageData(stageId, stage.type)
        }
      }
    }
  }, [activeStageId, courseId])

  const fetchStageData = async (stageId: number, stageType: string) => {
    setIsLoadingStageData(true)
    setStageError(null)

    try {
      if (stageType === 'Content') {
        const response = await fetch(
          `/api/partner/training/courses/stages/${stageId}/content`,
          {
            headers: getAuthHeaders()
          }
        )

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Transform API response to component format
            // Map all fields from the API response
            const contentData: ContentStageData = {
              chapterTitle: result.data.chapterTitle || '',
              contentType: result.data.contentType || 'VIDEO',
              driveLink: result.data.driveLink || '',
              documentLink: result.data.documentLink || '',
              content: result.data.content || '',
              thumbnailUrl: result.data.thumbnailUrl || ''
            }

            const updatedStages = stages.map((s) =>
              s.id === stageId.toString() ? { ...s, contentData } : s
            )
            updateData({ learningPath: updatedStages })
            setSavedStages((prev) => new Set(prev).add(stageId.toString()))
          }
        } else {
          // Check if it's a "not found" error (404 or 500 with "not found" message)
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.errorMessage || errorData.message || ''
          const isNotFound =
            response.status === 404 ||
            (response.status === 500 &&
              (errorMessage.includes('not found') ||
                errorMessage.includes('Not found')))

          if (!isNotFound) {
            // Only throw error if it's not a "not found" scenario
            throw new Error(errorMessage || 'Failed to fetch content')
          }
          // Otherwise, silently ignore (no data yet)
        }
      } else if (stageType === 'Quiz') {
        const response = await fetch(
          `/api/partner/training/courses/stages/${stageId}/quiz`,
          {
            headers: getAuthHeaders()
          }
        )

        if (response.ok) {
          const result = await response.json()
          if (result.success && result.data) {
            // Transform API response to component format
            const firstQuestion = result.data.questions?.[0]
            if (firstQuestion) {
              // Note: GET API doesn't return correctAnswer, so we set all as false
              // User will need to set the correct answer when editing
              const quizData: QuizStageData = {
                question: firstQuestion.question || '',
                choices: (firstQuestion.options || []).map(
                  (option: string, index: number) => ({
                    id: (index + 1).toString(),
                    text: option,
                    isCorrect: false // GET API doesn't return correctAnswer
                  })
                )
              }

              const updatedStages = stages.map((s) =>
                s.id === stageId.toString() ? { ...s, quizData } : s
              )
              updateData({ learningPath: updatedStages })
              setSavedStages((prev) => new Set(prev).add(stageId.toString()))
            }
          }
        } else {
          // Check if it's a "not found" error (404 or 500 with "not found" message)
          const errorData = await response.json().catch(() => ({}))
          const errorMessage = errorData.errorMessage || errorData.message || ''
          const isNotFound =
            response.status === 404 ||
            (response.status === 500 &&
              (errorMessage.includes('not found') ||
                errorMessage.includes('Not found') ||
                errorMessage.includes('Quiz not found')))

          if (!isNotFound) {
            // Only throw error if it's not a "not found" scenario
            throw new Error(errorMessage || 'Failed to fetch quiz')
          }
          // Otherwise, silently ignore (no data yet)
        }
      }
    } catch (error) {
      console.error('Error fetching stage data:', error)
      // Don't show error for "not found" scenarios (no data yet)
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to fetch stage data'
      const isNotFound =
        errorMessage.includes('not found') ||
        errorMessage.includes('Not found') ||
        errorMessage.includes('Stage content not found') ||
        errorMessage.includes('Quiz not found')

      if (!isNotFound) {
        // Only show error if it's not a "not found" scenario
        setStageError(errorMessage)
      }
      // Otherwise, silently ignore (no data yet)
    } finally {
      setIsLoadingStageData(false)
    }
  }

  const handleTypeChange = async (value: string) => {
    if (!activeStageId || !courseId) return

    const stage = stages.find((s) => s.id === activeStageId)
    if (!stage) return

    // Map type to API format
    const typeMap: Record<string, string> = {
      Content: 'CONTENT',
      Quiz: 'QUIZ'
    }

    const apiType = typeMap[value] || value.toUpperCase()

    // Update locally first for immediate UI feedback
    const updatedStages = stages.map((s) =>
      s.id === activeStageId ? { ...s, type: value } : s
    )
    updateData({ learningPath: updatedStages })

    // TODO: If stage has API ID, update via PUT/PATCH API
    // For now, we'll just update locally since the API might need a separate update endpoint
  }

  const handleSaveStageData = async (data: Partial<LearningPathStage>) => {
    if (!activeStageId) {
      setStageError('No stage selected')
      return
    }

    const stage = stages.find((s) => s.id === activeStageId)
    if (!stage) {
      setStageError('Stage not found')
      return
    }

    // Update locally first
    const updatedStages = stages.map((s) =>
      s.id === activeStageId ? { ...s, ...data } : s
    )
    updateData({ learningPath: updatedStages })

    // Save to API if stage has API ID and data is available
    const stageId = parseInt(stage.id, 10)
    if (isNaN(stageId)) {
      setStageError('Invalid stage ID')
      return
    }

    if (!stage.type) {
      setStageError('Stage type is required')
      return
    }

    setIsSavingStage(true)
    setStageError(null)

    try {
      if (stage.type === 'Content' && data.contentData) {
        await saveContentStage(stageId, data.contentData)
        // Mark content as created and update local state
        const updatedStages = stages.map((s) =>
          s.id === activeStageId ? { ...s, ...data, contentCreated: true } : s
        )
        updateData({ learningPath: updatedStages })
        setSavedStages((prev) => new Set(prev).add(stageId.toString()))
      } else if (stage.type === 'Quiz' && data.quizData) {
        await saveQuizStage(stageId, stage.title, data.quizData)
        // Mark content as created and update local state
        const updatedStages = stages.map((s) =>
          s.id === activeStageId ? { ...s, ...data, contentCreated: true } : s
        )
        updateData({ learningPath: updatedStages })
        setSavedStages((prev) => new Set(prev).add(stageId.toString()))
      } else {
        throw new Error('No data to save')
      }
    } catch (error) {
      console.error('Error saving stage data to API:', error)
      setStageError(
        error instanceof Error ? error.message : 'Failed to save stage data'
      )
      throw error // Re-throw to let the editor know save failed
    } finally {
      setIsSavingStage(false)
    }
  }

  const saveContentStage = async (
    stageId: number,
    contentData: ContentStageData
  ) => {
    const response = await fetch(
      `/api/partner/training/courses/stages/${stageId}/content`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          content: contentData.content || '',
          contentType: contentData.contentType || 'VIDEO',
          driveLink: contentData.driveLink || '',
          documentLink: contentData.documentLink || '',
          chapterTitle: contentData.chapterTitle || '',
          thumbnailUrl: contentData.thumbnailUrl || '',
          imageUrls: [] // Images removed from UI, but API still requires this field
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to save content')
    }

    return response.json()
  }

  const saveQuizStage = async (
    stageId: number,
    stageTitle: string,
    quizData: QuizStageData
  ) => {
    // Transform quiz data to API format
    const questions = [
      {
        question: quizData.question || '',
        options: quizData.choices
          .filter((c) => c.text.trim())
          .map((c) => c.text.trim()),
        correctAnswer:
          quizData.choices.find((c) => c.isCorrect)?.text.trim() || ''
      }
    ]

    const response = await fetch(
      `/api/partner/training/courses/stages/${stageId}/quiz`,
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: stageTitle || 'Quiz',
          questions
        })
      }
    )

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to save quiz')
    }

    return response.json()
  }

  const handleAddStage = () => {
    if (!courseId) {
      setStageError('Course ID is required. Please complete step 1 first.')
      return
    }
    setIsAddStageDialogOpen(true)
    setNewStageTitle('')
    setNewStageType('Content')
  }

  const handleCreateStage = async () => {
    if (!courseId) {
      setStageError('Course ID is required. Please complete step 1 first.')
      return
    }

    if (!newStageTitle.trim()) {
      setStageError('Stage title is required')
      return
    }

    setIsCreatingStage(true)
    setStageError(null)

    try {
      // Map type to API format
      const typeMap: Record<string, string> = {
        Content: 'CONTENT',
        Quiz: 'QUIZ'
      }

      const payload = {
        title: newStageTitle.trim(),
        type: typeMap[newStageType] || 'CONTENT'
      }

      const response = await fetch(
        `/api/partner/training/courses/${courseId}/stages`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload)
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to create stage')
      }

      const result = await response.json()

      if (result.success && result.data) {
        // Create new stage with API response data
        const newStage: LearningPathStage = {
          id: result.data.id.toString(), // Store API stage ID
          title: result.data.title,
          type: result.data.type === 'CONTENT' ? 'Content' : 'Quiz',
          order: result.data.stageOrder || stages.length + 1
        }
        const updatedStages = [...stages, newStage]
        updateData({ learningPath: updatedStages })
        setActiveStageId(newStage.id)

        // Close dialog and reset form
        setIsAddStageDialogOpen(false)
        setNewStageTitle('')
        setNewStageType('Content')

        // Refetch stages to ensure we have the latest data
        await fetchStages()
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error) {
      console.error('Error creating stage:', error)
      setStageError(
        error instanceof Error ? error.message : 'Failed to create stage'
      )
    } finally {
      setIsCreatingStage(false)
    }
  }

  const handleDeleteStage = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    // Parse stage ID to number
    const stageId = parseInt(id, 10)
    if (isNaN(stageId)) {
      setStageError('Invalid stage ID')
      return
    }

    setIsDeletingStage(true)
    setStageError(null)

    try {
      const response = await fetch(
        `/api/partner/training/course/stages/${stageId}`,
        {
          method: 'DELETE',
          headers: getAuthHeaders()
        }
      )

      const result = await response.json()

      if (result.success) {
        // Remove from local state
        const updatedStages = stages
          .filter((s) => s.id !== id)
          .map((s, index) => ({ ...s, order: index + 1 })) // Re-order
        updateData({ learningPath: updatedStages })

        if (activeStageId === id) {
          setActiveStageId(null)
        }
      } else {
        throw new Error(result.message || 'Failed to delete stage')
      }
    } catch (error) {
      console.error('Error deleting stage:', error)
      setStageError(
        error instanceof Error ? error.message : 'Failed to delete stage'
      )
    } finally {
      setIsDeletingStage(false)
    }
  }

  return (
    <div className='mx-auto w-full max-w-[1000px]'>
      <div className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
          Set Stages of the course
        </h2>
        <p className='mt-2 text-gray-500 dark:text-white'>
          Here you can manage the course stages, add new modules, and organize
          content for optimal learning.
        </p>
        {stageError && (
          <div className='mt-4 rounded-md bg-red-50 p-3 text-sm text-red-600'>
            {stageError}
          </div>
        )}
        {!courseId && (
          <div className='mt-4 rounded-md bg-yellow-50 p-3 text-sm text-yellow-600'>
            Please complete step 1 to create a course first.
          </div>
        )}
      </div>

      <div className='flex min-h-[500px] gap-6 rounded-[20px] bg-[#F7F8FB] p-4'>
        {/* Sidebar */}
        <div className='w-[280px] shrink-0'>
          <div className='mb-4 flex items-center justify-between px-2'>
            <h3 className='font-bold text-gray-900 dark:text-white'>Stages</h3>
            <Button
              size='icon'
              variant='ghost'
              className='h-8 w-8 rounded-full bg-white shadow-sm hover:bg-gray-50 dark:bg-card dark:bg-white/5'
              onClick={handleAddStage}
              disabled={isCreatingStage || !courseId}
            >
              <Plus size={16} />
            </Button>
          </div>

          <div className='flex flex-col gap-3'>
            {stages.map((stage) => (
              <div
                key={stage.id}
                onClick={() => setActiveStageId(stage.id)}
                className={cn(
                  'group relative flex w-full cursor-pointer flex-col gap-2 rounded-xl border p-4 transition-all',
                  activeStageId === stage.id
                    ? 'border-[#3E50F7] bg-white ring-1 ring-[#3E50F7] dark:bg-card'
                    : 'border-transparent bg-white hover:border-gray-200 dark:border-border dark:bg-card'
                )}
              >
                <div className='flex items-start gap-3'>
                  <span
                    className={cn(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded bg-gray-100 text-xs font-bold text-gray-500 dark:bg-white/10 dark:text-white',
                      activeStageId === stage.id && 'bg-blue-50 text-blue-600'
                    )}
                  >
                    {stage.order}
                  </span>
                  <p className='line-clamp-2 text-sm font-medium leading-snug text-gray-700 dark:text-white'>
                    {stage.title}
                  </p>
                </div>

                <div className='flex items-center justify-between pl-[36px]'>
                  <div className='flex items-center gap-1.5 rounded bg-gray-50 px-2 py-1 text-xs text-gray-500 dark:bg-white/5 dark:text-white'>
                    <FileText size={12} />
                    {stage.type}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button className='flex h-6 w-6 items-center justify-center rounded-full text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 group-hover:opacity-100 dark:bg-white/10 dark:text-white'>
                        <MoreHorizontal size={14} />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        className='text-red-600'
                        onClick={(e) => handleDeleteStage(stage.id, e as any)}
                        disabled={isDeletingStage}
                      >
                        <Trash2 className='mr-2 h-4 w-4' />
                        {isDeletingStage ? 'Deleting...' : 'Delete'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {stages.length === 0 && (
              <div className='flex flex-col items-center justify-center py-10 text-center text-sm text-gray-400 dark:text-white'>
                <p>No stages yet</p>
                <Button
                  variant='link'
                  onClick={handleAddStage}
                  disabled={
                    isCreatingStage ||
                    !courseId ||
                    stages.some((s) => s.contentCreated === true)
                  }
                >
                  {isCreatingStage ? 'Creating...' : '+ Add one'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Right Content Area */}
        <div className='flex-1 rounded-xl bg-white p-6 shadow-sm dark:bg-card'>
          {activeStageId ? (
            <div className='flex h-full flex-col'>
              {/* Header */}
              <div className='mb-6 flex items-center justify-between border-b border-gray-100 pb-4'>
                <div className='flex items-center gap-4'></div>

                <div className='flex items-center gap-2'>
                  {/* <Button
                    variant='outline'
                    className='h-9 rounded-full px-4 text-gray-600 dark:text-white hover:bg-gray-50 dark:bg-white/5'
                  >
                    <Eye size={16} className='mr-2' />
                    View Preview
                  </Button> */}
                  {/* <Button
                    variant='ghost'
                    size='icon'
                    className='h-9 w-9 rounded-full text-gray-400 dark:text-white hover:bg-gray-100 dark:bg-white/10'
                  >
                    <MoreHorizontal size={18} />
                  </Button> */}
                </div>
              </div>

              {/* Editor */}
              <div className='flex-1'>
                {isLoadingStageData ? (
                  <div className='flex h-full items-center justify-center text-gray-400 dark:text-white'>
                    Loading stage data...
                  </div>
                ) : (
                  <>
                    {activeStage?.type === 'Content' && (
                      <StageContentEditor
                        key={activeStage.id} // Re-mount on stage switch
                        initialData={activeStage.contentData}
                        onSave={async (data) => {
                          try {
                            await handleSaveStageData({ contentData: data })
                          } catch (error) {
                            // Error is already handled in handleSaveStageData
                            console.error('Failed to save content:', error)
                          }
                        }}
                        isSaving={isSavingStage}
                        contentCreated={activeStage?.contentCreated}
                      />
                    )}
                    {activeStage?.type === 'Quiz' && (
                      <StageQuizEditor
                        key={activeStage.id}
                        initialData={activeStage.quizData}
                        onSave={async (data) => {
                          try {
                            await handleSaveStageData({ quizData: data })
                          } catch (error) {
                            // Error is already handled in handleSaveStageData
                            console.error('Failed to save quiz:', error)
                          }
                        }}
                        isSaving={isSavingStage}
                        contentCreated={activeStage?.contentCreated}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className='flex h-full flex-col items-center justify-center text-gray-400 dark:text-white'>
              Select or create a stage to edit content
            </div>
          )}
        </div>
      </div>

      {/* Add Stage Dialog */}
      <Dialog
        open={isAddStageDialogOpen}
        onOpenChange={setIsAddStageDialogOpen}
      >
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Add New Stage</DialogTitle>
          </DialogHeader>
          <div className='space-y-4 py-4'>
            <div className='space-y-2'>
              <Label htmlFor='stage-title'>
                What is the goal of this stage
              </Label>
              <Input
                id='stage-title'
                placeholder='Enter stage title'
                value={newStageTitle}
                onChange={(e) => {
                  setNewStageTitle(e.target.value)
                  setStageError(null)
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    !isCreatingStage &&
                    newStageTitle.trim()
                  ) {
                    handleCreateStage()
                  }
                }}
                autoFocus
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='stage-type'>Stage Type</Label>
              <Select
                value={newStageType}
                onValueChange={(value: 'Content' | 'Quiz') => {
                  setNewStageType(value)
                  setStageError(null)
                }}
              >
                <SelectTrigger id='stage-type'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Content'>Content</SelectItem>
                  <SelectItem value='Quiz'>Quiz</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {stageError && (
              <div className='rounded-md bg-red-50 p-3 text-sm text-red-600'>
                {stageError}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant='outline'
              onClick={() => {
                setIsAddStageDialogOpen(false)
                setNewStageTitle('')
                setNewStageType('Content')
                setStageError(null)
              }}
              disabled={isCreatingStage}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateStage}
              disabled={isCreatingStage || !newStageTitle.trim()}
              className='bg-[#3E50F7] text-white hover:bg-blue-700'
            >
              {isCreatingStage ? 'Creating...' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateLearningPathStep
