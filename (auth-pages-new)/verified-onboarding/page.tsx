'use client'

import React, { useEffect, useState } from 'react'

import AuthLeft from '@/app/(auth)/_components/auth-left-container'

import FreeTrialRegisterForm from './_components/FreeTrialRegisterForm'
import OnboardingRight from './_components/OnboardingRight'

type Props = {}

const FreeTrail = (props: Props) => {
  const slides = [
    {
      heading: 'Your one stop solution for all partnership needs',
      description:
        'Discover and connect with the right partners to boost revenue, enhance offerings, and unlock new opportunities',
      imageSrc: '',
      imgWidth: 0,
      imgHeight: 0
    },
    {
      heading: 'Still using spreadsheets to manage partnerships?',
      description:
        'Here is how Sharkdom helps you manage partnerships < add copy>',
      imageSrc: '/onboarding-image-2.png',
      imgWidth: 309,
      imgHeight: 216
    },
    {
      heading: 'Bring your Offline partners Online',
      description:
        'Bring your offline partners online! Our platform streamlines Partner management and 3X your success rate.',
      imageSrc: '/onboarding-image-3.png',
      imgWidth: 276,
      imgHeight: 246
    },
    {
      heading: 'Quick customer persona’s',
      description:
        'Companies creating persona have 356% more chances of finding their Ideal Partner',
      imageSrc: '/onboarding-image-4.png',
      imgWidth: 334,
      imgHeight: 306
    }
  ]

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // 5 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className='flex w-full flex-1 justify-start overflow-hidden'>
      <div className=' hidden min-h-screen items-center justify-center overflow-hidden lg:flex'>
        {/* <AuthNewSlider /> */}
        <AuthLeft title='data-drive approach for partnerships' />
      </div>
      <div className='flex h-full max-h-screen max-w-[780px] flex-1 items-start justify-center px-12 pt-20 lg:px-0'>
        <FreeTrialRegisterForm />
      </div>
      {/* <OnboardingRight
        heading={slides[currentSlide].heading}
        description={slides[currentSlide].description}
        imageSrc={slides[currentSlide].imageSrc}
        imgWidth={302}
        imgHeight={302}
        isFirstOnboardingPage
        currentSlide={currentSlide}
        totalSlides={4}
      /> */}
    </div>
  )
}

export default FreeTrail
