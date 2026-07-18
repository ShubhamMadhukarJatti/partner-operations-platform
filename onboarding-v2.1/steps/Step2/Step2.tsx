'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowLeft } from 'lucide-react'

interface Step2Props {
  email?: string
  otpString?: string
  onChange: (field: string, value: string) => void
  onResendOTP: () => void
  onBack?: () => void
  onNext?: () => void
  isLoading?: boolean
  isValid?: boolean
}

export const Step2: React.FC<Step2Props> = ({
  email,
  otpString = '',
  onChange,
  onResendOTP,
  onBack,
  onNext,
  isLoading = false,
  isValid = false
}) => {
  const [otp, setOtp] = useState<string[]>(
    otpString ? otpString.split('').slice(0, 6) : Array(6).fill('')
  )
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [canResend, setCanResend] = useState(false)
  const inputRefs = Array.from({ length: 6 }, () =>
    useRef<HTMLInputElement>(null)
  )

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setCanResend(true)
    }
  }, [timeLeft])

  const handleResend = () => {
    if (!canResend) return
    onResendOTP()
    setTimeLeft(120)
    setCanResend(false)
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // only allow one digit
    setOtp(newOtp)
    onChange('otp', newOtp.join(''))

    if (value && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus()
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
        onChange('otp', newOtp.join(''))
      } else if (index > 0) {
        inputRefs[index - 1].current?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData
      .getData('text')
      .replace(/\D/g, '')
      .slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    pasted.split('').forEach((char, i) => {
      if (i < 6) newOtp[i] = char
    })
    setOtp(newOtp)
    onChange('otp', newOtp.join(''))
    inputRefs[Math.min(pasted.length, 5)].current?.focus()
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className='flex min-h-[calc(100vh-100px)] w-full flex-col items-center justify-center'>
      <div className='flex w-[480px] flex-col items-start justify-start gap-8'>
        <button
          onClick={onBack}
          className='flex items-center gap-2 text-sm font-semibold text-[#6863FB] transition-opacity hover:opacity-80'
        >
          <ArrowLeft className='h-4 w-4' />
          Back
        </button>

        <div className='flex w-full flex-col items-start justify-start gap-1'>
          <h1 className='text-left text-3xl font-semibold text-[rgba(16,24,40,1)]'>
            Verification
          </h1>
          <h2 className='text-left text-3xl font-normal text-[rgba(167,166,204,1)]'>
            Check your inbox
          </h2>
          <p className='mt-2 text-left text-sm font-normal text-[#64748B]'>
            We sent a 6-digit code to {email || 'your email'}. Valid for 10
            minutes.
          </p>
        </div>

        <div className='flex w-full flex-col gap-6'>
          <div className='flex justify-start gap-3'>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={inputRefs[idx]}
                type='text'
                inputMode='numeric'
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                className='flex h-16 w-16 items-center justify-center rounded-xl bg-white text-center text-2xl font-medium text-[#1A1A1A] shadow-sm outline-none focus:ring-2 focus:ring-[#6863FB]'
              />
            ))}
          </div>

          <button
            onClick={onNext}
            disabled={isLoading || !isValid}
            className='w-full rounded-xl bg-[#6863FB] py-3.5 text-base font-semibold text-white transition-all hover:bg-[#5651D9] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'
          >
            {isLoading ? 'Verifying...' : 'Verify and continue'}
          </button>

          <div className='flex flex-col items-center gap-1 text-center text-sm'>
            <span className='text-[#64748B]'>
              Didn&apos;t receive the code yet?
            </span>
            <button
              type='button'
              className='mt-1 font-semibold text-[#6863FB] hover:underline disabled:cursor-not-allowed disabled:opacity-50'
              onClick={handleResend}
              disabled={!canResend}
            >
              {canResend
                ? 'Resend code'
                : `Resend (in ${minutes}:${String(seconds).padStart(2, '0')}s)`}
            </button>
          </div>
        </div>

        {/* Terms & Privacy */}
        <div className='mt-6 flex w-full items-center justify-center gap-4 text-xs text-[#6A7282]'>
          <span>Terms of service</span>
          <div className='h-1 w-1 rounded-full bg-[#99A1AF]'></div>
          <span>Privacy policy</span>
        </div>
      </div>
    </div>
  )
}
