'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import {
  clearFreeTrialPlanSession,
  persistFreeTrialPlanSession
} from '@/lib/free-trial-plan-session'
import { showCustomToast } from '@/components/custom-toast'
import type { ConfirmPlanLineItem } from '@/components/subscription/ConfirmPlanView'
import SubscriptionPage from '@/components/subscription/SubscriptionPage'

const TRIAL_DAYS = 14

function isReasonableEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export default function FreeTrialPlansPage() {
  const router = useRouter()

  // Fresh plan picker each visit — no restored draft (session is shared per tab, not per user).
  useEffect(() => {
    clearFreeTrialPlanSession()
  }, [])

  const handleContinue = (
    items: ConfirmPlanLineItem[],
    cycle: 'monthly' | 'yearly',
    modules: string[],
    currency: 'INR' | 'USD'
  ) => {
    const raw =
      typeof sessionStorage !== 'undefined'
        ? sessionStorage.getItem('email')
        : null
    const registrationEmail = raw?.trim() ?? ''
    if (!registrationEmail || !isReasonableEmail(registrationEmail)) {
      showCustomToast(
        'Error',
        'Work email not found. Complete onboarding first.',
        'error',
        5000
      )
      return
    }

    persistFreeTrialPlanSession({
      registrationEmail,
      selectedFeatures: items,
      moduleNames: modules,
      currencyCode: currency,
      billingCycle: cycle
    })
    router.push('/free-trial/payment')
  }

  return (
    <div className='flex min-h-screen flex-col bg-white'>
      <div className='sticky top-0 z-10 border-b bg-white'>
        <div className='flex items-center justify-between px-6 py-4'>
          <Image
            src='/icons/logo.png'
            alt='Sharkdom'
            height={28}
            width={120}
            className='object-contain'
          />
          <div className='rounded-full bg-[#F0FDF4] px-3 py-1 text-xs font-semibold text-[#16A34A]'>
            {TRIAL_DAYS}-day free trial
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-8'>
        <div className='mx-auto max-w-7xl'>
          <div className='mb-6 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-5 py-4'>
            <p className='text-sm font-semibold text-[#16A34A]'>
              🎉 {TRIAL_DAYS}-day free trial, no charge until your trial ends.
              Cancel anytime.
            </p>
          </div>
          <SubscriptionPage hideControls onContinue={handleContinue} />
        </div>
      </div>
    </div>
  )
}
