'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getCookie } from 'cookies-next'
import { ArrowLeft, ArrowRight } from 'lucide-react'

import { createCollaborationFromUtmPartner } from '@/lib/actions/onboarding-v2.1'
import { UTM_PARTNER_ORG_ID_KEY } from '@/lib/constants'
import { useDecrypt } from '@/lib/hooks/useDecrypt'
import {
  ONBOARDING_REGISTRATION_MODE_KEY,
  registrationModeToVendorPartner
} from '@/lib/onboarding-user-view'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo } from '@/components/icons/logo'
import AuthLeft from '@/app/(auth)/_components/auth-left-container'

import MailIcon from '../../../../../public/onBoarding-v2.1/blueInbox.svg'

type OtpNumbers = {
  firstNumber: string
  secondNumber: string
  thirdNumber: string
  fourthNumber: string
}

const VerifyOtp = () => {
  const accessToken = getCookie('accessToken')
  const email = sessionStorage.getItem('email')
  const { decryptData } = useDecrypt()
  const [loading, setLoading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const otpData = sessionStorage.getItem('otp-numbers')
  const data: OtpNumbers | null = otpData ? JSON.parse(otpData) : null
  console.log({ accessToken })
  const [selectedOtp, setSelectedOtp] = useState<string>()
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes (120 seconds)
  const [canResend, setCanResend] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')
  const partner_key = searchParams?.get('partner_key')
  const utm_source = searchParams?.get('utm_source')
  const utm_register = searchParams?.get('utm_register')
  const isSignUp = searchParams?.get('isSignUp')
  const src = searchParams?.get('src')
  const fromOnboarding = searchParams?.get('fromOnboarding')

  console.log({ src })
  const pathname = usePathname()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ]

  if (!(email && data)) router.push('/login')

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
        console.log(data)
        showCustomToast('Error', data.error, 'error', 5000)
        throw new Error('Failed to login...')
      }

      showCustomToast('Success', 'Signup Successful', 'success', 5000)

      const verifyPayload = data as {
        userId?: string
        uid?: string
        orgId?: number
        organizationId?: number
      }
      const resolvedUserId =
        typeof verifyPayload?.userId === 'string'
          ? verifyPayload.userId
          : typeof verifyPayload?.uid === 'string'
            ? verifyPayload.uid
            : ''
      console.log('[verify-otp] userId:', resolvedUserId)

      // New onboarding flow: complete profile, then GET user-view / current-role, then POST user-view
      if (fromOnboarding === '1' && email) {
        const userId = resolvedUserId
        const orgIdRaw = verifyPayload?.orgId ?? verifyPayload?.organizationId
        const orgIdFromVerify =
          orgIdRaw != null && Number.isFinite(Number(orgIdRaw))
            ? Number(orgIdRaw)
            : undefined

        try {
          await fetch(`/api/onboarding/complete/${encodeURIComponent(email)}`, {
            method: 'POST',
            credentials: 'include'
          })
        } catch (_) {
          // Don't block redirect
        }

        let orgIdForPost = orgIdFromVerify
        if (userId) {
          try {
            const viewRes = await fetch(
              `/api/onboarding/user-view/${encodeURIComponent(userId)}`,
              { method: 'GET', credentials: 'include' }
            )
            const viewJson = await viewRes.json().catch(() => ({}))
            const fromView = viewJson?.data?.orgId
            if (fromView != null && Number.isFinite(Number(fromView))) {
              orgIdForPost = Number(fromView)
            }
          } catch (_) {
            // keep orgIdFromVerify
          }
          try {
            await fetch(
              `/api/onboarding/user/current-role/${encodeURIComponent(userId)}`,
              { method: 'GET', credentials: 'include' }
            )
          } catch (_) {
            // Don't block redirect
          }
        }

        const registrationMode =
          typeof window !== 'undefined'
            ? sessionStorage.getItem(ONBOARDING_REGISTRATION_MODE_KEY) ||
              localStorage.getItem(ONBOARDING_REGISTRATION_MODE_KEY) ||
              ''
            : ''
        const { isVendor, isPartner } =
          registrationModeToVendorPartner(registrationMode)

        if (
          userId &&
          (registrationMode === 'vendor' || registrationMode === 'partner')
        ) {
          try {
            await fetch('/api/onboarding/user-view', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                ...(orgIdForPost != null ? { orgId: orgIdForPost } : {}),
                isVendor,
                isPartner
              })
            })
          } catch (_) {
            // Don't block redirect
          }
        }

        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(ONBOARDING_REGISTRATION_MODE_KEY)
          // localStorage keeps ONBOARDING_REGISTRATION_MODE_KEY until sidebar bootstrap POST succeeds
        }
      }

      if (fromOnboarding === '1') {
        // Create collaboration from utm_register partner (new user flow)
        let receiverOrgId: string | null =
          typeof window !== 'undefined'
            ? localStorage.getItem(UTM_PARTNER_ORG_ID_KEY)
            : null
        if (!receiverOrgId && utm_register) {
          try {
            const decrypted = decryptData(utm_register.replace(/ /g, '+'))
            const parts = decrypted?.split(':')
            receiverOrgId =
              parts?.[1] && /^\d+$/.test(parts[1]) ? parts[1] : null
          } catch (_) {
            receiverOrgId = null
          }
        }
        if (receiverOrgId) {
          if (typeof window !== 'undefined')
            localStorage.removeItem(UTM_PARTNER_ORG_ID_KEY)
          createCollaborationFromUtmPartner(receiverOrgId).catch(() => {})
        }
        // Replace verify-otp URL so it doesn't remain in back history
        router.replace(redirect || '/offline-partners')
        window.location.reload()
        return
      } else if (src === '/free-trial') {
        router.push('/free-trial/onboardingv2')
      } else if (src === '/verified-onboarding') {
        router.push('/verified-onboarding/onboarding')
      } else if (src === '/enterprise-onboarding') {
        router.push('/enterprise-onboarding/onboarding')
      } else if (src === '/onboarding-demo-register') {
        router.push('/onboarding-demo')
      } else if (partner_key || utm_source) {
        router.push(`/onboarding?partner_key=${partner_key || utm_source}`)
      } else if (utm_register) {
        router.push(`/onboarding?utm_register=${utm_register}`)
      } else {
        if (isSignUp) {
          router.push('/onboarding-new')
        } else {
          router.push('/onboarding-v2.1')
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async ({ email }: { email: string | null }) => {
    if (!email) {
      showCustomToast(
        'Error',
        'Error fetching email...Login instead',
        'error',
        5000
      )
      return
    }
    setIsLoading(true)
    try {
      // const auth = getFirebaseAuth()

      const res = await fetch('/api/login', {
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

  console.log(data)
  return (
    <div className='flex min-h-screen flex-col items-center justify-center lg:flex-row'>
      {/* Left Panel */}
      {/* <div className='hidden max-h-screen items-center justify-center overflow-hidden lg:flex'>
        <AuthLeft title='Modern approach for B2b Partnerships' />
      </div> */}

      {/* Right Panel */}
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
              <Link href={'/login'}>
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

export default VerifyOtp
