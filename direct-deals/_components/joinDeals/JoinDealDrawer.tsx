'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import {
  useCheckConnectedAccounts,
  useConnectBankAccount,
  useGetApplications,
  useGetDealDetails,
  useJoinDeal
} from '@/http-hooks/deals'
import { RootState } from '@/redux/store'
import { connectBankAccountParam } from '@/services/deals'
import { ArrowLeft, X } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter
} from '@/components/ui/drawer'
import { BankIcon } from '@/components/icons/icons'

import DealPreview from '../DealPreview'
import AddAccountCard from '../payouts-earning/AddAccountCard'
import AddBankAccountDetails from '../payouts-earning/AddBankAccountDetails'
import { stripeConnectSteps } from '../payouts-earning/BankDetailsDrawer'
import PaypalScreen from '../payouts-earning/PaypalScreen'
import { ConnectedAccounts } from '../PayoutsContent'

interface JoinDealDrawerProps {
  open: boolean
  setOpen: (e: boolean) => void
  dealId: string
}

export const defaultDealDataPreviewData = {
  creationTimestamp: '',
  dealId: '',
  organizationId: 0,
  offerDetail: '',
  restrictedSectors: [],
  channelAllowed: [],
  quotaRemaining: '',
  geography: '',
  affiliateLink: '',
  approvalRequired: false,
  status: '',
  organizationName: '',
  logoUrl: '',
  organizationType: '',
  organizationBrief: ''
}

const JoinDealDrawer: React.FC<JoinDealDrawerProps> = ({
  open,
  setOpen,
  dealId
}) => {
  const [step, setStep] = React.useState<number>(1)
  const { mutate: joinDeal, isPending } = useJoinDeal()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { loading: orgLoading, organization } = saved
  const [bankFormSubmit, setBankFormSubmit] = useState<boolean>(false)
  const { mutate: connectAccount, isPending: connectBankPending } =
    useConnectBankAccount()
  const { data, isLoading } = useGetDealDetails(dealId)
  const { data: isAccountConnected } = useCheckConnectedAccounts() as {
    data: ConnectedAccounts | null
  }

  const handleJoinDeal = () => {
    if (dealId && organization) {
      joinDeal({ dealId, organizationId: organization.id })
      setOpen(false)
    }
  }

  const handleBack = () => {
    if (step > 2) setStep(2)
    else setStep(1)
  }

  const handleConnectStripe = () => {
    const stripeDirectUrl = 'https://dev.sharkdom.com/api/stripe'
    window.open(stripeDirectUrl)
  }

  const handleConnectBankAccount = (formData: connectBankAccountParam) => {
    connectAccount(formData)
    setStep(2)
  }

  const screenDetails = [
    {
      step: 1,
      title: 'Program Details',
      buttonText: 'Continue',
      buttonFunction: () => setStep(2),
      disable: false
    },
    {
      step: 2,
      title: 'Set up account',
      buttonText: 'Join Deal',
      buttonFunction: handleJoinDeal,
      disable: !isAccountConnected?.bankConnected
    },
    {
      step: 3,
      title: 'Direct Deposit',
      buttonText: 'Connect bank',
      buttonFunction: () => setBankFormSubmit(true),
      disable: isAccountConnected?.bankConnected
    },
    {
      step: 4,
      title: 'Add Stripe account',
      buttonText: 'Connect Stripe',
      buttonFunction: handleConnectStripe,
      disable: false
    },
    {
      step: 5,
      title: 'Add Razorpay account',
      buttonText: 'Connect Razorpay',
      buttonFunction: () => console.log('conen'),
      disable: false
    }
  ]

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent className='p-0'>
        <div>
          <div className='flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] px-6 py-3'>
            <div className=''>
              {step <= 2 && (
                <Badge className='rounded-[4px] bg-[#FFF2EC] px-2 py-1 text-[10px]/[12px] text-[#B05311] hover:bg-[#FFF2EC]'>
                  Step {step} of 2
                </Badge>
              )}

              <div className='flex gap-2'>
                {step > 1 && (
                  <button onClick={() => handleBack()}>
                    <ArrowLeft height={24} width={24} />
                  </button>
                )}

                <p className='text-shark-base sm:text-xl'>
                  {screenDetails[step - 1].title}
                </p>
              </div>
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
          {step === 1 && data && Object.keys(data).length > 0 ? (
            <DealPreview
              data={{ ...defaultDealDataPreviewData, ...data }}
              dealPreview={false}
            />
          ) : (
            <></>
          )}

          {step === 2 && (
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
                  onClick={() => setStep(3)}
                />
                {/* <AddAccountCard
                  icon={
                    <Image
                      src={'/assets/stripe.png'}
                      alt='stripe-logo'
                      width={49}
                      height={20}
                    />
                  }
                  title='Add Stripe'
                  description={
                    'Connect with your Stripe ID to recieve and send payment'
                  }
                  onClick={() => setStep(4)}
                />
                <AddAccountCard
                  icon={
                    <Image
                      src={'/assets/paypal-icon.png'}
                      alt='stripe-logo'
                      width={40}
                      height={15}
                    />
                  }
                  title='Add Razorpay'
                  description={
                    'Connect with your Razorpay ID to recieve and send payment'
                  }
                  onClick={() => setStep(5)}
                /> */}
              </div>
            </>
          )}

          {step === 3 && (
            <AddBankAccountDetails
              submitForm={bankFormSubmit}
              handleConnectBankAccount={handleConnectBankAccount}
            />
          )}

          {step === 4 && (
            <PaypalScreen
              icon='/assests/stripe-icon.png'
              title='Connect with Stripe'
              description='Connect with your existing account or create a new Stripe account to send and receive rewards'
              steps={stripeConnectSteps}
            />
          )}
          {step === 5 && (
            <PaypalScreen
              icon='/assests/stripe-icon.png'
              title='Connect with RazorPay'
              description='Connect with your existing account or create a new Razorpay account to send and receive rewards'
              steps={stripeConnectSteps}
            />
          )}
        </div>
        <DrawerFooter className='border-t border-t-[#EAECF0]'>
          <Button
            onClick={screenDetails[step - 1].buttonFunction}
            disabled={screenDetails[step - 1].disable}
          >
            {screenDetails[step - 1].buttonText}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default JoinDealDrawer
