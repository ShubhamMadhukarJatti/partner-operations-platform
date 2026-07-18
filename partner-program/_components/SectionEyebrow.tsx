import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

export function SectionEyebrow({
  children,
  className
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'relative inline-flex h-7 min-w-[74px] items-center justify-center rounded-full border border-[#d3d7e2] bg-white px-4',
        className
      )}
    >
      <span
        className='absolute left-3.5 top-1/2 size-1.5 -translate-y-1/2 rounded-full'
        style={{ backgroundColor: '#6054ec' }}
        aria-hidden
      />
      <span className='pl-2.5 text-[11px] font-medium uppercase tracking-[1.1px] text-[#3e424d]'>
        {children}
      </span>
    </div>
  )
}
