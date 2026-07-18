'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  useCheckConnectedAccounts,
  useConnectBankAccount
} from '@/http-hooks/deals'
import { connectBankAccountParam } from '@/services/deals'
import { ArrowLeft, BanknoteIcon, X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader
} from '@/components/ui/drawer'
import { BankIcon } from '@/components/icons/icons'

import AddAccountCard from './AddAccountCard'
import AddBankAccountDetails from './AddBankAccountDetails'
import PaypalScreen from './PaypalScreen'

// screen1 = 'first'
// screen2 = 'account details screen'
// screen3 = 'stripe details screen'

interface BankDetailsDrawerProps {
  open: boolean
  setOpen: (e: boolean) => void
}

export const stripeConnectSteps = [
  {
    step: 1,
    title: 'Step 1',
    description:
      'Enter bank details to set up your account to recieve and send payment.'
  },
  {
    step: 2,
    title: 'Step 2',
    description:
      'Enter bank details to set up your account to recieve and send payment.'
  },
  {
    step: 3,
    title: 'Step 3',
    description:
      'Enter bank details to set up your account to recieve and send payment.'
  }
]

const BankDetailsDrawer: React.FC<BankDetailsDrawerProps> = ({
  open,
  setOpen
}) => {
  const [currentScreen, setCurrentScreen] = useState<number>(0)
  const [bankFormData, setBankFormdata] = useState()
  const [bankFormSubmit, setBankFormSubmit] = useState<boolean>(false)
  const { mutate: connectAccount, isPending } = useConnectBankAccount()
  const { data, isLoading } = useCheckConnectedAccounts()
  console.log(data)
  const handleBack = () => {
    setCurrentScreen(0)
  }

  const handleConnectRazorpay = () => {
    const razorpayDirectUrl = 'https://dev.sharkdom.com/api/razorpay'
    window.open(razorpayDirectUrl)
  }

  const handleConnectStripe = () => {
    const stripeDirectUrl = 'https://dev.sharkdom.com/api/stripe'
    window.open(stripeDirectUrl)
  }

  const handleConnectBankAccount = (formData: connectBankAccountParam) => {
    connectAccount(formData)
  }

  const isDisabledButton = (accountType: 'bank' | 'stripe' | 'razorpay') => {
    if (
      data &&
      typeof data === 'object' &&
      'bankConnected' in data &&
      'stripeConnected' in data &&
      'razorPayConnected' in data
    ) {
      if (accountType === 'bank') return data?.bankConnected
      if (accountType === 'stripe') return data?.stripeConnected
      if (accountType === 'razorpay') return data?.razorPayConnected
    }

    return false
  }

  const screenTitle = [
    {
      screen: 1,
      title: 'Set up account'
    },
    {
      screen: 2,
      title: 'Add bank account',
      buttonText: 'Connect bank',
      buttonFunction: () => setBankFormSubmit(true),
      disable: isDisabledButton('bank')
    },
    {
      screen: 3,
      title: 'Add Stripe account',
      buttonText: 'Connect Stripe',
      buttonFunction: handleConnectStripe,
      disable: isDisabledButton('stripe')
    },
    {
      screen: 4,
      title: 'Add Razorpay account',
      buttonText: 'Connect Razorpay',
      buttonFunction: handleConnectRazorpay,
      disable: isDisabledButton('razorpay')
    }
  ]

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='p-0'>
        <div>
          <div className='flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] px-6 py-4'>
            <div className='flex items-center gap-2'>
              {currentScreen > 0 && (
                <button onClick={() => handleBack()}>
                  <ArrowLeft height={24} width={24} />
                </button>
              )}

              <p className='text-shark-base font-medium sm:text-xl'>
                {screenTitle[currentScreen].title}
              </p>
            </div>
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

          {currentScreen === 0 && (
            <>
              <div className='flex flex-col gap-1 bg-[#FDF3E3] p-4'>
                <p className='text-sm font-bold text-text-100'>
                  Account details are necessary for comission transfer
                </p>
                <p className='text-sm/4 font-normal text-text-80'>
                  As you complete the specified targets, you can send attahments
                  proofs and ask for commission.
                </p>
              </div>
              <div className='flex flex-col gap-4 px-5 py-4'>
                <AddAccountCard
                  icon={<BankIcon />}
                  title='Add bank account'
                  description={
                    'Enter bank details to set up your account to recieve and send payment.'
                  }
                  onClick={() => setCurrentScreen(1)}
                />
                {/* <AddAccountCard
                  icon={
                    <Image
                      src={'https://sharkdom.com/icons/stripe.svg'}
                      alt='stripe-logo'
                      width={49}
                      height={20}
                    />
                  }
                  title='Add Stripe'
                  description={
                    'Connect with your Stripe ID to recieve and send payment'
                  }
                  onClick={() => setCurrentScreen(2)}
                />
                <AddAccountCard
                  icon={
                    <Image
                      src={'https://sharkdom.com/icons/rajorpay.svg'}
                      alt='razorpay-logo'
                      width={40}
                      height={15}
                    />
                  }
                  title='Add Razorpay'
                  description={
                    'Connect with your Razorpay ID to recieve and send payment'
                  }
                  onClick={() => setCurrentScreen(3)}
                /> */}
              </div>
            </>
          )}

          {currentScreen === 1 && (
            <AddBankAccountDetails
              submitForm={bankFormSubmit}
              handleConnectBankAccount={handleConnectBankAccount}
            />
          )}
          {currentScreen === 2 && (
            <PaypalScreen
              icon={'https://sharkdom.com/icons/stripe.svg'}
              title='Connect with Stripe'
              description='Connect with your existing account or create a new Paypal account to send and receive rewards'
              steps={stripeConnectSteps}
            />
          )}
          {currentScreen === 3 && (
            <PaypalScreen
              icon={'https://sharkdom.com/icons/rajorpay.svg'}
              title='Connect with Rajorpay'
              description='Connect with your existing account or create a new Razorpay account to send and receive rewards'
              steps={stripeConnectSteps}
            />
          )}
        </div>
        {currentScreen > 0 && (
          <DrawerFooter className='border-t border-t-[#EAECF0]'>
            <Button
              onClick={screenTitle[currentScreen].buttonFunction}
              disabled={Boolean(screenTitle[currentScreen].disable)}
            >
              {screenTitle[currentScreen].buttonText}
            </Button>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  )
}

export default BankDetailsDrawer
