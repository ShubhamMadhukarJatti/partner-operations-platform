'use client'

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useCheckConnectedAccounts, useCreateNewDeal } from '@/http-hooks/deals'
import { RootState } from '@/redux/store'
import { ArrowLeft, X } from 'lucide-react'
import { useSelector } from 'react-redux'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import {
  BankIcon,
  FileDollarIcon,
  PropertyViewIcon
} from '@/components/icons/icons'

import BankDetailsForm from './BankDetailsForm'
import Banner from './Banner'
import CreateDealForm, { DealFormDataType } from './CreateDealForm'
import DealPreview from './DealPreview'
import GuidelinePopup from './GuidelinePopup'
import { defaultDealDataPreviewData } from './joinDeals/JoinDealDrawer'
import AddAccountCard from './payouts-earning/AddAccountCard'
import { ConnectedAccounts } from './PayoutsContent'

interface CreateDealDrawerProps {
  open: boolean
  setOpen: (e: boolean) => void
}

const CreateDealDrawer: React.FC<CreateDealDrawerProps> = ({
  open,
  setOpen
}) => {
  const [step, setStep] = useState<number>(1)
  const saved = useSelector((state: RootState) => state.currentOrg)
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(true)
  const [shouldSubmit, setShouldSubmit] = useState(false)
  const [formData, setFormData] = useState<DealFormDataType | null>(null)
  const { mutate: createDeal, isPending } = useCreateNewDeal()
  const { loading: orgLoading, organization } = saved
  const [openPreview, setOpenPreview] = useState(false)
  const [dealPreviewData, setDealPreviewData] = useState<DealFormDataType>(
    defaultDealDataPreviewData
  )
  const { data } = useCheckConnectedAccounts() as { data: ConnectedAccounts }
  const { data: connectedAccounts } = useCheckConnectedAccounts() as {
    data: ConnectedAccounts | null
  }
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const orgData = {
    organizationName: organization?.name,
    organizationType: organization?.companyType,
    organizationBrief: organization?.briefDescription,
    logoUrl: organization?.logoUrl
  }

  const handleContinue = () => {
    setShouldSubmit(true)
  }

  const handleCreateDeal = () => {
    if (formData && Object.keys(formData).length > 0) {
      const organizationId = organization?.id as number
      if (!organizationId) return
      createDeal({ ...formData, organizationId })

      setOpen(false)
      setDialogOpen(false)
      handleDrawerReset()
    }
  }

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      setStep(2)
      setShouldSubmit(false)
    }
  }, [formData])

  const handleBack = () => {
    setStep(1)
  }

  const handleConnectRazorpay = () => {
    const razorpayDirectUrl = 'https://dev.sharkdom.com/api/razorpay'
    window.open(razorpayDirectUrl)
  }

  const handleConnectStripe = () => {
    const stripeDirectUrl = 'https://dev.sharkdom.com/api/stripe'
    window.open(stripeDirectUrl)
  }

  const handleDrawerReset = () => {
    setStep(1)
    setFormData(null)
  }

  return (
    <>
      <GuidelinePopup
        open={dialogOpen}
        setOpen={setDialogOpen}
        handleCreateDeal={handleCreateDeal}
      />
      <Drawer open={openPreview} onOpenChange={setOpenPreview}>
        <DrawerContent className='max-w-[85%] p-0'>
          <div className='flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] px-6 py-3'>
            <p className='text-shark-base font-bold sm:text-xl'>Deal Preview</p>
            <DrawerClose asChild>
              <Button
                variant='link'
                onClick={() => {
                  setOpenPreview(false)
                }}
              >
                <X size={24} color='#2A3241' />
              </Button>
            </DrawerClose>
          </div>
          <div>
            {/* defaultDealDataPreviewData just to prevent from type errors: no significance */}
            <DealPreview
              data={{
                ...defaultDealDataPreviewData,
                ...orgData,
                ...dealPreviewData
              }}
              dealPreview={true}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='max-w-[85%] p-0'>
          <div>
            <div className='flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] px-6 py-3'>
              <div className=''>
                <Badge className='rounded-[4px] bg-[#FFF2EC] px-2 py-1 text-[10px]/[12px] text-[#B05311] hover:bg-[#FFF2EC]'>
                  Step {step} of 2
                </Badge>
                <div className='flex gap-2'>
                  {step > 1 && (
                    <button onClick={() => handleBack()}>
                      <ArrowLeft height={24} width={24} />
                    </button>
                  )}

                  <p className='text-shark-base font-bold sm:text-xl'>
                    {step === 1 ? 'Create Deal' : 'Set up Account'}
                  </p>
                </div>
              </div>
              <div className='flex sm:gap-4'>
                {step === 1 && (
                  <Button
                    onClick={() => handleContinue()}
                    disabled={buttonDisabled}
                  >
                    Continue
                  </Button>
                )}
                {step === 2 && (
                  <Button
                    onClick={() => setDialogOpen(true)}
                    disabled={!connectedAccounts?.bankConnected}
                  >
                    Create Deal
                  </Button>
                )}

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
          </div>

          {step === 1 ? (
            <div className='px-5 py-4'>
              <div className='flex items-center gap-4 rounded-xl bg-[#F3F3F3] px-4 py-3'>
                <div className='flex h-[45px] w-[45px] items-center justify-center rounded-lg bg-white'>
                  <PropertyViewIcon />
                </div>
                <div className='flex grow justify-between'>
                  <div>
                    <p className='text-sm/4 font-bold text-text-100'>
                      See how this will look to partners
                    </p>
                    <p className='text-sm/4 font-normal text-text-100'>
                      This shows you how your deal will show to other partners
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      setOpenPreview(true)
                    }}
                    className='text-base/5 font-bold'
                    variant={'link'}
                  >
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Banner
              icon={<BankIcon />}
              title='Account details are necessary for comission transfer'
              description='As you complete the specified targets, you can send attahments proofs and ask for commission.'
            />
          )}

          {step === 1 && (
            <div className='px-5 py-5'>
              <CreateDealForm
                organizationId={organization?.id}
                setButtonDisabled={setButtonDisabled}
                shouldSubmit={shouldSubmit}
                onSubmitComplete={() => setShouldSubmit(false)}
                setFormData={setFormData}
                previousData={formData}
                openPreview={openPreview}
                setDealPreviewData={setDealPreviewData}
              />
            </div>
          )}

          {step === 2 && (
            <div className='flex flex-col gap-4 px-10 py-4'>
              <div className='flex cursor-pointer flex-col gap-4  rounded-xl border border-text-20 p-4'>
                <div className='mb-1 flex justify-between gap-4'>
                  <div className='flex gap-4'>
                    <div className='flex min-w-[58px] items-center justify-center rounded-md bg-[#8350DB1A]'>
                      <BankIcon />
                    </div>
                    <div className='flex max-w-[300px] flex-col gap-1'>
                      <p className='text-base/5 font-bold text-text-100'>
                        Add bank account
                      </p>
                      <p className='text-sm/4 font-normal text-text-80 '>
                        Enter bank details to set up your account to recieve and
                        send payment.
                      </p>
                    </div>
                  </div>
                  {data?.bankConnected && (
                    <Button
                      disabled
                      className='border border-text-60 bg-white text-[#3E50F7] hover:text-white'
                    >
                      Connected
                    </Button>
                  )}
                </div>
                {!data?.bankConnected && <BankDetailsForm />}
              </div>
              {/* <div className='flex cursor-pointer items-center  justify-between gap-4 rounded-xl border border-text-20 p-4'>
                <div className='flex gap-4'>
                  <div className='flex min-w-[58px] items-center justify-center rounded-md bg-[#8350DB1A]'>
                    <Image
                      src={'/assets/stripe.png'}
                      alt='stripe-logo'
                      width={49}
                      height={20}
                    />
                  </div>
                  <div className='flex max-w-[300px] flex-col gap-1'>
                    <p className='text-base/5 font-bold text-text-100'>
                      Add Stripe
                    </p>
                    <p className='text-sm/4 font-normal text-text-80 '>
                      Connect with your Stripe ID to recieve and send payment
                    </p>
                  </div>
                </div>
                <Button
                  disabled={data?.stripeConnected}
                  onClick={handleConnectStripe}
                  className='border border-text-60 bg-white text-[#3E50F7] hover:text-white'
                >
                  {data?.stripeConnected ? 'Connected' : 'connect'}
                </Button>
              </div>
              <div className='flex cursor-pointer items-center  justify-between gap-4 rounded-xl border border-text-20 p-4'>
                <div className='flex gap-4'>
                  <div className='flex min-w-[58px] items-center justify-center rounded-md bg-[#8350DB1A]'>
                    <Image
                      src={'/assets/rajorpay.svg'}
                      alt='razorpay-logo'
                      width={49}
                      height={20}
                    />
                  </div>
                  <div className='flex max-w-[300px] flex-col gap-1'>
                    <p className='text-base/5 font-bold text-text-100'>
                      Add Razorpay
                    </p>
                    <p className='text-sm/4 font-normal text-text-80 '>
                      Connect with your razorpay ID to recieve and send payment
                    </p>
                  </div>
                </div>
                <Button
                  disabled={data?.razorPayConnected}
                  onClick={handleConnectRazorpay}
                  className='border border-text-60 bg-white text-[#3E50F7] hover:text-white'
                >
                  {data?.razorPayConnected ? 'Connected' : 'connect'}
                </Button>
              </div> */}
            </div>
          )}

          {/* {step === 3 && <DealPreview data={dealPreviewData} dealPreview={true} />} */}
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default CreateDealDrawer
