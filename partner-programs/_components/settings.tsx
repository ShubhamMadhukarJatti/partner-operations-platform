import React, { useEffect, useState } from 'react'

import { Label } from '@/components/ui/label'

import '../index.css'

import { useParams, useRouter } from 'next/navigation'
import {
  useCreateReferralProgram,
  useGetReferralCampaign,
  usePatchReferralCampaign,
  useReferralCode
} from '@/http-hooks/partner-programs'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Router } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import { DialogClose } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export const formSchema = z.object({
  programName: z
    .string()
    .min(3, 'Program name must be at least 3 characters long'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters long'),
  urlRef: z
    .string()
    .url({ message: 'Please enter a valid URL' })
    .refine((url) => url.startsWith('http://') || url.startsWith('https://'), {
      message: 'URL must start with http:// or https://'
    })
    .refine(
      (url) => {
        try {
          new URL(url)
          return true
        } catch {
          return false
        }
      },
      { message: 'The URL format is invalid' }
    )
})

export default function Settings({ referralData }: { referralData: any }) {
  const params: { code: string } = useParams()
  const [emailSwitch, setEmailSwitch] = useState(true)
  const [autoApproveSwitch, setAutoApproveSwitch] = useState(true)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUseNativeValidation: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      programName: referralData?.programName ?? '',
      description: referralData?.description ?? '',
      urlRef: referralData?.urlRef ?? ''
    },
    mode: 'onChange'
  })

  const [formData, setFormData] = useState<{
    id: string | null
    programName: string
    description: string
    urlRef: `${'http' | 'https'}://${string}` | null
  }>({
    id: null,
    programName: '',
    description: '',
    urlRef: null
  })
  const maxChars = 275

  const mutation = usePatchReferralCampaign()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    if (form.formState.isValid) {
      console.log(data)

      mutation.mutate({
        id: referralData?.id,
        programName: data.programName,
        description: data.description,
        urlRef: data?.urlRef
      })
    }
  }

  useEffect(() => {
    if (referralData) {
      form.reset({
        programName: referralData.programName || '',
        description: referralData.description || '',
        urlRef: referralData.urlRef || ''
      })
    }
  }, [referralData, form.reset])

  return (
    <div className='flex w-full max-w-[700px] flex-col gap-6  px-6'>
      <h2 className='text-shark-xl font-bold text-text-100'>Program Details</h2>

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
                  Program Name <span className='ml-1 text-primary-blue'>*</span>
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
                  Description <span className='ml-1 text-primary-blue'>*</span>
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
                <FormMessage className='text-xs text-red-400' />
              </FormItem>
            )}
          />

          <Separator className='h-[1px]' />

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

          <Separator />

          <div className='flex gap-[64px]'>
            <div className='max-w-[264px]'>
              <p className='text-sm font-semibold text-[#414651]'>
                Notifications Settings
              </p>
              <p className='text-sm font-normal text-[#535862]'>
                Receive updates via email & auto-approve partners joining this
                program{' '}
              </p>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='flex items-center gap-2'>
                <Switch
                  id='email'
                  checked={emailSwitch}
                  onCheckedChange={() => setEmailSwitch((val) => !val)}
                />
                <Label className='text-sm text-[#414651]' htmlFor='email'>
                  Email
                </Label>
              </div>
              <div className='flex items-center gap-2'>
                <Switch
                  id='auto-approve'
                  checked={autoApproveSwitch}
                  onCheckedChange={() => setAutoApproveSwitch((val) => !val)}
                />
                <Label
                  className='text-sm text-[#414651]'
                  htmlFor='auto-approve'
                >
                  Auto-approve
                </Label>
              </div>
            </div>
          </div>

          <Separator />

          <div className='mb-6 flex justify-end space-x-3'>
            <Button
              onClick={() => router.back()}
              type='button'
              variant='outline'
            >
              Cancel
            </Button>

            <Button
              type='submit'
              variant={!form.formState.isValid ? 'disable' : 'primary'}
              className={
                !form.formState.isValid
                  ? 'disabled:pointer-events-auto disabled:cursor-not-allowed'
                  : ''
              }
              loading={mutation.isPending}
              disabled={!form.formState.isValid}
            >
              {mutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Form>

      {/* Program Name */}
      {/* <div className='flex flex-col gap-2'>
        <Label
          htmlFor='programName'
          className='flex text-sm font-medium text-[#414651]'
        >
          Program Name <span className='ml-1 text-primary-blue'>*</span>
        </Label>
        <Input
          id='programName'
          placeholder='e.g. Partner Growth Program'
          className='border border-[#D5D7DA] pl-3'
          value={formData?.programName}
          onChange={handleChange}
        />
      </div> */}

      {/* Description */}
      {/* <div className='flex flex-col gap-2'>
        <Label
          htmlFor='description'
          className='flex text-sm font-medium text-[#414651]'
        >
          Description <span className='ml-1 text-primary-blue'>*</span>
        </Label>
        <Textarea
          id='description'
          placeholder='Describe your referral program'
          value={formData?.description}
          onChange={handleChange}
          className='min-h-[120px] border border-[#D5D7DA]'
        />
        <p className='text-sm text-[#535862]'>
          {maxChars - formData?.description?.length} characters left
        </p>
      </div> */}

      {/* Referral Link */}
      {/* <div className='flex flex-col gap-2'>
        <Label
          htmlFor='referralLink'
          className='flex text-sm font-medium text-[#414651]'
        >
          Referral Link Format <span className='ml-1 text-primary-blue'>*</span>
        </Label>
        <div className='relative'>
          <Input
            id='urlRef'
            placeholder='e.g. company.com/ref/{partner_id}'
            className='border border-[#D5D7DA] pl-9'
            onChange={handleChange}
            value={formData?.urlRef}
          />
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
            <Link size={16} />
          </div>
        </div>
      </div> */}

      {/* Buttons */}
      {/* <div className='mt-8 flex justify-end space-x-3'>
                <DialogClose>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                  className='bg-primary-blue hover:bg-primary-blue'
                  // onClick={handleSubmit}
                  disabled={
                    !formData.programName ||
                    !formData.description ||
                    mutation.isPending
                  }
                >
                  {mutation.isPending ? 'Creating...' : 'Create Program'}
                </Button>
              </div> */}

      {/* AI Recommendations */}
      {/* <div className='mt-8 rounded-md border border-[#E9EAEB] bg-[#E5EFFE] p-4'>
              <h3 className='mb-4 text-shark-sm font-semibold text-[#0062F1]'>
                AI Recommendations
              </h3>
              <div className='space-y-3'>
                <div className='flex gap-2'>
                  <Heart className='h-5 w-5 fill-blue-600 text-blue-600' />
                  <p className='text-shark-sm text-[#0062F1]'>
                    Based on your industry, we recommend a fixed reward model of $50
                    per successful referral
                  </p>
                </div>
                <div className='flex gap-2'>
                  <Heart className='h-5 w-5 fill-blue-600 text-blue-600' />
                  <p className='text-shark-sm text-[#0062F1]'>
                    Consider adding a tier system to reward high-performing partners
                  </p>
                </div>
              </div>
            </div> */}
    </div>
  )
}
