'use client'

import React, { useEffect } from 'react'
import { RootState } from '@/redux/store'
import { connectBankAccountParam } from '@/services/deals'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { BankDetailsFormData, BankDetailsFormSchema } from '../BankDetailsForm'

const AddBankAccountDetails: React.FC<{
  submitForm: boolean
  handleConnectBankAccount: (e: connectBankAccountParam) => void
}> = ({ submitForm, handleConnectBankAccount }) => {
  const form = useForm<BankDetailsFormData>({
    resolver: zodResolver(BankDetailsFormSchema),
    defaultValues: {
      holderName: '',
      accountNumber: '',
      ifscCode: ''
    },
    mode: 'onChange'
  })

  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = form

  useEffect(() => {
    console.log(isValid)
    if (submitForm && isValid) {
      handleConnectBankAccount({
        ...form.watch(),
        organizationId: organization?.id
      })
    }
  }, [submitForm, isValid])

  return (
    <div className='px-5 py-5'>
      <Form {...form}>
        <form className='flex w-full  gap-4'>
          <div className='flex grow flex-col gap-4'>
            <FormField
              control={control}
              name='accountType'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel className='flex items-center gap-1 text-shark-sm  font-normal text-text-60'>
                    Account Type
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={String(field.value)}
                      className='grid grid-cols-1 gap-3 md:grid-cols-3'
                    >
                      <FormItem className='  '>
                        <FormControl>
                          <Label
                            htmlFor='Business'
                            className='group flex cursor-pointer items-center  justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                          >
                            <div className='flex flex-1 gap-3 font-medium'>
                              <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                                Business
                              </span>
                            </div>
                            <RadioGroupItem
                              value={'business'}
                              id='Business'
                              className='peer'
                            />
                          </Label>
                        </FormControl>
                      </FormItem>
                      <FormItem className='  '>
                        <FormControl>
                          <Label
                            htmlFor='Individual'
                            className='group flex cursor-pointer items-center  justify-between rounded-lg border p-4 text-shark-base font-medium text-text-100 transition-colors hover:bg-gray-50 sm:justify-start sm:text-base [&:has([data-state=checked])]:border-primary-light-blue [&:has([data-state=checked])]:bg-background-ghost-white [&:has([data-state=checked])]:text-primary'
                          >
                            <div className='flex flex-1 gap-3 font-medium'>
                              <span className='[&:has(~[data-state=checked])]:text-primary-light-blue'>
                                Individual
                              </span>
                            </div>
                            <RadioGroupItem
                              value={'individual'}
                              id='Individual'
                              className='peer'
                            />
                          </Label>
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
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
        </form>
      </Form>
    </div>
  )
}

export default AddBankAccountDetails
