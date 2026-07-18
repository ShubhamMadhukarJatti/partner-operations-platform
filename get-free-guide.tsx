import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

export default function GetFreeGuide() {
  return (
    <div className='lg:0 w-full bg-[#EEF0FD] py-8'>
      <MaxWidthWrapper className='flex flex-col items-center justify-between gap-8 md:flex-row md:gap-12'>
        <div className='flex flex-col items-start space-y-4 px-4 md:basis-1/2 md:px-0'>
          <p className='text-xs font-semibold uppercase text-text-100 sm:text-sm'>
            Unlock Global Partnerships
          </p>
          <h2 className='text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl'>
            Introducing Cross Border Partnerships
          </h2>
          <p className='text-sm font-light text-text-100 sm:text-base md:text-lg lg:text-xl'>
            Find Companies all across the world to make it easy for your brand
            to dive into your non-native countries using your Partner&apos;s
            Market.
          </p>
          <Link
            href={'/register'}
            className='hover:bg-primary-light-blue/90 mt-2 inline-flex h-10 items-center gap-2 rounded-md bg-primary-light-blue px-4 text-sm font-medium text-white transition-colors sm:h-12 sm:px-6 sm:text-base'
          >
            Join Sharkdom&apos;s Network for FREE{' '}
            <ArrowRight className='h-4 w-4 sm:h-5 sm:w-5' />
          </Link>
        </div>
        <div className='mt-8 md:mt-0 md:basis-1/2'>
          <Image
            src={'/cross-border.png'}
            width={480}
            height={580}
            alt='Cross Border Partnerships'
            className='mx-auto h-auto w-full max-w-md md:max-w-full'
          />
        </div>
      </MaxWidthWrapper>
    </div>
  )
}
