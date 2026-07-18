import React from 'react'

import { cn } from '@/lib/utils'

type RoundedTitleCardProps = {
  title: string
  children?: React.ReactNode
  className: string
  action?: any
}

export default function RoundedTitleCard({
  title,
  children,
  className,
  action
}: RoundedTitleCardProps) {
  return (
    <div className={cn('rounded-lg border border-[#E9EAEB]', className)}>
      <div className='flex justify-between border-b border-[#E9EAEB] p-4'>
        <h2 className='text-shark-base font-semibold text-[#181D27]'>
          {title}
        </h2>

        {action}
      </div>
      {children}
    </div>
  )
}
