'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { showCustomToast } from '@/components/custom-toast'

const BookDemoForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [demoBooked, setDemoBooked] = useState(false)

  const formSchema = z.object({
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
    firstName: z.string().min(1, {
      message: 'First name is required'
    }),
    lastName: z.string().min(1, {
      message: 'Last name is required'
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const { control, handleSubmit, reset } = form

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/demo-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json-patch+json'
        },
        body: JSON.stringify(values)
      })
      if (!response.ok) {
        throw new Error(`Failed to post data. Status: ${response.status}`)
      }

      showCustomToast('Success', 'Demo Book', 'success', 5000)
      setDemoBooked(true)
      reset()
    } catch (error: any) {
      showCustomToast('Error', error, 'error', 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {!demoBooked ? (
        <div className='flex  max-w-md   flex-col justify-center rounded-lg border p-4 px-8  shadow-lg'>
          <h3 className='pb-6 text-center text-3xl font-bold text-muted-foreground'>
            Book a Demo with our Team
          </h3>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
              <div className='grid grid-cols-1 gap-2 md:grid-cols-2'>
                <FormField
                  control={control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Business Email</FormLabel> */}
                      <FormControl>
                        <Input placeholder='First Name*' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Business Email</FormLabel> */}
                      <FormControl>
                        <Input placeholder='Last Name*' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={control}
                name='businessEmail'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Business Email</FormLabel> */}
                    <FormControl>
                      <Input placeholder='Business Email*' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='startupName'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Business Email</FormLabel> */}
                    <FormControl>
                      <Input placeholder='Startup Name*' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='purpose'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Business Email</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder='How do you want to use Sharkdom'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Business Email</FormLabel> */}
                    <FormControl>
                      <Input
                        placeholder='Mobile No.'
                        {...field}
                        type='number'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type='submit'
                className='w-full'
                loading={isLoading}
                size='lg'
              >
                Book Demo
              </Button>
            </form>
          </Form>
        </div>
      ) : (
        <div className='flex h-[450px] min-w-[500px] max-w-[500px] flex-col items-center justify-center gap-8 rounded-xl border border-gray-200 bg-white shadow-xl'>
          <Image
            className='rounded-full'
            src='/assets/demo-booking-done-2.jpg'
            width={150}
            height={150}
            alt={'booking-done'}
          />
          <div className='flex flex-col items-center justify-center gap-3'>
            <p className='text-3xl font-bold text-primary'>
              Your Demo has been booked
            </p>
            <p className='mx-12 text-center text-xl font-medium text-gray-400'>
              Our Onboarding team will be reaching out shortly
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default BookDemoForm
