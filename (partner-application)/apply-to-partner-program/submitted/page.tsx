import type { Metadata } from 'next'

import { PartnerApplicationSubmittedContent } from './_components/PartnerApplicationSubmittedContent'

export const metadata: Metadata = {
  title: 'Application received | Sharkdom'
}

export default function PartnerApplicationSubmittedPage() {
  return <PartnerApplicationSubmittedContent />
}
