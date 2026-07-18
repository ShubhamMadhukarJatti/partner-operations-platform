import React from 'react'

import { cn } from '@/lib/utils'

interface GradientLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  gradient?: string
}

export const GradientLabel = ({
  children,
  className,
  gradient = 'linear-gradient(129.26deg, #D588FC 2.3%, #FBB795 41.49%, #FC93E3 100.27%)',
  style,
  ...props
}: GradientLabelProps) => {
  return (
    <div
      className={cn(
        'inline-block rounded-full border border-transparent bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#1B0C27] shadow-md',
        className
      )}
      style={{
        background: `linear-gradient(#fff, #fff) padding-box, ${gradient} border-box`,
        boxShadow: '0px 4px 12px 0px rgba(0, 0, 0, 0.06)',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  )
}
