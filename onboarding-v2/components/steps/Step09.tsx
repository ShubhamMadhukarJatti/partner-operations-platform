'use client'

import { useState } from 'react'

import { Input } from '@/components/ui/input'

const Step09 = () => {
  const options = [
    'Enable to partnerships via Sharkdom’s Discover Engine',
    'Using Partner channels to market your product via Sharkdom’s Partnership Marketing tool',
    'Manage your current partnerships via Sharkdom PRM',
    'All of the above',
    'Just exploring for fun'
  ]
  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <p className='text-center align-middle font-inter text-[20px] font-normal leading-[30px] tracking-[0px] text-[#7688A8]'>
            Partnership Context
          </p>

          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            What is your Goal to use Sharkdom?
          </h1>

          <div className='flex flex-col gap-4'>
            {options.map((label, index) => (
              <label
                key={index}
                className='flex h-[56px] w-[560px] cursor-pointer items-center justify-between rounded-lg border-[1.5px] border-[#2563EB] p-4 text-sm font-medium text-[#2563EB]'
              >
                <span>{label}</span>
                <Input type='checkbox' className='h-4 w-4 accent-[#2563EB]' />
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – 40% */}
      <div className='flex w-[40%] items-center justify-center px-6'>
        <div className='relative h-[90%] w-[90%] overflow-hidden rounded-2xl'>
          <img
            src='/Onboarding-bgv2.png'
            alt='Onboarding Background'
            className='h-full w-full rounded-2xl object-cover'
          />
          {/* Overlayed Image */}
          <div className='absolute inset-0 flex items-center justify-center px-6'>
            <img
              src='step03-bg.png'
              alt='Overlay Image'
              className='max-h-[80%] max-w-[80%] object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step09
