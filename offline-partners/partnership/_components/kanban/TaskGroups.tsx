'use client'

import { useEffect, useState } from 'react'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { IconPlus } from '@tabler/icons-react'

import TaskCard from './TaskCard'
import TaskColumn from './TaskColumn'
import { Task, TaskColumn as TaskColumnType, TaskStatus } from './types'

interface TaskGroupsProps {
  // This board is reused in multiple places; some callers pass "Task" (kanban type),
  // others pass API-shaped tasks (e.g. my-partner tasks). Normalize at runtime.
  tasks?: Array<Task | any>
  isLoading?: boolean
  onCreateTask?: () => void
  onUpdateTaskStatus?: (taskId: string, newStatus: TaskStatus) => Promise<void>
  onDeleteTask?: (taskId: string) => Promise<void>
  columns?: TaskColumnType[]
  emptyPlaceholder?: string
}

const normalizeStatus = (status: unknown): TaskStatus | null => {
  if (!status) return null
  if (
    status === 'todo' ||
    status === 'in_progress' ||
    status === 'completed' ||
    status === 'cancelled'
  ) {
    return status
  }

  const s = String(status).trim().toLowerCase()
  switch (s) {
    case 'not started':
      return 'todo'
    case 'in progress':
    case 'on track':
    case 'at risk':
    case 'delayed':
    case 'paused':
    case 'blocked':
      return 'in_progress'
    case 'completed':
      return 'completed'
    case 'cancelled':
    case 'canceled':
      return 'cancelled'
    default:
      return null
  }
}

const normalizeTask = (task: any): Task | null => {
  const normalizedStatus = normalizeStatus(task?.status)
  if (!normalizedStatus) return null

  // Keep other properties as-is to avoid breaking consumers that rely on them,
  // but ensure id/status are compatible with the kanban board internals.
  return {
    ...(task ?? {}),
    id: String(task?.id),
    status: normalizedStatus
  } as Task
}

// Initialize columns with tasks
const initializeColumnsWithTasks = (
  tasks: Array<Task | any>
): TaskColumnType[] => {
  const columnStructure: TaskColumnType[] = [
    {
      id: 'todo',
      title: 'To do',
      color: '#94A3B8',
      tasks: []
    },
    {
      id: 'in_progress',
      title: 'In progress',
      color: '#3B82F6',
      tasks: []
    },
    {
      id: 'completed',
      title: 'Completed',
      color: '#10B981',
      tasks: []
    },
    {
      id: 'cancelled',
      title: 'Cancelled',
      color: '#EF4444',
      tasks: []
    }
  ]

  // Group tasks by status
  tasks.forEach((task) => {
    const normalizedTask = normalizeTask(task)
    if (!normalizedTask) return

    const column = columnStructure.find(
      (col) => col.id === normalizedTask.status
    )
    if (column) {
      column.tasks.push(normalizedTask)
    }
  })

  return columnStructure
}

