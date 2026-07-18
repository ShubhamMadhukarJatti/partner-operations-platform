'use client'

import React from 'react'

import { Input } from '@/components/ui/input'

const Step03 = () => {
  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <p className='text-center align-middle font-inter text-[20px] font-normal leading-[30px] tracking-[0px] text-[#7688A8]'>
            Tell Us About Yourself
          </p>
          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            What is your Full Name ?
          </h1>

          <Input
            type='text'
            placeholder='Full Name'
            className='w-full text-sm'
          />
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

export default Step03
