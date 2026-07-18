'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowRight, Eye, EyeOff, Loader2, Users } from 'lucide-react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'
import {
  PARTNER_PORTAL_APP_ACCESS_SESSION_KEY,
  PARTNER_PORTAL_APP_ACCESS_SESSION_VALUE,
  PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_KEY,
  PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_VALUE
} from '@/app/partner-program-portal-app/constants'

import {
  PARTNER_APPLY_EMAIL_SESSION_KEY,
  SUBMIT_SUCCESS_SESSION_KEY,
  SUBMIT_SUCCESS_SESSION_VALUE
} from '../../apply-to-partner-program/_components/constants'
import {
  approvePartnerAction,
  sendOtpAction,
  setPasswordAction,
  verifyOtpAction
} from './actions'

const setPasswordSchema = z
  .object({
    password: z.string().min(8, 'Use at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })

type SetPasswordValues = z.infer<typeof setPasswordSchema>

/** Figma: card padding 17px V / 20px H; inner content is full width of padded area. */
const CARD_PADDING = 'py-[17px] px-5'

const inputClassName = cn(
  'h-[38px] w-full rounded-[6.75px] border border-[#CAC2E1] bg-[#F3F3F5] px-4 pr-11 text-[12.3px]',
  'placeholder:text-[#6A7282] dark:placeholder:text-white focus-visible:ring-2 focus-visible:ring-[#6863FB]/30'
)

export function SetPasswordView() {
  const router = useRouter()
  const [allowed, setAllowed] = useState(false)
  const [email, setEmail] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Real API integration state
  const [flowStep, setFlowStep] = useState<'VERIFY_OTP' | 'SET_PASSWORD'>(
    'VERIFY_OTP'
  )
  const [otpVal, setOtpVal] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const form = useForm<SetPasswordValues>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  })

  // Timer logic for resending OTP
  useEffect(() => {
    if (flowStep === 'VERIFY_OTP' && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (timeLeft === 0) {
      setCanResend(true)
    }
  }, [timeLeft, flowStep])

  const otpSentRef = useRef(false)

  // Check access marker & initial trigger to send OTP on mount
  useEffect(() => {
    try {
      const marker = sessionStorage.getItem(SUBMIT_SUCCESS_SESSION_KEY)
      if (marker !== SUBMIT_SUCCESS_SESSION_VALUE) {
        router.replace('/apply-to-partner-program')
        return
      }
      const storedEmail =
        sessionStorage.getItem(PARTNER_APPLY_EMAIL_SESSION_KEY)?.trim() ?? ''
      setEmail(storedEmail)
      setAllowed(true)

      if (storedEmail && !otpSentRef.current) {
        otpSentRef.current = true
        // Auto-approve and trigger send-otp on land
        sendOtp(storedEmail)
      }
    } catch {
      router.replace('/apply-to-partner-program')
    }
  }, [router])

  const sendOtp = async (emailVal: string) => {
    setIsSendingOtp(true)
    try {
      const res = await sendOtpAction(emailVal)
      if (!res.success) {
        throw new Error(res.message)
      }
      showCustomToast(
        'Code Sent',
        'Verification code has been sent to your email.',
        'success',
        4000
      )
      setTimeLeft(60)
      setCanResend(false)
    } catch (err: any) {
      showCustomToast(
        'Error',
        err.message || 'Could not send verification code',
        'error',
        5000
      )
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otpVal.length !== 6) {
      showCustomToast(
        'Error',
        'Please enter a 6-digit verification code.',
        'error',
        4000
      )
      return
    }
    setIsVerifying(true)
    try {
      const res = await verifyOtpAction(email, otpVal)
      if (!res.success) {
        throw new Error(res.message)
      }
      const data = res.data || {}

      const token = data.accessToken || data.token || data.data?.accessToken
      if (!token) {
        throw new Error('Access token not returned from verify endpoint')
      }

      console.log('SetPasswordView: OTP Verification token received:', token)
      sessionStorage.setItem('sharkdom-partner-portal-accessToken', token)
      localStorage.setItem('partner_access_token', token)

      setAccessToken(token)
      setFlowStep('SET_PASSWORD')
      showCustomToast(
        'Verified',
        'Email verified successfully. Please set your password.',
        'success',
        4000
      )
    } catch (err: any) {
      showCustomToast(
        'Error',
        err.message || 'Invalid verification code',
        'error',
        5000
      )
    } finally {
      setIsVerifying(false)
    }
  }

  async function onSubmit(values: SetPasswordValues) {
    if (!accessToken) {
      showCustomToast(
        'Error',
        'Session expired. Please verify your email again.',
        'error',
        5000
      )
      setFlowStep('VERIFY_OTP')
      return
    }
    setIsSubmitting(true)
    try {
      console.log(accessToken)
      const res = await setPasswordAction(accessToken, values.password)
      if (!res.success) {
        throw new Error(res.message)
      }

      showCustomToast(
        'Success',
        'Your Partner Portal is ready. Redirecting to your dashboard.',
        'success',
        5000
      )
      sessionStorage.setItem(
        PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_KEY,
        PARTNER_PORTAL_APP_WALKTHROUGH_PENDING_SESSION_VALUE
      )
      sessionStorage.setItem(
        PARTNER_PORTAL_APP_ACCESS_SESSION_KEY,
        PARTNER_PORTAL_APP_ACCESS_SESSION_VALUE
      )
      sessionStorage.removeItem(PARTNER_APPLY_EMAIL_SESSION_KEY)
      sessionStorage.removeItem(SUBMIT_SUCCESS_SESSION_KEY)
      router.push('/partner-program-portal-app/dashboard')
    } catch (err: any) {
      showCustomToast(
        'Error',
        err.message || 'Could not save password',
        'error',
        5000
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!allowed) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-[#F8F9FB] font-sans text-sm text-[#6A7282]'>
        Redirecting…
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-[#F8F9FB] font-sans'>
      <div className='mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-10'>
        <div className='flex w-full max-w-[598px] flex-col items-center gap-11'>
          <div className='flex w-full flex-col items-center gap-4'>
            <div
              className='flex size-14 shrink-0 items-center justify-center rounded-[14px]'
              style={{ background: 'rgba(62, 80, 247, 0.1)' }}
            >
              <Users
                className='size-7 text-[#6863FB]'
                strokeWidth={2}
                aria-hidden
              />
            </div>
            <div className='flex w-full flex-col gap-[18px] text-center'>
              <h1 className='text-[26px] font-semibold leading-tight text-[#323232]'>
                You are almost there!
              </h1>
              <p className='text-base font-medium leading-[1.46] text-[#21232C]'>
                <span className='text-[#21232C]'>
                  {email ? `Welcome ${email}!` : 'Welcome!'}
                  <br />
                </span>
                <span className='text-[#4D5C78] dark:text-white dark:focus:!text-white'>
                  {flowStep === 'VERIFY_OTP'
                    ? 'Verify your identity to proceed with the password setup.'
                    : 'Create a secure password to access your Partner Dashboard.'}
                </span>
              </p>
            </div>
          </div>

          <div className='flex w-full max-w-[392px] flex-col items-center gap-4'>
            {flowStep === 'VERIFY_OTP' ? (
              <div
                className={cn(
                  'box-border w-full max-w-[392px] rounded-[12.75px] border border-black/10 bg-white dark:bg-card',
                  CARD_PADDING
                )}
              >
                <div className='flex w-full min-w-0 flex-col'>
                  <h2 className='mb-2 text-center text-[18px] font-semibold text-black'>
                    Verify your email
                  </h2>
                  <p className='mb-5 text-center text-xs text-[#6A7282]'>
                    Enter the 6-digit code sent to your email.
                  </p>

                  <div className='flex flex-col gap-4'>
                    <div className='space-y-[7px]'>
                      <label className='text-[12.3px] font-normal text-[#323232]'>
                        Verification Code
                      </label>
                      <input
                        type='text'
                        maxLength={6}
                        placeholder='------'
                        value={otpVal}
                        onChange={(e) =>
                          setOtpVal(
                            e.target.value.replace(/\D/g, '').slice(0, 6)
                          )
                        }
                        className={cn(
                          'h-[38px] w-full rounded-[6.75px] border border-[#CAC2E1] bg-[#F3F3F5] px-4 text-center font-mono text-[14px] font-bold tracking-[0.5em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6863FB]/30'
                        )}
                      />
                    </div>

                    <Button
                      type='button'
                      disabled={isVerifying || otpVal.length !== 6}
                      onClick={handleVerifyOtp}
                      className='inline-flex h-[38px] w-full shrink-0 items-center justify-center gap-1.5 rounded-[6.75px] bg-[#6863FB] text-xs font-medium text-white hover:bg-[#6863FB]/90'
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className='size-3.5 animate-spin' />
                          Verifying…
                        </>
                      ) : (
                        <>
                          Verify &amp; Continue
                          <ArrowRight className='size-3.5' aria-hidden />
                        </>
                      )}
                    </Button>

                    <div className='mt-2 flex items-center justify-center gap-1 text-[11px] text-[#4D5C78]'>
                      <span>Didn&apos;t receive the code?</span>
                      <button
                        type='button'
                        className='font-semibold text-[#6863FB] hover:underline disabled:no-underline disabled:opacity-50'
                        onClick={() => sendOtp(email)}
                        disabled={!canResend || isSendingOtp}
                      >
                        {isSendingOtp ? 'Sending...' : 'Resend Code'}
                      </button>
                      {!canResend && (
                        <span className='text-[#6A7282]'>(in {timeLeft}s)</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='flex w-full max-w-[392px] flex-col items-center gap-4'
                >
                  <div
                    className={cn(
                      'box-border w-full max-w-[392px] rounded-[12.75px] border border-black/10 bg-white dark:bg-card',
                      CARD_PADDING
                    )}
                  >
                    <div className='flex w-full min-w-0 flex-col'>
                      <h2 className='mb-[21px] text-center text-[18px] font-semibold text-black'>
                        Set your password
                      </h2>
                      <div className='flex flex-col gap-4'>
                        <FormField
                          control={form.control}
                          name='password'
                          render={({ field }) => (
                            <FormItem className='space-y-[7px]'>
                              <FormLabel className='text-[12.3px] font-normal text-[#323232]'>
                                Create Password
                              </FormLabel>
                              <div className='relative'>
                                <FormControl>
                                  <Input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder='Min. 8 Characters'
                                    autoComplete='new-password'
                                    className={inputClassName}
                                    {...field}
                                  />
                                </FormControl>
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 -translate-y-1/2 text-black'
                                  onClick={() => setShowPassword((v) => !v)}
                                  aria-label={
                                    showPassword
                                      ? 'Hide password'
                                      : 'Show password'
                                  }
                                >
                                  {showPassword ? (
                                    <EyeOff
                                      className='size-[18px]'
                                      strokeWidth={1.5}
                                    />
                                  ) : (
                                    <Eye
                                      className='size-[18px]'
                                      strokeWidth={1.5}
                                    />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name='confirmPassword'
                          render={({ field }) => (
                            <FormItem className='space-y-[7px]'>
                              <FormLabel className='text-[12.3px] font-normal text-[#323232]'>
                                Confirm your password
                              </FormLabel>
                              <div className='relative'>
                                <FormControl>
                                  <Input
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder='Re-enter your password'
                                    autoComplete='new-password'
                                    className={inputClassName}
                                    {...field}
                                  />
                                </FormControl>
                                <button
                                  type='button'
                                  className='absolute right-3 top-1/2 -translate-y-1/2 text-black'
                                  onClick={() => setShowConfirm((v) => !v)}
                                  aria-label={
                                    showConfirm
                                      ? 'Hide confirm password'
                                      : 'Show confirm password'
                                  }
                                >
                                  {showConfirm ? (
                                    <EyeOff
                                      className='size-[18px]'
                                      strokeWidth={1.5}
                                    />
                                  ) : (
                                    <Eye
                                      className='size-[18px]'
                                      strokeWidth={1.5}
                                    />
                                  )}
                                </button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type='submit'
                    disabled={isSubmitting}
                    className='inline-flex h-[38px] w-full max-w-[392px] shrink-0 items-center justify-center gap-1.5 rounded-[6.75px] bg-[#6863FB] text-xs font-medium text-white hover:bg-[#6863FB]/90'
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className='size-3.5 animate-spin' />
                        Continuing…
                      </>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className='size-3.5' aria-hidden />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}

            <p className='max-w-[392px] text-center text-[10.5px] leading-[14px] text-[#4D5C78] dark:text-white dark:focus:!text-white'>
              By continuing, you agree to our{' '}
              <Link
                href='/terms-and-conditions'
                className='underline underline-offset-2'
              >
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link
                href='/privacy-policy'
                className='underline underline-offset-2'
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
