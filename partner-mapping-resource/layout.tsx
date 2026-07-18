import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Account Mapping for B2B SaaS Teams | Sharkdom',
  description:
    "Identify account overlaps and co-sell opportunities with Sharkdom's partner mapping resource. Find the right partners for pipeline impact without spreadsheets.",
  keywords: [
    'partner account mapping',
    'account overlap tool',
    'co-sell partner mapping'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/partner-mapping-resource'
  }
}

export default function PartnerMappingResourceLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
