'use client'

import React, { memo } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

const AssistantBanner = () => {
  const router = useRouter()

  return (
    <div
      className='relative overflow-hidden rounded-[14px] p-6'
      style={{
        background:
          'linear-gradient(136.1deg, rgba(213, 136, 252, 0.1) 1.84%, rgba(0, 123, 255, 0.1) 100%)'
      }}
    >
      <h3 className='text-[20px] font-medium text-[#2A3241] dark:text-white'>
        Still not finding the right partner match?
      </h3>
      <p className='mb-5 mt-1 text-[15px] text-[#4d535e] dark:text-gray-300'>
        Find partners with the highest chance of partner-led growth.
      </p>

      <div
        className='relative flex flex-col items-start justify-between gap-6 rounded-[12px] p-5 md:flex-row md:items-center'
        style={{ background: '#FFFFFF80' }}
      >
        {/* Gradient Border Mask */}
        <div
          className='pointer-events-none absolute inset-0 rounded-[12px]'
          style={{
            padding: '1px',
            background:
              'linear-gradient(136.1deg, #D588FC 1.84%, #007BFF 100%)',
            WebkitMask:
              'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude'
          }}
        />
        <div className='flex gap-4'>
          <div className='shrink-0 pt-1'>
            <img
              src='/dweepicon.svg'
              alt='Dweep AI'
              className='h-[28px] w-[41px] object-contain'
            />
          </div>
          <div className='flex flex-col'>
            <span
              className='text-[18px] font-semibold'
              style={{
                background:
                  'linear-gradient(90.05deg, #F49C46 0.04%, #D96570 3.78%, #9B72CB 9.78%, #5489D6 15.03%, #1BA1E3 21.46%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Dweep Agentic Scouting
            </span>
            <p className='mt-1 text-[13px] leading-relaxed text-[#4d535e] dark:text-gray-300'>
              AI-powered company search that reasons through your goals - not
              just keywords.
              <br className='hidden sm:block' />
              Describe what you're looking for, and we surface ranked matches
              with explained fit scores, partnership signals, and mutual
              connections.
            </p>
          </div>
        </div>

        <Button
          onClick={() => router.push('/dweep-ai')}
          className='h-[40px] shrink-0 rounded-[8px] px-6 text-[14px] font-semibold text-white hover:opacity-90'
          style={{ background: '#6863FB' }}
        >
          Try it now
        </Button>
      </div>
    </div>
  )
}

export default memo(AssistantBanner)
