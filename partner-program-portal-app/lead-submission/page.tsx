import type { Metadata } from 'next'

import { PartnerLeadSubmissionView } from './_components/PartnerLeadSubmissionView'

export const metadata: Metadata = {
  title: 'Partner Portal | Submit a Lead',
  description: 'Submit a new lead in the Sharkdom Partner Program portal.',
  robots: { index: false, follow: false }
}

export default function PartnerLeadSubmissionPage() {
  return <PartnerLeadSubmissionView />
}
