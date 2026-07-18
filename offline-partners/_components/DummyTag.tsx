'use client'

import React, { useState } from 'react'
import { Info, X } from 'lucide-react'

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger
} from '@/components/ui/hover-card'

const DummyTag = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen}>
      <HoverCardTrigger asChild>
        <span className='inline-flex cursor-pointer items-center justify-center rounded-md bg-[#FFE8A3] px-2 py-1 text-xs font-medium text-slate-800'>
          Dummy
          <Info className='ml-1' size={12} />
        </span>
      </HoverCardTrigger>
      <HoverCardContent
        side='top'
        className='!w-[430px] min-w-0 max-w-md shadow-2xl'
      >
        <div className='space-y-2'>
          <div className='flex items-start justify-between gap-2'>
            <div className='flex-1 pr-2 text-lg font-semibold'>
              Here&apos;s your sandbox environment
            </div>
            <button
              onClick={handleClose}
              className='text-muted-foreground transition-colors hover:text-foreground'
            >
              <X className='text-bold h-5 w-5' />
            </button>
          </div>
          <div className='whitespace-normal break-words text-sm leading-relaxed text-black'>
            This is a sample partner data to help you explore how Sharkdom
            scores compatibility, tracks engagement, and forecasts partnership
            success before you import your real partners.
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

export default DummyTag
