'use client'

import React, { useEffect, useState } from 'react'
import { useCreateNewDeal } from '@/http-hooks/deals'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { connectFirestoreEmulator } from 'firebase/firestore'
import { ChevronDown, InfoIcon, Trash2Icon } from 'lucide-react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { useConfigData } from '@/lib/useConfig'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
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
import { OutlinedInput } from '@/components/ui/outlined-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'
import { OutlinedTextarea } from '@/components/ui/outlined-textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { MCQIcon, SingleChoiceIcon, TypeCursor } from '@/components/icons/icons'

import MultipleChoiceQuestion from './MultipleChoiceQuestion'
import SingleChoiceQuestion from './SingleChoiceQuestion'

export const createDealSchema = z.object({
  offerDetail: z.string().min(1, 'Offer details are required'),
  restrictedSectors: z.array(z.string()).min(1, 'Select at least one sector'),
  geography: z.string().min(1, 'Geography is required'),
  channelAllowed: z.array(z.string()).min(1, 'Select at least one channel'),
  quotaRemaining: z.string().refine((val) => {
    const num = Number(val)
    return !isNaN(num) && num >= 1 && num <= 100
  }, 'Quota must be a number between 1 and 100'),
  approvalRequired: z.boolean(),
  status: z.string(),
  affiliateLink: z.string()
})

export type CreateDealFormData = z.infer<typeof createDealSchema>

export interface DealFormDataType {
  offerDetail: string
  restrictedSectors: string[]
  geography: string
  channelAllowed: string[]
  quotaRemaining: string
  approvalRequired: boolean
  status: string
  affiliateLink: string
}

interface CreateDealFormProps {
  organizationId?: number
  setButtonDisabled: (e: boolean) => void
  shouldSubmit: boolean
  onSubmitComplete: () => void
  setFormData: (e: any) => void
  previousData: DealFormDataType | null
  openPreview: boolean
  setDealPreviewData: (e: any) => void
}

