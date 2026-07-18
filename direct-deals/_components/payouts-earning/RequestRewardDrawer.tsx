'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useCreateComisionRequest, useGetMyDeals } from '@/http-hooks/deals'
import { RootState } from '@/redux/store'
import { X } from 'lucide-react'
import { useSelector } from 'react-redux'

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
import { Input } from '@/components/ui/input'
import { OutlinedInput } from '@/components/ui/outlined-input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/outlined-select'

import { formatDate } from '../myDeals/MainContent'
import { PaymentTrackedDataT } from './PaymentTransactiontable'

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

const RequestRewardDrawer: React.FC<{
  buttonText: string
  drawerData: PaymentTrackedDataT
}> = ({ buttonText, drawerData }) => {
  const { data } = useGetMyDeals('JOINED') as { data: companyT[] | null }
  const [selectedCompany, setSelectedCompany] = useState<companyT | undefined>(
    undefined
  )

  const [open, setOpen] = useState<boolean>(false)

  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization } = saved
  const { mutate: createCommision, isPending } = useCreateComisionRequest()

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

  // const handleCreateCommision = () => {
  //   const payload = {
  //     requestingOrgId: organization?.id,
  //   }
  // }

  // const onSubmit = async () => {
  //   try {
  //     const payload = {
  //       requestingOrganizationId: organization?.id,
  //       ...values
  //     }
  //     // createCommision(payload);
  //     setOpen(false)
  //   } catch (error) {
  //     console.log('Failed to create commision', error)
  //   }
  // }

  const handleSendRequest = () => {
    const payload = {
      transactionId: drawerData.paymentId,
      requestingOrganizationId: organization.id,
      commission: drawerData.amount,
      orgId: Number(drawerData.partnerId),
      invoiceAzure: ''
    }

    if (!payload.orgId) return

    createCommision(payload)
    setOpen(false)
  }
  useEffect(() => {
    // if (drawerData && data)

    const selectedPartner = data?.find(
      (partner) => partner.organizationId === Number(drawerData?.partnerId)
    )
    setSelectedCompany(selectedPartner)
    // }
  }, [drawerData, data])
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant='ghost'
          className='bg-[#E5EFFE] p-3 text-shark-sm font-bold text-[#3E50F7]'
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

        <div className='flex h-full flex-col justify-between'>
          <div className='mt-1 flex flex-col gap-6 px-5 py-4'>
            <Select
              disabled
              value={drawerData?.partnerId}
              // onValueChange={(value) => {
              //   setValue('orgId', Number(value))
              //   const selectedPartner = data?.find(
              //     (partner) =>
              //       String(partner.organizationId) === value
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
              value={drawerData.amount}
              disabled
              label='Amount'
              type='number'
              className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
              placeholder='Enter deal amount'
              // {...field}
            />

            <OutlinedInput
              label='Captured on'
              value={formatDate(drawerData.timestamp)}
              disabled
              className='text-text-100 placeholder:text-shark-xs lg:placeholder:text-shark-sm 2xl:placeholder:text-shark-base'
              placeholder='Enter date captured'
              // {...field}
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

          <DrawerFooter className='w-full border-t border-text-20'>
            <Button
              type='button'
              loading={isPending}
              onClick={() => handleSendRequest()}
            >
              Send request
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

export default RequestRewardDrawer
