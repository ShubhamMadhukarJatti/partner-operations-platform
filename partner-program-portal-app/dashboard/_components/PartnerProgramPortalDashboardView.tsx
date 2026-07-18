'use client'

import { useCallback, useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { PartnerProgramPortalScaffold } from '@/app/partner-program-portal-app/_components/PartnerProgramPortalScaffold'
import {
  PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_KEY,
  PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_VALUE
} from '@/app/partner-program-portal-app/constants'

import { PartnerPortalKpiCards } from './PartnerPortalKpiCards'
import { PartnerPortalRecentLeadsTable } from './PartnerPortalRecentLeadsTable'
import { PartnerPortalWalkthrough } from './PartnerPortalWalkthrough'

export function PartnerProgramPortalDashboardView() {
  const [walkthroughOpen, setWalkthroughOpen] = useState(false)

  const clearWalkthroughPending = useCallback(() => {
    try {
      sessionStorage.removeItem(
        PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_KEY
      )
    } catch {
      /* ignore */
    }
    setWalkthroughOpen(false)
  }, [])

  useEffect(() => {
    try {
      if (
        sessionStorage.getItem(
          PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_KEY
        ) === PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_VALUE
      ) {
        setWalkthroughOpen(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <PartnerProgramPortalScaffold
      columnTopSlot={
        <PartnerPortalWalkthrough
          open={walkthroughOpen}
          onDismiss={clearWalkthroughPending}
        />
      }
      rightColumnClassName={cn(walkthroughOpen && 'overflow-hidden')}
      mainClassName='gap-8 p-6'
    >
      <PartnerPortalKpiCards />
      <PartnerPortalRecentLeadsTable />
    </PartnerProgramPortalScaffold>
  )
}
