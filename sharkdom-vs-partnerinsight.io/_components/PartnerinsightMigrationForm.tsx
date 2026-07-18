'use client'

import React, { useState } from 'react'
import Link from 'next/link'
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

const bookDemoFormSchema = z.object({
  fullName: z.string().min(1, { message: 'Name is required' }),
  businessEmail: z.string().email({
    message: 'Please enter a valid business email address'
  }),
  startupName: z.string().min(1, { message: 'Company name is required' }),
  purpose: z.string().min(1, { message: 'Purpose is required' }),
  phoneNumber: z.string().regex(/^\d{10,15}$/, {
    message: 'Please enter a valid mobile number with 10 to 15 digits'
  }),
  heardAboutUs: z.string().min(1, { message: 'This field is required' }),
  jobTitle: z.string().optional().nullable(),
  emailUpdatesOptIn: z.boolean().optional().default(true)
})

type BookDemoFormData = z.infer<typeof bookDemoFormSchema>

export default function PartnerinsightMigrationForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

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

  async function onSubmit(values: BookDemoFormData) {
    const parts = values.fullName.trim().split(' ')
    const firstName = parts[0]
    const lastName = parts.slice(1).join(' ')
    const body = {
      ...values,
      firstName,
      lastName
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

      let data: unknown = null
      try {
        data = await response.json()
      } catch {
        /* ignore */
      }
      if (!response.ok) {
        const err = data as { error?: string; message?: string } | null
        throw new Error(
          err?.error ||
            err?.message ||
            `Failed to submit. Status: ${response.status}`
        )
      }

      setStatusMessage({
        type: 'success',
        message: "Form submitted successfully. We'll reach out shortly."
      })
      reset()
      setTimeout(() => setStatusMessage(null), 5000)
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.'
      setStatusMessage({ type: 'error', message })
      setTimeout(() => setStatusMessage(null), 5000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className='border-y border-[#e2e4eb] bg-gradient-to-r from-[rgba(185,207,255,0.23)] to-[rgba(222,176,255,0.23)] py-16 md:py-24'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='grid gap-12 lg:grid-cols-2 lg:items-start lg:gap-16'>
          <div className='space-y-8'>
            <div className='inline-flex items-center gap-2 rounded-full border border-[#d3d7e2] bg-white px-3 py-1.5 pr-4'>
              <span
                className='size-1.5 rounded-full bg-[#6054ec]'
                aria-hidden
              />
              <span className='font-mono text-[11px] font-medium uppercase tracking-[1.1px] text-[#3e424d]'>
                Migration, done for you
              </span>
            </div>

            <h2 className='text-[clamp(1.75rem,4vw,2.7rem)] font-bold leading-tight tracking-tight text-[#0e111b]'>
              <span className='text-[#6863fb]'>Migrate to Sharkdom</span>
              <span>
                {' '}
                from PartnerInsight.io or any top GTM/partner ops platform
              </span>
            </h2>

            <p className='max-w-xl text-base leading-relaxed text-[#0e111b]'>
              We&apos;ll rebuild your partner workspace in Sharkdom from an
              export free of charge. Most GTM teams go live in under a week.
            </p>

            <ul className='space-y-4'>
              {[
                'Free white-glove migration by our CX team',
                'All partners, deals & history preserved',
                'Side-by-side running for 30 days',
                'No data left behind, ever'
              ].map((text) => (
                <li key={text} className='flex items-start gap-3'>
                  <span className='mt-0.5 flex size-[22px] shrink-0 items-center justify-center rounded-[7px] bg-[#eaedff] text-sm font-bold text-[#320e9d]'>
                    ✓
                  </span>
                  <span className='text-sm font-medium text-[#0e111b]'>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='compare-page-card-pop cursor-default rounded-[24px] border border-[#e4e7ee] bg-gradient-to-br from-[#e3e5eb]/50 via-[#f9fafa]/50 to-[#fcfcfd]/50 p-6 shadow-[0px_16px_16px_rgba(23,25,28,0.12),0px_30px_32px_rgba(23,25,28,0.2)] hover:border-[#6863fb]/35 hover:shadow-[0px_20px_40px_-10px_rgba(96,84,236,0.22),0px_28px_40px_rgba(23,25,28,0.18)] md:p-8'
            >
              <div className='grid gap-5'>
                <div>
                  <label className='mb-2 block text-sm font-medium text-[#454a54]'>
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
                            className='h-10 rounded border-[#e3e5e8] bg-white'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='grid gap-5 sm:grid-cols-2'>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[#454a54]'>
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
                              className='h-10 rounded border-[#e3e5e8] bg-white'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div>
                    <label className='mb-2 block text-sm font-medium text-[#454a54]'>
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
                              className='h-10 rounded border-[#e3e5e8] bg-white'
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-[#454a54]'>
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
                            className='h-10 rounded border-[#e3e5e8] bg-white'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div>
                  <label className='mb-2 block text-sm font-medium text-[#454a54]'>
                    How did you hear about us? *
                  </label>
                  <FormField
                    control={control}
                    name='heardAboutUs'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className='h-10 rounded border-[#e3e5e8] bg-white'>
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

                <div>
                  <label className='mb-2 block text-sm font-medium text-[#454a54]'>
                    How do you want to use Sharkdom? *
                  </label>
                  <FormField
                    control={control}
                    name='purpose'
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className='h-10 rounded border-[#e3e5e8] bg-white'>
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
                                Activate partners faster with structured
                                Onboarding and Training
                              </SelectItem>
                              <SelectItem value='manage_pipeline'>
                                Completely Manage partnership pipeline via
                                Sharkdom
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
                  <label className='mt-6 flex cursor-pointer items-start gap-3 text-sm text-[#454a54]'>
                    <Input
                      type='checkbox'
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className='mt-0.5 size-[18px] shrink-0 rounded border-[#6863fb] text-[#6863fb]'
                    />
                    Yes, I&apos;d like to receive news and updates by email
                  </label>
                )}
              />

              <div className='mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <p className='text-sm text-[#454a54]'>
                  By submitting this form you agree with our{' '}
                  <Link
                    href='/privacy-policy'
                    className='font-medium text-[#0073e5] hover:underline'
                  >
                    Privacy Policy
                  </Link>
                </p>
                <Button
                  loading={isLoading}
                  loadingText='Submitting…'
                  type='submit'
                  className='h-12 shrink-0 rounded-full bg-[#6863fb] px-10 text-base font-semibold text-white shadow-[0px_2px_6px_rgba(23,25,28,0.3)] transition-all duration-300 ease-out hover:bg-[#5549e8] hover:shadow-[0px_4px_12px_rgba(104,99,251,0.45)] focus-visible:ring-2 focus-visible:ring-[#6863fb] focus-visible:ring-offset-2 active:scale-[0.98]'
                >
                  Request Demo
                </Button>
              </div>

              {statusMessage ? (
                <div
                  className={`mt-6 rounded-lg p-4 text-center text-sm font-medium ${
                    statusMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {statusMessage.message}
                </div>
              ) : null}
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
