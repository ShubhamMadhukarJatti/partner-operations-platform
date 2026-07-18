import React from 'react'
import { StripeCheckoutRecurring } from '@stripe/stripe-js'

import { Button } from '@/components/ui/button'

interface EmptyStatesProps {
  icon: React.ReactNode
  title: string
  description: string
  buttonText: string
  buttonFunction: () => void
}
const EmptyStates: React.FC<EmptyStatesProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonFunction
}) => {
  return (
    <div className='mx-auto flex max-w-[550px] flex-col items-center justify-center gap-4'>
      {icon}
      <div className='flex flex-col gap-1 text-center'>
        <p className='text-xl/6 font-bold text-text-100'>{title}</p>
        <p className=''>{description}</p>
      </div>
      <div>
        <Button className='shrink' onClick={buttonFunction}>
          {buttonText}
        </Button>
      </div>
    </div>
  )
}

export default EmptyStates
