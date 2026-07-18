'use client'

import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const BookDemoForm = () => {
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
    startupName: z.string().min(1, {
      message: 'Startup name is required'
    }),
    purpose: z.string().min(1, {
      message: 'Purpose is required'
    }),
    phoneNumber: z.string().regex(/^\d{10,15}$/, {
      message: 'Please enter a valid mobile number with 10 to 15 digits'
    }),
    heardAboutUs: z.string().min(1, {
      message: 'This field is required'
    }),
    jobTitle: z.string().optional().nullable(),
    emailUpdatesOptIn: z.boolean().optional().default(true)
  })

  type BookDemoFormData = z.infer<typeof bookDemoFormSchema>

  const form = useForm<BookDemoFormData>({
    resolver: zodResolver(bookDemoFormSchema),
    defaultValues: {
      fullName: '',
      startupName: '',
      businessEmail: '',
      purpose: '',
      jobTitle: '',
      phoneNumber: '',
      heardAboutUs: '',
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
      lastName: lastName
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

      // Clear message after 5 seconds
      setTimeout(() => setStatusMessage(null), 5000)
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
        className='relative mx-auto max-w-[720px] rounded-3xl border border-slate-200 bg-white/70 p-8 shadow-xl backdrop-blur'
      >
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
          <div>
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
          <div>
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
          </div>

          {/* Startup name */}
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Company Name *
            </label>
            <FormField
              control={control}
              name='startupName'
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

          {/* Heard about */}
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              How did you hear about us? *
            </label>
            <FormField
              control={control}
              name='heardAboutUs'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='h-10 rounded-lg'>
                        <SelectValue placeholder='Select an option' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='News'>News</SelectItem>
                        <SelectItem value='Linkedin'>LinkedIn</SelectItem>
                        <SelectItem value='Someone referred'>
                          Someone referred
                        </SelectItem>
                        <SelectItem value='Advertisement'>
                          Advertisement
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Job title */}
          {/* <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              Job Title
            </label>
            <FormField
              control={control}
              name='jobTitle'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ''}
                      className='h-10 rounded-lg bg-transparent'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div> */}

          {/* Purpose */}
          <div className='md:col-span-2'>
            <label className='mb-2 block text-sm font-medium text-slate-700'>
              How do you want to use Sharkdom? *
            </label>
            <FormField
              control={control}
              name='purpose'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className='h-10 rounded-lg'>
                        <SelectValue placeholder='Select an option' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='scale_partnerships'>
                          Scale Partnerships without adding head-counts
                        </SelectItem>
                        <SelectItem value='partner_program'>
                          Make your partner program noticeable
                        </SelectItem>
                        <SelectItem value='activate_partners'>
                          Activate partners faster with structured Onboarding
                          and Training
                        </SelectItem>
                        <SelectItem value='manage_pipeline'>
                          Completely Manage partnership pipeline via Sharkdom
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
            loading={isLoading}
            loadingText='Submitting...'
            className='h-12 rounded-full bg-indigo-500 px-10 text-white hover:bg-indigo-600 md:w-[80%]'
            type='submit'
          >
            Request Demo
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

export default BookDemoForm
