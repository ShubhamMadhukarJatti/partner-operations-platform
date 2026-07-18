'use client'

import React from 'react'
import Image from 'next/image'

import { SecurityLock } from '@/components/icons/icons'

interface PaymentMiddleScreensProps {
  imageUrl: string
  title: string
  description: string
  accountId: string
}

const PaymentMiddleScreens: React.FC<PaymentMiddleScreensProps> = ({
  imageUrl,
  title,
  description,
  accountId
}) => {
  return (
    <div className='flex flex-col gap-4 px-6 py-3'>
      <div className='flex flex-col items-center justify-center px-6 py-3'>
        <Image src={imageUrl} alt='wallet image' width={162} height={162} />
        <div className='flex flex-col items-center justify-center gap-0.5'>
          <p className='text-shark-lg font-bold'>{title}</p>
          <p className='text-center text-shark-base font-normal'>
            {description}
          </p>
        </div>
      </div>
      <div className='flex w-full flex-col gap-4 rounded-xl border border-text-20 p-4'>
        <p className='text-[10px]/[12px] font-bold uppercase'>
          Adding amount to
        </p>
        <p className='flex items-center gap-2.5 text-shark-sm font-bold'>
          <SecurityLock /> Account ID XXXX XXXX 0731
        </p>
      </div>
    </div>
  )
}

export default PaymentMiddleScreens