const CreateDealForm: React.FC<CreateDealFormProps> = ({
  organizationId,
  setButtonDisabled,
  shouldSubmit,
  onSubmitComplete,
  setFormData,
  previousData,
  openPreview,
  setDealPreviewData
}) => {
  const { mutate: createDeal, isPending } = useCreateNewDeal()
  const [inputCount, setInputCount] = useState<number>(0)
  const [mcqCount, setMcqCount] = useState<number>(0)
  const [singleChoiceQuestion, setSingleChoiceQuestion] = useState(0)

  const handleInputAdd = () => {
    setInputCount((prev) => prev + 1)
  }

  const handleInputRemove = () => {
    setInputCount((prev) => prev - 1)
  }

  const form = useForm<CreateDealFormData>({
    resolver: zodResolver(createDealSchema),
    defaultValues: previousData
      ? previousData
      : {
          offerDetail: '',
          restrictedSectors: [],
          geography: '',
          channelAllowed: [],
          quotaRemaining: '',
          approvalRequired: true,
          status: 'ACTIVE',
          affiliateLink: ''
        },
    mode: 'onChange'
  })

  const {
    handleSubmit,
    control,
    formState: { errors, isValid }
  } = form

  const onSubmit: SubmitHandler<DealFormDataType> = async (data) => {
    if (!organizationId) return
    createDeal({ ...data, organizationId })
  }

  useEffect(() => {
    setButtonDisabled(!isValid)
  }, [isValid])

  useEffect(() => {
    const submitForm = async () => {
      setFormData(form.watch())
    }

    if (shouldSubmit && isValid) submitForm()
    if (openPreview) setDealPreviewData(form.watch())
  }, [shouldSubmit, openPreview])

  const {
    isLoading,
    isError,
    preferredSectors,
    // restrictedIndustry,
    marketingChannels,
    geography
  } = useConfigData()

  return (
    <Form {...form}>
      <form
        //   onSubmit={handleSubmit(onFinalSubmit)}
        className='flex w-full flex-1 flex-col gap-4'
      >
        <h3 className='mb-3 text-shark-base text-[#000000]'>Required fields</h3>
        <div className='flex flex-1 flex-col gap-4'>
          <FormField
            control={control}
            name='offerDetail'
            render={({ field }) => (
              <FormItem>
                <FormControl className='h-[90px] w-full'>
                  <OutlinedTextarea
                    label='Offer Details'
                    placeholder='Describe offer details'
                    className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                    //   disabled={disabled}
                    {...field}
                  />
                </FormControl>
                <FormMessage className='text-xs' />
              </FormItem>
            )}
          />

          <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-3'>
            <FormField
              control={control}
              name='quotaRemaining'
              render={({ field }) => (
                <FormItem>
                  <FormControl className='w-full'>
                    <OutlinedInput
                      label='Quota Remaining'
                      placeholder='Add quota remaining between 2 and 100'
                      className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='approvalRequired'
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={(value) => field.onChange(value === 'true')}
                    value={String(field.value)}
                  >
                    <FormControl className='w-full'>
                      <SelectTrigger
                        label='Approval needed'
                        className='rounded-lg text-text-60 placeholder:text-shark-base placeholder:font-normal'
                      >
                        <SelectValue
                          className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                          placeholder='Select option'
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={'true'}>Yes</SelectItem>
                      <SelectItem value={'false'}>No</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className='text-xs' />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='affiliateLink'
              render={({ field }) => (
                <FormItem>
                  <FormControl className='w-full'>
                    <OutlinedInput
                      label='Affiliate link'
                      placeholder='Add link'
                      className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='flex items-center gap-1 text-xs text-text-100'>
                    <InfoIcon size={16} /> This link will be sent only after you
                    have accepted a partner.
                  </FormMessage>
                </FormItem>
              )}
            />
          </div>

          <Separator className='my-2' />

          <div className='flex flex-col gap-4'>
            <h2 className='text-shark-base'>
              This information is to ensure that we provide you filtered
              partners
            </h2>

            <div className='grid w-full grid-cols-1 gap-4 md:grid-cols-3'>
              <FormField
                control={control}
                name='restrictedSectors'
                //   rules={{ required: 'Select at least one sector' }}
                render={({ field, fieldState: { error } }) => (
                  <FormItem className='w-full'>
                    <FormControl className='relative w-full'>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          className='h-14 w-full border-none focus:border-none focus:ring-0'
                          disabled={!!isLoading}
                        >
                          <div className='relative flex h-12 w-full items-center justify-between rounded-lg border p-2'>
                            <div>
                              {isLoading ? (
                                <p className='w-full text-left text-sm text-gray-500'>
                                  Loading sectors...
                                </p>
                              ) : field.value?.length > 0 ? (
                                <p className='flex w-full gap-2 text-left text-sm capitalize'>
                                  {field.value.length > 7
                                    ? field.value.map((item, index) => (
                                        <Badge
                                          key={index}
                                          className='rounded-[4px] bg-text-20 px-2 py-1 text-[12px]/[14px] text-text-100 hover:bg-text-20'
                                        >
                                          {item.toLowerCase()}
                                        </Badge>
                                      ))
                                    : field.value.map((item, index) => (
                                        <Badge
                                          key={index}
                                          className='rounded-[4px] bg-text-20 px-2 py-1 text-[12px]/[14px] text-text-100 hover:bg-text-20'
                                        >
                                          {item.toLowerCase()}
                                        </Badge>
                                      ))}
                                </p>
                              ) : (
                                <p className='w-full text-left text-sm text-gray-500'>
                                  Select option
                                </p>
                              )}
                              <label
                                className={cn(
                                  'pointer-events-none absolute left-2 top-3 -translate-y-5 bg-background px-1 text-xs text-text-60 transition-all duration-200'
                                )}
                              >
                                Restricted Industries
                              </label>
                            </div>

                            <ChevronDown className='w-4' />
                          </div>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start' className='w-full'>
                          <ScrollArea className='h-72 w-full rounded-md'>
                            {preferredSectors?.map(
                              (sector: any, idx: number) => (
                                <DropdownMenuCheckboxItem
                                  key={idx}
                                  checked={field.value?.some(
                                    (selected) => selected === sector.key
                                  )}
                                  onClick={(e: any) => {
                                    e.preventDefault()
                                    const updatedSectors = field.value || []
                                    if (
                                      updatedSectors.some(
                                        (selected) => selected === sector.key
                                      )
                                    ) {
                                      field.onChange(
                                        updatedSectors.filter(
                                          (value) => value !== sector.key
                                        )
                                      )
                                    } else {
                                      field.onChange([
                                        ...updatedSectors,
                                        sector.key
                                      ])
                                    }
                                  }}
                                >
                                  {sector.key}
                                </DropdownMenuCheckboxItem>
                              )
                            )}
                          </ScrollArea>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </FormControl>
                    {error?.message && (
                      <FormMessage className='text-xs text-red-500'>
                        {error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='geography'
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className='w-full'>
                        <SelectTrigger
                          label='Geography'
                          className='rounded-lg text-text-60 placeholder:text-shark-base placeholder:font-normal'
                        >
                          <SelectValue
                            className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                            placeholder='Select option'
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {geography?.map((geo: any) => (
                          <SelectItem key={geo.id} value={geo.value}>
                            {geo.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='text-xs' />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name='channelAllowed'
                render={({ field, fieldState: { error } }) => (
                  <FormItem className=''>
                    <FormControl className='relative w-full'>
                      <div className='relative w-full'>
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            className='h-14 w-full border-none focus:border-none focus:ring-0'
                            disabled={!!isLoading}
                          >
                            <div className='relative flex h-12 w-full items-center justify-between rounded-lg border p-2'>
                              <div>
                                {isLoading ? (
                                  <p className='w-full text-left text-sm text-gray-500'>
                                    Loading channel...
                                  </p>
                                ) : field.value?.length > 0 ? (
                                  <p className='flex w-full gap-2 text-left text-sm capitalize'>
                                    {field.value.length > 7
                                      ? field.value.map((item, index) => (
                                          <Badge
                                            key={index}
                                            className='rounded-[4px] bg-text-20 px-2 py-1 text-[12px]/[14px] text-text-100 hover:bg-text-20'
                                          >
                                            {item.toLowerCase()}
                                          </Badge>
                                        ))
                                      : field.value.map((item, index) => (
                                          <Badge
                                            key={index}
                                            className='rounded-[4px] bg-text-20 px-2 py-1 text-[12px]/[14px] text-text-100 hover:bg-text-20'
                                          >
                                            {item.toLowerCase()}
                                          </Badge>
                                        ))}
                                  </p>
                                ) : (
                                  <p className='w-full text-left text-sm text-gray-500'>
                                    Select option
                                  </p>
                                )}
                                <label
                                  className={cn(
                                    'pointer-events-none absolute left-2 top-3 -translate-y-5 bg-background px-1 text-xs text-text-60 transition-all duration-200'
                                  )}
                                >
                                  Permitted marketing channels
                                </label>
                              </div>
                              <ChevronDown className='w-4' />
                            </div>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align='start'
                            className='w-full min-w-[var(--radix-dropdown-trigger-width)]'
                          >
                            <ScrollArea className='max-h-72 min-w-full rounded-md'>
                              {marketingChannels?.map(
                                (sector: any, idx: number) => (
                                  <DropdownMenuCheckboxItem
                                    className='min-w-full'
                                    key={idx}
                                    checked={field.value?.some(
                                      (selected) => selected === sector.value
                                    )}
                                    onClick={(e: any) => {
                                      e.preventDefault()
                                      const updatedSectors = field.value || []
                                      if (
                                        updatedSectors.some(
                                          (selected) =>
                                            selected === sector.value
                                        )
                                      ) {
                                        field.onChange(
                                          updatedSectors.filter(
                                            (value) => value !== sector.value
                                          )
                                        )
                                      } else {
                                        field.onChange([
                                          ...updatedSectors,
                                          sector.value
                                        ])
                                      }
                                    }}
                                  >
                                    {sector.value}
                                  </DropdownMenuCheckboxItem>
                                )
                              )}
                            </ScrollArea>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                    {error?.message && (
                      <FormMessage className='text-xs text-red-500'>
                        {error.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
          </div>

          <Separator className='my-1' />

          {inputCount || mcqCount || singleChoiceQuestion ? (
            <p className='text-shark-base'>
              Additional information added by you
            </p>
          ) : (
            <></>
          )}
          {inputCount ? (
            <div className='flex flex-col gap-3'>
              {Array.from({ length: inputCount }).map((_, key) => (
                <div key={key} className='flex w-full items-center gap-3'>
                  <FormField
                    control={control}
                    name='affiliateLink'
                    render={({ field }) => (
                      <FormItem className='grow'>
                        <FormControl className='w-full grow'>
                          <Input
                            placeholder='Enter the question'
                            className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className='text-xs' />
                      </FormItem>
                    )}
                  />
                  <Trash2Icon onClick={() => handleInputRemove()} />
                </div>
              ))}
            </div>
          ) : (
            <></>
          )}

          {Array.from({ length: mcqCount }).map((_, key) => (
            <MultipleChoiceQuestion key={key} />
          ))}

          {Array.from({ length: singleChoiceQuestion }).map((_, key) => (
            <SingleChoiceQuestion key={key} />
          ))}

          <div className='flex flex-col gap-4 rounded-xl bg-[#F6EFE7] p-4'>
            <div className='flex flex-col gap-1'>
              <p className='text-shark-base font-bold'>
                Add additional information to the deal
              </p>
              <p className='text-shark-base font-normal'>
                USe the below elements to add speciifc information
              </p>
            </div>
            <div className='flex gap-4'>
              <Button
                onClick={handleInputAdd}
                type='button'
                className='flex h-10 min-w-[288px] items-center justify-start gap-4 border border-[#E4E7EE] bg-white px-6 py-4 text-shark-sm font-bold hover:bg-white'
              >
                <TypeCursor /> Free text question{' '}
              </Button>
              <Button
                onClick={() => setMcqCount((prev) => prev + 1)}
                type='button'
                className='flex h-10 min-w-[288px] items-center justify-start gap-4 border border-[#E4E7EE] bg-white px-6 py-4 text-shark-sm font-bold hover:bg-white'
              >
                <MCQIcon /> Multiple-choice question{' '}
              </Button>
              <Button
                onClick={() => setSingleChoiceQuestion((prev) => prev + 1)}
                type='button'
                className='flex h-10 min-w-[288px] items-center justify-start gap-4 border border-[#E4E7EE] bg-white px-6 py-4 text-shark-sm font-bold hover:bg-white'
              >
                <SingleChoiceIcon /> Single-choice question{' '}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default CreateDealForm
