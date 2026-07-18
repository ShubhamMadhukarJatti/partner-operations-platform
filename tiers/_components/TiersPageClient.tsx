'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import GetStartedView from './GetStartedView'
import { PartnerTier } from './PartnerTierCard'
import { Tier as PricingTier } from './PricingTierCard'
import TiersCompletedView from './TiersCompletedView'
import TiersWizardView from './TiersWizardView'

interface TiersPageClientProps {
  hasExistingData: boolean
  pricingTiers: PricingTier[]
  partnerTiers: PartnerTier[]
}

const TiersPageClient = ({
  hasExistingData,
  pricingTiers,
  partnerTiers
}: TiersPageClientProps) => {
  const router = useRouter()
  const [view, setView] = useState<'start' | 'wizard' | 'completed'>(
    hasExistingData ? 'completed' : 'start'
  )
  const [defaultTab, setDefaultTab] = useState<'pricing' | 'partner'>('pricing')

  useEffect(() => {
    if (hasExistingData) {
      setView('completed')
    }
    // We don't automatically switch back to 'start' if data disappears to avoid disrupting user if they are in wizard,
    // but here we are just syncing if data indicates completion.
  }, [hasExistingData])

  const handleStart = () => {
    setView('wizard')
  }

  const handleWizardBack = () => {
    setView('start')
  }

  const handleWizardFinish = () => {
    // Set default tab to 'partner' when finishing from wizard (step 2 is partner tiers)
    setDefaultTab('partner')
    // Refresh the page to fetch latest data
    router.refresh()
    setView('completed')
  }

  const handleReset = () => {
    setView('start')
  }

  // Render view based on state
  switch (view) {
    case 'wizard':
      return (
        <TiersWizardView
          onBack={handleWizardBack}
          onFinish={handleWizardFinish}
        />
      )
    case 'completed':
      return (
        <TiersCompletedView
          onReset={handleReset}
          pricingTiers={pricingTiers}
          partnerTiers={partnerTiers}
          defaultTab={defaultTab}
        />
      )
    case 'start':
    default:
      return <GetStartedView onStart={handleStart} />
  }
}

export default TiersPageClient
