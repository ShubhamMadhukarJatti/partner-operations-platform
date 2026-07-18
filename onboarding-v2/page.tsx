// src/app/onboarding-v2/page.tsx
'use client'

import { useState } from 'react'

import StepNavigation from './components/StepNavigation'
import { stepsConfig } from './components/stepsConfig'
import StepWrapper from './components/StepWrapper'
import { OnboardingProvider } from './context/OnboardingContext'

export default function OnboardingV2() {
  const [currentStep, setCurrentStep] = useState(1)

  const StepComponent = stepsConfig.find(
    (step) => step.id === currentStep
  )?.component

  return (
    <OnboardingProvider>
      <StepWrapper>
        {StepComponent && <StepComponent />}
        <StepNavigation
          currentStep={currentStep}
          totalSteps={stepsConfig.length}
          onNext={() =>
            setCurrentStep((prev) => Math.min(prev + 1, stepsConfig.length))
          }
          onBack={() => setCurrentStep((prev) => Math.max(prev - 1, 1))}
        />
      </StepWrapper>
    </OnboardingProvider>
  )
}
