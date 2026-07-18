'use client'

import { useState } from 'react'

const Step13 = () => {
  const [selected, setSelected] = useState<number | null>(null)

  const buttons = [
    'Partnership Manager',
    'Partner Success / Enablement',
    'Partner Marketing',
    'Partner Ops / Systems',
    'BD / Strategic Partnerships',
    'Other'
  ]
  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <p className='font-inter text-center align-middle text-[20px] font-normal leading-[30px] tracking-[0px] text-[#7688A8]'>
            Team & Operations
          </p>
          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            What is your specific role within the Partnership function?
          </h1>

          <div className='grid grid-cols-2 gap-4'>
            {buttons.map((label, index) => (
              <button
                key={index}
                onClick={() => setSelected(index)}
                className={`flex h-[64px] w-full items-center justify-center rounded-lg border-[1.5px] p-4 text-sm font-medium transition
            ${
              selected === index
                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                : 'border-[#2563EB] bg-transparent text-[#2563EB]'
            }`}
              >
                {label}
              </button>
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

export default Step13
