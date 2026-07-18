'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

/** FDS typography variants – single source of truth for component classes */
const typographyVariants = cva('font-sans', {
  variants: {
    variant: {
      heading: 'text-heading font-semibold',
      text: 'text-body font-normal',
      textSemibold: 'text-body font-semibold',
      textLead: 'text-shark-lg font-normal',
      textLeadSemibold: 'text-shark-lg font-semibold',
      textSm: 'text-shark-sm font-semibold'
    }
  },
  defaultVariants: {
    variant: 'text'
  }
})

export type TypographyVariant = NonNullable<
  VariantProps<typeof typographyVariants>['variant']
>

/** Get FDS typography class name by variant (for use in className) */
export function getTypographyClass(variant: TypographyVariant = 'text') {
  return typographyVariants({ variant })
}

/**
 * FDS Heading – Inter, 32px, semibold (600), 40px line-height.
 */
const FDSHeading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    asChild?: boolean
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  }
>(({ className, asChild, as: Tag = 'h2', ...props }, ref) => {
  const Comp = asChild ? Slot : Tag
  return (
    <Comp
      ref={ref}
      className={cn(typographyVariants({ variant: 'heading' }), className)}
      {...props}
    />
  )
})
FDSHeading.displayName = 'FDSHeading'

/**
 * FDS Text – Inter, 16px, normal (400), 24px line-height.
 */
const FDSText = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    asChild?: boolean
    as?: 'p' | 'span' | 'div'
    variant?: TypographyVariant
  }
>(({ className, asChild, as: Tag = 'p', variant = 'text', ...props }, ref) => {
  const Comp = asChild ? Slot : Tag
  return (
    <Comp
      ref={ref}
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
})
FDSText.displayName = 'FDSText'

/**
 * FDS Text Semibold – Inter, 16px, semibold (600), 24px line-height.
 */
const FDSTextSemibold = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean
    as?: 'p' | 'span' | 'div'
  }
>(({ className, asChild, as: Tag = 'span', ...props }, ref) => {
  const Comp = asChild ? Slot : Tag
  return (
    <Comp
      ref={ref as any}
      className={cn(typographyVariants({ variant: 'textSemibold' }), className)}
      {...props}
    />
  )
})
FDSTextSemibold.displayName = 'FDSTextSemibold'

/**
 * FDS Text Lead – Inter, 20px, normal (400), 28px line-height. For lead paragraphs.
 */
const FDSTextLead = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean
    as?: 'p' | 'span' | 'div'
  }
>(({ className, asChild, as: Tag = 'p', ...props }, ref) => {
  const Comp = asChild ? Slot : Tag
  return (
    <Comp
      ref={ref as any}
      className={cn(typographyVariants({ variant: 'textLead' }), className)}
      {...props}
    />
  )
})
FDSTextLead.displayName = 'FDSTextLead'

/**
 * FDS Text Small – Inter, 14px, semibold (600), 20px line-height. For labels, badges.
 */
const FDSTextSm = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    asChild?: boolean
    as?: 'span' | 'p' | 'div'
  }
>(({ className, asChild, as: Tag = 'span', ...props }, ref) => {
  const Comp = asChild ? Slot : Tag
  return (
    <Comp
      ref={ref as any}
      className={cn(typographyVariants({ variant: 'textSm' }), className)}
      {...props}
    />
  )
})
FDSTextSm.displayName = 'FDSTextSm'

export {
  FDSHeading,
  FDSText,
  FDSTextSemibold,
  FDSTextLead,
  FDSTextSm,
  typographyVariants
}
