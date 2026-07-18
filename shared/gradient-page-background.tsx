import React from 'react'

import { cn } from '@/lib/utils'

interface GradientPageBackgroundProps {
  children: React.ReactNode
  className?: string
}

/**
 * Reusable page background with a rich blue-to-lavender gradient base
 * and decorative blurred gradient blobs for depth.
 *
 * Usage:
 *   <GradientPageBackground className="min-h-screen">
 *     <YourPageContent />
 *   </GradientPageBackground>
 */
export function GradientPageBackground({
  children,
  className
}: GradientPageBackgroundProps) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        background: 'var(--page-gradient-bg)'
      }}
    >
      {/* Top-left cyan blob */}
      <div
        aria-hidden
        className='pointer-events-none absolute'
        style={{
          width: 900,
          height: 800,
          left: -300,
          top: -300,
          transform: 'rotate(-22.32deg)',
          transformOrigin: 'top left',
          mixBlendMode: 'hard-light',
          background: 'var(--page-blob-1)',
          borderRadius: 9999,
          filter: 'blur(48px)'
        }}
      />

      {/* Top-right cyan blob (Added for Dark Mode/Specific layout) */}
      <div
        aria-hidden
        className='pointer-events-none absolute'
        style={{
          width: 900,
          height: 800,
          right: -300,
          top: -300,
          transform: 'rotate(22.32deg)',
          transformOrigin: 'top right',
          mixBlendMode: 'hard-light',
          background: 'var(--page-blob-2)',
          borderRadius: 9999,
          filter: 'blur(48px)'
        }}
      />

      {/* Bottom fade overlay */}
      <div
        aria-hidden
        className='pointer-events-none absolute inset-x-0 bottom-0'
        style={{
          height: '60%',
          background: 'var(--page-fade)',
          zIndex: 1
        }}
      />
      <div className='relative z-10 flex flex-1 flex-col'>{children}</div>
    </div>
  )
}
