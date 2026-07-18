'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Elements } from '@stripe/react-stripe-js'

import {
  createBillingSubscription,
  fetchProductIdsByModules
} from '@/lib/db/payment'
import {
  clearFreeTrialPlanSession,
  isFreeTrialPlanReadyForPayment,
  readFreeTrialPlanSession
} from '@/lib/free-trial-plan-session'
import { getStripe } from '@/lib/stripe'
import { useBillingCycle } from '@/hooks/useBillingCycle'
import { showCustomToast } from '@/components/custom-toast'
import {
  ConfirmPlanView,
  type ConfirmPlanLineItem
} from '@/components/subscription/ConfirmPlanView'

const TRIAL_DAYS = 14

export default function FreeTrialPaymentPage() {
  const router = useRouter()
  const stripePromise = getStripe()

  const [sessionReady, setSessionReady] = useState(false)
  const [sessionValid, setSessionValid] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currencyCode, setCurrencyCode] = useState<'INR' | 'USD'>('USD')
  const [stripeCustomerId, setStripeCustomerId] = useState<string | null>(null)

  const [selectedFeatures, setSelectedFeatures] = useState<
    ConfirmPlanLineItem[] | null
  >(null)
  const [billingCycle, setBillingCycle] = useBillingCycle('monthly')
  const [moduleNames, setModuleNames] = useState<string[]>([])
  const [registrationEmail, setRegistrationEmail] = useState<string | null>(
    null
  )

  useEffect(() => {
    const session = readFreeTrialPlanSession()
    if (!isFreeTrialPlanReadyForPayment(session)) {
      router.replace('/free-trial/plans')
      setSessionReady(true)
      return
    }
    setRegistrationEmail(session.registrationEmail)
    setSelectedFeatures(session.selectedFeatures)
    setModuleNames(session.moduleNames)
    setCurrencyCode(session.currencyCode)
    setBillingCycle(session.billingCycle)
    setSessionValid(true)
    setSessionReady(true)
  }, [router, setBillingCycle])

  const handleCardAdded = (customerId: string) => {
    setStripeCustomerId(customerId)
    showCustomToast('Success', 'Card added successfully!', 'success', 3000)
  }

  const handleSubscribe = async () => {
    if (!stripeCustomerId) {
      showCustomToast('Error', 'Please add a payment card first', 'error', 5000)
      return
    }
    if (!selectedFeatures || moduleNames.length === 0) return

    setIsProcessing(true)
    try {
      const productsRes = await fetchProductIdsByModules(moduleNames)
      const productIds: string[] = (productsRes?.data ?? []).map(
        (p: { productId: string }) => p.productId
      )

      if (!productIds.length) {
        throw new Error('Could not resolve products for selected modules.')
      }

      const subtotal = selectedFeatures.reduce(
        (sum, item) => sum + item.pricePerSeat * item.seats,
        0
      )
      const tax = Math.round(subtotal * 0.18)
      const totalAmount = subtotal + tax

      await createBillingSubscription({
        customerId: stripeCustomerId,
        productIds,
        interval: billingCycle,
        amount: totalAmount * 100,
        currency: currencyCode,
        trialPeriodDays: TRIAL_DAYS
      })

      showCustomToast(
        'Success',
        `Your ${TRIAL_DAYS}-day free trial has started!`,
        'success',
        5000
      )

      clearFreeTrialPlanSession()
      router.push('/offline-partners')
    } catch (error) {
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'Failed to start trial',
        'error',
        5000
      )
    } finally {
      setIsProcessing(false)
    }
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
        {!sessionReady || !sessionValid || !selectedFeatures ? (
          <div className='flex min-h-[40vh] items-center justify-center'>
            <div className='h-8 w-8 animate-spin rounded-full border-2 border-[#6863FB] border-t-transparent' />
          </div>
        ) : (
          <Elements
            stripe={stripePromise}
            options={{
              appearance: {
                theme: 'stripe',
                variables: { colorPrimary: '#6863FB' }
              }
            }}
          >
            <ConfirmPlanView
              selectedFeatures={selectedFeatures}
              currencyCode={currencyCode}
              onCurrencyChange={setCurrencyCode}
              trialDays={TRIAL_DAYS}
              moduleNames={moduleNames}
              freeTrialSubscriptionEmail={registrationEmail ?? undefined}
              onBack={() => {
                setStripeCustomerId(null)
                router.push('/free-trial/plans')
              }}
              onCardAdded={handleCardAdded}
              onNoSavedCards={() => setStripeCustomerId(null)}
              onSubscribe={handleSubscribe}
              isSubmitting={isProcessing}
              isSubscribeReady={!!stripeCustomerId}
            />
          </Elements>
        )}
      </div>
    </div>
  )
}
