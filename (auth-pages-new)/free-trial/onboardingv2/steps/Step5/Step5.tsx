'use client'

import { FC, useEffect, useRef, useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { step5 } from '../../constants/constants'
import { StateType, StepOption } from '../../types/types'
import { updateSelection, updateStepSelection } from '../../Util/util'

interface Step5Props {
  onChange: (value: string) => void
  data: StateType['currentRole']
}

export const Step5: FC<Step5Props> = ({ onChange, data }) => {
  const [steps, updateStepsHandler] = useState<StepOption[]>(step5)
  const updateSteps = (step: StepOption) => {
    onChange(step.name)
    updateStepsHandler(updateStepSelection(steps, step.id, 'select'))
  }

  useEffect(() => {
    updateStepsHandler(updateSelection(data, step5))
  }, [data])

  return (
    <>
      <SectionHeader
        title='Teams &amp; Operations'
        subtitle=' What is your current role?'
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
