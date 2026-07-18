'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { OutlinedInput } from '@/components/ui/outlined-input'

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
})

const PartnerPortalLoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams?.get('redirect')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async ({ email }: { email: string }) => {
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
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      sessionStorage.setItem('email', email)
      sessionStorage.setItem('otp-numbers', JSON.stringify(data))
      sessionStorage.setItem('login-source', 'partner-portal')
      router.push(
        `/partner-portal/login/verify-otp?${searchParams?.toString()}`
      )
    } catch (error: any) {
      const errorMessage =
        error?.message || error?.toString() || 'An error occurred during login'

      switch (errorMessage) {
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
          toast.error(errorMessage)
      }
      return
    } finally {
      setIsLoading(false)
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
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

      <div className='flex items-center justify-center  gap-1 pb-2'>
        <span className='text-shark-sm  font-medium text-text-60'>
          Don&apos;t have access?
        </span>

        <Link href={'/contact'}>
          <span className='text-shark-sm font-bold text-primary-light-blue'>
            Contact us
          </span>
        </Link>
      </div>
    </div>
  )
}

export default PartnerPortalLoginForm