const TaskGroups: React.FC<TaskGroupsProps> = ({
  tasks = [],
  isLoading = false,
  onCreateTask,
  onUpdateTaskStatus,
  onDeleteTask,
  columns: propColumns,
  emptyPlaceholder
}) => {
  // Always initialize with API tasks (even if empty) - never use dummy data
  const [columns, setColumns] = useState<TaskColumnType[]>(
    () => propColumns || initializeColumnsWithTasks(tasks)
  )
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Update columns when tasks or propColumns change (always use API data, even if empty)
  useEffect(() => {
    if (propColumns) {
      setColumns(propColumns)
    } else {
      setColumns(initializeColumnsWithTasks(tasks))
    }
  }, [tasks, propColumns])

  console.log('columns', columns)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8
      }
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const activeColumnId = active.data.current?.columnId
    const activeColumn = columns.find((col) => col.id === activeColumnId)
    const task = activeColumn?.tasks.find((task) => task.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    console.log('handleDragEnd called:', { active: active.id, over: over?.id })

    if (!over) {
      console.log('No over target, cancelling drag')
      setActiveTask(null)
      return
    }

    // Get column IDs from different possible sources
    const activeColumnId = active.data.current?.columnId
    // Check if over is a column (droppable) or a task (sortable)
    const overColumnId =
      over.data.current?.columnId || // From sortable task
      (over.data.current?.type === 'column' ? over.id : null) || // From droppable column
      over.id // Fallback to over.id

    console.log('Column IDs:', {
      activeColumnId,
      overColumnId,
      overData: over.data.current,
      overId: over.id
    })

    if (!activeColumnId || !overColumnId) {
      console.log('Missing column IDs, cancelling drag')
      setActiveTask(null)
      return
    }

    const activeColumn = columns.find((col) => col.id === activeColumnId)
    const overColumn = columns.find((col) => col.id === overColumnId)

    if (!activeColumn || !overColumn) {
      setActiveTask(null)
      return
    }

    if (activeColumnId !== overColumnId) {
      console.log('Moving task between different columns')
      const activeTaskIndex = activeColumn.tasks.findIndex(
        (task) => task.id === active.id
      )
      const activeTask = activeColumn.tasks[activeTaskIndex]

      console.log('Active task found:', { activeTask, activeTaskIndex })

      if (activeTask) {
        const updatedTask = {
          ...activeTask,
          status: overColumnId as any
        }

        setColumns((prevColumns) => {
          return prevColumns.map((col) => {
            if (col.id === activeColumnId) {
              return {
                ...col,
                tasks: col.tasks.filter((task) => task.id !== active.id)
              }
            }
            if (col.id === overColumnId) {
              const newTasks = [...col.tasks]

              // Check if we dropped on a specific task (for reordering)
              // or directly on the column (for empty columns or appending)
              const isDroppedOnColumn = over.data.current?.type === 'column'
              const overTaskIndex = isDroppedOnColumn
                ? -1
                : col.tasks.findIndex((task) => task.id === over.id)

              if (overTaskIndex !== -1) {
                // Dropped on a specific task - insert before it
                newTasks.splice(overTaskIndex, 0, updatedTask)
              } else {
                // Dropped on empty column or empty space - append to end
                newTasks.push(updatedTask)
              }

              return {
                ...col,
                tasks: newTasks
              }
            }
            return col
          })
        })

        const validStatuses: TaskStatus[] = [
          'todo',
          'in_progress',
          'completed',
          'cancelled'
        ]

        if (
          onUpdateTaskStatus &&
          validStatuses.includes(overColumnId as TaskStatus)
        ) {
          console.log('Calling onUpdateTaskStatus:', {
            taskId: activeTask.id,
            newStatus: overColumnId,
            activeColumnId,
            overColumnId
          })
          try {
            await onUpdateTaskStatus(activeTask.id, overColumnId as TaskStatus)
            console.log('onUpdateTaskStatus completed successfully')
          } catch (error) {
            console.error('Failed to update task status:', error)
            setColumns((prevColumns) => {
              return prevColumns.map((col) => {
                if (col.id === overColumnId) {
                  return {
                    ...col,
                    tasks: col.tasks.filter((task) => task.id !== active.id)
                  }
                }
                if (col.id === activeColumnId) {
                  const originalIndex = activeColumn.tasks.findIndex(
                    (task) => task.id === active.id
                  )
                  const newTasks = [...col.tasks]
                  newTasks.splice(originalIndex, 0, activeTask)
                  return {
                    ...col,
                    tasks: newTasks
                  }
                }
                return col
              })
            })
          }
        }
      }
    } else {
      const overTaskIndex = overColumn.tasks.findIndex(
        (task) => task.id === over.id
      )
      const activeTaskIndex = activeColumn.tasks.findIndex(
        (task) => task.id === active.id
      )

      if (activeTaskIndex !== -1 && overTaskIndex !== -1) {
        setColumns((prevColumns) => {
          return prevColumns.map((col) => {
            if (col.id === activeColumnId) {
              return {
                ...col,
                tasks: arrayMove(col.tasks, activeTaskIndex, overTaskIndex)
              }
            }
            return col
          })
        })
      }
    }

    setActiveTask(null)
  }

  const handleAddTaskToColumn = (columnId: string) => {
    if (onCreateTask) {
      onCreateTask()
    }
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-text-60'>Loading tasks...</div>
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='flex w-full flex-row flex-nowrap gap-4 overflow-x-auto pb-4'>
        {columns.map((column) => (
          <div
            key={column.id}
            className='flex max-h-[70vh] w-[320px] shrink-0 flex-col rounded-lg bg-gray-50 p-3'
          >
            <div className='mb-3 flex shrink-0 items-center justify-between'>
              <div className='flex min-w-0 items-center gap-2'>
                <div
                  className='h-6 w-1 shrink-0 rounded-full'
                  style={{ backgroundColor: column.color }}
                />
                <h2 className='truncate text-base font-semibold text-text-100'>
                  {column.title}
                </h2>
                <span className='shrink-0 text-base font-semibold text-text-60'>
                  ({column.tasks.length})
                </span>
              </div>
              {onCreateTask && (
                <button
                  onClick={() => handleAddTaskToColumn(column.id)}
                  className='shrink-0 rounded-md p-1 transition-colors hover:bg-gray-200'
                >
                  <IconPlus size={20} className='text-gray-600' />
                </button>
              )}
            </div>

            <SortableContext
              items={column.tasks.map((task) => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <TaskColumn
                columnId={column.id}
                tasks={column.tasks}
                onAddTask={
                  onCreateTask
                    ? () => handleAddTaskToColumn(column.id)
                    : undefined
                }
                emptyPlaceholder={emptyPlaceholder}
              />
            </SortableContext>
          </div>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}

export default TaskGroups
