'use client'

import { useDroppable } from '@dnd-kit/core'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconPlus } from '@tabler/icons-react'

import TaskCard from './TaskCard'
import { Task, TaskStatus } from './types'

interface TaskColumnProps {
  columnId: string
  tasks: Task[]
  onAddTask?: () => void
  emptyPlaceholder?: string
}

const SortableTaskCard: React.FC<{ task: Task; columnId: string }> = ({
  task,
  columnId
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task.id,
    data: {
      columnId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  )
}

const TaskColumn: React.FC<TaskColumnProps> = ({
  columnId,
  tasks,
  onAddTask,
  emptyPlaceholder
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: columnId,
    data: {
      columnId,
      type: 'column'
    }
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-0 flex-1 flex-col gap-2 rounded-lg transition-colors ${
        isOver ? 'bg-blue-50' : ''
      }`}
    >
      <div className='min-h-0 flex-1 space-y-2 overflow-y-auto pb-2 pr-1'>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} columnId={columnId} />
          ))
        ) : (
          <div className='flex h-full items-center justify-center py-8 text-sm text-gray-400'>
            {emptyPlaceholder || 'Drop tasks here'}
          </div>
        )}
      </div>

      {onAddTask && (
        <button
          onClick={onAddTask}
          className='mt-auto flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-gray-200 py-2 text-sm font-extrabold text-gray-600 transition-colors hover:bg-gray-300'
        >
          <IconPlus size={18} stroke={3} />
        </button>
      )}
    </div>
  )
}

export default TaskColumn
