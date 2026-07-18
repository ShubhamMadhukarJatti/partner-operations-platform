'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showCustomToast } from '@/components/custom-toast'

// Define your form schema (replace with your actual schema) -
// This schema validates that the 'email' field is a valid email address.
const formSchema = z.object({
  businessEmail: z.string().email({ message: 'Invalid email address.' })
})

const EbookDownloadSection = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [demoBooked, setDemoBooked] = useState(false) // Added state for demo booked status

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessEmail: ''
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('values', values)
    try {
      setIsLoading(true)
      const response = await fetch(`/api/demo-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...values,
          startupName: 'partner-page',
          purpose: 'KPI-PLAYBOOK',
          phoneNumber: '1234567890',
          firstName: 'partner',
          lastName: 'partner'
          // demoType: 'KPI-PLAYBOOK',
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `Failed to post data. Status: ${response.status}`
        )
      }

      showCustomToast(
        'Success',
        'E-book download initiated! Check your email.',
        'success',
        5000
      )
      setDemoBooked(true)
      form.reset()
    } catch (error: any) {
      showCustomToast(
        'Error',
        `Error: ${error.message || 'Something went wrong.'}`,
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='container mx-auto px-4 py-12 md:py-20'>
      <div className='grid grid-cols-1 gap-8 overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-xl md:grid-cols-2 md:p-12'>
        {/* Left Section: Image and Demo Button */}
        <div className='flex flex-col items-center justify-center rounded-md bg-gray-50 p-4'>
          <img
            src='/assets/ebook-cover.svg' // Placeholder image path, replace with actual
            alt='Metrics to measure a Partnership well ahead of partnering Ebook Cover'
            className='mb-6 h-auto w-full max-w-sm rounded-md object-contain'
          />

          <Link
            href='/book-demo'
            passHref // Use passHref with custom components inside Link
          >
            <Button variant='outline' size='lg' className='w-full max-w-xs'>
              Get a free demo
            </Button>
          </Link>
        </div>

        {/* Right Section: Text and Form */}
        <div className='flex flex-col justify-center space-y-6'>
          <h2 className='text-3xl font-bold leading-tight tracking-tight md:text-4xl'>
            KPI&apos;s to measure{' '}
            <span className='text-[#00AD3C]'>Partnership Outcome</span> ahead of
            partnering
          </h2>

          <blockquote className='border-l-4 border-blue-500 pl-4 text-lg italic text-gray-700'>
            &quot;Truly astonishing about this resource is that it made us clear
            about metrics to see before investing any further time on a
            partnership&quot;
          </blockquote>

          <div className='text-sm text-gray-600'>
            <p>Rajat Kulshreshta | CTO & co-founder</p>
            <img
              src='\assets\Kaksha-Setui.svg'
              alt='Testimonial'
              className='w-50 my-4 h-4 object-cover'
            />
          </div>

          {/* Download Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <Label htmlFor='work-email' className='text-base font-medium'>
              Work Email*
            </Label>
            <Input
              id='work-email'
              type='email'
              placeholder='Enter your work email'
              className='w-full'
              {...form.register('businessEmail')}
            />
            {form.formState.errors.businessEmail && (
              <p className='text-sm text-red-500'>
                {form.formState.errors.businessEmail.message}
              </p>
            )}
            <Button
              type='submit'
              size='lg'
              className='w-full bg-blue-600 hover:bg-blue-700'
              disabled={isLoading}
            >
              {isLoading ? 'Downloading...' : 'Download E-book'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default EbookDownloadSection
