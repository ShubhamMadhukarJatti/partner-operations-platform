'use client'

import React from 'react'
import Image from 'next/image'

import { StepProgressBar } from './StepProgressBar'

interface FormWrapperProps {
  children: React.ReactNode
  image: string
  alt?: string
  stepCount: number
}

export const OnboardingWrapper: React.FC<FormWrapperProps> = ({
  children,
  image,
  alt = 'Form image',
  stepCount = 1
}) => {
  return (
    <div className='flex h-full min-h-screen justify-center'>
      <div className='flex h-screen w-full flex-col bg-white'>
        {/* Fixed Header */}
        <div className='sticky top-0 z-10  bg-white'>
          <div className='flex justify-center p-4'>
            <div className='flex w-full flex-col justify-center text-center md:w-3/4 lg:w-1/2'>
              <div className='flex justify-between pb-4'>
                <Image
                  src={'/icons/logo.png'}
                  alt='sharkdom'
                  height={100}
                  width={100}
                />
                <p className='text-xs text-[#717182]'>Step {stepCount} of 2</p>
              </div>
              <StepProgressBar totalSteps={2} currentStep={stepCount} />
            </div>
          </div>
          <div className='border-b' />
        </div>

        {/* Scrollable content */}
        <div className='flex-1 overflow-y-auto pt-40'>
          <div className='flex h-full items-center justify-center'>
            <div className='w-full px-4 lg:px-1'>{children}</div>
          </div>
        </div>
      </div>

      {/* <div className='relative mx-[30px] hidden items-center justify-center bg-gray-100 md:flex md:w-2/5'>
        <Image
          src={'/Onboarding-bgv2.png'}
          alt='Background'
          fill
          className='object-cover'
          priority
        />

        <div className='relative z-10 p-[10px]'>
          <Image
            src={image}
            alt={alt}
            width={400}
            height={350}
            className='object-contain'
            priority
          />
        </div>
      </div> */}
    </div>
  )
}
