'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface BookDemoFormProps {
  onSuccess?: () => void
  demoType?: string
}

export const BookDemoForm: React.FC<BookDemoFormProps> = ({
  onSuccess,
  demoType
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const bookDemoFormSchema = z.object({
    fullName: z.string().min(1, {
      message: 'Name is required'
    }),
    businessEmail: z.string().email({
      message: 'Please enter a valid business email address'
    }),
    // phoneNumber: z.string().regex(/^\+?[0-9\s\-()]{7,20}$/, {
    //   message: 'Please enter a valid mobile number'
    // }),
    emailUpdatesOptIn: z.boolean().optional().default(true)
  })

  type BookDemoFormData = z.infer<typeof bookDemoFormSchema>

  const form = useForm<BookDemoFormData>({
    resolver: zodResolver(bookDemoFormSchema),
    defaultValues: {
      fullName: '',
      businessEmail: '',
      // phoneNumber: '',
      emailUpdatesOptIn: true
    }
  })

  const { control, handleSubmit, reset } = form

  async function onSubmit(values: z.infer<typeof bookDemoFormSchema>) {
    const parts = values.fullName.trim().split(' ')
    const firstName = parts[0]
    const lastName = parts.slice(1).join(' ')
    const body = {
      ...values,
      firstName: firstName,
      lastName: lastName,
      purpose: demoType
    }

    try {
      setIsLoading(true)
      const response = await fetch(`/api/demo-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      let data: any = null
      try {
        data = await response.json()
      } catch {
        // ignore non-json responses
      }
      if (!response.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            `Failed to submit. Status: ${response.status}`
        )
      }

      setStatusMessage({
        type: 'success',
        message: "Form submitted successfully. We'll reach out shortly."
      })
      reset()

      // Call onSuccess callback and clear message after 2 seconds
      if (onSuccess) {
        setTimeout(() => {
          onSuccess()
          setStatusMessage(null)
        }, 2000)
      } else {
        setTimeout(() => setStatusMessage(null), 5000)
      }
    } catch (error: any) {
      setStatusMessage({
        type: 'error',
        message: error?.message || 'Something went wrong. Please try again.'
      })

      // Clear message after 5 seconds
      setTimeout(() => setStatusMessage(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }
  const getStatusEmoji = () => {
    if (!statusMessage) return ''
    return statusMessage.type === 'success' ? '🎉' : '❌'
  }
  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className='relative mx-auto w-full max-w-[720px] rounded-3xl border border-slate-200 bg-white p-8 shadow-xl'
      >
        <Label className='mb-4 block text-lg font-semibold text-[#3C3CD4]'>
          Why Partnership/GTM team should avoid CRM’s over PRM at all cost?
        </Label>
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          {/* Full name */}
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Your Name *
            </label>
            <FormField
              control={control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className='h-10 rounded-lg bg-transparent'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Work email */}
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Work Email *
            </label>
            <FormField
              control={control}
              name='businessEmail'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type='email'
                      className='h-10 rounded-lg bg-transparent'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Mobile */}
          {/* <div>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Mobile No *
            </label>
            <FormField
              control={control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      className='h-10 rounded-lg bg-transparent'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}
        </div>

        <FormField
          control={control}
          name='emailUpdatesOptIn'
          render={({ field }) => (
            <label className='flex items-center gap-3 pt-8 text-sm text-slate-600'>
              <Input
                type='checkbox'
                checked={!!field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                className='h-5 w-5 rounded border-slate-300 text-indigo-500'
              />
              Yes, I’d like to receive news and updates by email
            </label>
          )}
        />

        {/* Footer */}
        <div className='mt-4 flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
          <p className='text-sm text-slate-500'>
            By submitting this form you agree with our{' '}
            <span className='text-indigo-500 underline'>Privacy Policy</span>
          </p>
          <Button
            className='h-12 rounded-full bg-indigo-500 px-10 text-white hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 md:w-[80%]'
            type='submit'
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Download Now'
            )}
          </Button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mt-6 rounded-lg p-4 text-center ${
              statusMessage.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <p className='text-sm font-medium'>
              <span className='mr-2'>{getStatusEmoji()}</span>
              {statusMessage.message}
            </p>
          </div>
        )}
      </form>
    </Form>
  )
}
