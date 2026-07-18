'use client'

import React from 'react'
import Image from 'next/image'
import { useEndDeal } from '@/http-hooks/deals'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

const EndDealDialog: React.FC<{ dealId: string }> = ({ dealId }) => {
  const { mutate: endDeal, isPending } = useEndDeal()

  const handleButtonClicked = (dealId: string) => {
    endDeal(dealId)
  }
  console.log(dealId)
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='border border-text-40 bg-white text-primary-blue hover:text-white'>
          End deal
        </Button>
      </DialogTrigger>
      <DialogContent className='px-5 py-4 sm:max-w-[472px]'>
        <div className='mt-6 flex flex-col items-center justify-center gap-10'>
          <Image
            src='/assets/warning-icon.png'
            alt='warning sign'
            height='137'
            width={181}
          />

          <div className='flex flex-col items-center gap-4'>
            <p className='text-center text-shark-xl font-bold'>
              End this deal?
            </p>
            <p className='text-center text-shark-base font-normal'>
              Once you end this deal, you can not re-open this existing deal.
              You have to create a new deal.
            </p>

            <Button
              onClick={() => handleButtonClicked(dealId)}
              className='w-full'
            >
              Yes, end deal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EndDealDialog
