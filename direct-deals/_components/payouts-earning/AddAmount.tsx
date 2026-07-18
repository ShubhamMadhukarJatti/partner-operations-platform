'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { getCurrentOrganization } from '@/lib/db/organization'
import {
  createStripeCheckout,
  createUserSubscription,
  verifyPayment
} from '@/lib/db/payment'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { OutlinedInput } from '@/components/ui/outlined-input'
import { showCustomToast } from '@/components/custom-toast'

export const AmountSchema = z.object({
  amount: z
    .number({
      invalid_type_error: 'Amount must be a number'
    })
    .positive('Amount must be greater than 0')
    .min(1, 'Amount must be greater than 0')
})
export type AmountData = z.infer<typeof AmountSchema>

export function AddAmount() {
  const form = useForm<AmountData>({
    resolver: zodResolver(AmountSchema)
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = form

  console.log(form.watch())

  const handleAddMoney = async (amount: number) => {
    try {
      // if (country !== 'IN') {
      //   await handleStripeUpgrade(planType)
      //   return
      // }

      const currentOrganization = await getCurrentOrganization()
      // const result = await createUserSubscription({
      //   organizationId: currentOrganization?.id,
      //   planType,
      //   referralCode: 'string',
      //   email: 'string',
      //   contactNumber: 'string'
      // })

      // if (!result?.subscriptionId) {
      //   showCustomToast('Error', 'Subscription ID not found!', 'error', 5000)
      //   return
      // }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY,
        // order_id: result.subscriptionId,
        name: 'Sharkdom',
        amount: amount * 100,
        // description: `${planType} Subscription`,
        handler: async (response: any) => {
          const paymentResult = await verifyPayment(response)
          if (paymentResult) {
            showCustomToast('Success', 'Payment successful!', 'success', 5000)
          } else {
            showCustomToast(
              'Error',
              'Payment failed. Please try again.',
              'error',
              5000
            )
          }
        },
        prefill: {
          email: currentOrganization?.primaryEmail,
          contact: '+91 9000000001'
        },
        readonly: { email: true, contact: true },
        theme: { color: '#3399cc' }
      }

      const paymentObject = new window.Razorpay(options)
      paymentObject.open()
    } catch (error) {
      showCustomToast(
        'Error',
        error instanceof Error ? error.message : 'An unknown error occurred',
        'error',
        5000
      )
    }
  }

  const onSubmit = (data: AmountData) => {
    console.log('Form submitted:', data)
    handleAddMoney(data.amount)
    // Add your submission logic here
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={'ghost'}
          className='bg-[#E5EFFE] p-3  text-shark-sm font-bold text-[#3E50F7] hover:bg-[#E5EFFE] hover:text-[#3E50F7]'
        >
          Add
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Enter Amount to Add</DialogTitle>
            </DialogHeader>
            <div className='grid gap-4 py-4'>
              <div className=''>
                <FormField
                  control={control}
                  name='amount'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl className='w-full'>
                        <OutlinedInput
                          type='number'
                          label='Amount'
                          placeholder='Enter Amount to add'
                          className='my-4 text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                          value={field.value || ''}
                          onChange={(e) => {
                            // Convert string input to number for Zod validation
                            const value = e.target.value
                            field.onChange(
                              value === '' ? undefined : Number(value)
                            )
                          }}
                        />
                      </FormControl>
                      <FormMessage className='text-xs ' />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type='submit' disabled={!isValid}>
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
