'use client'

import { FC, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { step16 } from '../../constants/constants'
import { StateType, StepOption } from '../../types/types'
import { updateSelection, updateStepSelection } from '../../Util/util'

interface Step16Props {
  onChange: (value: string) => void
  data: StateType['currentCustomerStrength']
}

export const Step16: FC<Step16Props> = ({ onChange, data }) => {
  const [steps, updateStepsHandler] = useState<StepOption[]>(step16)
  const updateSteps = (step: StepOption) => {
    onChange(step.name)
    updateStepsHandler(updateStepSelection(steps, step.id, 'select'))
  }

  useEffect(() => {
    updateStepsHandler(updateSelection(data, step16))
  }, [data])

  return (
    <>
      <SectionHeader
        title='Customer context'
        subtitle='What is your current customer strength?'
      />
      <div className='grid w-full max-w-[500px] grid-cols-1 gap-4 sm:grid-cols-2'>
        {steps.map((step) => {
          const btnClassName = step.isSelected ? 'primanyOutline' : 'outline'
          return (
            <Button
              key={step.id}
              onClick={() => updateSteps(step)}
              variant={btnClassName}
            >
              {step.name}
            </Button>
          )
        })}
      </div>
    </>
  )
}
