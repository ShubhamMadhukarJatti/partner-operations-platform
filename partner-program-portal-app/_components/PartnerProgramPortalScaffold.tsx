'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'
import {
  PARTNER_PORTAL_APP_ACCESS_SESSION_KEY,
  PARTNER_PORTAL_APP_ACCESS_SESSION_VALUE,
  PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_KEY,
  PARTNER_PORTAL_DUMMY_AVATAR_INITIAL,
  PARTNER_PORTAL_DUMMY_DISPLAY_NAME
} from '@/app/partner-program-portal-app/constants'
import { PartnerPortalFab } from '@/app/partner-program-portal-app/dashboard/_components/PartnerPortalFab'
import { PartnerPortalHeader } from '@/app/partner-program-portal-app/dashboard/_components/PartnerPortalHeader'
import { PartnerPortalSidebar } from '@/app/partner-program-portal-app/dashboard/_components/PartnerPortalSidebar'

import {
  PartnerSessionProvider,
  usePartnerSession
} from './PartnerSessionContext'

export type PartnerProgramPortalScaffoldProps = {
  children: ReactNode
  /** Rendered inside the right column before the header (e.g. dashboard walkthrough overlay). */
  columnTopSlot?: ReactNode
  /** Extra classes for the scrollable right column (e.g. overflow-hidden when overlay open). */
  rightColumnClassName?: string
  /** Classes for the main element wrapping `children`. */
  mainClassName?: string
  headerDisplayName?: string
  headerAvatarInitial?: string
}

export function PartnerProgramPortalScaffold(
  props: PartnerProgramPortalScaffoldProps
) {
  return <PartnerProgramPortalScaffoldContent {...props} />
}

function PartnerProgramPortalScaffoldContent({
  children,
  columnTopSlot,
  rightColumnClassName,
  mainClassName
}: PartnerProgramPortalScaffoldProps) {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
  const { profile, isLoading } = usePartnerSession()

  const signOut = useCallback(() => {
    try {
      sessionStorage.removeItem(PARTNER_PORTAL_APP_ACCESS_SESSION_KEY)
      sessionStorage.removeItem(
        PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_KEY
      )
    } catch {
      /* ignore */
    }
    router.replace('/apply-to-partner-program')
  }, [router])

  useEffect(() => {
    try {
      const marker = sessionStorage.getItem(
        PARTNER_PORTAL_APP_ACCESS_SESSION_KEY
      )
      if (marker !== PARTNER_PORTAL_APP_ACCESS_SESSION_VALUE) {
        router.replace('/apply-to-partner-program')
        return
      }
      setAllowed(true)
    } catch {
      router.replace('/apply-to-partner-program')
    }
  }, [router])

  if (!allowed || isLoading) {
    return (
      <div className='flex min-h-dvh items-center justify-center bg-[#F8F9FB] font-sans text-sm text-[#6A7282]'>
        Redirecting…
      </div>
    )
  }

  const headerDisplayName = profile?.fullName
  const headerAvatarInitial = profile?.fullName
    ? profile.fullName.trim().slice(0, 1)
    : PARTNER_PORTAL_DUMMY_AVATAR_INITIAL
  const partnershipTier = profile?.partnershipTier

  return (
    <GradientPageBackground>
      <div className='min-h-dvh bg-[#F8F9FB] font-sans dark:bg-transparent'>
        <PartnerPortalSidebar onSignOut={signOut} />
        <div
          className={cn(
            'relative ml-[220px] flex min-h-dvh min-w-0 flex-1 flex-col',
            rightColumnClassName
          )}
        >
          {columnTopSlot}
          <PartnerPortalHeader
            displayName={headerDisplayName}
            avatarInitial={headerAvatarInitial}
            partnershipTier={partnershipTier}
          />
          <main className={cn('flex min-h-0 flex-1 flex-col', mainClassName)}>
            {children}
          </main>
          <PartnerPortalFab />
        </div>
      </div>
    </GradientPageBackground>
  )
}
