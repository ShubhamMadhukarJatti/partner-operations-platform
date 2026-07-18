import { FC, useState } from 'react'
import { ChevronDown } from 'lucide-react'

type Step = {
  id: number
  title: string
  description: string
}

type StepAccordionProps = {
  steps: Step[]
}

const StepAccordion: FC<StepAccordionProps> = ({ steps }) => {
  const [openSteps, setOpenSteps] = useState<number[]>([steps[0]?.id || 1]) // Multiple steps open by default (first one is open)

  const toggleStep = (stepId: number) => {
    setOpenSteps(
      (prev) =>
        prev.includes(stepId)
          ? prev.filter((id) => id !== stepId) // Close the step if already open
          : [...prev, stepId] // Open the step if closed
    )
  }

  return (
    <div className='space-y-4'>
      {steps.map((step, index) => (
        <div key={step.id} className='relative flex gap-4'>
          {/* Step Number and Dotted Line */}
          <div className='flex flex-col items-center'>
            {/* Step Number */}
            <div className='flex h-6 w-6 items-center justify-center rounded-full bg-primary-light-blue font-bold text-white'>
              {step.id}
            </div>
            {/* Dotted Line (Always Visible) */}
            {index < steps.length - 1 && (
              <div className='h-full min-h-8 border-l-2 border-dotted border-text-20 '></div>
            )}
          </div>

          {/* Accordion Content */}
          <div className='w-full'>
            {/* Trigger */}
            <button
              onClick={() => toggleStep(step.id)}
              className='flex w-full items-center justify-between text-left text-sm font-semibold hover:text-blue-500'
            >
              <span>{step.title}</span>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  openSteps.includes(step.id) ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Content */}
            <div
              className={`max-w-xs overflow-hidden transition-all duration-300 ${
                openSteps.includes(step.id) ? 'max-h-auto my-4' : 'max-h-0'
              }`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: step.description }}
                className='text-shark-sm text-text-80'
              ></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StepAccordion
