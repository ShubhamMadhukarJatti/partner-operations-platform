'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import MailIcon from '../../../../public/onBoarding-v2.1/blueInbox.svg'

type OtpNumbers = {
  firstNumber: string
  secondNumber: string
  thirdNumber: string
  fourthNumber: string
}

const PartnerPortalOtpScreen = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')
  const email = sessionStorage.getItem('email')
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const otpData = sessionStorage.getItem('otp-numbers')
  const data: OtpNumbers | null = otpData ? JSON.parse(otpData) : null
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes (120 seconds)
  const [canResend, setCanResend] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ]

  if (!(email && data)) router.push('/partner-portal/login')

  const handleVerify = async (
    email: string | null,
    otp: string | undefined
  ) => {
    if (!email) {
      toast.error('Error fetching email')
      return
    }

    if (otp?.length !== 6) {
      toast.error('Enter a valid 6 digit otp')
      return
    }
    setAttempts((attempt) => attempt + 1)
    setLoading(true)
    try {
      const res = await fetch('/api/login-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          otp: otp
        })
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error)
        throw new Error('Failed to login...')
      }

      toast.success('Verified')

      // Redirect to partner portal dashboard or specified redirect
      router.push(redirect ?? '/partner-portal/dashboard')
    } catch (error) {
      // Error already handled by toast
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async ({ email }: { email: string | null }) => {
    if (!email) {
      toast.error('Error fetching email...login again')
      router.push('/partner-portal/login')
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })
      if (!res.ok) {
        toast.error(`Failed to resend Otp`)
        throw new Error('Failed to login...')
      }

      const data = await res.json()
      sessionStorage.setItem('email', email)
      sessionStorage.setItem('otp-numbers', JSON.stringify(data))
    } catch (error: any) {
      switch (error.message) {
        case 'Firebase: Error (auth/user-not-found).':
          toast.error('User Doesn`t exist, Create a new account')
          break
        case 'Firebase: Error (auth/invalid-credential).':
          toast.error('Invalid login credentials')
          break
        case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
          toast.error('Too many login attempts, please try after few minutes.')
          break
        default:
          toast.error('Something went wrong, please try again.')
      }
      return
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleResendOTP = () => {
    if (!canResend) return

    handleLogin({ email })
    setTimeLeft(120)
    setCanResend(false)
  }

  if (attempts > 2) {
    handleResendOTP()
    setAttempts(0)
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedData = e.clipboardData.getData('Text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const arr = pastedData.split('')
      setOtp(arr)
      inputRefs[5].current?.focus()
      e.preventDefault()
    }
  }

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        inputRefs[index - 1].current?.focus()
      }
    } else if (e.key === 'Enter') {
      if (otp.join('').length === 6 && !loading && !isLoading) {
        handleVerify(email, otp.join(''))
      }
    }
  }

  return (
    <div className='flex min-h-screen flex-col lg:flex-row'>
      <div className='flex w-full flex-1 flex-col items-center justify-center bg-white px-4 py-6 lg:w-1/2'>
        <div className='mx-auto flex w-full max-w-md flex-col gap-8 pt-4'>
          <div className='flex w-full items-center justify-center '>
            <div className='rounded-xl bg-[#3E50F71A] p-4'>
              <Image src={MailIcon} alt='img' height={28} width={28} />
            </div>
          </div>

          <div>
            <h1 className='mb-2 text-center text-2xl font-bold text-[#2A3241]'>
              Check your email
            </h1>
            <p className='text-center text-sm font-normal text-[#4D5C78]'>
              We&apos;ve sent a 6-digit verification code to
              <br />
              <span className='font-bold text-[#323232]'>{email}</span>
            </p>
          </div>

          <div className='flex flex-col justify-center rounded-xl border p-6'>
            <p className='text-center text-sm font-semibold text-[#0A0A0A]'>
              Enter verification code
            </p>
            <p className='text-center text-sm text-[#717182]'>
              Enter the 6-digit code from your email
            </p>
            <div className='my-6 flex justify-center gap-3 '>
              {otp.map((value, idx) => (
                <Input
                  key={idx}
                  maxLength={1}
                  type='text'
                  inputMode='numeric'
                  ref={inputRefs[idx]}
                  value={value}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={cn(
                    'h-8 w-8 text-center text-sm md:h-10 md:w-10 md:text-base',
                    idx === 0 && 'rounded-l-lg',
                    idx === otp.length - 1 && 'rounded-r-lg'
                  )}
                />
              ))}
            </div>
            <div className='flex flex-col items-center justify-center gap-1 text-sm text-[#4D5C78]'>
              <span>Didn&apos;t receive the code?</span>
              <div>
                <button
                  type='button'
                  className='font-semibold text-[#3E50F7] hover:underline'
                  onClick={handleResendOTP}
                  disabled={!canResend}
                >
                  Resent OTP
                </button>
                <span className='ml-1 text-[#4D5C78]'>(in {timeLeft}s)</span>
              </div>
            </div>
          </div>

          <div className='flex w-full justify-between gap-6 pt-4'>
            <div className='mx-auto w-1/2 max-w-md'>
              <Link href={'/partner-portal/login'}>
                <Button className='w-full bg-[#FFFFFF]' variant='outline'>
                  <ArrowLeft className='h-4 w-8' />
                  Back
                </Button>
              </Link>
            </div>
            <div className='w-1/2'>
              <Button
                className='w-full bg-[#3E50F7] text-white transition-all duration-200 hover:scale-105 active:scale-95'
                loading={loading || isLoading}
                onClick={() => handleVerify(email, otp.join(''))}
                disabled={otp.join('').length !== 6}
                title={
                  otp.join('').length !== 6
                    ? 'Please enter all 6 digits'
                    : 'Press Enter or click to confirm'
                }
              >
                Confirm
                <ArrowRight className='h-4 w-8' />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerPortalOtpScreen
