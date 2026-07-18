'use client'

import React from 'react'

import { Button } from '@/components/ui/button'

interface SubscriptionSummaryProps {
  selectedPlan: any
  seatCount: number
  onProceed: () => void
  isLoading?: boolean
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({
  selectedPlan,
  seatCount,
  onProceed,
  isLoading = false
}) => {
  const seatPrice = 20
  const totalUsers = Math.max(1, seatCount)
  const additionalUsers = Math.max(0, totalUsers - 1)

  const basePrice = parseInt(
    selectedPlan?.price?.replace(/[^0-9]/g, '') || '0',
    10
  )
  const currency = selectedPlan?.price?.replace(/[0-9.,]/g, '')?.trim() || '₹'

  const baseTotal = basePrice * 12
  const additionalTotal = additionalUsers * seatPrice * 12
  const grandTotal = baseTotal + additionalTotal

  const formatTotal = (value: number) => `${currency}${value.toFixed(2)}`

  return (
    <div>
      <p className='text-[14px] font-semibold text-[#111111]'>Summary</p>

      <div className='mt-6 space-y-6'>
        <section className='space-y-3 border-b border-[#F0F0F5] pb-6'>
          <p className='text-xs tracking-wide text-[#717182]'>
            Subscription Plan
          </p>

          <div className='flex flex-col gap-2'>
            <p className='text-[20px] font-semibold text-[#323232]'>
              {selectedPlan?.title || 'Select a Plan'}
            </p>

            <div className='flex flex-wrap items-baseline gap-1'>
              <span className='text-[20px] font-semibold text-[#323232]'>
                {currency}
                {basePrice}
              </span>
              <span className='text-xs text-[#717182]'>
                / per month x 1 user x 12 months
              </span>
            </div>

            <p className='text-xs italic text-[#717182]'>Billed Every Year</p>
          </div>

          <div className='flex items-start justify-between'>
            <span className='text-xs text-transparent'>.</span>
            <span className='text-[20px] font-semibold text-[#323232]'>
              {formatTotal(baseTotal)}
            </span>
          </div>
        </section>

        {additionalUsers > 0 && (
          <section className='space-y-3 border-b border-[#F0F0F5] pb-6'>
            <p className='text-xs capitalize text-[#717182]'>
              additional users
            </p>

            <div className='flex flex-col gap-2'>
              <p className='text-[20px] font-semibold text-[#323232]'>
                {selectedPlan?.title || 'Partnership Enterprise'}
              </p>

              <div className='flex flex-wrap items-baseline gap-1'>
                <span className='text-[20px] font-bold text-[#323232]'>
                  {currency}
                  {seatPrice}
                </span>
                <span className='text-xs text-[#717182]'>
                  / per month x {additionalUsers} users x 12 months
                </span>
              </div>

              <p className='text-xs italic text-[#717182]'>Billed Every Year</p>
            </div>

            <div className='flex items-start justify-between'>
              <span className='text-xs text-transparent'>.</span>
              <span className='text-[20px] font-bold text-[#323232]'>
                {formatTotal(additionalTotal)}
              </span>
            </div>
          </section>
        )}

        <section className='flex items-center justify-between pt-2'>
          <span className='text-sm text-[#717182]'>Total</span>
          <span className='text-[20px] font-bold text-[#323232]'>
            {formatTotal(grandTotal)}
          </span>
        </section>
      </div>

      <Button
        onClick={onProceed}
        disabled={isLoading || !selectedPlan}
        className='mt-4 w-full rounded-lg bg-[#6863FB] py-2.5 text-sm font-semibold text-white hover:bg-[#5b57e6] disabled:bg-[#B6B4F7] disabled:text-white/90'
      >
        {isLoading ? 'Processing...' : 'Proceed to Pay'}
      </Button>
    </div>
  )
}

export default SubscriptionSummary
