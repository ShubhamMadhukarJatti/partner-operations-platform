'use client'

import React, { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { getConfigByType } from '@/lib/db/configuration'
import { getFirebaseAuth } from '@/lib/firebase/auth/firebase'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
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

type Props = {}

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  password: z.string()
})

const AdminPortalLogin = (props: Props) => {
  const router = useRouter()
  const pathname = usePathname()

  const [isLoading, setIsLoading] = useState<boolean>(false)

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
      console.log(res)
      if (!res.ok) {
        showCustomToast('Error', 'Failed to login', 'error', 5000)
        throw new Error('Failed to login...')
      }

      const data = await res.json()
      sessionStorage.setItem('email', email)
      sessionStorage.setItem('otp-numbers', JSON.stringify(data))
      const base64Path = btoa(pathname)
      router.push(`/login/verify-otp?fromRoute=${base64Path}`)
      // router.push('/login/verify-otp')

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleLogin(values)
  }

  return (
    <main className='h-screen bg-[#f4f4f4]'>
      <div className='flex h-full items-center justify-center'>
        <Card className='w-full max-w-lg space-y-4 border-0 bg-white px-7 py-12 shadow-none'>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Login to your account</CardDescription>
          </CardHeader>
          <CardContent className='flex flex-col gap-2'>
            <div className='space-y-4'>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className='space-y-4'
                >
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='example@gmail.com'
                            type='email'
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
                        <div className='flex items-baseline justify-between py-0.5'>
                          <FormLabel>Password</FormLabel> */}
                  {/* <Link
                      href={passRedirectParam('/reset-password')}
                      className='text-sm'
                      tabIndex={5}
                    >
                      Forgot password?
                    </Link> */}
                  {/* </div>
                        <FormControl>
                          <Input
                            placeholder='enter your password'
                            type='password'
                            autoComplete='current-password'
                            required
                            tabIndex={2}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  /> */}
                  <Button
                    type='submit'
                    className='w-full'
                    loading={isLoading !== null && isLoading}
                    tabIndex={3}
                    loadingText='Logging in'
                    size='lg'
                  >
                    Login
                  </Button>
                </form>
              </Form>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default AdminPortalLogin
