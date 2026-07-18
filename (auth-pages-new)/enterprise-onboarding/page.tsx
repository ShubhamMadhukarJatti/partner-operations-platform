'use client'

import React, { useEffect, useState } from 'react'

import FreeTrialRegisterForm from '../free-trial/_components/FreeTrialRegisterForm'
import OnboardingRight from '../free-trial/_components/OnboardingRight'

type Props = {}

const EnterpriseOnboarding = (props: Props) => {
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
    <div className='flex max-h-screen w-full justify-end'>
      <div className='mr-24 flex max-w-[461px]  py-6'>
        <FreeTrialRegisterForm />
      </div>
      <OnboardingRight
        heading={slides[currentSlide].heading}
        description={slides[currentSlide].description}
        imageSrc={slides[currentSlide].imageSrc}
        imgWidth={302}
        imgHeight={302}
        isFirstOnboardingPage
        currentSlide={currentSlide}
        totalSlides={4}
      />
    </div>
  )
}

export default EnterpriseOnboarding
