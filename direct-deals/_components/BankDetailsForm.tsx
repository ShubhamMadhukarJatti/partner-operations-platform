'use client'

import React from 'react'
import { useConnectBankAccount } from '@/http-hooks/deals'
import { RootState } from '@/redux/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { OutlinedInput } from '@/components/ui/outlined-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'

export const BankDetailsFormSchema = z.object({
  holderName: z.string().min(1, 'Holder name is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  ifscCode: z.string().min(1, 'IFSC code required'),
  accountType: z.enum(['business', 'individual'])
})

export type BankDetailsFormData = z.infer<typeof BankDetailsFormSchema>

const BankDetailsForm = () => {
  const form = useForm<BankDetailsFormData>({
    resolver: zodResolver(BankDetailsFormSchema),
    defaultValues: {
      holderName: '',
      accountNumber: '',
      ifscCode: ''
    }
  })

  const { mutate: addBankAmount, isPending } = useConnectBankAccount()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = form

  const onSubmit = (data: BankDetailsFormData) => {
    addBankAmount({ ...data, organizationId: organization.id })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='mb-4 grid grid-cols-1 gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='accountType'
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl className='w-full'>
                    <SelectTrigger
                      label='Account Type'
                      className='rounded-lg text-text-60 placeholder:text-shark-base placeholder:font-normal'
                    >
                      <SelectValue
                        className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                        placeholder='Select option'
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value='business'>Business</SelectItem>
                    <SelectItem value='individual'>Individual</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='holderName'
            render={({ field }) => (
              <FormItem>
                <FormControl className='w-full'>
                  <OutlinedInput
                    label='Account holder name'
                    placeholder='Enter account holder’s name'
                    className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='accountNumber'
            render={({ field }) => (
              <FormItem>
                <FormControl className='w-full'>
                  <OutlinedInput
                    label='Account number'
                    placeholder='Enter account number'
                    className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name='ifscCode'
            render={({ field }) => (
              <FormItem>
                <FormControl className='w-full'>
                  <OutlinedInput
                    label='IFSC code'
                    placeholder='Enter IFSC code'
                    className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />
        </div>
        <Button
          loading={isPending}
          className='border border-text-60 bg-white text-[#3E50F7] hover:text-white'
        >
          Connect
        </Button>
      </form>
    </Form>
  )
}

export default BankDetailsForm
