'use client'

import { format } from 'date-fns'

import { Task } from './types'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isDragging = false }) => {
  const hasValidDueDate = task.dueDate && !isNaN(Date.parse(task.dueDate))
  const formattedDueDate = hasValidDueDate
    ? format(new Date(task.dueDate), 'MMM dd, yyyy')
    : null
  console.log(task)

  return (
    <div
      className={`cursor-move rounded-2xl bg-white p-3 shadow-sm transition-all ${
        isDragging ? 'rotate-2 opacity-50' : 'hover:shadow-md'
      }`}
    >
      <div className='flex flex-col gap-3'>
        <h3 className='break-words text-sm font-semibold text-text-100'>
          {task.title}
        </h3>

        {task.description && (
          <p className='line-clamp-3 break-words text-[10px] leading-relaxed text-text-60'>
            {task.description}
          </p>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {task.tags.map((tag) => (
              <span
                key={tag}
                className='rounded-full border border-blue-100 bg-blue-50 px-2 py-0.5 text-[9px] font-medium text-blue-600'
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {(task.assignedTo?.name || formattedDueDate) && (
          <div className='flex flex-col gap-2'>
            {task.assignedTo?.name && (
              <div className='flex items-center gap-1'>
                <span className='text-xs text-text-70'>Assigned to:</span>
                <span className='text-xs font-medium text-text-100'>
                  {task.assignedTo.name}
                </span>
              </div>
            )}

            {formattedDueDate && (
              <div className='flex items-center gap-1'>
                <span className='text-xs text-text-70'>Due:</span>
                <span className='text-xs font-medium text-text-100'>
                  {formattedDueDate}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskCard
