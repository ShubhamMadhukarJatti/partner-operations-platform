import React from 'react'
import Image from 'next/image'

import AuthMarquee from './AuthMarquee'

const AuthLeft: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className='relative z-0 h-full w-[720px] overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <Image src='/assets/auth-bg.png' alt='' fill />
      </div>

      <div className='relative z-10 mb-4 flex h-full flex-col items-center justify-center overflow-hidden text-center text-white'>
        <h1 className='text-[48px] font-semibold text-white'>{title}</h1>

        <div className='mt-4 flex flex-col items-center justify-center'>
          <Image src='/auth/star.png' alt='' width={90} height={90} />
          <p className='mb-4 text-xl'>Trusted by 1400+ companies</p>
          <p className='mx-auto max-w-[75%] text-center text-xl'>
            Rejuvenate your Partnership Experience(PE) just like these top
            companies
          </p>
        </div>
        <AuthMarquee />
      </div>
    </div>
  )
}

export default AuthLeft
