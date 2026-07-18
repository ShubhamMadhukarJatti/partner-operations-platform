'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { ArrowRight, Mail, SmileIcon } from 'lucide-react'
import { useCookies } from 'react-cookie'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getGoogleProvider, loginWithProvider } from '@/lib/firebase'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { PasswordInput } from '@/components/ui/password-input'
import { showCustomToast } from '@/components/custom-toast'

const formSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .refine((email) => !/(gmail\.com|outlook\.com)$/i.test(email), {
      message: 'Emails from gmail.com and outlook.com are not allowed'
    })
})

export const RegistrationForm = ({ isSignUp }: { isSignUp?: boolean }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cookies, setCookie] = useCookies<string>(['offer'])
  const redirect = searchParams?.get('redirect')
  const partner_key = searchParams?.get('partner_key')
  const utm_source = searchParams?.get('utm_source')
  const utm_register = searchParams?.get('utm_register')
  const pathname = usePathname()
  if (searchParams.has('offer')) {
    const offer = searchParams.get('offer')
    setCookie('offer', offer, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
  }
  if (searchParams.has('campaign')) {
    const campaign = searchParams.get('campaign')
    setCookie('campaign', campaign, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    })
  }
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [passwordsMatch, setPasswordsMatch] = useState(true)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  useEffect(() => {
    const emailFromUrl = searchParams?.get('email')
    if (emailFromUrl) {
      form.setValue('email', emailFromUrl)
    }
  }, [searchParams, form])

  console.log(pathname)

  const handleRegister = async ({ email }: { email: string }) => {
    setIsLoading(true)
    const params = new URLSearchParams(searchParams.toString())

    // Append `isSignUp=true` only if isSignUp is true
    if (isSignUp) {
      params.set('isSignUp', 'true')
    }
    params.set('src', pathname)
    try {
      // const auth = getFirebaseAuth()
      // const credential = await createUserWithEmailAndPassword(
      //   auth,
      //   email,
      //   password
      // )
      // const idTokenResult = await credential.user.getIdTokenResult()
      // await fetch('/api/login', {
      //   method: 'GET',
      //   headers: {
      //     Authorization: `Bearer ${idTokenResult.token}`
      //   }
      // })
      if (!email) return
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      })
      const data = await res.json()

      if (!res.ok) {
        showCustomToast('Error', `${data.error}`, 'error', 5000)
        throw new Error('Failed to register...')
      }

      sessionStorage.setItem('email', email)
      sessionStorage.setItem('otp-numbers', JSON.stringify(data))

      // If user came from new onboarding flow, submit onboarding data to backend
      const onboardingPayloadRaw =
        typeof sessionStorage !== 'undefined'
          ? sessionStorage.getItem('ONBOARDING_PAYLOAD')
          : null
      if (onboardingPayloadRaw) {
        try {
          const payload = JSON.parse(onboardingPayloadRaw) as Record<
            string,
            unknown
          >
          const startRes = await fetch('/api/onboarding/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...payload, email })
          })
          const startData = await startRes.json()
          if (startRes.ok && startData.success) {
            sessionStorage.removeItem('ONBOARDING_PAYLOAD')
          }
          // Continue to OTP regardless of onboarding/start result
        } catch (_) {
          // Don't block redirect to OTP
        }
      }

      // Replace /sign-up in history with verify-otp so it isn't shown on back
      router.replace(`/register/verify-otp?${params.toString()}`)

      // if (pathname === '/free-trial') {
      //   router.push('/free-trial/onboarding')
      // } else if (pathname === '/onboarding-demo-register') {
      //   router.push('/onboarding-demo')
      // } else if (partner_key || utm_source) {
      //   router.push(`/onboarding?partner_key=${partner_key || utm_source}`)
      // } else if (utm_register) {
      //   router.push(`/onboarding?utm_register=${utm_register}`)
      // } else {
      //   if (isSignUp) {
      //     router.push('/onboarding-new')
      //   } else {
      //     router.push('/onboarding')
      //   }
      // }
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        showCustomToast(
          'Error',
          'Email already in use, Please Login',
          'error',
          5000
        )
      } else if (error.code === 'auth/invalid-email') {
        showCustomToast('Error', 'Invalid email address', 'error', 5000)
      } else {
        console.error(error.message)
      }
      return
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleAuthLoading(true)
      const auth = getFirebaseAuth()
      const user = await loginWithProvider(auth, getGoogleProvider(auth))
      const idTokenResult = await user.getIdTokenResult()
      await fetch('/api/login', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${idTokenResult.token}`
        }
      })
      setIsGoogleAuthLoading(false)

      router.push(redirect ?? '/offline-partners')
    } catch (error) {
      showCustomToast(
        'Error',
        'Authentication failed, Please try again',
        'error',
        5000
      )
      return
    } finally {
      setIsGoogleAuthLoading(false)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleRegister({ email: values.email })
  }

  const handlePasswordConfirmationChange = (e: any) => {
    const newPasswordConfirmation = e.target.value
    setPasswordConfirmation(newPasswordConfirmation)
    setPasswordsMatch(password === newPasswordConfirmation)
  }
  return (
    <div className='space-y-3'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-6 space-y-2'>
          <p className='fds-text-semibold'>Get started</p>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  {/* <OutlinedInput
                    label='Email Address'
                    type='email'
                    placeholder='example@gmail.com'
                    required
                    {...field}
                  /> */}
                  <>
                    <Label className='text-sm text-[#4D5C78]'>
                      Enter your work email to create your account
                    </Label>
                    <Input
                      type='email'
                      placeholder='business@work.com'
                      icon={<Mail size={16} />}
                      required
                      {...field}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='  w-full pl-1'>
            <p className='text-xs text-[#4D5C78]'>
              We&apos;ll send a verification code to this email
            </p>
            {/* <div className='text-[#007AFF]'>
              <SmileIcon size={20} />
            </div>
            <p className='fds-text-sm text-blue-500'>
              Recommended: By entering your business email you can skip the
              verification jargon
            </p> */}
          </div>

          {/* <FormItem>
            <Label>Password*</Label>
            <PasswordInput
              required
              tabIndex={2}
              placeholder='enter a strong password'
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              autoComplete='current-password'
              // {...field}
            />
          </FormItem> */}

          {/* <FormItem>
            <Label>Reenter Password*</Label>
            <PasswordInput
              required
              tabIndex={2}
              placeholder='enter the same password'
              value={passwordConfirmation}
              onChange={handlePasswordConfirmationChange}
              autoComplete='current-password'
              // {...field}
            />
          </FormItem> */}
          <Button
            type='submit'
            className=' fds-text-semibold !mt-6 h-10 w-full rounded-lg bg-primary-light-blue text-white'
            loading={isLoading}
            loadingText='Creating account'
            disabled={isGoogleAuthLoading}
            size='lg'
          >
            Continue <ArrowRight className='h-4 w-8' />
          </Button>
        </form>
      </Form>
      {/* <div className='flex items-center gap-2 '>
        <hr className='h-px w-full' />
        <span className='text-bold shrink-0 text-shark-xs text-[#7688A8]'>
          OR CONTINUE WITH
        </span>
        <hr className='h-px w-full' />
      </div>

      <Button
        className='w-full rounded-lg border border-text-20 bg-white fds-text-semibold text-text-100'
        variant='ghost'
        tabIndex={4}
        onClick={handleGoogleLogin}
        loading={isGoogleAuthLoading}
        disabled={isLoading}
        loadingText='Logging in'
        size='lg'
      >
        <Image
          src={'/icons/google.svg'}
          alt=''
          className='mr-2 h-6 w-6'
          width={24}
          height={24}
        />
        SignUp with Google
      </Button> */}

      {/* <Button
        className={cn('flex w-full border-2 text-base', {
          //   hidden: pathname === '/onboarding-demo-register'
        })}
        variant='ghost'
        tabIndex={4}
        onClick={() => {
          signIn('slack')
        }}
        loadingText='Logging in'
        size='lg'
      >
        <Image
          src={'/icons/google.svg'}
          width={24}
          height={24}
          alt=''
          className='mr-2 h-6 w-6'
        />
        Login with slack
      </Button> */}

      <div className='flex flex-col items-center justify-center gap-1'>
        <span className='fds-text text-text-60'>Already have a account?</span>

        <Link href={'/login'}>
          <span className='fds-text-sm text-primary-light-blue'>Sign in</span>
          <br />
        </Link>
      </div>
      <p className='flex justify-center text-xs text-[#4D5C78]'>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </p>
    </div>
  )
}

export default RegistrationForm
