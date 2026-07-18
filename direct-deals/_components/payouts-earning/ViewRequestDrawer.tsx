'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  useApprovePaymentRequest,
  useCreateComisionRequest,
  useGetMyDeals,
  useRejectPaymentRequest
} from '@/http-hooks/deals'
import { RootState } from '@/redux/store'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash2, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { z } from 'zod'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { OutlinedInput } from '@/components/ui/outlined-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'
import { UploadIcon } from '@/components/icons/icons'

import { PaymentTrackedDataT } from './PaymentTransactiontable'
import RejectDialogue from './RejectDialog'

interface companyT {
  dealId: string
  organizationName: string
  organizationType: string
  organizationBrief: string
  dealBrief: string
  status: string
  organizationId: number
  logoUrl: string
}

export const requestSchema = z.object({
  // orgId: z.number().min(1, 'organization is required'),
  orgId: z.number().min(1, 'organization is required'),
  date: z.string(),
  amount: z.string().min(1, 'Amount is required')
})

export type CreateDealFormData = z.infer<typeof requestSchema>

const ViewRequestDrawer: React.FC<{
  buttonText: string
  drawerData: PaymentTrackedDataT
  status: string
}> = ({ buttonText, drawerData, status }) => {
  const { data } = useGetMyDeals('JOINED') as { data: companyT[] | null }
  const [selectedCompany, setSelectedCompany] = useState<companyT | undefined>(
    undefined
  )

  console.log({ drawerData })

  const [open, setOpen] = useState<boolean>(false)

  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization } = saved
  const { mutate: approvePayment, isPending: approving } =
    useApprovePaymentRequest()
  const { mutate: rejectPayment, isPending: rejecting } =
    useRejectPaymentRequest()

  // const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files) {
  //     setSelectedFiles((prevFiles) => [
  //       ...prevFiles,
  //       ...Array.from(event.target.files ?? [])
  //     ])
  //   }
  // }

  // const handleRemoveFile = (index: number) => {
  //   setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index))
  // }

  const form = useForm<CreateDealFormData>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      amount: String(drawerData?.amount)
    },
    mode: 'onChange'
  })

  const handleRejectApplication = (id: number, reason: string) => {
    rejectPayment({ id, reason })
    setOpen(false)
  }

  const handleApprovePayment = (id: number) => {
    approvePayment(id)
    if (!approving) setOpen(false)
  }

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
    reset
  } = form

  useEffect(() => {
    // if (drawerData && data) {
    console.log(selectedCompany)

    const selectedPartner = data?.find(
      (partner) => partner.organizationId === drawerData.organizationId
    )
    setSelectedCompany(selectedPartner)
    // }
  }, [drawerData, data])

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant='link'
          className='p-0 text-shark-sm font-bold text-[#3E50F7]'
          onClick={() => setOpen(true)}
        >
          {buttonText}
        </Button>
      </DrawerTrigger>
      <DrawerContent className='p-0'>
        <DrawerHeader className='flex w-full items-center justify-between border border-text-20 px-6 py-4'>
          <DrawerTitle className='text-shark-xl font-medium'>
            Request Reward
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant='link' onClick={() => setOpen(false)}>
              <X size={24} color='#2A3241' />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <Form {...form}>
          <form className='flex h-full flex-col justify-between'>
            <div className='mt-1 flex flex-col gap-6 px-5 py-4'>
              <Select
                disabled
                value={String(drawerData?.requestingOrganizationId)}
                // onValueChange={(value) => {
                //   setValue('orgId', Number(value))
                //   const selectedPartner = data?.find(
                //     (partner) => String(partner.organizationId) === value
                //   )
                //   setSelectedCompany(selectedPartner)
                // }}
              >
                <SelectTrigger
                  label='Company'
                  className='rounded-lg text-text-100 placeholder:text-shark-base placeholder:font-normal'
                >
                  <SelectValue
                    className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                    placeholder='Select Partner Program'
                  />
                </SelectTrigger>
                <SelectContent>
                  {data?.map((partner) => (
                    <SelectItem
                      key={partner?.dealId}
                      value={String(partner.organizationId)}
                    >
                      {partner?.organizationName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCompany && (
                <div className='flex flex-col gap-2'>
                  <p className='text-shark-sm font-bold'>
                    Program details preview
                  </p>
                  <div className='flex flex-col gap-2 rounded-xl border border-text-20 p-4'>
                    <div className='flex gap-4'>
                      <div className='relative h-[45px] w-[45px] overflow-hidden rounded-lg'>
                        <Image
                          src={selectedCompany?.logoUrl}
                          alt='company logo'
                          fill
                        />
                      </div>
                      <div className=''>
                        <p className='text-lg/5 font-bold text-text-100'>
                          {selectedCompany?.organizationName}
                        </p>
                        <div className='mt-1 flex gap-1'>
                          {
                            <Badge className='rounded-[4px] bg-text-20 px-2 py-[2px] text-[12px]/[14px] text-text-100 hover:bg-text-20'>
                              {selectedCompany?.organizationType}
                            </Badge>
                          }
                        </div>
                      </div>
                    </div>
                    <p className='text-sm font-normal text-text-100'>
                      {selectedCompany?.organizationBrief}
                    </p>
                    <Badge
                      className='mt-2 rounded-[4px] bg-[#F0F1F2] px-2 py-1 text-[12px]/[14px] text-text-100'
                      variant={'secondary'}
                    >
                      {selectedCompany?.dealBrief}
                    </Badge>
                  </div>
                </div>
              )}
              <OutlinedInput
                disabled
                label='Amount'
                type='number'
                className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                placeholder='Enter deal amount'
                value={drawerData?.amount}
              />

              <OutlinedInput
                disabled
                label='Captured on'
                className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
                placeholder='Enter date captured'
                value={drawerData?.date}
              />

              {/* <div className='flex flex-col gap-2.5 rounded-xl border border-text-20 p-4'>
              <div className='flex'>
                <div className='grow'>
                  <p className='text-shark-base font-bold text-[#403A44]'>
                    Attach invoices
                  </p>
                  <p className='text-shark-sm font-normal text-[#403A44]'>
                    This may include sale proofs, invoices, etc
                  </p>
                </div>
                <Button
                  variant='ghost'
                  className='bg-[#E5EFFE] p-3 text-shark-xs font-bold text-[#3E50F7] hover:bg-[#E5EFFE] hover:text-[#3E50F7]'
                >
                  <label className='flex ' htmlFor='fileInput'>
                    <UploadIcon />
                    Upload
                  </label>
                  <Input
                    id='fileInput'
                    type='file'
                    multiple
                    className='hidden'
                    onChange={handleFileChange}
                  />
                </Button>
              </div>
              {selectedFiles && (
                <div className='flex flex-col gap-[14px]'>
                  {selectedFiles.map((file, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between gap-[2px] rounded-lg bg-[#F5F2EE] px-4 py-3'
                    >
                      {file.name}
                      <Trash2
                        onClick={() => handleRemoveFile(index)}
                        size={16}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div> */}
            </div>

            <DrawerFooter className='gap-0 p-0'>
              <div className='border-t border-text-20 p-4'>
                <Button
                  loading={approving}
                  className='w-full'
                  type='button'
                  onClick={() => handleApprovePayment(drawerData.id)}
                  disabled={status !== 'REQUEST_RECEIVED'}
                >
                  Approve Payment
                </Button>
              </div>
              <div className='w-full border-t border-text-20 p-4'>
                <RejectDialogue
                  id={drawerData?.id}
                  handleRejectApplication={handleRejectApplication}
                  status={status}
                />
              </div>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}

export default ViewRequestDrawer
