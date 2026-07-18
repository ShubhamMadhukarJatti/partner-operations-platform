import React from 'react'

interface PrimaryUseCaseProps {
  goal: string[]
  onChange: (value: string[]) => void
  onNext: () => void
  onPrev?: () => void
}

export const PrimaryUseCase: React.FC<PrimaryUseCaseProps> = ({
  goal = [],
  onChange,
  onNext,
  onPrev
}) => {
  const toggleGoal = (id: string) => {
    if (goal.includes(id)) {
      onChange(goal.filter((g) => g !== id))
    } else {
      onChange([...goal, id])
    }
  }

  const options = [
    {
      id: 'Discover new partners',
      title: 'Discover new partners',
      desc: "Use Sharkdom's AI-powered discovery engine to find ideal partners"
    },
    {
      id: 'Partner channel marketing',
      title: 'Partner channel marketing',
      desc: 'Market your product through partner channels using our marketing tools'
    },
    {
      id: 'Manage current partnerships',
      title: 'Manage current partnerships',
      desc: 'Use Sharkdom PRM to organise and track your existing partnerships'
    },
    {
      id: 'Just exploring',
      title: 'Just exploring',
      desc: "I'm learning about partnership platforms and exploring options"
    }
  ]

  return (
    <div className='relative mx-auto flex w-full max-w-[480px] flex-col items-start justify-start gap-4 pb-8 pt-24'>
      {/* Back Button */}
      {onPrev && (
        <div
          onClick={onPrev}
          className='mb-4 flex w-full cursor-pointer items-center text-sm font-medium text-[#6863FB] hover:underline'
        >
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='mr-2'
          >
            <path
              d='M10 12L6 8L10 4'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Back
        </div>
      )}

      {/* Breadcrumb */}
      <div className='mb-2 flex w-full items-center gap-2 text-sm'>
        {/* Step 1: Completed */}
        <div className='flex items-center gap-2 font-medium text-[#10B981]'>
          <div className='flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981]'>
            <svg
              width='10'
              height='8'
              viewBox='0 0 10 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1 4L3.5 6.5L9 1'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          Step 1
        </div>
        <div className='h-[1px] w-6 bg-gray-200'></div>

        {/* Step 2: Completed */}
        <div className='flex items-center gap-2 font-medium text-[#10B981]'>
          <div className='flex h-4 w-4 items-center justify-center rounded-full bg-[#10B981]'>
            <svg
              width='10'
              height='8'
              viewBox='0 0 10 8'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M1 4L3.5 6.5L9 1'
                stroke='white'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </div>
          Step 2
        </div>
        <div className='h-[1px] w-6 bg-gray-200'></div>

        {/* Step 3: Active */}
        <div className='flex items-center gap-2 font-medium text-[#6863FB]'>
          <svg
            width='16'
            height='16'
            viewBox='0 0 16 16'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx='8'
              cy='8'
              r='7'
              stroke='#6863FB'
              strokeWidth='1.5'
              strokeDasharray='3 3'
            />
          </svg>
          Step 3
        </div>
      </div>
      <div className='flex flex-col items-start justify-start gap-3 self-stretch'>
        <div className='flex flex-col items-start justify-start gap-1 self-stretch'>
          <div className='flex flex-col justify-center self-stretch font-inter text-2xl font-semibold text-[#101828]'>
            Primary use case
          </div>
          <div className='flex flex-col justify-center font-inter text-2xl font-normal text-[#A7A6CC]'>
            What's your main goal?
          </div>
        </div>
        <div className='mt-2 flex flex-col justify-center self-stretch'>
          <span className='font-inter text-sm leading-[18.20px] text-[#6A7282]'>
            <span className='font-normal'>
              Pick the one that best describes what you want from Sharkdom right
              now. You can do all of these.{' '}
            </span>
            <span className='font-semibold'>
              We just need to know where to start.
            </span>
          </span>
        </div>
      </div>

      <div className='flex w-full flex-col items-start justify-start gap-4 self-stretch'>
        {options.map((option) => {
          const isSelected = goal.includes(option.id)
          return (
            <div
              key={option.id}
              onClick={() => toggleGoal(option.id)}
              className={`relative inline-flex cursor-pointer items-center justify-between gap-4 self-stretch rounded-xl bg-white/30 px-4 py-4 outline outline-1 transition-all ${
                isSelected ? 'outline-[#6B4FBB]' : 'outline-[#C5D0E4]/50'
              }`}
            >
              <div className='z-10 inline-flex flex-1 flex-col items-start justify-center gap-1'>
                <div className='self-stretch font-inter text-base font-normal leading-normal text-[#101828]'>
                  {option.title}
                </div>
                <div className='self-stretch font-inter text-xs font-normal leading-[18px] text-[#6A7282]'>
                  {option.desc}
                </div>
              </div>
              <div
                className={`z-10 inline-flex h-4 w-4 flex-col items-center justify-center rounded-full outline outline-1 ${
                  isSelected
                    ? 'bg-[#F9FAFB] outline-[#6B4FBB]'
                    : 'bg-[#F9FAFB] outline-[#E5E7EB]'
                }`}
              >
                {isSelected && (
                  <div className='h-2 w-2 rounded-full bg-[#6863FB]' />
                )}
              </div>
              {isSelected && (
                <div className='pointer-events-none absolute inset-0 rounded-xl bg-[#6863FB]/5' />
              )}
            </div>
          )
        })}
      </div>

      {/* Continue Button */}
      <button
        onClick={onNext}
        disabled={goal.length === 0}
        className='mt-4 w-full rounded-lg bg-[#6863FB] py-3 font-medium text-white transition-colors hover:bg-[#5a55d6] disabled:cursor-not-allowed disabled:opacity-50'
      >
        Go to my Dashboard
      </button>

      {/* Terms & Privacy */}
      <div className='mt-6 flex w-full items-center justify-center gap-4 text-xs text-[#6A7282]'>
        <span>Terms of service</span>
        <div className='h-1 w-1 rounded-full bg-[#99A1AF]'></div>
        <span>Privacy policy</span>
      </div>
    </div>
  )
}
