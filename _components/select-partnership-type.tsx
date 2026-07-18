'use client'

import { useState } from 'react'
import Image from 'next/image'
import type {
  Credits,
  OrganizationType,
  SearchOrganizationResponse
} from '@/types'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { showCustomToast } from '@/components/custom-toast'

import { GenerateProposal } from './generate-proposal'

type Props = {
  recieverOrg: SearchOrganizationResponse
  userId: string
  token: string
  senderOrg: OrganizationType
  options: { option: string; category: string }[]
  status: string | null
  credits: any
}

export const SelectPartnershipType = ({
  recieverOrg,
  userId,
  token,
  senderOrg,
  options,
  status,
  credits
}: Props) => {
  const [partnershipType, setPartnershipType] = useState<string>('A')
  const [isTypeSelected, setTypeSelected] = useState<boolean>(false)
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  return (
    <>
      {/* credits && credits.aiProposalCredits > 0  */}
      {true ? (
        <>
          {status === null ? (
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <AlertDialogTrigger>
                <div
                  className='relative rounded-full bg-[#1E9CFF] p-2 text-white'
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Image
                    src='/icons/magic-pen.svg'
                    width={16}
                    height={16}
                    alt=''
                  />
                  <Image
                    className='absolute -right-1 -top-1'
                    src='/icons/crown.png'
                    width={16}
                    height={16}
                    alt=''
                  />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent className='flex h-full max-h-[90vh] w-full max-w-[97vw] gap-2 overflow-hidden border-none bg-transparent p-0 shadow-none lg:max-w-screen-lg xl:max-w-screen-xl'>
                <div className='flex h-full w-full flex-col items-center justify-center'>
                  <h3 className='text-center text-2xl font-light capitalize'>
                    {senderOrg.name} x {recieverOrg.name}
                  </h3>

                  <Card className='mt-4 flex w-full max-w-md  flex-col items-center p-8'>
                    <CardHeader className='text-center text-2xl font-semibold text-[#101828]'>
                      Looking to partner for
                    </CardHeader>
                    <CardContent className='mt-8 w-full '>
                      <Label>Registration Type</Label>
                      <Select
                        name='partnershipType'
                        value={partnershipType}
                        defaultValue='A'
                        onValueChange={setPartnershipType}
                      >
                        <SelectTrigger className='mt-2 w-full rounded-lg'>
                          <SelectValue placeholder='Company registration type' />
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value='A'>Technology</SelectItem>
                          <SelectItem value='B'>Co-Marketing</SelectItem>
                          <SelectItem value='C'>Strategic</SelectItem>
                          <SelectItem value='D'>Community</SelectItem>
                          <SelectItem value='E'>Brand Licensing</SelectItem>
                          <SelectItem value='F'>Sales</SelectItem>
                          <SelectItem value='G'>Social</SelectItem>
                        </SelectContent>
                      </Select>
                    </CardContent>
                    <CardFooter className='mt-8 flex w-full  flex-col gap-4'>
                      <GenerateProposal
                        credits={credits as Credits}
                        recieverOrg={recieverOrg}
                        userId={userId}
                        token={token}
                        senderOrg={senderOrg}
                        options={options}
                        status={status}
                        partnershipType={partnershipType}
                      />

                      <Button
                        variant={'secondary'}
                        className='w-full'
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </AlertDialogContent>
            </AlertDialog>
          ) : null}
        </>
      ) : (
        <button
          className='flex size-9 items-center justify-center rounded-full bg-primary text-white'
          onClick={() =>
            showCustomToast(
              'Warning',
              'Insufficient AI credits.',
              'error',
              5000
            )
          }
        >
          <Image src='/icons/magic-pen.svg' width={16} height={16} alt='' />
          <div className='sr-only'>generate proposal</div>
        </button>
      )}
    </>
  )
}
