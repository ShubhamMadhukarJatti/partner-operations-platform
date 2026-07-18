// src/app/onboarding-v2/components/steps/Step02.tsx
'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const Step02 = () => {
  const [otp, setOtp] = useState(Array(6).fill(''))
  const inputsRef = useRef<HTMLInputElement[]>([])

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return // Only digits

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }
  return (
    <div className='flex h-screen'>
      {/* Left Panel – 60% */}
      <div className='flex w-[60%] items-center justify-center bg-white px-10'>
        <div className='flex w-full flex-1 flex-col items-center justify-center bg-white px-4 py-8 lg:w-1/2'>
          <div className='mx-auto flex w-full max-w-md flex-col gap-8 pb-12 pt-8'>
            <div>
              <h1 className='mb-2 text-center text-2xl font-bold text-[#2A3241]'>
                Check your email
              </h1>
              <p className='text-center text-sm font-normal text-[#4D5C78]'>
                We sent a verification link to{' '}
              </p>
            </div>

            <div>
              <p className='mb-6 text-center text-base font-medium text-[#4D5C78]'>
                Select the correct number as in the email to verify
              </p>
              <div className='mb-4 flex justify-center gap-3'>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className='h-12 w-10 rounded-md text-center text-lg'
                  />
                ))}
              </div>
              <div className='flex items-center justify-center gap-1 text-sm text-[#4D5C78]'>
                <span>Didnt receive otp?</span>
                <button>Resent OTP</button>
                <span className='ml-1 text-[#4D5C78]'>(in s)</span>
              </div>
            </div>

            <div>
              <Button>Confirm</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel – 40% */}
      <div className='flex w-[40%] items-center justify-center px-6'>
        <div className='relative h-[90%] w-[90%] overflow-hidden rounded-2xl'>
          <img
            src='/Onboarding-bgv2.png'
            alt='Onboarding Background'
            className='h-full w-full rounded-2xl object-cover'
          />
          {/* Overlayed Image */}
          <div className='absolute inset-0 flex items-center justify-center px-6'>
            <img
              src='step02-bg.png'
              alt='Overlay Image'
              className='max-h-[80%] max-w-[80%] object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step02
