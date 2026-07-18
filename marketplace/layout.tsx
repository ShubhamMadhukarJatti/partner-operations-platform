import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sharkdom Partner Marketplace | Find B2B Co-Sell Partners',
  description:
    "Browse Sharkdom's global partner marketplace to find integration co-sell and channel partners by industry geography and GTM motion. Join free and start building.",
  keywords: [
    'B2B partner marketplace',
    'find co-sell partners',
    'integration partner discovery'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/marketplace'
  },
  openGraph: {
    title: 'Sharkdom Partner Marketplace | Find B2B Co-Sell Partners',
    description:
      "Browse Sharkdom's global partner marketplace to find integration co-sell and channel partners by industry geography and GTM motion. Join free and start building.",
    url: 'https://www.sharkdom.com/marketplace',
    type: 'website',
    siteName: 'Sharkdom'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sharkdom Partner Marketplace | Find B2B Co-Sell Partners',
    description:
      "Browse Sharkdom's global partner marketplace to find integration co-sell and channel partners by industry geography and GTM motion. Join free and start building."
  }
}

export default function MarketplaceLayout({
  children
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
