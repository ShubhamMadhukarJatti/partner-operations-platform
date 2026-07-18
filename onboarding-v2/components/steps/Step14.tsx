'use client'

import React, { useEffect } from 'react'

import { useOnboarding } from '../../context/OnboardingContext'

const Step14 = () => {
  const { state, updateStep } = useOnboarding()
  const options = ['Enterprise', "SMB's", 'Small Companies', 'Startup']

  // Convert stored string array to index array for UI
  const getSelectedIndexes = (): number[] => {
    if (!state.step14 || state.step14.length === 0) return []
    return state.step14
      .map((item) => options.indexOf(item))
      .filter((index) => index !== -1)
  }

  const toggleSelect = (index: number) => {
    const currentSelected = getSelectedIndexes()
    let newSelected: string[]

    if (currentSelected.includes(index)) {
      // Remove from selection
      newSelected = state.step14.filter((item) => item !== options[index])
    } else {
      // Add to selection
      newSelected = [...state.step14, options[index]]
    }

    updateStep('step14', newSelected)
  }

  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <p className='text-center align-middle font-inter text-[20px] font-normal leading-[30px] tracking-[0px] text-[#7688A8]'>
            Customer Profile
          </p>
          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            What customer you currently serve?
          </h1>

          <div className='grid w-full max-w-[740px] grid-cols-2 gap-4'>
            {options.map((label, index) => (
              <button
                key={index}
                type='button'
                onClick={() => toggleSelect(index)}
                className={`flex h-[64px] w-full items-center justify-between rounded-lg border-[1.5px] p-4 text-sm font-medium transition
        ${
          getSelectedIndexes().includes(index)
            ? 'border-[#2563EB] bg-[#2563EB] text-white'
            : 'border-[#2563EB] bg-white text-[#2563EB]'
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
              src='step14-bg.png'
              alt='step14-bg'
              className='max-h-[80%] max-w-[80%] object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step14
