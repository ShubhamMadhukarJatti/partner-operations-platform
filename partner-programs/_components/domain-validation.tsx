import React, { useState } from 'react'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
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

// import { Label } from '@/components/ui/label'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from '@/components/ui/select'

import EmailVerification from './email-verification'

import '../index.css'

import { showCustomToast } from '@/components/custom-toast'

const extractDomain = (url: any) => {
  const hostname = new URL(url)?.hostname
  const parts = hostname.split('.')
  return parts.slice(-2).join('.')
}

export const formSchema = z
  .object({
    programName: z
      .string()
      .min(3, 'Program name must be at least 3 characters long'),
    email: z.string().email({
      message: 'Please enter a valid email address'
    }),
    signUpUrl: z.string().url({ message: 'Invalid URL' }),
    commission: z.number({
      invalid_type_error: 'Commission must be a number'
    })
  })
  .refine(
    (data: any) => {
      const emailDomain = data.email
        .split('@')[1]
        .split('.')
        .slice(-2)
        .join('.')
      const urlDomain = extractDomain(data.signUpUrl)
      return emailDomain === urlDomain
    },
    {
      message: 'Email and sign-up URL must have the same domain',
      path: ['signUpUrl']
    }
  )

function DomainValidate({ showHeader }: any) {
  const [showCheckEmailScreen, setShowCheckEmailScreen] = useState(false)
  const [loader, setLoader] = useState(false)
  // const [toggleSwitch, setToggleSwitch] = useState(false)
  // const [commissionPeriod, setCommissionPeriod] = useState('LifeTime')

  const organizationData = useSelector(
    (state: RootState) => state.organization?.organizationData
  ) as OrganizationType
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUseNativeValidation: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      programName: '',
      email: '',
      signUpUrl: '',
      commission: 0
    }
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoader(true)
    if (!organizationData || !organizationData?.id) {
      showCustomToast('Error', 'org not found', 'error', 5000)
      setLoader(false)
      return
    }
    try {
      const response = await fetch('/api/generate-referral-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orgId: organizationData.id,
          landingPage: values.signUpUrl
        })
      })

      if (!response.ok) {
        setLoader(false)
        throw new Error('Failed to generate referral link')
      }

      const data = await response.json()

      if (data && data?.referralCode) {
        const createPayload = {
          organizationId: organizationData?.id,
          referralCode: data?.referralCode,
          urlRef: values.signUpUrl,
          emailRef: values.email,
          programName: values.programName,
          referralLink: data?.referralLink,
          partnerOrganizationName: null,
          partnerId: null
          // status: 'ACTIVE'
        }

        const createCamPaign = await fetch('/api/create-referral-campaign', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createPayload)
        })

        if (!createCamPaign.ok) {
          setLoader(false)
          throw new Error('Failed to create Campaign')
        }

        await createCamPaign.json()
        setLoader(false)
        setShowCheckEmailScreen(true)
        showHeader(false)
      }
      showCustomToast(
        'Success',
        'Referral link generated successfully',
        'success',
        5000
      )
    } catch (error) {
      console.error(error)
      showCustomToast(
        'Error',
        'Failed to generate referral link',
        'error',
        5000
      )
    }
  }

  return (
    <div className='h-full'>
      {showCheckEmailScreen ? (
        <EmailVerification />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col sm:w-3/4'
          >
            <div className='rounded border px-8 pb-2 pt-8 sm:px-10 sm:pb-4 sm:pt-10'>
              <div className='flex flex-row gap-10 pb-10'>
                <div className='basis-2/6'>
                  <p className='mb-2 font-medium'>Program</p>
                  <p className='text-sm text-[#475569]'>
                    Set up the main details of your affiliate program.
                  </p>
                </div>
                <div className='flex basis-4/6 flex-col gap-6'>
                  <FormField
                    control={form.control}
                    name='programName'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel>Program Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Program Name'
                            required
                            tabIndex={1}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs font-normal text-[#475569]'>
                          This name will be visible to your partners when they
                          sign up.
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='signUpUrl'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel>Website URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='https://'
                            required
                            tabIndex={1}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs font-normal text-[#475569]'>
                          The page that your partners’ affiliate links will lead
                          to.
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='email'
                    render={({ field }) => (
                      <FormItem className='space-y-2'>
                        <FormLabel>Business email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your Company's email ID"
                            type='email'
                            autoComplete='username'
                            required
                            tabIndex={1}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs font-normal text-[#475569]'>
                          We’ll send you a verification mail on this ID.
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className='mt-2 flex flex-row gap-10 rounded border bg-gray-100 p-4'>
              <Button
                className='ml-auto mr-6 rounded text-sm font-medium'
                type='submit'
                value='Send'
                loading={loader}
                loadingText={'Please wait...'}
              >
                Create & Validate
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}

export default DomainValidate
