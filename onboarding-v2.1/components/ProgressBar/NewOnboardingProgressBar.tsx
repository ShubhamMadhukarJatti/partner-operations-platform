import React from 'react'

export const NewOnboardingProgressBar = ({
  currentStep
}: {
  currentStep: number
}) => {
  const steps = [1, 2, 3]

  return (
    <div className='mb-8 flex items-center justify-center gap-3 self-stretch'>
      {steps.map((step) => {
        const isCompleted = currentStep > step
        const isActive = currentStep === step

        return (
          <React.Fragment key={step}>
            <div className='flex items-center justify-center gap-2 overflow-hidden rounded-lg shadow-[0px_1px_2px_rgba(10,12.67,18,0.05)]'>
              <div className='relative h-4 w-4'>
                {isCompleted ? (
                  <div className='absolute left-[1px] top-[1px] flex h-[14px] w-[14px] items-center justify-center rounded-full bg-[#6863FB]'>
                    <svg
                      width='8'
                      height='8'
                      viewBox='0 0 24 24'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M5 13l4 4L19 7'
                        stroke='white'
                        strokeWidth='4'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </div>
                ) : isActive ? (
                  <>
                    <div className='absolute left-[1px] top-[1px] h-[14px] w-[14px] rounded-full border border-[#6863FB]' />
                    <div className='absolute left-[4px] top-[4px] h-2 w-2 rounded-full bg-[#6863FB]' />
                  </>
                ) : (
                  <div
                    className='relative h-full w-full'
                    style={{
                      transform: 'rotate(90deg)',
                      transformOrigin: 'top left'
                    }}
                  >
                    <div
                      className='absolute left-[1px] top-[15px] h-[14px] w-[14px] rounded-full border border-[#C5D0E4]'
                      style={{
                        transform: 'rotate(-90deg)',
                        transformOrigin: 'top left'
                      }}
                    />
                  </div>
                )}
              </div>
              <div
                className={`font-inter text-xs font-semibold leading-tight ${isCompleted ? 'text-[#6863FB]' : isActive ? 'text-[#6863FB]' : 'font-normal text-[#6A7282]'}`}
              >
                Step {step}
              </div>
            </div>
            {step < 3 && (
              <div className='h-0 w-6 outline outline-[0.50px] outline-offset-[-0.25px] outline-[#C5D0E4]'></div>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
