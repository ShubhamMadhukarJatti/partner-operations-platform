import React from 'react'
import { ArrowRight, Flag, Info, Loader2, Star } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface Milestone {
  id: string
  label: string
  labelIcon?: React.ReactNode
  title: string
  description: string
  isInProgress?: boolean
  actionLabel?: string
}

const DUMMY_MILESTONES: Milestone[] = [
  {
    id: '1',
    label: '60% Completed',
    labelIcon: <Loader2 className='animate-spin' size={12} />,
    title: 'Complete 3 advanced courses',
    description:
      'Get access to over 20+ partnership templates including a dashboard layout, charts, kanban.',
    isInProgress: true,
    actionLabel: 'Continue'
  },
  {
    id: '2',
    label: 'Milestone 2',
    title: 'Complete 2 partner training',
    description:
      'Get access to over 20+ partnership templates including a dashboard layout, charts, kanban.'
  },
  {
    id: '3',
    label: 'Milestone 3',
    title: 'Complete 10 Beginners course',
    description:
      'Get access to over 20+ partnership templates including a dashboard layout, charts, kanban.'
  },
  {
    id: '4',
    label: 'Milestone 4',
    title: 'Get 5 star in 10 Beginners',
    description:
      'Get access to over 20+ partnership templates including a dashboard layout, charts, kanban.'
  }
]

const MilestonesSection = () => {
  return (
    <div className='flex flex-col gap-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-border dark:bg-card'>
      {/* Header */}
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white'>
            <Flag size={14} className='fill-current' />
          </div>
          <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
            Milestones
          </h2>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info
                  size={16}
                  className='text-gray-400 hover:text-gray-600 dark:text-white dark:text-white'
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Track your progress and achievements</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Score */}
        <div className='flex flex-col gap-1'>
          <span className='text-sm text-gray-500 dark:text-white'>
            Your Avg Score
          </span>
          <div className='flex items-center gap-2'>
            <div className='flex items-center gap-0.5'>
              {[1, 2, 3, 4].map((star) => (
                <Star
                  key={star}
                  size={16}
                  className='fill-yellow-400 text-yellow-400'
                />
              ))}
              <Star size={16} className='fill-gray-200 text-gray-200' />
            </div>
            <span className='font-medium text-gray-900 dark:text-white'>
              4.0
            </span>
          </div>
        </div>
      </div>

      {/* Content Divider */}
      <div className='h-px w-full bg-gray-100 dark:bg-white/10' />

      {/* Timeline */}
      <div className='relative flex flex-col gap-8 pl-2'>
        {/* Vertical Line */}
        <div className='absolute left-[11px] top-2 h-full w-px bg-gray-200 dark:bg-white/20' />

        {DUMMY_MILESTONES.map((milestone, index) => (
          <div key={milestone.id} className='relative z-10 flex gap-4'>
            {/* Timeline Node */}
            <div className='flex flex-col items-center'>
              <div className='flex h-5 w-5 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-500'>
                <Flag size={10} className='fill-current' />
              </div>
            </div>

            {/* Content */}
            <div className='flex flex-col gap-2 pb-2'>
              {/* Label Pill */}
              <div className='flex w-fit items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 dark:border-border dark:bg-card dark:text-white'>
                {milestone.labelIcon}
                {milestone.label}
              </div>

              <h3 className='font-semibold text-gray-900 dark:text-white'>
                {milestone.title}
              </h3>

              <p className='text-sm leading-relaxed text-gray-500 dark:text-white'>
                {milestone.description}
              </p>

              {milestone.actionLabel && (
                <Button
                  variant='outline'
                  size='sm'
                  className='mt-2 h-8 w-fit gap-1 rounded-full px-4 text-xs'
                >
                  {milestone.actionLabel}
                  <ArrowRight size={12} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MilestonesSection
