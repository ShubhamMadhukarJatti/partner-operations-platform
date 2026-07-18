'use client'

import React, { useState } from 'react'

import {
  colors,
  icons,
  summaryData
} from '@/lib/constants/subscription-constants'

interface SummarySectionProps {
  className?: string
  currentSubscription?: any
  selectedPlan?: any
  additionalSeats?: number
}

const SummarySection: React.FC<SummarySectionProps> = ({
  className = '',
  currentSubscription,
  selectedPlan,
  additionalSeats = 0
}) => {
  const [userCount, setUserCount] = useState(additionalSeats || 0)

  const handleIncrement = () => setUserCount((prev) => prev + 1)
  const handleDecrement = () => setUserCount((prev) => Math.max(0, prev - 1))

  // Calculate totals based on real data
  const basePlanPrice =
    selectedPlan?.price || currentSubscription?.price?.amount || 0
  const basePlanCurrency =
    selectedPlan?.currency || currentSubscription?.price?.currency || '$'
  const seatPrice = 20 // ₹20 per additional seat per month
  const additionalUsersTotal = userCount * seatPrice * 12 // ₹20 per month × users × 12 months
  const grandTotal = basePlanPrice * 12 + additionalUsersTotal // Base plan + additional users

  return (
    <div
      className={`rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:bg-white/5 ${className}`}
      style={{
        backgroundColor: colors.summary.background,
        boxShadow: colors.summary.shadow
      }}
    >
      {/* Summary Title */}
      <h3
        className='mb-6 text-lg font-bold'
        style={{ color: colors.main.textDark }}
      >
        Summary
      </h3>

      {/* Subscription Plan */}
      <div className='mb-6'>
        <div className='mb-2 flex items-start justify-between'>
          <div>
            <h4
              className='text-sm font-bold'
              style={{ color: colors.main.textDark }}
            >
              {selectedPlan?.title ||
                currentSubscription?.price?.planType ||
                'Current Plan'}
            </h4>
            <p className='text-sm' style={{ color: colors.sidebar.text }}>
              {basePlanCurrency}
              {basePlanPrice}/month x 1 plan x 12 months
            </p>
          </div>
          <span
            className='text-sm font-bold'
            style={{ color: colors.main.textDark }}
          >
            {basePlanCurrency}
            {basePlanPrice * 12}
          </span>
        </div>
        <p
          className='text-xs italic'
          style={{ color: colors.sidebar.textLight }}
        >
          Billed Every Year
        </p>
      </div>

      {/* Additional Users */}
      {userCount > 0 && (
        <div className='mb-6'>
          <div className='mb-2 flex items-start justify-between'>
            <div>
              <h4
                className='text-sm font-bold'
                style={{ color: colors.main.textDark }}
              >
                Additional Seats
              </h4>
              <p className='text-sm' style={{ color: colors.sidebar.text }}>
                ₹{seatPrice}/month x {userCount} seats x 12 months
              </p>
            </div>
            <span
              className='text-sm font-bold'
              style={{ color: colors.main.textDark }}
            >
              ₹{additionalUsersTotal.toLocaleString()}.00
            </span>
          </div>
          <p
            className='text-xs italic'
            style={{ color: colors.sidebar.textLight }}
          >
            Billed Every Year
          </p>
        </div>
      )}

      {/* Total */}
      <div className='mb-6 border-t border-gray-200 pt-4 dark:border-border'>
        <div className='flex items-center justify-between'>
          <span className='text-sm' style={{ color: colors.sidebar.text }}>
            Total
          </span>
          <span
            className='text-xl font-bold'
            style={{ color: colors.main.textDark }}
          >
            {basePlanCurrency}
            {grandTotal.toLocaleString()}.00
          </span>
        </div>
      </div>

      {/* Proceed to Pay Button */}
      <button
        className='w-full rounded px-4 py-3 font-medium text-white transition-colors hover:opacity-90'
        style={{
          backgroundColor: colors.summary.buttonBackground,
          color: colors.summary.buttonText
        }}
      >
        Proceed to Pay
      </button>
    </div>
  )
}

export default SummarySection
