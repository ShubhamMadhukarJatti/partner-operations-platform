import { SeekButton } from '@vidstack/react'
import { RotateCcw, RotateCw } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export function SeekBackwardButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SeekButton
            seconds={-10}
            className='group relative flex items-center justify-center rounded-full p-2.5 outline-none ring-inset hover:bg-white/10 data-[focus]:ring-4'
          >
            <RotateCcw className='h-6 w-6 text-white transition-transform group-active:-rotate-45' />
          </SeekButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Rewind 10s</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function SeekForwardButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <SeekButton
            seconds={10}
            className='group relative flex items-center justify-center rounded-full p-2.5 outline-none ring-inset hover:bg-white/10 data-[focus]:ring-4'
          >
            <RotateCw className='h-6 w-6 text-white transition-transform group-active:rotate-45' />
          </SeekButton>
        </TooltipTrigger>
        <TooltipContent>
          <p>Skip 10s</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
