'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { InvoiceIcon } from '@/components/icons/icons'

import BankDetailsDrawer from './BankDetailsDrawer'

const ConnectBankCard = () => {
  const [opendrawer, setOpenDrawer] = useState<boolean>(false)
  return (
    <>
      <BankDetailsDrawer open={opendrawer} setOpen={setOpenDrawer} />
      <div className='flex gap-4 rounded-xl border border-[#FFD582] bg-[#FFF4D7] px-4 py-5'>
        <div className='flex h-[96px] w-[96px] items-center justify-center rounded-xl bg-white'>
          <InvoiceIcon />
        </div>
        <div className=''>
          <div className='mb-4 flex flex-col gap-2'>
            <h2 className='text-lg/6 font-bold text-text-100'>
              Connect your bank details
            </h2>
            <p className='text-sm/4 text-text-100'>
              Request rewards and send payouts by adding your bank account or
              Paypal account
            </p>
          </div>
          <Button onClick={() => setOpenDrawer(true)}>Connect Account</Button>
        </div>
      </div>
    </>
  )
}

export default ConnectBankCard
