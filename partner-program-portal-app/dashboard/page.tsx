import type { Metadata } from 'next'

import { PartnerProgramPortalDashboardView } from './_components/PartnerProgramPortalDashboardView'

export const metadata: Metadata = {
  title: 'Partner Portal | Dashboard',
  description: 'Sharkdom Partner Program portal dashboard.',
  robots: { index: false, follow: false }
}

export default function PartnerProgramPortalDashboardPage() {
  return <PartnerProgramPortalDashboardView />
}
