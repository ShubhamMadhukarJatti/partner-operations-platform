'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import {
  useCreateReferralProgram,
  useReferralCode
} from '@/http-hooks/partner-programs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heart, Link } from 'iconsax-react'
import { PlusIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

import ReferralAddPartner from './referral-add-parnter'
import { formSchema } from './settings'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

type Props = {}

const NewReferralProgram = ({}: Props) => {
  const [isSuccess, setIsSuccess] = useState(false)

  const [campaignDetails, setCampaignDetails] = useState<{
    campaignId: string
    programName: string
    description: string
    referralCode: string
    referralLink: string
  } | null>(null)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='primary'
          className='flex w-fit items-center gap-1.5 text-shark-sm font-bold'
        >
          <PlusIcon size={16} strokeWidth={4} /> New Referral Program
        </Button>
      </DialogTrigger>
      <DialogContent
        hideCloseBtn
        className='m-0 h-screen w-screen max-w-none overflow-y-scroll rounded-none bg-[#F9FAFB] p-0'
      >
        {isSuccess ? (
          <ProgramSuccess campaignDetails={campaignDetails!} />
        ) : (
          <CreateProgramForm
            onSuccess={(data) => {
              setCampaignDetails(data)
              setIsSuccess(true)
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

export default NewReferralProgram

const CreateProgramForm = ({
  onSuccess
}: {
  onSuccess: (data: any) => void
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    shouldUseNativeValidation: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      programName: '',
      description: '',
      urlRef: ''
    },
    mode: 'onChange'
  })

  const [formData, setFormData] = useState({
    programName: '',
    description: '',
    urlRef: ''
  })
  const maxChars = 275

  const mutation = useCreateReferralProgram()
  // const { data, isLoading } = useReferralCode() as unknown as {
  //   data: {
  //     referralLink: string
  //     referralCode: string
  //     testWebhookUrl: string
  //     prodWebhookUrl: string
  //   }
  //   isLoading: boolean
  //

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (!form.formState.isValid) return

    mutation.mutate(
      {
        // referralCode: data?.referralCode ?? '',
        // referralLink: data?.referralLink ?? '',
        status: 'ACTIVE',
        programName: data.programName,
        description: data.description,
        urlRef: data.urlRef
      },
      {
        onSuccess: (response: any) => {
          console.log({ response })
          onSuccess({
            campaignId: response.id,
            programName: data.programName,
            description: data.description,
            referralCode: response.referralCode,
            referralLink: response.referralLink
          })
        }
      }
    )
  }

  return (
    <div className='w-full overflow-y-auto'>
      <div className='mx-auto my-8 w-full max-w-[700px]'>
        <div className='px-4'>
          <h2 className='mb-6 text-shark-xl font-bold text-text-100'>
            Program Details
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className='flex flex-col gap-6'
            >
              <FormField
                control={form.control}
                name='programName'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='flex text-sm font-medium text-[#414651]'>
                      {' '}
                      Program Name{' '}
                      <span className='ml-1 text-primary-blue'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Program Name'
                        required
                        tabIndex={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-400' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='flex text-sm font-medium text-[#414651]'>
                      {' '}
                      Description{' '}
                      <span className='ml-1 text-primary-blue'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className='min-h-[120px] border border-[#D5D7DA]'
                        placeholder='description...'
                        required
                        tabIndex={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-shark-sm text-[#535862]'>
                      {maxChars - field.value.length} characters left
                    </FormMessage>
                    {/* <FormMessage className='text-xs text-red-400' /> */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='urlRef'
                render={({ field }) => (
                  <FormItem className='space-y-2'>
                    <FormLabel className='flex text-sm font-medium text-[#414651]'>
                      {' '}
                      Referral Link format{' '}
                      <span className='ml-1 text-primary-blue'>*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Enter the url you want to redirect your partner's community to"
                        required
                        tabIndex={1}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='text-xs text-red-400' />
                  </FormItem>
                )}
              />

              <div className='flex justify-end space-x-3'>
                <DialogClose>
                  <Button type='button' variant='outline'>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type='submit'
                  variant={
                    !form.formState.isValid || mutation.isPending
                      ? 'disable'
                      : 'primary'
                  }
                  className={
                    !form.formState.isValid || mutation.isPending
                      ? 'disabled:pointer-events-auto disabled:cursor-not-allowed'
                      : ''
                  }
                  disabled={!form.formState.isValid || mutation.isPending}
                >
                  {mutation.isPending ? 'Creating...' : 'Create Program'}
                </Button>
              </div>
            </form>
          </Form>

          {/* Buttons */}
        </div>

        {/* AI Recommendations */}
        <div className='mt-8 rounded-md border border-[#E9EAEB] bg-[#E5EFFE] p-4'>
          {/* <h3 className='mb-4 text-shark-sm font-semibold text-[#0062F1]'>
            AI Recommendations
          </h3> */}
          <div className='space-y-3'>
            <div className='flex gap-2'>
              {/* <Heart className='h-5 w-5 fill-blue-600 text-blue-600' /> */}
              <p className='text-shark-sm text-[#0062F1]'>
                After creating campaign, make sure to configure the tracking
                code before sharing invite to your partner
              </p>
            </div>
            <div className='flex gap-2'>
              {/* <Heart className='h-5 w-5 fill-blue-600 text-blue-600' /> */}
              <p className='text-shark-sm text-[#0062F1]'>
                Automated message would be sent on your shared Partner Space
                after creation
              </p>
            </div>
          </div>
          {/* </div> */}
        </div>
      </div>
    </div>
  )
}

const ProgramSuccess = ({
  campaignDetails
}: {
  campaignDetails: {
    campaignId: string
    programName: string
    description: string
    referralCode: string
    referralLink: string
  }
}) => {
  return (
    <div className='my-12 flex w-full  justify-center '>
      <div className=''>
        <div className='mx-auto h-[378px] w-[500px]'>
          <Lottie
            animationData={require('@/lib/lottie-json/refer-a-friend.json')}
            loop={true}
          />
        </div>
        <div className=''>
          <h1 className='mb-1 text-shark-lg font-bold text-[#2A3241]'>
            Program Created Successfully
          </h1>

          <p className='mb-10 text-shark-sm text-[#4D5C78]'>
            Your referral program has been created and is ready to start
            accepting partners
          </p>

          <div className='flex items-center gap-4'>
            <ReferralAddPartner
              campaignId={campaignDetails.campaignId}
              programName={campaignDetails.programName}
              description={campaignDetails.description}
              referralCode={campaignDetails.referralCode}
              referralLink={campaignDetails.referralLink}
            />

            <DialogClose>
              <Button variant='outline' className=''>
                Referrals Home
              </Button>
            </DialogClose>
          </div>
        </div>
      </div>
    </div>
  )
}
