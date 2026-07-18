'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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
import { showCustomToast } from '@/components/custom-toast'
import { Logo } from '@/components/icons/logo'
import { AuthNewSlider } from '@/app/(auth)/_components/auth-new-slider'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
})

const PartnerCourseLogin = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const autoLoginAttempted = useRef<boolean>(false)
  const { decryptData } = useDecrypt()
  const utm_register = searchParams?.get('utm')

  const handleLogin = useCallback(
    async ({ email }: { email: string }) => {
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
          showCustomToast('Error', 'Failed to login', 'error', 5000)
          throw new Error('Failed to login...')
        }

        const data = await res.json()
        sessionStorage.setItem('email', email)
        sessionStorage.setItem('otp-numbers', JSON.stringify(data))
        const base64Path = btoa(pathname)
        const queryParams = new URLSearchParams()
        queryParams.set('fromRoute', base64Path)
        if (utm_register) {
          queryParams.set('utm_register', utm_register)
        }
        router.push(`/partner-course/otp-verify?${queryParams.toString()}`)
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
          case 'Firebase: Error (auth/too-many-requests).':
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
    },
    [pathname, router, utm_register]
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  // Extract email from UTM parameter and auto-login
  useEffect(() => {
    if (utm_register && !autoLoginAttempted.current) {
      try {
        const decryptedData = decryptData(utm_register?.replace(/ /g, '+'))
        const splitData = decryptedData?.split(':')
        const [userId, orgId, role, email] = splitData
        if (email) {
          autoLoginAttempted.current = true
          form.setValue('email', email)
          handleLogin({ email })
        }
      } catch (error) {
        console.error('Error processing utm_register parameter:', error)
        showCustomToast(
          'Error',
          'Failed to process UTM parameter. Please try again.',
          'error',
          5000
        )
      }
    }
  }, [utm_register, decryptData, form, handleLogin])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleLogin(values)
  }

  return (
    <div className='flex min-h-screen flex-col md:flex-row lg:flex-row'>
      <div className='hidden w-1/2 items-center justify-center bg-gray-50 lg:flex'>
        <AuthNewSlider />
      </div>
      <div className='flex w-full flex-1 flex-col-reverse items-center justify-center pt-10 lg:flex-row'>
        <div className='flex w-full max-w-full flex-col justify-center p-6 sm:p-8 md:p-10 lg:mr-24 lg:max-w-[561px] lg:p-12'>
          <div className='flex justify-center lg:justify-start'>
            <Logo className='w-[120px] lg:w-[150px]' />
          </div>
          <div className='mt-10 text-center lg:mt-6 lg:text-left'>
            <h1 className='text-2xl font-bold text-text-100 lg:text-shark-3xl'>
              Partner Course Login
            </h1>
            <p className='mt-2 text-base font-medium text-text-60'>
              Enter your credentials to continue
            </p>
          </div>
          <div className='mt-7 space-y-6'>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
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

                <Button
                  type='submit'
                  className='w-full rounded-lg bg-primary-light-blue text-shark-base font-bold text-white'
                  loading={isLoading}
                  tabIndex={3}
                  loadingText='Logging in'
                  size='lg'
                >
                  Login
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PartnerCourseLogin
