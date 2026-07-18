'use client'

import React from 'react'
import { Check, Minus, Plus } from 'lucide-react'

import { subscriptionPlans } from '@/lib/constants/subscription-constants'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'

type Plan = (typeof subscriptionPlans)[0]

interface SubscriptionPlanCardProps {
  plan: Plan
  className?: string
  onUpgrade?: () => void
  isLoading?: boolean
  isCurrentPlan?: boolean
  isSelected?: boolean
  seatCount?: number
  onSeatChange?: (count: number) => void
}

const SubscriptionPlanCard: React.FC<SubscriptionPlanCardProps> = ({
  plan,
  className = '',
  onUpgrade,
  isLoading = false,
  isCurrentPlan = false,
  isSelected = false,
  seatCount = 0,
  onSeatChange
}) => {
  const handleIncrement = () => {
    if (!isSelected) onUpgrade?.()
    onSeatChange?.(Math.min(4, (seatCount ?? 0) + 1))
  }
  const handleDecrement = () => {
    if (!isSelected) onUpgrade?.()
    onSeatChange?.(Math.max(0, (seatCount ?? 0) - 1))
  }

  const basePrice = parseInt(plan.price?.replace(/[^0-9]/g, '') || '0', 10)
  const currency = plan.price?.replace(/[0-9.,]/g, '')?.trim() || '₹'
  const users = Math.max(0, seatCount ?? 0)
  const total = basePrice * users

  return (
    <Card
      className={cn(
        'flex flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-colors dark:bg-white/5',
        isSelected
          ? 'border-[#6863FB] ring-1 ring-[#6863FB]'
          : 'border-[#E4E7EE]',
        className
      )}
      onClick={() => !isCurrentPlan && onUpgrade?.()}
    >
      <CardHeader className='flex flex-row items-start justify-between gap-2 space-y-0 border-b-0 pb-3'>
        <h3 className='text-base font-bold text-[#323232]'>{plan.title}</h3>
        <span className='shrink-0 text-sm text-[#717182]'>
          {currency}
          {basePrice.toLocaleString('en-IN')} / user
        </span>
      </CardHeader>
      <CardContent className='flex-1 space-y-4 pt-0'>
        <p className='text-sm font-semibold text-[#323232]'>Top features:</p>
        <ul className='space-y-2'>
          {plan.features.slice(0, 5).map((feature, index) => (
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

        <div
          className='flex items-center justify-between gap-2 pt-2'
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <div className='flex items-center gap-1'>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full border-[#E4E7EE] bg-white hover:bg-[#F9FAFB] dark:bg-white/5'
              onClick={(e) => {
                e.stopPropagation()
                handleDecrement()
              }}
              disabled={isCurrentPlan || users <= 0}
            >
              <Minus className='h-4 w-4' />
            </Button>
            <span className='min-w-[2rem] text-center text-sm font-medium text-[#323232]'>
              {users}
            </span>
            <Button
              type='button'
              variant='outline'
              size='icon'
              className='h-8 w-8 rounded-full border-[#E4E7EE] bg-white hover:bg-[#F9FAFB] dark:bg-white/5'
              onClick={(e) => {
                e.stopPropagation()
                handleIncrement()
              }}
              disabled={isCurrentPlan || users >= 4}
            >
              <Plus className='h-4 w-4' />
            </Button>
            <span className='ml-1 text-sm text-[#717182]'>Users</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className='flex items-center justify-end border-t-0 pt-3'>
        <span className='text-sm text-[#323232]'>
          <span className='text-[#717182]'>{currency}</span>
          <span className='font-bold'>
            {total.toLocaleString('en-IN')}
          </span>{' '}
          Total
        </span>
      </CardFooter>
    </Card>
  )
}

export default SubscriptionPlanCard
