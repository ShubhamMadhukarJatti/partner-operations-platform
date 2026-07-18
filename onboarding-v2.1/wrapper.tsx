'use client'

import React from 'react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

import { NewOnboardingProgressBar } from './components/ProgressBar/NewOnboardingProgressBar'
import { initialState } from './Util/onboardingReducer'

interface FormWrapperProps {
  children: React.ReactNode
  image: string
  alt?: string
  stepCount: number
  state?: typeof initialState
}

export const OnboardingWrapper: React.FC<FormWrapperProps> = ({
  children,
  image,
  alt = 'Form image',
  stepCount = 1,
  state
}) => {
  const pathname = usePathname()
  return (
    <div className='flex min-h-screen justify-center'>
      <div
        className={`flex min-h-screen w-full flex-col ${stepCount > 5 ? 'bg-white' : 'bg-[linear-gradient(rgba(255,255,255,0.5),rgba(255,255,255,0.5)),url("/onboardingV2.png")] bg-cover bg-center bg-no-repeat'}`}
      >
        {/* Custom Header for Steps 1 to 5 */}
        {stepCount <= 5 && (
          <div className='absolute left-0 top-0 z-20 p-8'>
            <Image
              src='/icons/logo.png'
              alt='sharkdom'
              height={28}
              width={120}
              className='object-contain'
            />
          </div>
        )}

        {/* Fixed Header */}
        {pathname !== '/onboarding-v2.1/newTeamMember' && stepCount > 5 && (
          <div className='sticky top-0 z-10 bg-white'>
            <div className='flex justify-center p-4'>
              <div className='flex w-full flex-col justify-between md:w-4/5 md:pr-16'>
                <div className='relative flex items-center justify-between pb-4'>
                  {/* Logo centered */}
                  <Image
                    src='/icons/logo.png'
                    alt='sharkdom'
                    height={28}
                    width={120}
                    className='object-contain'
                  />
                </div>
                <NewOnboardingProgressBar currentStep={stepCount - 5} />
              </div>
            </div>
            <div className='border-b' />
          </div>
        )}

        {/* Scrollable content */}
        <div className='flex flex-1 overflow-y-auto'>
          {/* Main content */}
          <div className='w-full px-4 pb-16'>{children}</div>
        </div>
      </div>
    </div>
  )
}
