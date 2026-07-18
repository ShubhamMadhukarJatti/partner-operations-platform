import React, { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'

import PartnerTierInputCard, { PartnerTierData } from './PartnerTierInputCard'
import PartnerTierStep from './PartnerTierStep'
import { PricingTierData } from './PricingTierInputCard'
import PricingTierStep from './PricingTierStep'

interface TiersWizardViewProps {
  onBack: () => void
  onFinish: () => void
}

const NUM_WIZARD_STEPS = 2
const WIZARD_STEP_ARR = [1, 2]

const TiersWizardView = ({ onBack, onFinish }: TiersWizardViewProps) => {
  const [currentStep, setCurrentStep] = useState<number>(1)
  const [isSaving, setIsSaving] = useState(false)

  // State for Step 1
  const [pricingTiers, setPricingTiers] = useState<PricingTierData[]>([
    {
      id: '1', // Simple ID generation
      name: '',
      price: '',
      color: '#FFBA53',
      features: ['']
    }
  ])

  // State for Step 2
  const [partnerTiers, setPartnerTiers] = useState<PartnerTierData[]>([
    {
      id: '1',
      name: '',
      price: '',
      seatsLower: '',
      seatsUpper: '',
      discount: '',
      region: '',
      color: '#FFBA53'
    }
  ])

  const savePricingTiers = async () => {
    // Basic validation
    for (const tier of pricingTiers) {
      if (!tier.name || !tier.price) {
        showCustomToast(
          'Error',
          'Please fill in all tier details (Name, Price).',
          'error'
        )
        return false
      }
    }

    setIsSaving(true)
    try {
      const promises = pricingTiers.map((tier) => {
        const features = (tier.features || [])
          .map((f) => (typeof f === 'string' ? f.trim() : ''))
          .filter((f) => f !== '')
        return fetch(`/api/catalogues/pricing/tiers/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            tierName: tier.name.trim(),
            price: Number(tier.price) || 0,
            currency: 'USD',
            colorCode: tier.color || '#FFBA53',
            features
          })
        }).then(async (res) => {
          if (!res.ok) {
            let errMsg = 'Failed to save tier'
            try {
              const errJson = await res.json()
              errMsg = errJson.message || errJson.errorMessage || errMsg
            } catch {
              const text = await res.text()
              if (text) errMsg = text
            }
            throw new Error(errMsg)
          }
          return res.json()
        })
      })

      await Promise.all(promises)
      showCustomToast('Success', 'Pricing tiers saved successfully!', 'success')
      setIsSaving(false)
      return true
    } catch (error: any) {
      console.error('Error saving tiers:', error)
      showCustomToast(
        'Error',
        'Failed to save pricing tiers. Please try again.',
        'error'
      )
      setIsSaving(false)
      return false
    }
  }

  const savePartnerTiers = async () => {
    // Validation
    for (const tier of partnerTiers) {
      if (!tier.name || !tier.price || !tier.seatsLower || !tier.seatsUpper) {
        showCustomToast(
          'Error',
          'Please fill in all mandatory partner tier details (Name, Price, Seats).',
          'error'
        )
        return false
      }
    }

    setIsSaving(true)
    try {
      const promises = partnerTiers.map((tier) =>
        fetch(`/api/catalogues/partner/tiers/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({
            tierName: tier.name,
            price: Number(tier.price) || 0,
            currency: 'USD',
            seatLower: Number(tier.seatsLower) || 0,
            seatUpper: Number(tier.seatsUpper) || 0,
            discountPercent: Number(tier.discount) || 0,
            region: tier.region || 'All',
            colorCode: tier.color
          })
        }).then(async (res) => {
          if (!res.ok) {
            const text = await res.text()
            throw new Error(text || 'Failed to save partner tier')
          }
          return res.json()
        })
      )

      await Promise.all(promises)
      showCustomToast('Success', 'Partner tiers saved successfully!', 'success')

      // Fetch partner tiers after successful POST
      try {
        const fetchResponse = await fetch(
          `/api/catalogues/partner/tiers?page=0&size=10`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include'
          }
        )

        if (fetchResponse.ok) {
          const fetchData = await fetchResponse.json()
          console.log('Partner tiers fetched successfully:', fetchData)
        }
      } catch (fetchError) {
        console.error('Error fetching partner tiers after save:', fetchError)
        // Don't show error toast for fetch failure, as POST was successful
      }

      setIsSaving(false)
      return true
    } catch (error: any) {
      console.error('Error saving partner tiers:', error)
      showCustomToast(
        'Error',
        'Failed to save partner tiers. Please try again.',
        'error'
      )
      setIsSaving(false)
      return false
    }
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      const success = await savePricingTiers()
      if (success) {
        setCurrentStep(2)
      }
    } else {
      const success = await savePartnerTiers()
      if (success) {
        onFinish()
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    } else {
      onBack()
    }
  }

  // --- Step 1 Logic ---
  const handleAddTier = () => {
    const newId = (pricingTiers.length + 1).toString()
    setPricingTiers([
      ...pricingTiers,
      {
        id: newId,
        name: '',
        price: '',
        color: '#FFBA53',
        features: ['']
      }
    ])
  }

  const handleUpdateTier = (index: number, updatedTier: PricingTierData) => {
    const newTiers = [...pricingTiers]
    newTiers[index] = updatedTier
    setPricingTiers(newTiers)
  }

  //   const handleDeleteTier = (index: number) => {
  //       // Optional: Don't allow deleting the last remaining tier?
  //       if(tiers.length <= 1) return;
  //       const newTiers = tiers.filter((_, i) => i !== index);
  //       setTiers(newTiers);
  //   }

  // --- Step 2 Logic ---
  const handleAddPartnerTier = () => {
    const newId = (partnerTiers.length + 1).toString()
    setPartnerTiers([
      ...partnerTiers,
      {
        id: newId,
        name: '',
        price: '',
        seatsLower: '',
        seatsUpper: '',
        discount: '',
        region: '',
        color: '#FFBA53'
      }
    ])
  }

  const handleUpdatePartnerTier = (
    index: number,
    updatedTier: PartnerTierData
  ) => {
    const newTiers = [...partnerTiers]
    newTiers[index] = updatedTier
    setPartnerTiers(newTiers)
  }

  return (
    <div className='flex min-h-[calc(100vh-80px)] w-full flex-col bg-gray-50/30'>
      {/* Content Area - Scrollable */}
      <div className='flex-1 overflow-y-auto px-4 pb-24'>
        {' '}
        {/* pb-24 for footer space */}
        {currentStep === 1 ? (
          <PricingTierStep
            tiers={pricingTiers}
            onAddTier={handleAddTier}
            onUpdateTier={handleUpdateTier}
          />
        ) : (
          <PartnerTierStep
            tiers={partnerTiers}
            onAddTier={handleAddPartnerTier}
            onUpdateTier={handleUpdatePartnerTier}
          />
        )}
      </div>

      {/* Fixed Footer Stack */}
      <div className='sticky bottom-0 z-10 flex w-full flex-col border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'>
        {/* Progress Stepper */}
        <div className='w-full px-4 pt-4 lg:px-8'>
          <div className='flex w-full items-center gap-3'>
            {WIZARD_STEP_ARR.map((step) => (
              <div
                key={step}
                className={cn(
                  'h-1 flex-1 rounded-full transition-colors duration-300',
                  step <= currentStep ? 'bg-[#535AF1]' : 'bg-gray-200'
                )}
              />
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className='flex w-full items-center justify-between px-4 py-4 lg:px-8'>
          <Button
            variant='outline'
            onClick={handlePrevious}
            className='flex h-11 items-center gap-2 rounded-lg border-gray-200 px-6 font-medium text-gray-700 hover:bg-gray-50'
          >
            <ArrowLeft size={18} />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            disabled={isSaving}
            className='flex h-11 items-center gap-2 rounded-lg bg-[#535AF1] px-8 font-medium text-white hover:bg-[#444ACF]'
          >
            {isSaving ? 'Saving...' : currentStep === 1 ? 'Next' : 'Finish'}
            {!isSaving && currentStep === 1 && <ArrowRight size={18} />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default TiersWizardView
