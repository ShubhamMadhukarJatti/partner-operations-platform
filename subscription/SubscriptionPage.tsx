'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { Check, Minus, Plus, X } from 'lucide-react'

import {
  MODULES,
  type ApiProduct,
  type ModuleItem
} from '@/lib/constants/modules'
import { getModules } from '@/lib/db/payment'
import { getUserGeo } from '@/lib/geo'
import { cn } from '@/lib/utils'
import { useBillingCycle } from '@/hooks/useBillingCycle'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { showCustomToast } from '@/components/custom-toast'
import type { ConfirmPlanLineItem } from '@/components/subscription/ConfirmPlanView'

import { SubscriptionSummaryBox } from './SubscriptionSummaryBox'

interface SubscriptionPageProps {
  className?: string
  onBackClick?: () => void
  onContinue: (
    items: ConfirmPlanLineItem[],
    billingCycle: 'monthly' | 'yearly',
    moduleNames: string[],
    currencyCode: 'INR' | 'USD'
  ) => void
  /** When true: hides the X button, hides the Cancel+footer CTA,
   *  and moves "Continue to Subscribe" into the billing toggle row */
  hideControls?: boolean
}

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({
  className = '',
  onBackClick,
  onContinue,
  hideControls = false
}) => {
  const [seatsByPlanId, setSeatsByPlanId] = useState<Record<string, number>>(
    () =>
      Object.fromEntries(MODULES.map((m) => [m.stripeID, 0])) as Record<
        string,
        number
      >
  )
  const [billingCycle, setBillingCycle] = useBillingCycle('monthly')
  const [currencyCode, setCurrencyCode] = useState<'INR' | 'USD'>('USD')
  const [apiPricing, setApiPricing] = useState<ApiProduct[]>([])

  const currencySymbol = currencyCode === 'USD' ? '$' : '₹'

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const res = await getModules()
        setApiPricing(res?.data ?? [])
      } catch (e) {
        console.error('Failed to fetch module pricing:', e)
      }
    }
    fetchPricing()
  }, [])

  useEffect(() => {
    getUserGeo().then((geo) => {
      if (geo) setCurrencyCode(geo.currency)
    })
  }, [])

  const setSeatsForPlan = (planId: string, seats: number) => {
    setSeatsByPlanId((prev) => ({ ...prev, [planId]: Math.max(0, seats) }))
  }

  /** Resolve price for a module based on billing cycle + currency, preferring API data */
  const getPrice = (module: ModuleItem): number => {
    const moduleName = module.module[billingCycle].moduleName
    const staticPrice =
      currencyCode === 'USD'
        ? module.module[billingCycle].priceUSD
        : module.module[billingCycle].priceINR

    const apiProduct = apiPricing.find((p) => p.productName === moduleName)

    if (apiProduct) {
      // Safely handle different backend JSON naming conventions (camelCase vs uppercase)
      const usdPrice =
        apiProduct.priceUSD ??
        (apiProduct as any).priceUsd ??
        (apiProduct as any).price_usd
      const inrPrice =
        apiProduct.priceINR ??
        (apiProduct as any).priceInr ??
        (apiProduct as any).price_inr

      const price = currencyCode === 'USD' ? usdPrice : inrPrice
      if (typeof price === 'number' && Number.isFinite(price) && price > 0) {
        return price
      }
    }

    return staticPrice
  }

  const selectedLineItems = useMemo(
    () =>
      MODULES.filter((m) => (seatsByPlanId[m.stripeID] ?? 0) > 0).map((m) => ({
        title: m.name,
        seats: seatsByPlanId[m.stripeID] ?? 0,
        pricePerSeat: getPrice(m),
        moduleName: m.module[billingCycle].moduleName
      })),
    [seatsByPlanId, billingCycle, currencyCode, apiPricing]
  )

  const subtotal = selectedLineItems.reduce(
    (s, i) => s + i.pricePerSeat * i.seats,
    0
  )
  /** Show cost sidebar whenever user has selected seats (not only when subtotal > 0). */
  const showSummary = selectedLineItems.length > 0

  const handleContinueToPay = () => {
    if (selectedLineItems.length === 0) {
      showCustomToast(
        'Error',
        'Please add at least one feature with users',
        'error',
        5000
      )
      return
    }
    const moduleNames = selectedLineItems.map((i) => i.moduleName)
    onContinue(
      selectedLineItems.map((i) => ({
        title: i.title,
        seats: i.seats,
        pricePerSeat: i.pricePerSeat
      })),
      billingCycle,
      moduleNames,
      currencyCode
    )
  }

  return (
    <div className={`min-h-screen bg-white dark:bg-transparent ${className}`}>
      <div className='mx-auto'>
        {/* Header */}
        <div className='mb-8 flex items-start justify-between'>
          <div>
            <h1 className='text-2 dark:text-whitexl md:text-3 dark:text-whitexl font-bold text-[#323232]'>
              Build your perfect plan
            </h1>
            <p className='mt-2 max-w-xl text-sm text-[#717182]'>
              Select your team size and choose the features you need. Scale up
              or down anytime as your business grows.
            </p>
          </div>
          {!hideControls && (
            <button
              type='button'
              onClick={onBackClick}
              className='rounded p-1 text-[#717182] hover:bg-[#F0F0F5] hover:text-[#323232]'
              aria-label='Close'
            >
              <X className='h-5 w-5' />
            </button>
          )}
        </div>

        {/* Billing toggle + inline CTA (free-trial mode) */}
        <div className='flex items-center justify-between border-b border-[#E4E7EE] px-0 py-4'>
          <ToggleGroup
            type='single'
            value={billingCycle}
            onValueChange={(v) =>
              v && setBillingCycle(v as 'monthly' | 'yearly')
            }
            className='inline-flex rounded-lg border border-[#E4E7EE] bg-[#F9FAFB] p-0.5'
          >
            <ToggleGroupItem
              value='monthly'
              className='rounded-md px-4 py-2 text-sm font-medium data-[state=on]:bg-[#6863FB] data-[state=off]:text-[#323232] data-[state=on]:text-white'
            >
              Monthly
            </ToggleGroupItem>
            <ToggleGroupItem
              value='yearly'
              className='rounded-md px-4 py-2 text-sm font-medium data-[state=on]:bg-[#6863FB] data-[state=off]:text-[#323232] data-[state=on]:text-white'
            >
              Yearly
            </ToggleGroupItem>
          </ToggleGroup>

          {hideControls && (
            <Button
              type='button'
              onClick={handleContinueToPay}
              disabled={selectedLineItems.length === 0}
              className='rounded-lg bg-[#6863FB] px-6 text-white hover:bg-[#5b57e6] disabled:bg-[#B6B4F7] disabled:text-white/90'
            >
              Continue to Subscribe
            </Button>
          )}
        </div>

        {/* Main content: cards + summary sidebar */}
        <div className='flex gap-8'>
          {/* Plan cards */}
          <div
            className={cn(
              'grid flex-1 grid-cols-1 gap-6 transition-all duration-300 ease-in-out md:grid-cols-2',
              showSummary ? 'xl:grid-cols-2' : 'xl:grid-cols-3'
            )}
          >
            {MODULES.map((module) => {
              const seats = seatsByPlanId[module.stripeID] ?? 0
              const pricePerUser = getPrice(module)
              const total = pricePerUser * seats
              const hasPurpleBadge = seats > 0

              return (
                <Card
                  key={module.stripeID}
                  className={cn(
                    'flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all duration-200',
                    hasPurpleBadge
                      ? 'border-[#6863FB] bg-[#6863FB]/[0.04]'
                      : 'border-[#E4E7EE] bg-white dark:bg-white/5'
                  )}
                >
                  <CardHeader className='flex flex-row items-center justify-between gap-2 space-y-0 border-b-0 pb-3'>
                    <h3 className='text-base font-bold text-[#323232]'>
                      {module.name}
                    </h3>
                    <span
                      className={cn(
                        'shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold',
                        hasPurpleBadge
                          ? 'bg-[#6863FB] text-white'
                          : 'bg-[#F0F0F5] text-[#323232]'
                      )}
                    >
                      {currencySymbol}
                      {pricePerUser.toLocaleString('en-IN')} / user
                    </span>
                  </CardHeader>
                  <CardContent className='flex-1 space-y-4 pt-0'>
                    <p className='text-sm font-semibold text-[#323232]'>
                      Top features:
                    </p>
                    <ul className='space-y-2'>
                      {module.features.map((feature, index) => (
                        <li
                          key={index}
                          className='flex items-start gap-2 text-sm text-[#323232]'
                        >
                          <Check
                            className='mt-0.5 h-4 w-4 shrink-0 text-[#6863FB]'
                            strokeWidth={2.5}
                          />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className='flex items-end justify-between border-t-0 pb-5 pt-3'>
                    <div
                      className='flex items-center gap-1'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        className={cn(
                          'h-8 w-8 rounded-full border-[#E4E7EE] bg-white hover:bg-[#F9FAFB] dark:bg-white/5',
                          hasPurpleBadge ? 'border-[#6863FB]/20' : ''
                        )}
                        onClick={() =>
                          setSeatsForPlan(module.stripeID, seats - 1)
                        }
                        disabled={seats <= 0}
                      >
                        <Minus className='h-4 w-4' />
                      </Button>
                      <span className='min-w-[2rem] text-center text-sm font-semibold text-[#323232]'>
                        {seats}
                      </span>
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        className={cn(
                          'h-8 w-8 rounded-full border-[#E4E7EE] bg-white hover:bg-[#F9FAFB] dark:bg-white/5',
                          hasPurpleBadge ? 'border-[#6863FB]/20' : ''
                        )}
                        onClick={() =>
                          setSeatsForPlan(module.stripeID, seats + 1)
                        }
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                      <span className='ml-1 text-xs text-[#717182]'>Users</span>
                    </div>
                    <div className='flex flex-col items-end'>
                      <span className='text-lg font-bold leading-none text-[#6863FB] md:text-xl'>
                        {currencySymbol}
                        {total.toLocaleString('en-IN')}
                      </span>
                      <span className='mt-1 text-xs text-[#717182]'>Total</span>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {/* Subscription summary sidebar — appears/disappears with animation */}
          <aside
            className={cn(
              'shrink-0 overflow-hidden transition-all duration-700 ease-in-out lg:block',
              showSummary ? 'w-[340px] opacity-100' : 'w-0 opacity-0'
            )}
          >
            <div className='sticky top-8 w-[340px]'>
              <SubscriptionSummaryBox
                useMulti={true}
                selectedFeatures={selectedLineItems}
                currencyCode={currencyCode}
                onCurrencyChange={setCurrencyCode}
                className='h-fit'
                showTaxDisclaimer={true}
              />
            </div>
          </aside>
        </div>

        {/* Footer — hidden in free-trial mode (CTA is in the toggle row) */}
        {!hideControls && (
          <div className='mt-8 flex items-center justify-between'>
            <Button
              type='button'
              variant='outline'
              onClick={onBackClick}
              className='rounded-lg border-[#E4E7EE] bg-white text-[#323232] hover:bg-[#F9FAFB] dark:bg-white/5'
            >
              Cancel
            </Button>
            <Button
              type='button'
              onClick={handleContinueToPay}
              disabled={selectedLineItems.length === 0}
              className='rounded-lg bg-[#6863FB] px-6 text-white hover:bg-[#5b57e6] disabled:bg-[#B6B4F7] disabled:text-white/90'
            >
              Continue to Pay
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionPage
