import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Call,
  Copy,
  Export,
  Global,
  Location,
  Profile,
  Send,
  Sms
} from 'iconsax-react'

import { fetchMailboxClaimStatus } from '@/lib/db/email-outreach'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'
import {
  EditIcon,
  EmailIocn,
  RightArrow,
  RightEnvelopIcon
} from '@/components/icons/icons'

import DashboardItemWrapper from '../../dashboard/[id]/_components/dashboard-item-wrapper'
import EmailComposer, {
  EmailData
} from '../../outreach-email/components/EmailComposer'
import InviteBenefits from './InviteBenefits'

type Props = {
  data: any
}

const OfflineOrgInfo = ({ data }: Props) => {
  const [openInviteBenefits, setOpenInviteBenefits] = useState(false)
  const [showEmailComposer, setShowEmailComposer] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)

  // Fetch mailbox claim status
  useEffect(() => {
    const loadClaimStatus = async () => {
      const { isClaimed } = await fetchMailboxClaimStatus()
      setIsClaimed(isClaimed)
    }
    loadClaimStatus()
  }, [])

  const handleSendEmail = async (emailData: EmailData) => {
    try {
      // Use different endpoint based on whether it's an external partner
      const endpoint = emailData.externalPartnerCode
        ? '/api/email/outreach/message/send/external/partner'
        : '/api/email/outreach/message/send'

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      const result = await response.json()
      console.log('Email sent successfully:', result)
      // You can add a success notification here
    } catch (error) {
      console.error('Error sending email:', error)
      throw error
    }
  }

  const renderVerification = () => {
    if (data?.verified) {
      return (
        <div className='m-4 flex items-center justify-start gap-2 rounded-xl bg-green-100 p-2'>
          <Image
            src={'/tick-verify.svg'}
            alt='tick verify'
            height={24}
            width={24}
          />{' '}
          <span className='text-sm font-bold text-text-100'>
            Partner verified
          </span>
        </div>
      )
    }

    if (data?.verifyEmailSent) {
      return (
        <div className='m-4 flex flex-col gap-2.5 rounded-xl bg-neutral-100 p-4'>
          <span className='text-sm font-bold text-text-100'>
            Verification email sent
          </span>

          <p className='text-xs text-text-90'>
            We will inform once email has been opened and when partner has
            verified.
          </p>
        </div>
      )
    }

    return (
      <div className='m-4 flex flex-col gap-2.5 rounded-xl bg-red-100/80 p-4'>
        <div className=' flex h-5 w-5 items-center justify-center rounded-full border-2 border-red-500'>
          <span className='text-sm font-bold text-red-500'>!</span>
        </div>
        <span className='text-sm font-bold text-text-100'>Verify partner</span>

        <p className='text-xs text-text-90'>
          Send an email to partner. Once partner accepts the invite, they will
          be verified.
        </p>

        <Button variant='primary' className='w-fit rounded-lg p-2 text-xs'>
          Send verification email
        </Button>
      </div>
    )
  }

  return (
    <div>
      <DashboardItemWrapper className=''>
        <aside className='h-full w-[288px] md:w-[300px] md:max-w-[300px]'>
          {/* Company/Contact Header Section */}
          <div className='flex flex-col items-center gap-2 border-b border-text-20 px-4 py-3 pb-2'>
            <Image
              src={
                data?.logoUrl ||
                'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png'
              }
              width={70}
              height={70}
              alt='name'
              className='object-cover'
            />

            <h2 className='text-shark-lg font-bold text-text-100 '>
              {data?.name}
            </h2>

            <div className='flex items-center gap-2'>
              <div className='flex items-center gap-1 rounded-full border border-green-400 bg-green-100 px-3 py-1'>
                <div className='h-2 w-2 rounded-full  bg-green-500'></div>
                <span className='text-xs font-medium text-green-700'>
                  On Sharkdom
                </span>
              </div>
            </div>

            <Link href={`/company/${data?.code || '#'}`} target='_blank'>
              <Button
                variant={'link'}
                className='h-4 gap-1 text-xs font-medium text-primary-light-blue'
              >
                Show in sharkdom
                <RightArrow />
              </Button>
            </Link>
          </div>

          {/* Primary Information Section */}
          <div className='flex flex-col gap-4 border-b border-text-20 px-4 py-3'>
            <div className='flex items-center justify-between'>
              <span className='fds-text-semibold text-text-100'>
                Primary Information
              </span>
              <button className='text-text-60 hover:text-text-100'>
                <EditIcon />
              </button>
            </div>

            <div className='flex flex-col gap-3'>
              <div className='flex items-center gap-1'>
                <Profile size='20' color='#7688A8' />
                <span className='fds-text-sm text-text-100'>
                  {data?.contactName || 'N.A'}
                </span>
              </div>

              {data?.contactTitle && (
                <div className='ml-6'>
                  <span className='text-shark-xs text-text-60'>
                    {data.contactTitle}
                  </span>
                </div>
              )}

              <div className='flex items-center gap-1'>
                <Sms size='20' color='#7688A8' />
                <span className='fds-text text-primary-light-blue'>
                  {data?.email || 'N.A'}
                </span>
                <button
                  className='border-none bg-transparent outline-none'
                  onClick={() => {
                    if (data?.email) {
                      navigator.clipboard.writeText(data.email)
                      // showCustomToast('Success', 'Copied', 'success', 5000)
                    }
                  }}
                >
                  <Copy size='20' color='#7688A8' />
                </button>
              </div>

              {data?.phone && (
                <div className='flex items-center gap-1'>
                  <Call size='20' color='#7688A8' />
                  <span className='fds-text text-primary-light-blue'>
                    {data.phone}
                  </span>
                  <button
                    className='border-none bg-transparent outline-none'
                    onClick={() => {
                      navigator.clipboard.writeText(data.phone)
                      // showCustomToast('Success', 'Copied', 'success', 5000)
                    }}
                  >
                    <Copy size='20' color='#7688A8' />
                  </button>
                </div>
              )}

              {data?.website && (
                <div className='flex items-center gap-1'>
                  <Global size='20' color='#7688A8' />
                  <Link href={data.website} target='_blank'>
                    <span className='fds-text text-primary-light-blue'>
                      {data.website}
                    </span>
                  </Link>
                </div>
              )}

              {data?.location && (
                <div className='flex items-center gap-1'>
                  <Location size='20' color='#7688A8' />
                  <span className='fds-text capitalize text-text-100'>
                    {data.location}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className='flex flex-col gap-4 border-b border-text-20 px-4 py-3'>
            <span className='fds-text-semibold text-text-100'>
              Quick Actions
            </span>

            <div className='flex flex-col gap-3'>
              {isClaimed && (
                <Button
                  variant='primary'
                  className='flex gap-2'
                  onClick={() => setShowEmailComposer(true)}
                >
                  <EmailIocn color={'#fff'} />
                  Compose an email
                </Button>
              )}

              <Button
                variant='primary'
                className='flex gap-2'
                onClick={() => setOpenInviteBenefits(true)}
              >
                <RightEnvelopIcon color={'#ffffff'} />
                Invite {data?.name} to Sharkdom
              </Button>

              {/* <Link href={`/explore/${data?.id}`} target='_blank'>
                <Button
                  variant='outline'
                  className='hover:bg-primary-blue/5 flex items-center gap-2 border-primary-blue text-primary-blue'
                >
                  <RightArrow />
                  View in the Discover Section
                </Button>
              </Link> */}
            </div>
          </div>

          {/* Tags Section */}
          <div className='flex flex-col gap-4 px-4 py-3'>
            <span className='fds-text-semibold text-text-100'>Tags</span>

            <div className='flex flex-wrap gap-2'>
              {data?.tags?.map((tag: string, index: number) => (
                <span
                  key={index}
                  className='rounded-full bg-primary-blue px-3 py-1 text-xs font-medium text-white'
                >
                  {tag}
                </span>
              )) || (
                <>
                  <span className='rounded-full  border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                    B2B
                  </span>
                  <span className='rounded-full  border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                    Fintech
                  </span>
                  <span className='rounded-full border border-blue-400 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600'>
                    India
                  </span>
                </>
              )}
            </div>

            {data?.matchPercentage && (
              <div className='mt-2'>
                <span className='rounded-full  border border-green-400 bg-green-50 px-3 py-1 text-xs font-medium text-green-600'>
                  {data.matchPercentage}% Match
                </span>
              </div>
            )}
          </div>

          {/* {renderVerification()} */}
        </aside>
        {openInviteBenefits && (
          <InviteBenefits
            open={openInviteBenefits}
            setOpen={setOpenInviteBenefits}
            partnerName={data?.name}
            partnerEmail={data?.email}
          />
        )}
      </DashboardItemWrapper>

      {/* Email Composer Modal */}
      {showEmailComposer && (
        <EmailComposer
          isModal={true}
          onClose={() => setShowEmailComposer(false)}
          onSend={handleSendEmail}
          selectedOrgId={data?.id}
          selectedOrgName={data?.name}
        />
      )}
    </div>
  )
}

export default OfflineOrgInfo
