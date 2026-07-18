'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import google from '@/../public/icons/google.svg'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getGoogleProvider, loginWithProvider } from '@/lib/firebase'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import { useDecrypt } from '@/lib/hooks/useDecrypt'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { PasswordInput } from '@/components/ui/password-input'
import { showCustomToast } from '@/components/custom-toast'

import OtpScreen from './OtpScreen'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
  // password: z.string()
})

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isGoogleAuthLoading, setIsGoogleAuthLoading] = useState(false)
  const [loginResponse, setLoginResponse] = useState()
  const redirect = searchParams?.get('redirect')
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [data, setData] = useState<any>('')
  const { decryptData } = useDecrypt()
  const utm_register = searchParams?.get('utm_register')
  console.log('data', data)

  useEffect(() => {
    if (utm_register) {
      try {
        const decryptedData = decryptData(utm_register?.replace(/ /g, '+'))
        const splitData = decryptedData?.split(':')
        const [userId, orgId, role, email] = splitData
        setData({ userId, orgId, role, email })
        if (email) {
          form.setValue('email', email)
          handleLogin({ email })
        }
      } catch {
        // Ignore decrypt errors; leave form empty
      }
    }
  }, [decryptData, utm_register])

  const handleLogin = async ({ email }: { email: string }) => {
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
      const data = await res.json()

      if (!res.ok) {
        console.log('saas', res)
        throw new Error(data.error)
      }

      sessionStorage.setItem('email', email)
      sessionStorage.setItem('otp-numbers', JSON.stringify(data))
      router.push(`/login/verify-otp?${searchParams?.toString()}`)

      // router.push(redirect ?? '/getting-started')
      // window.location.reload()
    } catch (error: any) {
      console.log('errreree', error)
      const errorMessage =
        error?.message || error?.toString() || 'An error occurred during login'

      switch (errorMessage) {
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
          showCustomToast('Error', errorMessage, 'error', 5000)
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
      router.push(redirect ?? '/getting-started')
      window.location.reload()
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

  function passRedirectParam(url: string) {
    if (redirect) {
      return `${url}?redirect=${redirect}`
    }

    return url
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
      // password: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleLogin({ email: values.email })
  }

  return (
    <div className='space-y-6 '>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='mt-7 space-y-6'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OutlinedInput
                    placeholder='Enter your work email'
                    type='email'
                    label='Email Address'
                    autoComplete='username'
                    required
                    tabIndex={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PasswordInput
                    required
                    tabIndex={2}
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e: any) => setPassword(e.target.value)}
                    autoComplete='current-password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <div className='flex justify-end'>
            <Link
              href={passRedirectParam('/reset-password')}
              className='  fds-text-semibold text-primary-light-blue'
              tabIndex={5}
            >
              Forgot password?
            </Link>
          </div> */}

          <Button
            type='submit'
            className='fds-text-semibold w-full rounded-lg bg-[#6863FB] text-white hover:bg-[#5651D9]'
            loading={isLoading}
            disabled={isGoogleAuthLoading}
            tabIndex={3}
            loadingText='Logging in'
            size='lg'
          >
            Login
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
        className='w-full rounded-lg border border-text-20 fds-text-semibold text-text-100'
        variant='ghost'
        tabIndex={4}
        onClick={handleGoogleLogin}
        loading={isGoogleAuthLoading}
        disabled={isLoading}
        loadingText='Logging in'
        size='lg'
      >
        <Image src={google} alt='' className='mr-2 h-6 w-6' />
        Log in with Google
      </Button> */}
      <div className='flex items-center justify-center  gap-1 pb-2'>
        <span className='fds-text text-text-60'>Don’t have an account?</span>

        <Link href={'/onboarding'}>
          <span className='fds-text-sm text-[#6863FB] transition-colors hover:text-[#5651D9]'>
            Sign up
          </span>
        </Link>
      </div>
    </div>
  )
}
