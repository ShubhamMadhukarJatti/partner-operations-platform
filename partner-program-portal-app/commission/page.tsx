import type { Metadata } from 'next'

import { PartnerCommissionView } from './_components/PartnerCommissionView'

export const metadata: Metadata = {
  title: 'Partner Portal | Commission Tracker',
  description:
    'Track commissions, payouts, and monthly earnings in the Sharkdom Partner Program portal.',
  robots: { index: false, follow: false }
}

export default function PartnerCommissionPage() {
  return <PartnerCommissionView />
}
