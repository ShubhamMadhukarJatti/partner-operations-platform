import React, { useState } from 'react'

const Step12 = () => {
  const [selected, setSelected] = useState<number[]>([])
  const options = [
    'Strategic',
    'Technology',
    'Co-Selling',
    'Community',
    'Social'
  ]
  const toggleSelect = (index: number) => {
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <p className='font-inter text-center align-middle text-[20px] font-normal leading-[30px] tracking-[0px] text-[#7688A8]'>
            Partnership Context
          </p>
          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            Which type of partnerships do you prefer?
          </h1>

          <div className='grid w-full max-w-[740px] grid-cols-2 gap-4'>
            {options.map((label, index) => (
              <button
                key={index}
                type='button'
                onClick={() => toggleSelect(index)}
                className={`flex h-[64px] w-full items-center justify-between rounded-lg border-[1.5px] p-4 text-sm font-medium transition
        ${
          selected.includes(index)
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
              src='step12-bg.png'
              alt='step12-bg'
              className='max-h-[80%] max-w-[80%] object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step12
