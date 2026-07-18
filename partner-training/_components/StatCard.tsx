import React from 'react'
import { Info } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

interface StatCardProps {
  label: string
  value: string
}

const StatCard = ({ label, value }: StatCardProps) => {
  return (
    <div className='flex flex-col gap-2 rounded-xl border border-gray-100/50 bg-white p-6 shadow-sm dark:bg-card'>
      <div className='flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-white'>
        {label}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info size={14} className='opacity-70 hover:opacity-100' />
            </TooltipTrigger>
            <TooltipContent>
              <p>Info about {label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className='text-3xl font-bold text-gray-900 dark:text-white'>
        {value}
      </div>
    </div>
  )
}

export default StatCard
