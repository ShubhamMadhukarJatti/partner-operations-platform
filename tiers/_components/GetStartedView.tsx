import React from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

interface GetStartedViewProps {
  onStart: () => void
}

const GetStartedView = ({ onStart }: GetStartedViewProps) => {
  return (
    <div className='flex h-[calc(100vh-80px)] w-full flex-col overflow-hidden bg-white lg:flex-row'>
      {/* Left Side */}
      <div className='flex w-full flex-col justify-center px-6 py-10 lg:w-[45%] lg:pl-16 lg:pr-10 xl:pl-24'>
        <div className='mb-6'>
          <Image
            src='/assets/tiers/deal_title_img.png'
            alt='Deal Title Icon'
            width={120}
            height={120}
            className='object-contain'
          />
        </div>

        <h1 className='mb-6 text-[40px] font-bold leading-tight text-black sm:text-[48px] lg:text-[56px]'>
          Its easy to set your Tier
        </h1>

        <p className='mb-8 max-w-lg text-lg leading-relaxed text-gray-600'>
          You can set the pricing and categorize the pricing by naming the
          tiers, this will help resellers to understand your pricing better
        </p>

        <div>
          <Button
            onClick={onStart}
            className='h-12 w-40 rounded-lg bg-[#535AF1] text-base font-medium text-white hover:bg-[#444ACF]'
          >
            Get Started
          </Button>
        </div>
      </div>

      {/* Right Side */}
      <div className='relative hidden h-full w-full items-center justify-center bg-gray-50/50 lg:flex lg:w-[55%]'>
        <Image
          src='/assets/tiers/deal_get_started_main_img.png'
          alt='Deal Visualization'
          fill
          className='object-cover object-left'
          priority
        />
      </div>
    </div>
  )
}

export default GetStartedView
