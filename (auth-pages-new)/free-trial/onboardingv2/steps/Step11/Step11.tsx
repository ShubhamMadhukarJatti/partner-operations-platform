'use client'

import { FC, useEffect, useState } from 'react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'

import { SectionHeader } from '../../components/SectionHeader/SectionHeader'
import { step11 } from '../../constants/constants'
import { StateType, StepOption } from '../../types/types'
import { updateSelection, updateStepSelection } from '../../Util/util'

interface Step11Props {
  onChange: (value: string[]) => void
  data: StateType['reagon']
}

export const Step11: FC<Step11Props> = ({ onChange, data }) => {
  const [steps, updateStepsHandler] = useState<StepOption[]>(step11)
  const updateSteps = (step: StepOption) => {
    const newSelection = step.isSelected
      ? data.filter((item) => item !== (step.apiValue || step.name))
      : [...data, step.apiValue || step.name]
    onChange(newSelection)
    updateStepsHandler(updateStepSelection(steps, step.id, 'toggle'))
  }

  useEffect(() => {
    updateStepsHandler(updateSelection(data, step11))
  }, [data])

  return (
    <>
      <SectionHeader
        title='Partnership context'
        subtitle='Which regions do you want to partner with?'
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
