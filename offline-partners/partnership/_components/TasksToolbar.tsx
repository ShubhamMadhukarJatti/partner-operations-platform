import {
  IconFilter,
  IconLayoutGrid,
  IconList,
  IconUpload
} from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

import type { ViewMode } from './types'

interface TasksToolbarProps {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
}

const TasksToolbar: React.FC<TasksToolbarProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex rounded-lg border border-gray-200 p-0.5'>
        <Button
          size='icon'
          onClick={() => onViewModeChange('grid')}
          className={`h-7 w-10 hover:bg-slate-200 ${
            viewMode === 'grid'
              ? 'bg-[#00000008] text-text-100'
              : 'bg-transparent text-[#757575]'
          }`}
        >
          <IconLayoutGrid size={16} />
        </Button>
        <Button
          size='icon'
          onClick={() => onViewModeChange('list')}
          className={`h-7 w-10 hover:bg-slate-200 ${
            viewMode === 'list'
              ? 'bg-[#00000008] text-text-100'
              : 'bg-transparent text-[#757575]'
          }`}
        >
          <IconList size={16} />
        </Button>
      </div>

      <div className='flex gap-2'>
        <Button variant='primary' size='sm' className='flex items-center gap-2'>
          <IconFilter size={16} />
          Filter
        </Button>
        <Button variant='primary' size='sm' className='flex items-center gap-2'>
          <IconUpload size={16} />
          Import
        </Button>
      </div>
    </div>
  )
}

export default TasksToolbar
