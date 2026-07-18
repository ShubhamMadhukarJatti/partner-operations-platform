'use client'

import React, { useRef, useState } from 'react'

import { Input } from '@/components/ui/input'

const OTP_LENGTH = 6

export const OTPInput: React.FC<{
  otp?: string
  setOtp?: (v: string) => void
}> = ({ otp: parentOtp = '', setOtp: setParentOtp }) => {
  const [otp, setOtp] = useState<string[]>(
    parentOtp
      ? parentOtp
          .split('')
          .concat(Array(OTP_LENGTH - parentOtp.length).fill(''))
      : Array(OTP_LENGTH).fill('')
  )

  const updateParent = (newOtp: string[]) => {
    if (setParentOtp) setParentOtp(newOtp.join(''))
  }
  const inputsRef = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    updateParent(newOtp)

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) inputsRef.current[index - 1]?.focus()
      } else {
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        updateParent(newOtp)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pasted = e.clipboardData
      .getData('Text')
      .slice(0, OTP_LENGTH)
      .split('')
    if (pasted.every((char) => /^\d$/.test(char))) {
      const newOtp = Array(OTP_LENGTH).fill('')
      pasted.forEach((char, idx) => {
        newOtp[idx] = char
      })
      setOtp(newOtp)
      updateParent(newOtp)
      pasted.forEach((_, idx) => {
        inputsRef.current[idx]?.value && inputsRef.current[idx]?.focus()
      })
    }
  }

  return (
    <div className='flex space-x-2'>
      {otp.map((digit, index) => (
        <Input
          key={index}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={digit}
          ref={(el) => {
            inputsRef.current[index] = el as HTMLInputElement
          }}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className='h-12 w-12 rounded text-center text-xl'
        />
      ))}
    </div>
  )
}
