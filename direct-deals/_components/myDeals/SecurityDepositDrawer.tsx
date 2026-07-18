'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import wallet from '@/../public/assets/wallet.png'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter
} from '@/components/ui/drawer'
import { SecurityLock } from '@/components/icons/icons'

import PaymentMiddleScreens from './PaymentMiddleScreens'

const SecurityDepositDrawer: React.FC<{
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ open, setOpen }) => {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='p-0'>
        <div>
          <div className='flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] px-6 py-3'>
            <p className='text-shark-base font-semibold sm:text-xl'>
              Security Deposit Pending
            </p>
            <div className='flex sm:gap-4'>
              <DrawerClose asChild>
                <Button
                  variant='link'
                  onClick={() => {
                    setOpen(false)
                  }}
                >
                  <X size={24} color='#2A3241' />
                </Button>
              </DrawerClose>
            </div>
          </div>

          <div className='flex flex-col gap-4 px-5 py-4'>
            <div className='flex flex-col items-center justify-center'>
              <Image src={wallet} alt='wallet image' width={162} height={162} />
              <p className='text-shark-lg font-bold'>
                Deposit security amount to activate deal
              </p>
            </div>
            <div className='flex w-full flex-col gap-4 rounded-xl border border-text-20 p-4'>
              <p className='text-[10px]/[12px] font-bold uppercase'>
                Adding amount to
              </p>
              <p className='flex items-center gap-2.5 text-shark-sm font-bold'>
                <SecurityLock /> Account ID XXXX XXXX 0731
              </p>
            </div>

            <div className='flex flex-col gap-4'>
              <h4 className='text-shark-base font-normal'>FAQs</h4>

              <div className='flex w-full flex-col gap-4 rounded-xl bg-[#101A33] p-4'>
                <p className='text-[10px]/[12px] font-bold uppercase text-text-20'>
                  WHY IS THIS NEEDED
                </p>
                <p className='text-shark-sm font-normal text-text-40'>
                  This is important in order to reduce fraud, creating trust and
                  securing partner reward.
                </p>
              </div>
              <div className='flex w-full flex-col gap-4 rounded-xl bg-[#101A33] p-4'>
                <p className='text-[10px]/[12px] font-bold uppercase text-text-20'>
                  HOW MUCH TO DEPOSIT?
                </p>
                <p className='text-shark-sm font-normal text-text-40'>
                  Deposit varies from deal to deal. Based on your deal amount,
                  the desposit sum would be ₹1,000.00
                </p>
              </div>
              <div className='flex w-full flex-col gap-4 rounded-xl bg-[#101A33] p-4'>
                <p className='text-[10px]/[12px] font-bold uppercase text-text-20'>
                  WHY IS THIS NEEDED
                </p>
                <p className='text-shark-sm font-normal text-text-40'>
                  Amount can be withdrawn anytime unless there is a standing
                  payout pending. Only your deal would be unpublished from
                  marketplace.
                </p>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className='border-t border-t-[#EAECF0]'>
          <Button>Deposit ₹XXX amount</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default SecurityDepositDrawer
