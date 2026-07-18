import { Suspense } from 'react'
import type { Metadata } from 'next'

import PartnerProgramApplicationView from './_components/PartnerProgramApplicationView'

export const metadata: Metadata = {
  title: 'Partner Application | Sharkdom',
  description:
    "Apply to join Sharkdom's referral partner program — Champion or Referral tier.",
  robots: { index: true, follow: true }
}

function PartnerApplicationFallback() {
  return (
    <div
      className='min-h-screen pt-24 text-center text-sm text-[#6A7282]'
      style={{
        backgroundColor: '#F9FAFB',
        backgroundImage:
          'radial-gradient(ellipse 90% 70% at 50% -15%, rgba(199, 182, 255, 0.32) 0%, transparent 62%), radial-gradient(ellipse 85% 65% at 0% 0%, rgba(147, 197, 253, 0.32) 0%, transparent 68%), radial-gradient(ellipse 75% 60% at 100% 0%, rgba(196, 181, 253, 0.28) 0%, transparent 70%)'
      }}
    >
      Loading…
    </div>
  )
}

export default function ApplyToPartnerProgramPage() {
  return (
    <Suspense fallback={<PartnerApplicationFallback />}>
      <PartnerProgramApplicationView />
    </Suspense>
  )
}
