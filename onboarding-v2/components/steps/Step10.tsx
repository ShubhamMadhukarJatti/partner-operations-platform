'use client'

import { useOnboarding } from '../../context/OnboardingContext'

const Step10 = () => {
  const { state, updateStep } = useOnboarding()
  const boxOptions = ['APAC', 'North America', 'Europe', 'MENA']

  const handleSelect = (index: number) => {
    updateStep('step10', boxOptions[index])
  }

  const getSelectedIndex = (): number | null => {
    if (!state.step10) return null
    const index = boxOptions.indexOf(state.step10)
    return index !== -1 ? index : null
  }

  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full max-w-md flex-col gap-6'>
          <p className='text-center align-middle font-inter text-[20px] font-normal leading-[30px] tracking-[0px] text-[#7688A8]'>
            Partnership Context
          </p>

          <h1 className='text-center text-2xl font-bold text-[#2A3241]'>
            Which region do you prefer to partner with?
          </h1>

          <div className='flex gap-4'>
            {boxOptions.map((label, index) => (
              <button
                key={index}
                type='button'
                onClick={() => handleSelect(index)}
                className={`flex h-[190px] w-[168px] flex-col items-start justify-between rounded-lg border-2 p-4 text-sm font-medium transition
            ${
              getSelectedIndex() === index
                ? 'border-[#2563EB] bg-[#2563EB] text-white'
                : 'border-[#2563EB] bg-white text-[#2563EB]'
            }`}
              >
                <span>{label}</span>
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
              src='step10-bg.png'
              alt='Step 10 bg Image'
              className='max-h-[80%] max-w-[80%] object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step10
