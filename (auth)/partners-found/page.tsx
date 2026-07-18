'use client'

import { useEffect, useReducer, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'

import { Step1 } from './steps/step1'
import { Step2 } from './steps/step2'
import { OnboardingWrapper } from './wrapper'

export default function OnboardingV21() {
  const [step, setStep] = useState(1)

  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()
  console.log('step', step)

  useEffect(() => {
    const email = sessionStorage.getItem('email')
    if (email) {
      setEmail(email)
    }
  }, [])

  const prevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev))
  }
  const nextStep = () => {
    setStep((prev) => prev + 1)
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />
      case 2:
        return <Step2 />

      default:
        return null
    }
  }

  if (isInitialLoading) {
    return (
      <OnboardingWrapper
        image={`/images/onboarding/onboarding_step${step + 2}.png`}
        alt='onboarding images'
        stepCount={step}
      >
        <div className='relative flex h-full flex-col items-center justify-center text-center'>
          <div className='flex flex-col items-center space-y-4'>
            <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900'></div>
            <p className='text-gray-600'>Loading your data...</p>
          </div>
        </div>
      </OnboardingWrapper>
    )
  }

  // console.log("step", step + 2)
  return (
    <OnboardingWrapper
      image={`/images/onboarding/onboarding_step${step + 2}.png`}
      alt='onboarding images'
      stepCount={step}
    >
      <div className='flex flex-col items-center justify-center'>
        <div className='w-1/2 px-16'>
          {renderStep()}
          {step == 1 && (
            <>
              <div className='flex w-full items-center justify-between gap-6 pb-4 pt-4'>
                <div className='w-1/4'>
                  <Button
                    variant='outline'
                    onClick={prevStep}
                    disabled={step === 1}
                    className='h-8 w-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed'
                    title={
                      step === 1
                        ? 'Cannot go back'
                        : 'Press ← or click to go back'
                    }
                  >
                    <ArrowLeft className='h-4 w-4' />
                    Back
                  </Button>
                </div>
                <div className='w-3/4'>
                  <Button
                    variant={'default'}
                    // disabled={!isStepValid(step, state) || isLoading}
                    disabled={isLoading}
                    onClick={nextStep}
                    className='h-8 w-full transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50'
                  >
                    Claim This Company
                    <ArrowRight className='h-4 w-4' />
                  </Button>
                </div>
              </div>
              <p className='text-center text-[10px] text-gray-400'>
                If this isn&apos;t your company or you&apos;re having issues,
                contact us at
                <span className='pl-1 font-semibold text-[#3E50F7]'>
                  support@sharkdom.com
                </span>
              </p>
            </>
          )}
        </div>
        {/* Keyboard shortcut hint */}{' '}
        {step == 1 && (
          <div className='mt-2 text-center text-xs text-gray-500'>
            💡 Tip: Press{' '}
            <kbd className='rounded bg-gray-100 px-1 py-0.5 text-xs'>Enter</kbd>{' '}
            to continue or{' '}
            <kbd className='rounded bg-gray-100 px-1 py-0.5 text-xs'>←</kbd> to
            go back
          </div>
        )}
        {/* Validation hint */}
        {/* {!isStepFilled(step, state) && (
          <div className='mt-1 text-center text-xs text-red-500'>
            ⚠️ Please fill in the required information above
          </div>
        )} */}
      </div>
    </OnboardingWrapper>
  )
}
