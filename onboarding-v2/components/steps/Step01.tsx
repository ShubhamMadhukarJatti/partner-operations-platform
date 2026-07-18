'use client'

import { Input } from '@/components/ui/input'

const Step01 = () => {
  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            Welcome to Shardom
          </h1>

          <Input type='email' placeholder='Email' className='w-full text-sm' />
          <Input
            type='url'
            placeholder='Company Website'
            className='w-full text-sm'
          />

          <button className='rounded-md bg-blue-600 py-2 font-semibold text-white transition hover:bg-blue-700'>
            Sign Up
          </button>
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
              src='Onboarding-group-bg.png'
              alt='Overlay Image'
              className='max-h-[80%] max-w-[80%] object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step01
