import React from 'react'
import { Plus } from 'lucide-react'

import PartnerTierInputCard, { PartnerTierData } from './PartnerTierInputCard'

interface PartnerTierStepProps {
  tiers: PartnerTierData[]
  onAddTier: () => void
  onUpdateTier: (index: number, updatedTier: PartnerTierData) => void
}

const PartnerTierStep = ({
  tiers,
  onAddTier,
  onUpdateTier
}: PartnerTierStepProps) => {
  return (
    <div className='flex w-full flex-col items-center py-8'>
      <h2 className='mb-8 text-3xl font-bold text-gray-900'>
        Set your Partner Tier
      </h2>

      <div className='flex w-full flex-col items-center gap-6'>
        {tiers.map((tier, index) => (
          <PartnerTierInputCard
            key={tier.id}
            data={tier}
            onChange={(updatedData) => onUpdateTier(index, updatedData)}
          />
        ))}

        {/* Add New Partner Tier Button */}
        <button
          onClick={onAddTier}
          className='flex h-[140px] w-full max-w-[650px] flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 bg-white transition-colors hover:border-gray-300 hover:bg-gray-50'
        >
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
            <Plus size={20} color='#92A0B9' />
          </div>
          <div className='text-center'>
            <h3 className='text-base font-semibold text-gray-900'>
              Add a New Tier
            </h3>
            <p className='text-sm text-gray-400'>
              You can add any number of tiers
            </p>
          </div>
        </button>
      </div>
    </div>
  )
}

export default PartnerTierStep
