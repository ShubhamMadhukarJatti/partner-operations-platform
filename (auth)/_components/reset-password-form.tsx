'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

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

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  })
})

export const ResetPasswordForm = () => {
  const [isMailSent, setIsMailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async ({ email }: { email: string }) => {
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!data.email_sent) {
        showCustomToast('Error', data.error, 'error', 5000)
        return
      }

      setIsMailSent(true)
    } catch (error) {
      showCustomToast(
        'Error',
        'Failed to send password reset email',
        'error',
        5000
      )
    }
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsMailSent(false)
      setIsLoading(true)

      await handleForgotPassword(values)
    } catch (error: any) {
      showCustomToast('Error', error, 'error', 5000)
    } finally {
      setIsLoading(false)
    }
  }

  if (isMailSent) {
    return (
      <div className='space-y-3'>
        <div className='flex items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-20 w-20 md:rotate-[15deg] lg:h-32 lg:w-32'
            width='100%'
            height='100%'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='1'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z'></path>
            <polyline points='22,6 12,13 2,6'></polyline>
          </svg>
        </div>
        <p className='text-center text-lg font-semibold [text-wrap:balance]'>
          Please check your inbox for password reset instructions
        </p>
        <p className='text-center text-sm text-muted-foreground [text-wrap:balance]'>
          If you don&apos;t see the email, please check your spam folder
        </p>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder='example@gmail.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-full' loading={isLoading} size='lg'>
          Send me a recovery link
        </Button>
      </form>
    </Form>
  )
}
