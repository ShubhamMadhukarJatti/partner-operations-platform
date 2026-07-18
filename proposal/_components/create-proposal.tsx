'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { proposalOffersExpectationsActions } from '@/redux/slices/proposal'
import { RootState } from '@/redux/store'
import { OrganizationType } from '@/types'
import {
  Archive,
  ArrowCircleUp2,
  ArrowLeft,
  HambergerMenu
} from 'iconsax-react'
import { useDispatch, useSelector } from 'react-redux'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { showCustomToast } from '@/components/custom-toast'
import { FullLogo } from '@/components/icons/logo'

import AccountPopover from '../../(dashboard-pages)/_components/layout/account-popover'
import { SidebarContent } from '../../(dashboard-pages)/_components/layout/sidebar'
import CompanyDetails from './CompanyDetails'
import PartnerDetails from './PartnerDetails'
import ProposalPoints from './proposal-points'
import ProposalSentDialog from './proposal-sent-dialog'
import ProposalOptions from './ProposalOptions'

export type TBenefit = {
  benefit: string
  description: string
  hint?: string
}

type Props = {
  receiverOrg: OrganizationType
  userId: string
  token: string

  options: { option: string; hint: string; category: string }[]
}

const CreateProposal = ({ receiverOrg, userId, token, options }: Props) => {
  const dispatch = useDispatch()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const offersExpectationsSaved = useSelector(
    (state: RootState) => state.proposalOffersExpectations
  )
  const { updateOffersExpectations } = proposalOffersExpectationsActions
  const [openProposalModal, setOpenProposalModal] = useState(false)

  const [templateDrawer, setOpenTemplateDrawer] = useState(false)
  const [openNotifications, setOpenNotifications] = useState<boolean>(false)
  const { loading: orgLoading, organization } = saved
  const { offers: userSelectedOffers, expectations: userSelectedExpectations } =
    offersExpectationsSaved
  const [isLoading, setIsLoading] = useState(false)
  const [offers, setOffers] = useState<TBenefit[]>([])
  const [expectations, setExpectations] = useState<TBenefit[]>([])
  const [selectedOption, setSelectedOption] = useState('')
  const [isVibrating, setIsVibrating] = useState(false)
  const groupedOptions = options?.reduce((acc: any, option) => {
    const { category, ...rest } = option
    acc[category] = acc[category] || []
    acc[category].push(rest)
    return acc
  }, {})
  const { unreadCount } = useSelector((state: RootState) => state.notification)

  const handleSelectBenefit = useCallback(
    (value: string, isSenderBenefit: boolean) => {
      const hint = options.find((elem) => elem.option === value)?.hint || ''
      const newBenefit = { benefit: value, description: '', hint }

      if (isSenderBenefit) {
        setOffers((prev) => [...prev, newBenefit])
      } else {
        setExpectations((prev) => [...prev, newBenefit])
      }
      setSelectedOption('')
    },
    [options]
  )

  const handleSendProposal = async () => {
    if (organization?.credits?.collaborationsLeft <= 0) {
      showCustomToast(
        'Insufficient Credits',
        "You don't have enough credit to proceed further - Upgrade Now",
        'error',
        5000
      )
      return
    }

    setIsLoading(true)
    try {
      const senderBenefits = expectations.map(({ benefit, description }) => ({
        benefit,
        description
      }))
      const receiverBenefits = offers.map(({ benefit, description }) => ({
        benefit,
        description
      }))

      if (senderBenefits.length === 0 || receiverBenefits.length === 0) {
        showCustomToast(
          'Missing Information',
          'Please add at least one benefit for both sender and receiver.',
          'error',
          5000
        )
        return
      } else if (
        senderBenefits.some((benefit) => benefit.description.length === 0)
      ) {
        showCustomToast(
          'Missing Description',
          'Please add a description for all sender benefits.',
          'error',
          5000
        )
        return
      } else if (
        receiverBenefits.some((benefit) => benefit.description.length === 0)
      ) {
        showCustomToast(
          'Missing Description',
          'Please add a description for all receiver benefits.',
          'error',
          5000
        )
        return
      }

      const response = await fetch('/api/organizationCollaboration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          senderOrganizationId: organization.id,
          receiverOrganizationId: receiverOrg.id,
          senderUserId: userId,
          status: 'PENDING',
          chatAccessAllowed: true,
          contactPersonUserId: userId,
          partnershipMouVersions: [
            {
              senderOrgcontactPerson: userId,
              status: 'PENDING_SIGN',
              senderBenefits: [...senderBenefits],
              receiverBenefits: [...receiverBenefits]
            }
          ]
        })
      })

      const data = await response.json()

      setOpenProposalModal(true)
      // console.log(data, 'data')
    } catch (error) {
      console.error(error)
      showCustomToast(
        'Error',
        'Failed to send proposal. Please try again.',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const onClickApiListing = () => {
    dispatch(updateOffersExpectations({ offers, expectations }))
  }

  useEffect(() => {
    if (userSelectedOffers.length > 0) {
      setOffers([...userSelectedOffers])
    }

    if (userSelectedExpectations.length > 0) {
      setExpectations([...userSelectedExpectations])
    }
  }, [userSelectedOffers, userSelectedExpectations])

  const triggerVibration = () => {
    setIsVibrating(true)
    setTimeout(() => setIsVibrating(false), 2500) // Reset vibration after 500ms
  }

  useEffect(() => {
    if (unreadCount > 0) {
      triggerVibration() // Trigger vibration when unreadCount is updated
    }
  }, [unreadCount])

  return (
    <>
      {/* <div className='relative 2xl:p-8'>
        <div className=' p-4 lg:pb-32'>
          <div className='flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between '>
            <nav className='space-x-2'>
              <Link href='/explore'>
                <span className='text-shark-base  font-bold text-primary-light-blue underline lg:text-shark-xl'>
                  Marketplace
                </span>
              </Link>
              <span className=' text-shark-base font-bold text-text-100 lg:text-shark-2xl'>
                /
              </span>
              <Link href={`/startup/${receiverOrg.id}`} target='_blank'>
                <span className='text-shark-base font-bold text-primary-light-blue underline lg:text-shark-xl'>
                  {receiverOrg.name}
                </span>
              </Link>
              <span className='text-shark-base font-bold text-text-100 lg:text-shark-2xl'>
                /
              </span>
              <span className='text-shark-base font-bold text-text-100 lg:text-shark-xl '>
                Send a Proposal
              </span>
            </nav>

            <div className='flex space-x-2'>
              <Button
                onClick={() => setOpenTemplateDrawer(true)}
                className='h-[37px] w-[94px] rounded-lg border border-text-20 bg-white text-shark-sm font-bold text-text-100 hover:bg-background-ghost-white'
              >
                Templates
              </Button>

              <Button
                className='h-[37px] w-[228px] rounded-lg  bg-primary-light-blue text-shark-sm  font-bold  text-white'
                loading={isLoading}
                onClick={handleSendProposal}
              >
                Send Proposal
              </Button>
            </div>
          </div>

          <div className='mt-4 grid grid-cols-1 gap-4 2xl:mb-8'>
            <GenerateProposalSection
              receiverOrg={receiverOrg}
              setExpectations={setExpectations}
              setOffers={setOffers}
              senderOrg={organization}
              token={token}
            />
          </div>

          <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:gap-8'>
            <ReceiverDetails receiverOrg={receiverOrg} />
            {organization && (
              <ApiListingSection
                receiverOrg={receiverOrg}
                organization={organization}
                onClickApiListing={onClickApiListing}
              />
            )}
          </div>

          <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:mt-8 2xl:gap-8'>
            <ProposalPoints
              heading={`Expectation Proposal form ${receiverOrg.name}`}
              groupedOptions={groupedOptions}
              points={expectations}
              handleSelect={handleSelectBenefit}
              selectedOption={selectedOption}
              isBenefit={false}
              setPoints={setExpectations}
              setSelectedOption={setSelectedOption}
            />
            <ProposalPoints
              heading={`Offers Proposal form ${organization.name}`}
              groupedOptions={groupedOptions}
              points={offers}
              handleSelect={handleSelectBenefit}
              selectedOption={selectedOption}
              isBenefit
              setPoints={setOffers}
              setSelectedOption={setSelectedOption}
            />
          </div>

          <ProposalSentDialog
            isOpen={openProposalModal}
            setIsOpen={setOpenProposalModal}
            org={receiverOrg}
          />
        </div>

        <TemplateDrawer
          open={templateDrawer}
          setOpen={setOpenTemplateDrawer}
          setExpectations={setExpectations}
          setOffers={setOffers}
        />
      </div> */}

      <div>
        {/* Header */}
        <header className='relative z-10 w-full -translate-y-4 animate-fade-in border-b border-border px-2 py-4 opacity-0 sm:px-0 lg:px-6'>
          <MaxWidthWrapper className='flex max-w-5xl items-center justify-between gap-4 xl:max-w-7xl'>
            <Link href='/' className='flex items-center text-xl font-semibold'>
              <FullLogo className='h-6 w-full sm:h-8' />
            </Link>

            <div className='flex items-center gap-4'>
              <Link href='/partner-programs' className='text-sm font-normal'>
                Partner Programs
              </Link>
              <Link href='/integrations' className='text-sm font-normal'>
                Integrations
              </Link>
              <Link href='/resources' className='text-sm font-normal'>
                Resources
              </Link>
            </div>

            <div className='flex items-center gap-4'>
              <Link
                href={'/settings/plans'}
                className='hidden items-center justify-center  gap-2  rounded-lg border border-text-20 p-2 text-shark-sm font-bold text-white hover:bg-primary-dark-blue md:flex'
                style={{
                  background:
                    'linear-gradient(101.31deg, #0062F1 0.05%, #00398B 100.05%)'
                }}
              >
                <span className='shrink-0'>
                  <ArrowCircleUp2
                    size='16'
                    color='#fff'
                    className='shrink-0 '
                  />
                </span>
                Upgrade
              </Link>
              <div
                className='relative mr-2'
                onClick={() => setOpenNotifications(true)}
              >
                <Image
                  src={'/icons/notification-bing.svg'}
                  width={25}
                  height={25}
                  alt={'notification'}
                  className={cn('', {
                    'animate-vibrate': isVibrating
                  })}
                />
                {unreadCount > 0 && (
                  <span className='absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-semantic-danger text-shark-xs font-medium text-white'>
                    {unreadCount}
                  </span>
                )}
              </div>
              <AccountPopover />

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant='outline' className=' border-none lg:hidden'>
                    <HambergerMenu size={28} />
                  </Button>
                </SheetTrigger>
                <SheetContent side='right' className='w-[80%] p-0'>
                  <SidebarContent
                    currentOrganization={organization}
                    isCollapsed={false}
                    toggleSidebar={() => console.log(`sidebar`)}
                    isInDialog={true}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </MaxWidthWrapper>
        </header>

        {/* Main container */}
        <div className='mx-auto flex w-full max-w-7xl flex-col px-4 lg:px-6'>
          {/* Heading and Send Enquiry section */}
          <div className='py-6'>
            <Link href={'/explore'} className='flex items-center gap-2'>
              <ArrowLeft size={24} color='#2A3241' />
              <p className='text-[#2C323C]'>Back to Marketplace</p>
            </Link>
            <div className='flex items-center justify-between pt-4'>
              <h3 className='text-shark-xl font-bold lg:text-shark-2xl'>
                Add details for partner enquiry
              </h3>
              <div className='flex items-center gap-6'>
                <button className='hidden h-[37px] w-full gap-1  rounded-none border-b-0 border-l-0 border-r border-t-0 border-[#E4E7EE] bg-transparent px-4 text-shark-sm font-bold lg:block'>
                  <Archive size={22} />
                </button>
                <Button
                  className='h-[37px] rounded-lg bg-primary-light-blue text-shark-sm font-bold text-white'
                  loading={isLoading}
                  onClick={handleSendProposal}
                >
                  Send Enquiry
                </Button>
              </div>
            </div>
          </div>

          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <PartnerDetails receiverOrg={receiverOrg} />
            <CompanyDetails organizationData={organization} />
          </div>

          <div className='mb-8 overflow-hidden rounded-xl bg-[#EDEDED]'>
            <ProposalOptions
              receiverOrg={receiverOrg}
              setExpectations={setExpectations}
              setOffers={setOffers}
              senderOrg={organization}
              token={token}
              isDialogOpen={false}
              setIsDialogOpen={function (
                value: React.SetStateAction<boolean>
              ): void {
                throw new Error('Function not implemented.')
              }}
            />

            <div className='mb-4 grid grid-cols-1 px-4 lg:grid-cols-2 lg:px-6'>
              <ProposalPoints
                heading={`Expectation Proposal form ${receiverOrg.name}`}
                groupedOptions={groupedOptions}
                points={expectations}
                handleSelect={handleSelectBenefit}
                selectedOption={selectedOption}
                isBenefit={false}
                setPoints={setExpectations}
                setSelectedOption={setSelectedOption}
              />
              <ProposalPoints
                heading={`Offers Proposal form ${organization.name}`}
                groupedOptions={groupedOptions}
                points={offers}
                handleSelect={handleSelectBenefit}
                selectedOption={selectedOption}
                isBenefit
                setPoints={setOffers}
                setSelectedOption={setSelectedOption}
              />
            </div>

            <ProposalSentDialog
              isOpen={openProposalModal}
              setIsOpen={setOpenProposalModal}
              org={receiverOrg}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default CreateProposal
