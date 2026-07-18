'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signOut } from 'firebase/auth'

import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import useFormStore from '@/lib/stores/useFormStore'
import { FullLogo } from '@/components/icons/logo'

const Stepper = ({
  demo = false,
  isPaid,
  isPaymentPage
}: {
  demo: boolean
  isPaid?: boolean
  isPaymentPage?: boolean
}) => {
  const steps = [
    {
      number: 1,
      title: 'Basic Details',
      description: 'Enter your personal details for registration.'
    },
    {
      number: 2,
      title: 'Company Details',
      description:
        'Share essential information about your company for registration.'
    },
    {
      number: 3,
      title: 'Set Company Goals',
      description:
        "Define your company's objectives and aspirations for the future."
    },
    {
      number: 4,
      title: isPaid ? 'Upgrade to proceed' : 'Surprise Gift',
      description: isPaid
        ? 'Start finding right Partnerships for your business within hours'
        : 'Discover a hidden surprise - free credits await you upon sign-up.'
    }
  ]

  const onboardingJoinStartUpSteps = ['Your details', 'Join StartUp']
  const router = useRouter()
  let { step: currentStep } = useFormStore()

  const searchParams = useSearchParams()

  const searchStep = searchParams.get('step')
  const utm_register = searchParams.get('utm_register')

  const handleLogout = async () => {
    // const auth = getFirebaseAuth()
    // await signOut(auth)
    await fetch('/api/logout', {
      method: 'GET'
    })

    router.push('/login')
    localStorage.removeItem('dialogShown')
    localStorage.removeItem('FormShown')
  }

  return (
    <div className='flex max-h-screen max-w-[26rem] flex-col bg-white p-4 lg:h-screen lg:justify-between lg:px-12 lg:py-10'>
      <Link href='/' className='self-start '>
        <FullLogo className='h-6 w-full ' />
      </Link>
      <div className='mt-6 lg:mt-16'>
        <h1 className='fds-heading text-text-100'>
          {`Let's complete your Profile`}
        </h1>
        <p className='mt-2 text-shark-sm text-text-100'>
          Finish setting up by following these steps
        </p>
      </div>
      <div className='mt-4 hidden justify-between  lg:mt-14 lg:flex lg:flex-col'>
        {steps.map((step, index) => {
          return (
            <Step
              key={step.number}
              currentStep={isPaymentPage ? 4 : currentStep}
              number={step.number}
              title={step.title}
              description={step.description}
              active={isPaymentPage ? true : currentStep === index + 1}
              isLast={index === steps.length - 1}
              isFilled={isPaymentPage ? index < 3 : currentStep > index + 1}
              opacity={1}
            />
          )
        })}
      </div>

      <div className='my-3 flex items-center gap-2 text-center lg:mb-6'>
        <p className='fds-text text-text-80'>Already have an account?</p>
        <p
          onClick={() => handleLogout()}
          className='fds-text-semibold text-primary-light-blue'
        >
          Log In
        </p>
      </div>
    </div>
  )
}

export default Stepper

interface StepProps {
  number: number
  title: string
  description: string
  active: boolean
  isLast?: boolean
  currentStep: number
  opacity: number
  isFilled: boolean
}

const Step: React.FC<StepProps> = ({
  number,
  title,
  description,
  active,
  isLast,
  opacity,
  isFilled,
  currentStep
}) => {
  return (
    <div className='relative mb-2 flex items-start space-x-3.5 '>
      {/* Step Number */}
      <div className={`flex flex-col items-center`}>
        {isFilled ? (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='28'
            height='29'
            viewBox='0 0 28 29'
            fill='none'
          >
            <circle cx='14' cy='14.1797' r='14' fill='#83C413' />
            <path
              fill-rule='evenodd'
              clip-rule='evenodd'
              d='M18.7464 9.45412L11.5864 16.3641L9.68641 14.3341C9.33641 14.0041 8.78641 13.9841 8.38641 14.2641C7.99641 14.5541 7.88641 15.0641 8.12641 15.4741L10.3764 19.1341C10.5964 19.4741 10.9764 19.6841 11.4064 19.6841C11.8164 19.6841 12.2064 19.4741 12.4264 19.1341C12.7864 18.6641 19.6564 10.4741 19.6564 10.4741C20.5564 9.55412 19.4664 8.74412 18.7464 9.44412V9.45412Z'
              fill='white'
            />
          </svg>
        ) : (
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${
              active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
            }`}
          >
            {number}
          </div>
        )}
        {/* Dashed Line */}
        {!isLast && (
          <div className='my-2.5 h-full'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='2'
              height='60'
              viewBox='0 0 2 60'
              fill='none'
            >
              <path
                d='M1 0.179688L1 59.1797'
                stroke='#7688A8'
                stroke-dasharray='4 4'
              />
            </svg>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className='mb-10 flex flex-col'>
        <h2
          className={`font-medium ${active ? 'text-black' : 'text-gray-400'}`}
        >
          {title}
        </h2>
        <p
          className={`mt-1.5 text-sm ${active ? 'text-gray-500' : 'text-gray-300'}`}
        >
          {description}
        </p>
      </div>
    </div>
  )
}
