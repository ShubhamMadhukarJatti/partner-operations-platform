import type { Metadata } from 'next'

import { PartnerLeadDirectoryView } from './_components/PartnerLeadDirectoryView'

export const metadata: Metadata = {
  title: 'Partner Portal | My Leads',
  description:
    'View and filter your leads in the Sharkdom Partner Program portal.',
  robots: { index: false, follow: false }
}

export default function PartnerLeadDirectoryPage() {
  return <PartnerLeadDirectoryView />
}
