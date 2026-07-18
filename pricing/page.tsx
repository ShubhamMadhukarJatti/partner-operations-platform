import React from 'react'
import { Metadata } from 'next'
import { headers } from 'next/headers'

import {
  DEFAULT_PRICING_REGION,
  detectPricingRegion,
  pricingRegionFromLocalePrefix
} from '@/lib/pricing-region'

import PricingSection from './_components/PricingSection'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Sharkdom Pricing | Partner Program Plans for Every Stage',
  description:
    'Standard, Premium, and Elite plans for B2B partner programs. Pay only for the partner ops you actually need. Modular pricing for startup to enterprise teams. No lock-in.',
  keywords: [
    'partner management software pricing',
    'PRM pricing',
    'partner platform cost'
  ],
  robots: {
    index: true, // Allows crawling
    follow: true // Allows following links
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/pricing'
  }
}

type PricingPageProps = {
  searchParams?: {
    locale?: string | string[]
  }
}

const PricingPage = async ({ searchParams }: PricingPageProps) => {
  const localeParam = Array.isArray(searchParams?.locale)
    ? searchParams?.locale[0]
    : searchParams?.locale
  const forcedRegion = pricingRegionFromLocalePrefix(localeParam)
  const detectedRegion = forcedRegion ?? (await detectPricingRegion(headers()))
  const initialRegion = detectedRegion ?? DEFAULT_PRICING_REGION
  const shouldRefineRegion = !forcedRegion && !detectedRegion

  return (
    <div>
      <PricingSection
        forcedRegion={forcedRegion}
        initialRegion={initialRegion}
        shouldRefineRegion={shouldRefineRegion}
      />
    </div>
  )
}

export default PricingPage
