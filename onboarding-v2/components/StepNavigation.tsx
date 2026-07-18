// src/app/onboarding-v2/components/StepNavigation.tsx
'use client'

import { useOnboarding } from '../context/OnboardingContext'

type Props = {
  currentStep: number
  totalSteps: number
  onNext: () => void
  onBack: () => void
}

const StepNavigation = ({ currentStep, totalSteps, onNext, onBack }: Props) => {
  const { state } = useOnboarding()

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!state.step1
      case 2:
        return !!state.step2
      case 3:
        return !!state.step3
      case 4:
        return !!state.step4
      case 5:
        return !!state.step5
      case 6:
        return !!state.step6
      case 7:
        return !!state.step7
      case 8:
        return !!state.step8
      case 9:
        return !!state.step9
      case 10:
        return !!state.step10
      case 11:
        return !!state.step11
      case 12:
        return !!state.step12
      case 13:
        return !!state.step13
      case 14:
        return state.step14.length > 0
      case 15:
        return !!state.step15
      default:
        return false
    }
  }

  return (
    <div className='mt-6 flex flex-col gap-4'>
      {/* Debug info */}
      <div className='text-xs text-gray-500'>
        <div>Current Step: {currentStep}</div>
        <div>Step Valid: {isStepValid(currentStep) ? 'Yes' : 'No'}</div>
        <div>
          Current State:{' '}
          {JSON.stringify(state[`step${currentStep}` as keyof typeof state])}
        </div>
      </div>

      <div className='flex justify-between'>
        <button
          onClick={onBack}
          disabled={currentStep === 1}
          className='rounded bg-gray-300 px-4 py-2 disabled:opacity-50'
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!isStepValid(currentStep)}
          className='rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50'
        >
          {currentStep === totalSteps ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  )
}

export default StepNavigation
