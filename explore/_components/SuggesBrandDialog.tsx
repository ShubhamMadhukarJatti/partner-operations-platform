'use client'

import React, { useState } from 'react'
import { RootState } from '@/redux/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Globe, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'
import {
  AiStarIcon,
  CirclesContent,
  PackageIcon
} from '@/components/icons/icons'

const formSchema = z.object({
  name: z.string().min(2, 'Brand name must be atleast 2 characters'),
  category: z.enum(['B2B', 'D2C', 'OTHERS']),
  country: z.enum(['IN', 'US']),
  website: z
    .string()
    .regex(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+)(\/.*)?$/, {
      message: 'Invalid website URL'
    })
    .optional()
})

const SuggestBrandDialog = () => {
  const [open, setOpen] = useState<boolean>(false)
  const saved = useSelector((state: RootState) => state.currentOrg)
  const [loading, setLoading] = useState(false)

  const { loading: orgLoading, organization } = saved

  const form = useForm<z.infer<typeof formSchema>>({
    shouldUseNativeValidation: false,
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: undefined,
      country: undefined,
      website: undefined
    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      const res = await fetch('/api/suggest-brand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          orgId: String(organization.id)
        })
      })
      showCustomToast('Success', 'Submitted successfully', 'success', 5000)
      console.log(res)
      form.reset()
    } catch (error) {
      console.log('error', error)
      showCustomToast('Error', 'Error submitting', 'error', 5000)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className='border-[#3E50F7] text-sm font-semibold text-[#3E50F7] hover:bg-[#3E50F7] hover:text-white'
          variant={'outline'}
        >
          + Suggest a Brand
        </Button>
      </DialogTrigger>

      <DialogContent className='w-full max-w-[432px] overflow-hidden p-0'>
        <div className='relative'>
          <div className='absolute z-0'>
            <CirclesContent />
          </div>
          <div className='absolute left-6 top-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#DEE8FF]'>
            <PackageIcon />
          </div>

          <div className='relative z-[1] mt-[72px] p-6 pb-0'>
            <div className='flex flex-col gap-1'>
              <h3 className='text-lg  font-semibold text-[#181D27]'>
                Suggest a Brand
              </h3>
              <p className='text-sm text-[#535862]'>
                Suggest a brand you would like to partner with, and we will add
                it to our marketplace.
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='mt-4 flex flex-col'
              >
                <div className='flex basis-4/6 flex-col gap-4'>
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder='Brand Name'
                            required
                            tabIndex={1}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='category'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            name={`category`}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className=' w-full rounded-xl border-text-40'
                              // label='Access Control'
                            >
                              <SelectValue placeholder='Select a category' />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value='B2B'>B2B</SelectItem>
                              <SelectItem value='D2C'>D2C</SelectItem>
                              <SelectItem value='OTHERS'>Others</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='country'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Select
                            name={`country`}
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className=' w-full rounded-xl border-text-40'
                              // label='Access Control'
                            >
                              <SelectValue placeholder='Select a country' />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value='US'>US</SelectItem>
                              <SelectItem value='IN'>INDIA</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='website'
                    render={({ field }) => (
                      <FormItem className=''>
                        <FormLabel>Website (Optional)</FormLabel>
                        <FormControl>
                          <div className='relative w-full max-w-sm'>
                            <Globe
                              className='absolute left-3 top-1/2 -translate-y-1/2 transform rounded-xl border border-input bg-background'
                              size={18}
                              stroke='#717680'
                            />
                            <Input
                              type='text'
                              placeholder='https://'
                              className='pl-10'
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className='text-xs font-normal text-[#475569]' />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter className='flex flex-col items-start py-6 pt-8 sm:justify-start'>
                  <Button
                    loading={loading}
                    type='submit'
                    className='w-[268px] px-4 py-2.5'
                  >
                    Submit
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SuggestBrandDialog
