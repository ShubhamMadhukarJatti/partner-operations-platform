import React from 'react'

import { cn } from '@/lib/utils'

const AnalyticsContainer: React.FC<{
  title: string
  children: React.ReactNode
  className?: string
}> = ({ title, children, className }) => {
  return (
    <div
      className={cn(
        'w-full rounded-2xl border border-[#EBEBEB] bg-white p-5 shadow-sm',
        className
      )}
    >
      <h3 className='text-base font-semibold text-[#2A3241]'>{title}</h3>
      {children}
    </div>
  )
}

export default AnalyticsContainer
