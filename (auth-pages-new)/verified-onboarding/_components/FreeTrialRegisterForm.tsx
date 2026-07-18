'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { Logo } from '@/components/icons/logo'
import { RegistrationForm } from '@/app/(auth)/_components/registration-form'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type Props = {}

const FreeTrialRegisterForm = (props: Props) => {
  return (
    <div className='flex h-full max-w-[470px] flex-1 items-center justify-center py-6   '>
      <div className=''>
        <div className='relative h-[100] w-[180px]'>
          {/* <Image src='/welcome.svg' height={180} width={180} alt='' /> */}
          <Lottie
            animationData={require('@/lib/lottie-json/welcome-chat.json')}
            loop={true}
            width={180}
            height={180}
          />
        </div>
        <div className='mt-4'>
          <h1 className='text-shark-xl font-bold text-text-100'>
            Welcome to Sharkdom
          </h1>
          <p className='mt-2 text-shark-sm font-medium  text-text-60'>
            Join Sharkdom as your one stop solution for all you partnership
            needs
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  )
}

export default FreeTrialRegisterForm
