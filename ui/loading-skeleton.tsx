'use client'

import React from 'react'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

const Skeleton = React.memo(
  ({ className, children, ...props }: SkeletonProps) => {
    return (
      <div
        className={cn(
          'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Skeleton.displayName = 'Skeleton'

// Pre-built skeleton components for common use cases
export const PageSkeleton = React.memo(() => (
  <div className='flex flex-col gap-8 p-6'>
    {/* Header skeleton */}
    <div className='flex items-center justify-between'>
      <Skeleton className='h-8 w-48' />
      <Skeleton className='h-10 w-32' />
    </div>

    {/* Content skeleton */}
    <div className='grid gap-6'>
      <Skeleton className='h-32 w-full' />
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className='h-24 w-full' />
        ))}
      </div>
    </div>
  </div>
))

PageSkeleton.displayName = 'PageSkeleton'

export const CardSkeleton = React.memo(() => (
  <div className='space-y-4 rounded-lg border p-6'>
    <Skeleton className='h-4 w-3/4' />
    <Skeleton className='h-4 w-1/2' />
    <Skeleton className='h-20 w-full' />
    <div className='flex justify-between'>
      <Skeleton className='h-8 w-20' />
      <Skeleton className='h-8 w-16' />
    </div>
  </div>
))

CardSkeleton.displayName = 'CardSkeleton'

export const TableSkeleton = React.memo(({ rows = 5 }: { rows?: number }) => (
  <div className='space-y-4'>
    {/* Header skeleton */}
    <div className='grid grid-cols-4 gap-4'>
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className='h-4 w-full' />
      ))}
    </div>

    {/* Rows skeleton */}
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className='grid grid-cols-4 gap-4'>
        {Array.from({ length: 4 }).map((_, j) => (
          <Skeleton key={j} className='h-4 w-full' />
        ))}
      </div>
    ))}
  </div>
))

TableSkeleton.displayName = 'TableSkeleton'

export const NavigationSkeleton = React.memo(() => (
  <div className='space-y-2'>
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className='h-10 w-full' />
    ))}
  </div>
))

NavigationSkeleton.displayName = 'NavigationSkeleton'

export default Skeleton
