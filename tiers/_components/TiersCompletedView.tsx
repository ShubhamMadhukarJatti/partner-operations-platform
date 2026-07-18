import React from 'react'
import { HelpCircle } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { PartnerTier } from './PartnerTierCard'
import PartnerTiersSection from './PartnerTiersSection'
import { Tier as PricingTier } from './PricingTierCard'
import PricingTiersSection from './PricingTiersSection'

interface TiersCompletedViewProps {
  onReset: () => void
  pricingTiers: PricingTier[]
  partnerTiers: PartnerTier[]
  defaultTab?: 'pricing' | 'partner'
}

const TiersCompletedView = ({
  onReset,
  pricingTiers,
  partnerTiers,
  defaultTab = 'pricing'
}: TiersCompletedViewProps) => {
  return (
    <div className='h-full w-full p-6'>
      <Tabs defaultValue={defaultTab} className='w-full space-y-8'>
        <TabsList className='h-auto w-full justify-start space-x-8 rounded-none border-b bg-transparent p-0'>
          <TabsTrigger
            value='pricing'
            className='rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-semibold text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none'
          >
            Pricing Tier
            <HelpCircle className='ml-2 h-4 w-4 text-muted-foreground/60' />
          </TabsTrigger>
          <TabsTrigger
            value='partner'
            className='rounded-none border-b-2 border-transparent px-0 py-3 text-sm font-semibold text-muted-foreground transition-all hover:text-foreground data-[state=active]:border-foreground data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none'
          >
            Partner Tier
            <HelpCircle className='ml-2 h-4 w-4 text-muted-foreground/60' />
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value='pricing'
          forceMount
          className='mt-0 duration-300 animate-in fade-in-50 slide-in-from-bottom-2 data-[state=inactive]:hidden'
        >
          <PricingTiersSection initialTiers={pricingTiers} />
        </TabsContent>

        <TabsContent
          value='partner'
          forceMount
          className='mt-0 duration-300 animate-in fade-in-50 slide-in-from-bottom-2 data-[state=inactive]:hidden'
        >
          <PartnerTiersSection initialTiers={partnerTiers} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default TiersCompletedView
