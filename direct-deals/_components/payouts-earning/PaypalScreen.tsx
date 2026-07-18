'use client'

import React from 'react'
import Image from 'next/image'
import { steps } from 'framer-motion'

interface PaypalScreenProps {
  title: string
  description: string
  icon: string
  steps: {
    step: number
    title: string
    description: string
  }[]
}

const PaypalScreen: React.FC<PaypalScreenProps> = ({
  title,
  description,
  icon,
  steps
}) => {
  return (
    <div className='px-5 py-4'>
      <div>
        <div className='mb-4 flex flex-col items-center justify-center'>
          <Image className='mb-4' src={icon} alt='' width={56} height={56} />
          <p className='mb-1 text-center text-base/5 font-bold text-text-100'>
            {title}
          </p>
          <p className='max-w-[356px] text-center text-sm/4 font-normal text-text-80'>
            {description}
          </p>
        </div>

        <div className='flex flex-col gap-8 rounded-xl border border-text-20 p-4'>
          {steps.map((step) => (
            <div key={step.step} className='flex items-center gap-2.5'>
              <div className='flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-[#0085CC]/20 text-xs'>
                {step.step}
              </div>
              <div>
                <p className='text-xs font-bold text-text-100'>{step.title}</p>
                <p className='text-sm/4 font-normal text-text-80'>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PaypalScreen
