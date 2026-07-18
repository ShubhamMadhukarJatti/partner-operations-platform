'use client'

import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'

import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'

import Logo from '../../../../../public/icons/logo.svg'
import OnboardingBgImage from '../../../../../public/onboarding-bg.png'

type Props = {
  heading: string
  description: string
  imageSrc: string
  imgWidth: number
  imgHeight: number
  isFree?: boolean
  isFirstOnboardingPage?: boolean
  isLoginPage?: boolean
  currentSlide?: number // Add this prop
  totalSlides?: number
}

const OnboardingRight = ({
  heading,
  description,
  imageSrc,
  imgHeight,
  imgWidth,
  isFree,
  isFirstOnboardingPage,
  currentSlide = 0,
  totalSlides = 4
}: Props) => {
  const router = useRouter()

  const handleLogout = async () => {
    // const auth = getFirebaseAuth()
    // await signOut(auth)
    await fetch('/api/logout', { method: 'GET' })

    router.push('/login')
    localStorage.removeItem('dialogShown')
    localStorage.removeItem('FormShown')
  }

  const slideIndicators = Array.from(
    { length: totalSlides },
    (_, index) => index
  )

  return (
    <div className='relative hidden w-[40%] bg-[#132343] md:block'>
      <section className='relative flex h-screen w-full flex-col items-center justify-center text-center'>
        {isFirstOnboardingPage && (
          <>
            {/* Background Image */}
            <Image
              src={OnboardingBgImage}
              alt='onboarding-bg'
              className='absolute inset-0 z-0 h-full w-full object-cover'
            />

            {imageSrc ? (
              <Image
                src={imageSrc}
                alt='onboarding-img'
                height={imgHeight}
                width={imgWidth}
                className='z-20 transition-all duration-700'
              />
            ) : (
              <div className='relative z-10 flex max-w-2xl flex-col items-center justify-center gap-8 px-4'>
                <div className='flex h-20 w-20 justify-center overflow-hidden rounded-2xl bg-white'>
                  <Image src={Logo} alt='logo' className='m-3' />
                </div>
                <ul className='flex flex-col items-center justify-center space-y-6'>
                  <li className='rounded-md bg-white px-4 py-4 text-shark-xs font-medium text-[#2A3241]'>
                    Partner onboarding
                  </li>
                  <li className='rounded-md bg-white px-7 py-4 text-shark-xs font-medium text-[#2A3241]'>
                    Partner enablement
                  </li>
                  <li className='rounded-md bg-white px-12 py-4 text-shark-xs font-medium text-[#2A3241]'>
                    Partner marketing
                  </li>
                  <li className='rounded-md bg-white px-12 py-4 text-shark-xs font-medium text-[#2A3241]'>
                    Relationship management
                  </li>
                </ul>
              </div>
            )}
          </>
        )}

        <div className='relative z-10 flex max-w-2xl flex-col items-center justify-center gap-8 px-4'>
          {!isFirstOnboardingPage && (
            <Image
              src={imageSrc}
              alt='onboarding-img'
              height={imgHeight}
              width={imgWidth}
              className='transition-all duration-700 ease-in-out'
            />
          )}

          <div className='mt-6 flex w-[430px] flex-col items-center justify-center transition-all duration-700'>
            <h3 className='px-2 text-2xl font-semibold text-white'>
              {heading}
            </h3>
            <p className='mt-2 px-2 text-base text-[#ADB7CB]'>{description}</p>
          </div>
        </div>
        {isFirstOnboardingPage && (
          <div className='absolute bottom-16 mt-8 flex items-center justify-center gap-2'>
            {slideIndicators.map((index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full border border-white transition-all duration-700 ${
                  currentSlide === index ? 'bg-white' : 'bg-transparent'
                }`}
                aria-label={`Slide ${index + 1} of ${totalSlides}`}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default OnboardingRight
