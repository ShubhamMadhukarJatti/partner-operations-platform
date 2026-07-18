import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Partner Training and Certification Feature | Sharkdom',
  description:
    "Enable partners faster with Sharkdom's built-in training tools. Deliver courses track completion and certify partners before they start selling. Free to explore.",
  keywords: [
    'partner training platform',
    'partner certification software',
    'partner enablement tools'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/partner-training-feature'
  }
}

export default function PartnerTrainingFeatureLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
