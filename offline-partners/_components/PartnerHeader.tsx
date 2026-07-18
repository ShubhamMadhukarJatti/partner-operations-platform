import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RootState } from '@/redux/store'
import { IconBrandTelegram } from '@tabler/icons-react'
import { ExternalLink } from 'lucide-react'
import { useSelector } from 'react-redux'

import { fetchMailboxClaimStatus } from '@/lib/db/email-outreach'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'
import { RightArrow } from '@/components/icons/icons'

import EmailComposer, {
  EmailData
} from '../../outreach-email/components/EmailComposer'
import ComposeEmailModal from './ComposeEmailModal'
import InviteBenefits from './InviteBenefits'

type Props = {
  data: any
  inDummyFlow?: boolean
}

const PartnerHeader = ({ data, inDummyFlow = false }: Props) => {
  const handleDummyAction = () => {
    showCustomToast(
      'Info',
      'No edit access for this dummy account',
      'info',
      5000
    )
  }
  const [openInviteBenefits, setOpenInviteBenefits] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [showComposeEmailModal, setShowComposeEmailModal] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)
  const { organization: currentOrganization } = useSelector(
    (state: RootState) => state.currentOrg
  )

  // Mock mailbox claim status for dummy flow (no API call)
  useEffect(() => {
    setIsClaimed(true) // Always show as claimed in demo mode
  }, [])

  const handleSendEmail = async (emailData: EmailData) => {
    // Dummy flow - simulate email sending without making API calls
    try {
      console.log('Email sent successfully (Demo Mode):', emailData)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error sending email (Demo Mode):', error)
      throw error
    }
  }

  return (
    <>
      <div className='flex flex-col gap-4 rounded-2xl py-2 md:flex-row md:items-center md:justify-between md:py-4'>
        {/* Left side - Logo, Name, and Status */}
        <div className='flex items-center gap-4'>
          {/* Logo with 8px border */}
          <div className='rounded-lg border-8 border-gray-100'>
            <Image
              src={
                data?.logoUrl ||
                'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
              }
              width={50}
              height={50}
              alt={data?.name || 'Partner'}
              className='h-[50px] w-[50px] rounded-lg object-cover'
            />
          </div>

          {/* Name and Status */}
          <div className='flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <h2 className='text-lg font-bold text-text-100 md:text-xl'>
                {data?.name}
              </h2>

              {/* Show in Sharkdom link */}
              <Link href={`/company/${data?.code || '#'}`} target='_blank'>
                <Button
                  variant='link'
                  className='h-auto gap-1 p-0 text-xs font-medium text-primary-blue'
                >
                  <ExternalLink size={12} />
                </Button>
              </Link>
            </div>

            {/* On Sharkdom tag */}
            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 rounded-full border border-green-400 bg-green-100 px-3 py-1'>
                <div className='h-2 w-2 rounded-full  bg-green-500'></div>
                <span className='text-xs font-medium text-green-700'>
                  On Sharkdom
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Action Buttons */}
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3'>
          <Button
            variant='primary'
            className='gap-2 text-white'
            onClick={() => {
              if (inDummyFlow) {
                handleDummyAction()
                return
              }
              setOpenInviteBenefits(true)
            }}
          >
            <IconBrandTelegram size={22} className='text-white' />
            Invite to Sharkdom
          </Button>

          {/* {isClaimed && ( */}
          <Button
            variant='primary'
            className='gap-2'
            onClick={() => {
              if (inDummyFlow) {
                handleDummyAction()
                return
              }
              setShowComposeEmailModal(true)
            }}
          >
            <IconBrandTelegram size={22} className='text-white' />
            Compose an email
          </Button>
          {/* )} */}
        </div>
      </div>

      {/* Modals */}
      {openInviteBenefits && (
        <InviteBenefits
          open={openInviteBenefits}
          setOpen={setOpenInviteBenefits}
          partnerName={data?.name}
          partnerEmail={data?.email}
        />
      )}

      {showEmailComposer && (
        <EmailComposer
          isModal={true}
          onClose={() => setShowEmailComposer(false)}
          onSend={handleSendEmail}
          selectedOrgId={data?.id}
          selectedOrgName={data?.name}
        />
      )}

      {showComposeEmailModal && (
        <ComposeEmailModal
          open={showComposeEmailModal}
          onClose={() => setShowComposeEmailModal(false)}
          recipientName={data?.name}
          recipientEmail={data?.email}
          partnerDetails={data}
          currentOrganization={currentOrganization}
          inDummyFlow={inDummyFlow}
        />
      )}
    </>
  )
}

export default PartnerHeader
