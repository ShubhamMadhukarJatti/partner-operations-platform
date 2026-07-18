'use client'

import React from 'react'

interface SubscriptionCardProps {
  className?: string
  onUpgradeClick?: () => void
  subscription?: any
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  className = '',
  onUpgradeClick,
  subscription
}) => {
  const normalizedSubscription = Array.isArray(subscription)
    ? subscription[0]
    : subscription

  // Extract data from the new billing overview API structure
  const subscriptionPlan = normalizedSubscription?.subscriptionPlan
  const subscriptionSummary = normalizedSubscription?.subscriptionSummary

  const rawStatus =
    subscriptionSummary?.status?.toString?.() ||
    normalizedSubscription?.status?.toString?.() ||
    ''
  const status = rawStatus.toUpperCase()

  const isActive = status === 'ACTIVE' || status === 'CREATED'
  const isTrialStatus = status === 'TRIALING' || status === 'TRIAL'

  const formatSuiteName = (name: string) =>
    name
      .replace(/_MONTHLY$|_YEARLY$/i, '')
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const displayPlanFromCode = (planCode: string) => {
    const normalizedCode = planCode.toUpperCase()

    const planMap: Record<string, string> = {
      FREE: 'Free',
      STANDARD: 'Standard',
      PREMIUM: 'Premium',
      ELITE: 'Elite',
      STANDARD_TRIAL: 'Standard Trial',
      PREMIUM_TRIAL: 'Premium Trial',
      STARTER: 'Starter',
      PARTNERSHIP_ACCELERATOR: 'Partnership Accelerator',
      PARTNER_ONBOARDING_MONTHLY: 'Partner Onboarding',
      DEAL_REGISTRATION_MONTHLY: 'Deal Registration'
    }

    if (planMap[normalizedCode]) return planMap[normalizedCode]

    if (normalizedCode.includes('STANDARD')) return 'Standard'
    if (normalizedCode.includes('PREMIUM')) return 'Premium'

    if (
      normalizedCode.includes('ELITE') ||
      normalizedCode.includes('ENTERPRISE')
    ) {
      return 'Elite'
    }

    if (normalizedCode.includes('TRIAL')) return 'Free Trial'

    if (normalizedCode.includes('ACCELERATOR')) {
      return 'Partnership Accelerator'
    }

    return planCode
  }

  const activeSuites: string[] =
    subscriptionSummary?.activeSuites ||
    normalizedSubscription?.activeSuites ||
    []

  const currentPlanName =
    (activeSuites.length > 0
      ? activeSuites.map(formatSuiteName).join(', ')
      : null) || (isTrialStatus ? 'Free Trial' : 'Free')

  const getPriceText = () => {
    // 1. Prioritize price from the latest invoice (as requested: "last payment is detail le")
    const latestInvoice = normalizedSubscription?.invoices?.[0]
    if (latestInvoice?.amount) {
      const amount = Number(latestInvoice.amount) / 100
      const currencyCode = (latestInvoice.currency || 'INR').toUpperCase()

      const formatter = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency:
          currencyCode === 'INR'
            ? 'INR'
            : currencyCode === '$'
              ? 'USD'
              : currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })

      return `${formatter.format(amount)} per month`
    }

    // 2. Fallback to subscriptionPlan.price
    const planPrice = subscriptionPlan?.price
    const seats = subscriptionPlan?.numberOfSeats || 1

    if (typeof planPrice === 'number') {
      const actualPrice = planPrice
      const countryCode = subscriptionPlan?.country === 'IN' ? 'en-IN' : 'en-US'
      const currencyCode = subscriptionPlan?.country === 'IN' ? 'INR' : 'USD'
      const totalAmount = actualPrice * (seats > 0 ? seats : 1)

      const formatter = new Intl.NumberFormat(countryCode, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      })

      if (seats > 1) {
        return `${formatter.format(totalAmount)} total / month (${formatter.format(actualPrice)} per seat)`
      }
      return `${formatter.format(actualPrice)} per month`
    }

    return 'Free'
  }

  return (
    <div
      className={`rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:border-[#252666] dark:bg-[#130F55] ${className}`}
    >
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <img
            src='/icons/subscription_plan.svg'
            alt='Subscription'
            width={20}
            height={20}
          />

          <h3 className='text-lg font-bold text-[#2A3241] dark:text-white'>
            Subscription
          </h3>
        </div>

        {/* Status Badge */}
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            isActive && currentPlanName !== 'Free Trial'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {isActive && currentPlanName !== 'Free Trial'
            ? 'Active Plan'
            : 'Free Trial'}
        </span>
      </div>

      {/* Subscription Content */}
      <div className='flex items-center justify-between'>
        <div>
          {/* Label */}
          <div className='mb-1'>
            <span className='text-xs text-[#6B7280] dark:text-white'>
              Current Plan
            </span>
          </div>

          {/* Plan Name */}
          <div className='mb-1'>
            <span className='text-base font-semibold text-[#2A3241] dark:text-white'>
              {currentPlanName}
            </span>
          </div>

          {/* Monthly Price */}
          <div>
            <span className='text-sm text-[#6B7280] dark:text-white'>
              {getPriceText()}
            </span>
          </div>
        </div>

        {/* Upgrade Button */}
        <button
          onClick={onUpgradeClick}
          className='rounded-md border border-[#6863FB] px-5 py-1.5 text-sm font-medium text-[#6863FB] transition-colors hover:bg-purple-50'
        >
          Upgrade
        </button>
      </div>
    </div>
  )
}

export default SubscriptionCard
