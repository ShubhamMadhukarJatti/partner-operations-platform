import React from 'react'

import { fetcher } from '@/lib/server'

import { PartnerTier } from './_components/PartnerTierCard'
import { Tier as PricingTier } from './_components/PricingTierCard'
import TiersPageClient from './_components/TiersPageClient'

export const dynamic = 'force-dynamic'

// Define API response types
interface ApiTierResponse {
  success: boolean
  message: string
  data: {
    hasData: boolean
    pricingTiers: {
      content: ApiPricingTier[]
      numberOfElements: number
      empty: boolean
    }
    partnerTiers: {
      content: ApiPartnerTier[]
      numberOfElements: number
      empty: boolean
    }
  }
}

interface ApiPricingTier {
  id: number
  tierName: string
  price: number
  currency: string
  colorCode: string
  features: string[]
  active: boolean
}

interface ApiPartnerTier {
  id: number
  tierName: string
  price: number
  currency: string | null
  seatLower: number
  seatUpper: number
  discountPercent: number
  region: string
  colorCode: string
  active: boolean
}

const TiersPage = async () => {
  let hasExistingData = false
  let pricingTiers: PricingTier[] = []
  let partnerTiers: PartnerTier[] = []

  try {
    const response = (await fetcher(
      '/api/catalogues?page=0&size=10'
    )) as ApiTierResponse

    if (response?.success && response?.data) {
      hasExistingData = response.data.hasData

      if (hasExistingData) {
        // Map Pricing Tiers
        pricingTiers = (response.data.pricingTiers?.content || []).map((t) => ({
          id: t.id.toString(),
          name: t.tierName,
          price: t.currency
            ? `${t.currency === 'USD' ? '$' : t.currency} ${t.price}`
            : t.price.toString(),
          features: t.features || [],
          color: t.colorCode || '#000000'
        }))

        // Map Partner Tiers
        partnerTiers = (response.data.partnerTiers?.content || []).map((t) => ({
          id: t.id.toString(),
          name: t.tierName,
          price: `$ ${t.price}`, // Assuming USD or generic currency formatting for now based on example
          seats: `${t.seatLower} - ${t.seatUpper}`,
          discount: `${t.discountPercent}%`,
          region: t.region,
          color: t.colorCode || '#000000',
          active: t.active
        }))
      }
    }
  } catch (error) {
    console.error('Failed to fetch tiers data:', error)
    // Fallback to no data state
    hasExistingData = false
  }

  return (
    <TiersPageClient
      hasExistingData={hasExistingData}
      pricingTiers={pricingTiers}
      partnerTiers={partnerTiers}
    />
  )
}

export default TiersPage
