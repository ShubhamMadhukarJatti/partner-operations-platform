'use client'

import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { MoneybagIcon } from '@/components/icons/icons'

interface GuidelinePopupProp {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  handleCreateDeal: () => void
}

const GuidelinePopup: React.FC<GuidelinePopupProp> = ({
  open,
  setOpen,
  handleCreateDeal
}) => {
  return (
    <Dialog open={open} onOpenChange={() => setOpen(false)}>
      <DialogContent className='flex w-[593px] flex-col p-6'>
        <DialogHeader>
          <DialogTitle>
            <h2 className='fds-heading mb-5 text-[#3B475D]'>Guidelines</h2>
          </DialogTitle>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <p className='fds-text'>
            Please abide by these guidelines while having your affiliate program
            published in the marketplace.
          </p>

          <div className='flex items-center gap-0'>
            <div className='flex max-w-[33%] flex-col items-center justify-center gap-3 px-3 py-4'>
              <MoneybagIcon />
              <p className='text-center text-shark-base text-shark-blue-900'>
                No unrealistic earning claims
              </p>
            </div>
            <Separator orientation='vertical' className='h-[70px] w-[1px]' />
            <div className='flex max-w-[33%] flex-col items-center justify-center gap-3 px-3 py-4'>
              <MoneybagIcon />
              <p className='text-center text-shark-base text-shark-blue-900'>
                Must have a clear commission
              </p>
            </div>
            <Separator orientation='vertical' className='h-[70px] w-[1px]' />
            <div className='flex max-w-[33%] flex-col items-center justify-center gap-3 px-3 py-4'>
              <MoneybagIcon />
              <p className='text-center text-shark-base text-[#001430]'>
                Transparent tracking via sharkdom
              </p>
            </div>
          </div>

          <div className='rounded-lg bg-text-20 p-4 text-shark-sm'>
            Program will be removed from the marketplace if guidelines are not
            followed
          </div>
        </div>

        <DialogFooter className='flex pt-4'>
          <Button onClick={() => handleCreateDeal()} className='w-full'>
            Create deal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default GuidelinePopup
