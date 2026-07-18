'use client'

import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'

import { cn } from '@/lib/utils'

export type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  /** Fraction of the element visible before animating (Framer `viewport.amount`). */
  amount?: number | 'some' | 'all'
  /** Initial vertical offset in px. */
  y?: number
  delay?: number
  duration?: number
} & Omit<
  HTMLMotionProps<'div'>,
  'children' | 'initial' | 'whileInView' | 'viewport'
>

const easeMarketing = [0.22, 1, 0.36, 1] as const

/**
 * Fade + slight rise when the block enters the viewport (Framer-style marketing scroll).
 * Respects `prefers-reduced-motion`.
 */
export function ScrollReveal({
  children,
  className,
  amount = 'some',
  y = 18,
  delay = 0,
  duration = 0.88,
  ...rest
}: ScrollRevealProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{
        duration,
        delay,
        ease: easeMarketing
      }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
