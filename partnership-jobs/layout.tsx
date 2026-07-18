import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partnership Jobs | Channel and Alliances Roles | Sharkdom',
  description:
    "Browse open partnership, alliances, and channel sales roles from SaaS companies. Sharkdom's jobs board connects professionals with teams hiring in B2B partnerships right now.",
  keywords: [
    'partnership jobs',
    'alliances manager jobs',
    'channel sales roles',
    'partner manager careers'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/partnership-jobs'
  }
}

export default function PartnershipJobsLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
