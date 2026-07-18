'use client'

import { FC, useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { step10 } from '../../constants/constants'
import { StateType, StepOption } from '../../types/types'
import { updateSelection, updateStepSelection } from '../../Util/util'

interface Step10Props {
  onChange: (value: string) => void
  data: StateType['goalToUseSharkdom']
}

export const Step10: FC<Step10Props> = ({ onChange, data }) => {
  const [steps, updateStepsHandler] = useState<StepOption[]>(step10)
  const updateSteps = (step: StepOption) => {
    onChange(step.name)
    updateStepsHandler(updateStepSelection(steps, step.id, 'select'))
  }

  useEffect(() => {
    updateStepsHandler(updateSelection(data, step10))
  }, [data])

  return (
    <>
      <SectionHeader
        title='Goals &amp; Objectives'
        subtitle='What are your goals to use Sharkdom?'
      />
      <div className='grid w-full max-w-[500px] grid-cols-1 gap-4'>
        {steps.map((step) => {
          const btnClassName = step.isSelected ? 'primanyOutline' : 'outline'
          return (
            <Button
              key={step.id}
              onClick={() => updateSteps(step)}
              variant={btnClassName}
              className='justify-start text-left'
            >
              {step.name}
            </Button>
          )
        })}
      </div>
    </>
  )
}
