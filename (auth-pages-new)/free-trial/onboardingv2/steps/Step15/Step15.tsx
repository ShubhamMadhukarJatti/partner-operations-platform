'use client'

import { FC, useEffect, useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { step15 } from '../../constants/constants'
import { StateType, StepOption } from '../../types/types'
import { updateSelection, updateStepSelection } from '../../Util/util'

interface Step15Props {
  onChange: (value: string) => void
  data: StateType['currentCustomer']
}

export const Step15: FC<Step15Props> = ({ onChange, data }) => {
  const [steps, updateStepsHandler] = useState<StepOption[]>(step15)
  const updateSteps = (step: StepOption) => {
    onChange(step.apiValue || step.name)
    updateStepsHandler(updateStepSelection(steps, step.id, 'select'))
  }

  useEffect(() => {
    updateStepsHandler(updateSelection(data, step15))
  }, [data])

  return (
    <>
      <SectionHeader
        title='Customer context'
        subtitle='What type of customers do you serve?'
      />
      <div className='grid w-full max-w-[500px] grid-cols-1 gap-4 sm:grid-cols-2'>
        {steps.map((step) => {
          const btnClassName = step.isSelected ? 'primanyOutline' : 'outline'
          const imageUrl = step.isSelected
            ? step.iconActivePath
            : step.iconInactivePath
          return (
            <Button
              key={step.id}
              onClick={() => updateSteps(step)}
              variant={btnClassName}
            >
              {step.needToIcon && imageUrl && (
                <Image
                  src={imageUrl}
                  alt={step.name}
                  height={18}
                  width={18}
                  className='mr-[10px]'
                />
              )}
              {step.name}
            </Button>
          )
        })}
      </div>
    </>
  )
}
