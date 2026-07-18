import React from 'react'
import Image from 'next/image'
import { url } from 'inspector'

import { cn } from '@/lib/utils'
import { FullLogo2, FullLogoWhite } from '@/components/icons/logo'

const MistakeSection = () => {
  return (
    <div className='flex flex-col gap-9 '>
      <h3 className='text-[48px] font-bold'>Common Mistakes</h3>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2'>
        <div className='flex w-full flex-col gap-6'>
          <div className='relative flex h-[443px] items-center justify-center overflow-hidden rounded-xl border border-[#C8CFDC] bg-white'>
            <div className='absolute right-0 top-0 h-full w-full'>
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 100 100'
                preserveAspectRatio='none'
              >
                <line
                  x1='100'
                  y1='0'
                  x2='0'
                  y2='100'
                  stroke='#FF0000'
                  strokeWidth='0.5'
                />
              </svg>
            </div>
            <Image
              src={'/icons/sharkdom-logo-teal.svg'}
              width={317}
              height={61}
              alt='Sharkdom logo'
              unoptimized
              className={cn('object-contain')}
            />
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            Do not apply partner brand colors to the logo{' '}
          </p>
        </div>
        <div className='flex w-full flex-col gap-6'>
          <div className='relative flex h-[443px] items-center justify-center overflow-hidden rounded-xl border border-[#C8CFDC] bg-white'>
            <div className='absolute right-0 top-0 h-full w-full'>
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 100 100'
                preserveAspectRatio='none'
              >
                <line
                  x1='100'
                  y1='0'
                  x2='0'
                  y2='100'
                  stroke='#FF0000'
                  strokeWidth='0.5'
                />
              </svg>
            </div>
            <Image
              src={'/icons/modified-logo.svg'}
              width={317}
              height={61}
              alt='Sharkdom logo'
              unoptimized
              className={cn('object-contain')}
            />
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            Do not modify logo colors
          </p>
        </div>
        <div className='flex w-full flex-col gap-6'>
          <div className='relative flex h-[443px] items-center justify-center overflow-hidden rounded-xl border border-[#C8CFDC] bg-white'>
            <div className='absolute right-0 top-0 h-full w-full'>
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 100 100'
                preserveAspectRatio='none'
              >
                <line
                  x1='100'
                  y1='0'
                  x2='0'
                  y2='100'
                  stroke='#FF0000'
                  strokeWidth='0.5'
                />
              </svg>
            </div>
            <Image
              src={'/icons/shadowd-logo.svg'}
              width={317}
              height={61}
              alt='Sharkdom logo'
              unoptimized
              className={cn('object-contain')}
            />
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            Do not modify logo colors
          </p>
        </div>

        <div className='flex w-full flex-col gap-6'>
          <div className='relative flex h-[443px] items-center justify-center overflow-hidden rounded-xl border border-[#C8CFDC] bg-[#C944AE]'>
            <div className='absolute right-0 top-0 h-full w-full'>
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 100 100'
                preserveAspectRatio='none'
              >
                <line
                  x1='100'
                  y1='0'
                  x2='0'
                  y2='100'
                  stroke='#FF0000'
                  strokeWidth='0.5'
                />
              </svg>
            </div>
            <FullLogoWhite className='h-[61px] w-[317px]' />
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            Do not place the logo on non-brand colors unless it is a partner
            brand color.
          </p>
        </div>
        <div className='flex w-full flex-col gap-6'>
          <div className='relative flex h-[443px] items-center justify-center overflow-hidden rounded-xl border border-[#C8CFDC] bg-white'>
            <div className='absolute right-0 top-0 h-full w-full'>
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 100 100'
                preserveAspectRatio='none'
              >
                <line
                  x1='100'
                  y1='0'
                  x2='0'
                  y2='100'
                  stroke='#FF0000'
                  strokeWidth='0.5'
                />
              </svg>
            </div>
            <FullLogo2 className='rotate h-[61px] w-[317px] rotate-[30deg]' />
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            Do not rotate the logo.
          </p>
        </div>
        <div className='flex w-full flex-col gap-6'>
          <div className='relative flex h-[443px] items-center justify-center overflow-hidden rounded-xl border border-[#C8CFDC]'>
            <Image src='/icons/busy-street.png' fill alt='' />
            <div className='absolute right-0 top-0 h-full w-full'>
              <svg
                width='100%'
                height='100%'
                viewBox='0 0 100 100'
                preserveAspectRatio='none'
              >
                <line
                  x1='100'
                  y1='0'
                  x2='0'
                  y2='100'
                  stroke='#FF0000'
                  strokeWidth='0.5'
                />
              </svg>
            </div>
            <FullLogo2 className='z-10 h-[61px] w-[317px]' />
          </div>
          <p className='text-base font-normal text-[#4E4E4E]'>
            Do not place the logo on busy background.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MistakeSection
