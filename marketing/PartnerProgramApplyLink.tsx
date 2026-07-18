import type { ComponentProps, ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'

/**
 * Shared classes for partner program “3D slab” CTAs (hero links + apply form buttons).
 * Use `size="hero"` for marketing hero; `size="form"` for the apply form footer.
 */
export function partnerProgramCtaClassNames(
  variant: 'primary' | 'outline',
  size: 'hero' | 'form' = 'hero',
  className?: string
) {
  const isPrimary = variant === 'primary'
  const sizeClasses =
    size === 'hero'
      ? 'h-14 w-full min-w-0 px-8 text-lg sm:h-16 sm:min-w-[min(100%,20rem)] sm:px-10'
      : 'min-h-[48px] w-full min-w-0 px-5 py-2.5 text-sm lg:min-h-[52px] lg:flex-1 lg:px-8 lg:text-base'

  return cn(
    'relative z-10 inline-flex items-center justify-center gap-2 rounded-lg font-sansGeneral leading-none transition',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    sizeClasses,
    isPrimary
      ? cn(
          'border border-[#3F51B5] bg-[#5B76FF] font-bold text-white',
          'shadow-[0px_4px_0px_0px_#3F51B5]',
          'hover:enabled:translate-y-px hover:enabled:shadow-[0px_3px_0px_0px_#3F51B5]',
          'active:enabled:translate-y-1 active:enabled:shadow-none',
          'focus-visible:ring-[#6863FB]/40',
          'disabled:pointer-events-none disabled:opacity-60'
        )
      : cn(
          'border-2 border-[#5B76FF] bg-white font-semibold text-[#5B76FF]',
          'shadow-[0px_4px_0px_0px_#3F51B5]',
          'hover:translate-y-px hover:bg-[#F8F9FF] hover:shadow-[0px_3px_0px_0px_#3F51B5]',
          'active:translate-y-1 active:shadow-none',
          'focus-visible:ring-[#5B76FF]/40'
        ),
    className
  )
}

export function partnerProgramCtaArrowClassNames(
  variant: 'primary' | 'outline'
) {
  return cn(
    'shrink-0',
    variant === 'primary'
      ? 'size-5 text-white sm:size-6'
      : 'size-5 text-[#5B76FF] sm:size-6'
  )
}

/**
 * Partner program hero CTAs (“Apply as Champion / Referral”) — 3D slab shadow + arrow.
 *
 * **How to reuse:** import from `@/components/marketing/PartnerProgramApplyLink`
 * and pass `variant="primary" | "outline"`, `href`, and label as `children`.
 * For native buttons (e.g. form submit), use `partnerProgramCtaClassNames` +
 * `partnerProgramCtaArrowClassNames` from the same module.
 *
 * @example
 * ```tsx
 * <PartnerProgramApplyLink variant="primary" href="/apply-to-partner-program?tier=champion">
 *   Apply as Champion Partner
 * </PartnerProgramApplyLink>
 * ```
 */
export type PartnerProgramApplyLinkProps = Omit<
  ComponentProps<typeof Link>,
  'className' | 'children'
> & {
  variant: 'primary' | 'outline'
  className?: string
  children: ReactNode
}

export function PartnerProgramApplyLink({
  variant,
  href,
  className,
  children,
  ...linkProps
}: PartnerProgramApplyLinkProps) {
  const isPrimary = variant === 'primary'

  return (
    <Link
      href={href}
      className={partnerProgramCtaClassNames(variant, 'hero', className)}
      {...linkProps}
    >
      {children}
      <ArrowRight
        className={partnerProgramCtaArrowClassNames(variant)}
        aria-hidden
      />
    </Link>
  )
}
