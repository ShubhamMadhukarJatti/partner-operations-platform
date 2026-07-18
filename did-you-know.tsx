'use client'

import Image from 'next/image'
import CountUp from 'react-countup'

import MaxWidthWrapper from '@/components/ui/max-width-wrapper'

function DidYouKnow() {
  return (
    <div className='flex w-full flex-col justify-center rounded-3xl bg-[#F0F3F8] px-4 py-8 sm:px-8 sm:py-12 lg:px-12 lg:py-16'>
      <h4 className='text-center text-xl font-bold text-shark-blue-950 sm:text-2xl lg:text-4xl'>
        Transform your business
      </h4>
      <p className='pt-2 text-center text-lg font-medium text-text-60 sm:text-xl lg:text-2xl'>
        See how YC-Backed companies boosted their metrics
      </p>

      <MaxWidthWrapper>
        <div className='mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12'>
          <StatItem
            imageSrc='/timer.svg'
            value={75}
            label='Average time saved in partnership process'
          />
          <StatItem
            imageSrc='/presention-chart.svg'
            value={46}
            label='Increase in revenue & signups'
          />
          <StatItem
            imageSrc='/share.svg'
            value={39}
            label='Higher rate of finding Ideal Partner for your Startup'
          />
        </div>
      </MaxWidthWrapper>
      <span id='counter' className='hidden' />
    </div>
  )
}

interface StatItemProps {
  imageSrc: string
  value: number
  label: string
}

function StatItem({ imageSrc, value, label }: StatItemProps) {
  return (
    <div className='flex flex-col items-center'>
      <div className='flex items-center justify-center gap-2 sm:gap-4'>
        <Image
          src={imageSrc}
          width={48}
          height={48}
          alt='Statistic icon'
          className='h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20'
        />
        <div className='flex items-baseline'>
          <CountUp
            start={0}
            end={value}
            duration={5}
            delay={1}
            enableScrollSpy
            className='text-3xl font-extrabold text-text-100 sm:text-4xl lg:text-5xl'
          />
          <span className='text-2xl font-extrabold text-[#1D2939] sm:text-3xl lg:text-4xl'>
            %
          </span>
        </div>
      </div>
      <p className='mt-2 max-w-[250px] text-center text-sm font-normal sm:text-base lg:text-lg'>
        {label}
      </p>
    </div>
  )
}

export default DidYouKnow
