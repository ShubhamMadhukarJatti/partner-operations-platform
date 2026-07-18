import type { Metadata } from 'next'

import { PartnerInformationView } from './_components/PartnerInformationView'

export const metadata: Metadata = {
  title: 'Partner Portal | Profile & Settings',
  description:
    'Manage your partner profile, notifications, and account on Sharkdom.',
  robots: { index: false, follow: false }
}

export default function PartnerInformationPage() {
  return <PartnerInformationView />
}
