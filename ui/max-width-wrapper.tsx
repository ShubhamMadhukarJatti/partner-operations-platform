import { ReactNode } from 'react'

import { cn } from '@/lib/utils'

const MaxWidthWrapper = ({
  className,
  children
}: {
  className?: string
  children: ReactNode
}) => {
  return (
    <div className={cn('max-w-8xl mx-auto w-full px-6', className)}>
      {children}
    </div>
  )
}

export default MaxWidthWrapper
