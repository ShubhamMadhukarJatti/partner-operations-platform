'use client'

import React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface SubscriptionDetailsSidebarProps {
  selectedPlanTitle: string
  seatCount: number
  pricePerSeat: number
  currency?: string
}

export function SubscriptionDetailsSidebar({
  selectedPlanTitle,
  seatCount,
  pricePerSeat,
  currency = '₹'
}: SubscriptionDetailsSidebarProps) {
  const subtotal = pricePerSeat * seatCount
  const discount = 0
  const tax = Math.round(subtotal * 0.18)
  const totalMonthly = subtotal - discount + tax

  return (
    <Card className='h-fit overflow-hidden rounded-xl border-[#E4E7EE] shadow-sm'>
      <div className='bg-[#6863FB] px-5 py-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-lg font-semibold text-white'>
            Subscription details
          </h2>
          <Select defaultValue='INR'>
            <SelectTrigger className='dark:bg-white/5/20 h-8 w-auto border-0 bg-white text-white [&>span]:text-white'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='INR'>INR</SelectItem>
              <SelectItem value='USD'>USD</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <CardContent className='space-y-4 bg-white p-5 dark:bg-white/5'>
        <p className='text-sm font-medium text-[#323232]'>Selected features</p>
        <div className='space-y-3'>
          <div className='flex items-start justify-between gap-4'>
            <div>
              <p className='font-semibold text-[#323232]'>
                {selectedPlanTitle}
              </p>
              <p className='text-sm text-[#717182]'>
                {seatCount} seat{seatCount !== 1 ? 's' : ''}
              </p>
            </div>
            <span className='shrink-0 font-medium text-[#323232]'>
              {currency}
              {(pricePerSeat * seatCount).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <Separator className='bg-[#E4E7EE]' />

        <div className='flex justify-between text-sm'>
          <span className='text-[#717182]'>Subtotal</span>
          <span className='text-[#323232]'>
            {currency}
            {subtotal.toLocaleString('en-IN')}
          </span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-[#717182]'>Discount</span>
          <span className='text-[#717182]'>
            -{currency}
            {discount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className='flex justify-between text-sm'>
          <span className='text-[#717182]'>Tax</span>
          <span className='text-[#323232]'>
            {currency}
            {tax.toLocaleString('en-IN')}
          </span>
        </div>

        <Separator className='bg-[#323232]/10' />

        <div className='rounded-lg bg-[#F9FAFB] px-3 py-3'>
          <div className='flex items-center justify-between'>
            <span className='font-semibold text-[#323232]'>Total Monthly</span>
            <span className='text-lg font-bold text-[#323232]'>
              {currency}
              {totalMonthly.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
        <p className='text-xs text-[#717182]'>
          No charge during the trial. Cancel anytime
        </p>
      </CardContent>
    </Card>
  )
}
