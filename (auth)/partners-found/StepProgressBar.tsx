import React from 'react'

interface StepProgressBarProps {
  totalSteps: number
  currentStep: number
}

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  totalSteps,
  currentStep
}) => {
  return (
    <div className='flex w-full items-center justify-center gap-2'>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 w-full rounded-full transition-colors duration-300 ${
            index < currentStep ? 'bg-[#3E50F7]' : 'bg-[#D9D9D9]'
          }`}
        />
      ))}
    </div>
  )
}
