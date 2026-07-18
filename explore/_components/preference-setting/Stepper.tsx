'use client'

import React from 'react'

type Props = {}

const StepperNew = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className='flex w-full items-center gap-2'>
      {['1', '2', '3'].map((step, index) => (
        <div key={index} className='flex w-full items-center'>
          {/* Step Circle */}
          <div
            className={`h-1.5 w-full rounded-full ${
              index < currentStep ? 'bg-primary-light-blue' : 'bg-text-20'
            }`}
          />
        </div>
      ))}
    </div>
  )
}

export default StepperNew
