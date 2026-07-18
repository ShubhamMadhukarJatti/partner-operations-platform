'use client'

import { useOnboarding } from '../../context/OnboardingContext'

const Step07 = () => {
  const { state, updateStep } = useOnboarding()
  const buttons = ['0-5', '10-20', '10-25', '>25']

  const handleSelect = (index: number) => {
    updateStep('step7', buttons[index])
  }

  const getSelectedIndex = (): number | null => {
    if (!state.step7) return null
    const index = buttons.indexOf(state.step7)
    return index !== -1 ? index : null
  }

  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <p className='text-center align-middle font-inter text-[20px] font-normal leading-[30px] tracking-[0px] text-[#7688A8]'>
            Team & Operations
          </p>

          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            How big is your partnership team?
          </h1>

          <div className='grid grid-cols-2 gap-4'>
            {buttons.map((label, index) => (
              <button
                key={index}
                onClick={() => handleSelect(index)}
                className={`flex h-[64px] w-full items-center justify-center rounded-lg border-[1.5px] p-4 text-sm font-medium transition
            ${
              getSelectedIndex() === index
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

export default Step07
