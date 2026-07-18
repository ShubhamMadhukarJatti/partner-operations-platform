import type { Metadata } from 'next'

import { PartnerResourcesView } from './_components/PartnerResourcesView'

export const metadata: Metadata = {
  title: 'Partner Portal | Resources',
  description:
    'Sales enablement materials and tools for Sharkdom Partner Program partners.',
  robots: { index: false, follow: false }
}

export default function PartnerResourcesPage() {
  return <PartnerResourcesView />
}
