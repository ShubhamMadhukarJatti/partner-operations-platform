'use client'

import { FC, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { step6 } from '../../constants/constants'
import { StateType, StepOption } from '../../types/types'
import { updateSelection, updateStepSelection } from '../../Util/util'

interface Step6Props {
  onChange: (value: string) => void
  data: StateType['marketSegment']
}

export const Step6: FC<Step6Props> = ({ onChange, data }) => {
  const [steps, updateStepsHandler] = useState<StepOption[]>(step6)
  const updateSteps = (step: StepOption) => {
    onChange(step.name)
    updateStepsHandler(updateStepSelection(steps, step.id, 'select'))
  }

  useEffect(() => {
    updateStepsHandler(updateSelection(data, step6))
  }, [data])

  return (
    <>
      <SectionHeader
        title='Partnership context'
        subtitle='Which Market segment do you want to partner in?'
      />
      <div className='grid w-full max-w-[500px] grid-cols-1 gap-4 sm:grid-cols-3'>
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
