'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CheckCircle2, FileText, GripVertical } from 'lucide-react'

import { CourseData } from './CourseDetailsStep'

// API Response Types
interface Stage {
  stageId: number
  title: string
  type: 'CONTENT' | 'QUIZ'
  order: number
}

interface SetStagesStepProps {
  data: CourseData
  updateData: (updates: Partial<CourseData>) => void
  courseId: number | null
}

// Sortable Stage Item Component
const SortableStageItem = ({
  stage,
  index
}: {
  stage: Stage
  index: number
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: stage.stageId.toString() })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='flex items-center gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-border dark:bg-card'
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className='cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing dark:text-white dark:text-white'
      >
        <GripVertical size={20} />
      </div>

      {/* Order Number */}
      <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-white/10 dark:text-white'>
        {index + 1}
      </div>

      {/* Stage Info */}
      <div className='flex flex-1 items-center gap-3'>
        <div className='flex items-center gap-2'>
          {stage.type === 'QUIZ' ? (
            <CheckCircle2 size={18} className='text-blue-600' />
          ) : (
            <FileText size={18} className='text-gray-600 dark:text-white' />
          )}
          <span className='font-medium text-gray-900 dark:text-white'>
            {stage.title}
          </span>
        </div>
        <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-white/10 dark:text-white'>
          {stage.type}
        </span>
      </div>
    </div>
  )
}

const SetStagesStep = ({ data, updateData, courseId }: SetStagesStepProps) => {
  const [stages, setStages] = useState<Stage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isReordering, setIsReordering] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const fetchStages = useCallback(async () => {
    if (!courseId) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/partner/training/courses/${courseId}/stages`
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to fetch stages')
      }

      const result = await response.json()

      if (result.success && result.data) {
        // Sort stages by order
        const sortedStages = [...result.data].sort(
          (a: Stage, b: Stage) => a.order - b.order
        )
        setStages(sortedStages)
      } else {
        setStages([])
      }
    } catch (err) {
      console.error('Error fetching stages:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch stages')
      setStages([])
    } finally {
      setIsLoading(false)
    }
  }, [courseId])

  // Fetch stages on component load
  useEffect(() => {
    if (courseId) {
      fetchStages()
    }
  }, [courseId, fetchStages])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id) {
      return
    }

    const oldIndex = stages.findIndex(
      (stage) => stage.stageId.toString() === active.id
    )
    const newIndex = stages.findIndex(
      (stage) => stage.stageId.toString() === over.id
    )

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // Update local state immediately for better UX
    const newStages = arrayMove(stages, oldIndex, newIndex)
    setStages(newStages)

    // Call reorder API
    await reorderStages(newStages)
  }

  const reorderStages = async (reorderedStages: Stage[]) => {
    if (!courseId) return

    setIsReordering(true)
    setError(null)

    try {
      const stageIds = reorderedStages.map((stage) => stage.stageId)

      const response = await fetch(
        `/api/partner/training/courses/${courseId}/stages/reorder`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ stageIds })
        }
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || 'Failed to reorder stages')
      }

      const result = await response.json()

      if (result.success) {
        // Refetch stages to get the updated order from the server
        await fetchStages()
      } else {
        throw new Error('Failed to reorder stages')
      }
    } catch (err) {
      console.error('Error reordering stages:', err)
      setError(err instanceof Error ? err.message : 'Failed to reorder stages')
      // Revert to original order on error
      await fetchStages()
    } finally {
      setIsReordering(false)
    }
  }

  if (!courseId) {
    return (
      <div className='mx-auto w-full max-w-[800px]'>
        <div className='rounded-xl border border-gray-200 bg-white p-8 text-center text-gray-500 dark:border-border dark:bg-card dark:text-white'>
          Course ID is required. Please complete step 1 first.
        </div>
      </div>
    )
  }

  return (
    <div className='mx-auto w-full max-w-[800px]'>
      <div className='mb-8'>
        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
          Set Stages of the course
        </h2>
        <p className='mt-2 text-gray-500 dark:text-white'>
          Drag and drop to reorder the stages. The order will be saved
          automatically.
        </p>
      </div>

      {error && (
        <div className='mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600'>
          {error}
        </div>
      )}

      <div className='rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-border dark:bg-card'>
        {isLoading ? (
          <div className='flex items-center justify-center py-12 text-gray-500 dark:text-white'>
            Loading stages...
          </div>
        ) : stages.length === 0 ? (
          <div className='flex items-center justify-center py-12 text-gray-500 dark:text-white'>
            No stages found. Please add stages in step 2.
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stages.map((stage) => stage.stageId.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className='flex flex-col gap-3'>
                {stages.map((stage, index) => (
                  <SortableStageItem
                    key={stage.stageId}
                    stage={stage}
                    index={index}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {isReordering && (
          <div className='mt-4 text-center text-sm text-gray-500 dark:text-white'>
            Saving new order...
          </div>
        )}
      </div>
    </div>
  )
}

export default SetStagesStep
