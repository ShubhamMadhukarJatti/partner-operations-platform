'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo } from '@/components/icons/logo'

import MailIcon from '../../../../public/onBoarding-v2.1/blueInbox.svg'
import AuthLeft from './auth-left-container'

type OtpNumbers = {
  firstNumber: string
  secondNumber: string
  thirdNumber: string
  fourthNumber: string
}

const OtpScreen = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')
  const utm_register = searchParams?.get('utm_register')
  const accessToken = getCookie('accessToken')
  const email = sessionStorage.getItem('email')
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const otpData = sessionStorage.getItem('otp-numbers')
  const data: OtpNumbers | null = otpData ? JSON.parse(otpData) : null
  console.log({ accessToken })
  const [selectedOtp, setSelectedOtp] = useState<string>()
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

  // Redirect to appropriate login page if no email/data
  if (!(email && data)) {
    const encoded = searchParams.get('fromRoute')
    const fromRoute = encoded ? atob(encoded) : ''
    if (
      fromRoute === '/partner-portal/login' ||
      pathname?.includes('/partner-portal/login') ||
      pathname === '/partner-portal/login/verify-otp'
    ) {
      router.push('/partner-portal/login')
    } else {
      router.push('/login')
    }
  }

  const handleVerify = async (
    email: string | null,
    otp: string | undefined
  ) => {
    if (!email) {
      showCustomToast('Error', 'Error fetching email', 'error', 5000)
      return
    }

    if (otp?.length !== 6) {
      showCustomToast('Error', 'Enter a valid 6 digit otp', 'error', 5000)
      return
    }
    setAttempts((attempt) => attempt + 1)
    setLoading(true)
    try {
      // Determine if this is a partner portal login
      const encoded = searchParams.get('fromRoute')
      const fromRoute = encoded ? atob(encoded) : ''
      const isPartnerPortal =
        fromRoute === '/partner-portal/login' ||
        pathname?.includes('/partner-portal/login') ||
        pathname === '/partner-portal/login/verify-otp'

      // Use the appropriate API endpoint
      const apiEndpoint = isPartnerPortal
        ? '/api/login-verify-partner'
        : '/api/login-verify'

      const res = await fetch(apiEndpoint, {
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
        console.log(data)
        showCustomToast('Error', data.error, 'error', 5000)
        throw new Error('Failed to login...')
      }

      // sessionStorage.removeItem("email");
      // sessionStorage.removeItem("otp-numbers");

      // Only for /login flow: notify backend OTP success (fire-and-forget, never block or show errors)
      if (!isPartnerPortal) {
        fetch(`/api/user/otp-success?email=${encodeURIComponent(email)}`, {
          method: 'POST',
          credentials: 'include'
        }).catch(() => {})
      }

      showCustomToast('Success', 'Login Successful', 'success', 5000)
      // Use replace so /login/verify-otp is not kept in browser history
      if (isPartnerPortal) {
        const tokenVal =
          data.accessToken || data.data?.accessToken || data.token
        if (tokenVal) {
          localStorage.setItem('partner_access_token', tokenVal)
          sessionStorage.setItem(
            'sharkdom-partner-portal-accessToken',
            tokenVal
          )
        }
        const vendorOrgId =
          searchParams?.get('vendorOrgId') ||
          (typeof window !== 'undefined'
            ? sessionStorage.getItem('partnerPortalOrgId')
            : null)
        if (vendorOrgId) {
          router.replace(`/partner-portal/dashboard/${vendorOrgId}`)
        } else {
          router.replace('/partner-portal/dashboard')
        }
        return
      }
      if (utm_register) {
        router.replace(
          `/onboarding-v2.1/newTeamMember?utm_register=${utm_register}`
        )
      } else {
        if (fromRoute == '/admin-portal') {
          router.replace(redirect ?? '/admin-portal/search')
        } else if (fromRoute == '/partner-portal/login') {
          const vendorOrgId =
            searchParams?.get('vendorOrgId') ||
            (typeof window !== 'undefined'
              ? sessionStorage.getItem('partnerPortalOrgId')
              : null)
          router.replace(
            redirect ??
              (vendorOrgId
                ? `/partner-portal/dashboard/${vendorOrgId}`
                : '/partner-portal/dashboard')
          )
        } else {
          router.replace(redirect ?? '/offline-partners')
        }
      }
      // Store the email in the local storage
      localStorage.setItem('email', email)
      // window.location.reload()
    } catch (error) {
      console.log(error)
      //   toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async ({ email }: { email: string | null }) => {
    if (!email) {
      showCustomToast(
        'Error',
        'Error fetching email...login again',
        'error',
        5000
      )
      const encoded = searchParams.get('fromRoute')
      const fromRoute = encoded ? atob(encoded) : ''
      if (
        fromRoute === '/partner-portal/login' ||
        pathname?.includes('/partner-portal/login') ||
        pathname === '/partner-portal/login/verify-otp'
      ) {
        router.push('/partner-portal/login')
      } else {
        router.push('/login')
      }
      return
    }
    setIsLoading(true)
    try {
      // const auth = getFirebaseAuth()

      const encoded = searchParams.get('fromRoute')
      const fromRoute = encoded ? atob(encoded) : ''
      const isPartnerPortal =
        fromRoute === '/partner-portal/login' ||
        pathname?.includes('/partner-portal/login') ||
        pathname === '/partner-portal/login/verify-otp'

      const apiEndpoint = isPartnerPortal ? '/api/login-partner' : '/api/login'

      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })
      console.log(res)
      if (!res.ok) {
        showCustomToast('Error', `Failed to resend Otp`, 'error', 5000)
        throw new Error('Failed to login...')
      }

      const data = await res.json()
      sessionStorage.setItem('email', email)
      sessionStorage.setItem('otp-numbers', JSON.stringify(data))

      // router.push(redirect ?? '/getting-started')
      // window.location.reload()
    } catch (error: any) {
      switch (error.message) {
        case 'Firebase: Error (auth/user-not-found).':
          showCustomToast(
            'Error',
            'User Doesn`t exist, Create a new account',
            'error',
            5000
          )
          break
        case 'Firebase: Error (auth/invalid-credential).':
          showCustomToast('Error', 'Invalid login credentials', 'error', 5000)
          break
        case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
          showCustomToast(
            'Error',
            'Too many login attempts, please try after few minutes.',
            'error',
            5000
          )
          break
        default:
          showCustomToast(
            'Error',
            'Something went wrong, please try again.',
            'error',
            5000
          )
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

    handleLogin({ email }) // Call the resend function
    setTimeLeft(120) // Reset the timer
    setCanResend(false)
  }

  if (attempts > 2) {
    handleResendOTP()
    setAttempts(0)
  }

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1) // Only allow one digit per box
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
        // Clear current
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
      } else if (index > 0) {
        inputRefs[index - 1].current?.focus()
      }
    } else if (e.key === 'Enter') {
      // Handle Enter key press for better UX
      if (otp.join('').length === 6 && !loading && !isLoading) {
        handleVerify(email, otp.join(''))
      }
    }
  }

  console.log(data)
  return (
    <div className='flex min-h-screen flex-col lg:flex-row'>
      {/* Left Panel */}
      {/* <div className=' hidden max-h-screen items-center justify-center overflow-hidden lg:flex'>

        <AuthLeft title='Modern approach for B2b Partnerships' />
      </div> */}

      {/* Right Panel */}
      {/* <div className='flex w-full flex-1 flex-col items-center justify-center bg-white px-4 py-8 lg:w-1/2'>
        <div className='mx-auto flex w-full max-w-md flex-col gap-8 pb-12 pt-8'>
          <div className='flex justify-center'>
            <FullLogo className='w-[180px] md:w-[239px]' />
          </div>

          <div>
            <h1 className='mb-2 text-center text-2xl font-bold text-[#2A3241]'>
              Check your email
            </h1>
            <p className='text-center text-sm font-normal text-[#4D5C78]'>
              We sent a verification link to{' '}
              <span className='font-bold'>{email}</span>
            </p>
          </div>

          <div>
            <p className='mb-6 text-center text-base font-medium text-[#4D5C78]'>
              Select the correct number as in the email to verify
            </p>
            <div className='mb-4 flex justify-center gap-3'>
              {otp.map((value, idx) => (
                <input
                  key={idx}
                  maxLength={1}
                  type='text'
                  inputMode='numeric'
                  ref={inputRefs[idx]}
                  value={value}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className='h-12 w-12 rounded-lg border border-[#E3E8F2] bg-white text-center text-2xl transition-all focus:border-[#3E50F7] focus:outline-none md:h-16 md:w-16 md:text-3xl'
                />
              ))}
            </div>
            <div className='flex items-center justify-center gap-1 text-sm text-[#4D5C78]'>
              <span>Didnt receive otp?</span>
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

          <div>
            <Button
              className='mt-8 w-full bg-[#3E50F7] text-white transition-all duration-200 hover:scale-105 active:scale-95'
              loading={loading || isLoading}
              onClick={() => handleVerify(email, otp.join(''))}
              disabled={otp.join('').length !== 6}
              title={
                otp.join('').length !== 6
                  ? 'Please enter all 6 digits'
                  : 'Press Enter or click to confirm'
              }
            >
              {loading || isLoading ? 'Verifying...' : 'Confirm'}
            </Button>
          </div>
          <div className='mx-auto w-full max-w-md'>
            <Link
              href={'/login'}
              // className='flex items-center gap-1.5 text-sm font-semibold text-[#3E50F7]'
            >
              <Button className='w-full bg-[#FFFFFF] text-[#2563EB]'>
                Back
              </Button>
            </Link>
          </div>
        </div>
      </div> */}
      <div className='flex w-full flex-1 flex-col items-center justify-center bg-white px-4 py-6 lg:w-1/2'>
        <div className='mx-auto flex w-full max-w-md flex-col gap-8 pt-4'>
          {/* <div className='flex justify-center'>
                  <FullLogo className='w-[180px] md:w-[239px]' />
                </div> */}
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
            {/* <p className='mb-6 text-center text-base font-medium text-[#4D5C78]'>
                    Select the correct number as in the email to verify
                  </p> */}
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
              <Link
                href={(() => {
                  const encoded = searchParams.get('fromRoute')
                  const fromRoute = encoded ? atob(encoded) : ''
                  if (
                    fromRoute === '/partner-portal/login' ||
                    pathname?.includes('/partner-portal/login') ||
                    pathname === '/partner-portal/login/verify-otp'
                  ) {
                    return '/partner-portal/login'
                  }
                  return '/login'
                })()}
              >
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

export default OtpScreen
