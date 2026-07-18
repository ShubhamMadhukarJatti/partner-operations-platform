'use client'

import { useState } from 'react'
import Link from 'next/link'
import { OrganizationType } from '@/types'
import { ArrowLeft, Clock } from 'lucide-react'
import moment from 'moment'

import { acceptProposal, rejectProposal } from '@/lib/actions/collaboration'
import { Button } from '@/components/ui/button'
import { showCustomToast } from '@/components/custom-toast'
import { ImageFallback } from '@/components/shared/image-with-fallback'

import { StatusIndication } from '../_components/status-indicator'
import { AskClarification } from '../inbox/_components/ask-clarification'
import EditProposal from './edit-proposal'

interface ProposalPropsType {
  senderOrg: OrganizationType
  receiverOrg: OrganizationType
  proposal: any
  type: 'sent' | 'recieved'
  userId: string
  token: string
  currentOrganization: OrganizationType
  playgroundOptions: { option: string; hint: string; category: string }[]
}

const Proposal = ({
  senderOrg,
  receiverOrg,
  proposal,
  type,
  token,
  userId,
  currentOrganization,
  playgroundOptions
}: ProposalPropsType) => {
  const [rejecting, setRejecting] = useState(false)
  const [accepting, setAccepting] = useState(false)
  const handleReject = async () => {
    try {
      setRejecting(true)

      await rejectProposal(proposal.id)
      showCustomToast('Rejected', 'Proposal rejected', 'error', 5000)
    } catch (e: any) {
      showCustomToast('Error', 'Error rejecting proposal', 'error', 5000)
    } finally {
      setRejecting(false)
    }
  }
  const handleAccept = async () => {
    try {
      setAccepting(true)
      await acceptProposal({
        recieverOrgId: proposal.receiverOrganizationId,
        senderOrgId: proposal.senderOrganizationId
      })
      showCustomToast('Success', 'Proposal Accepted', 'success', 5000)
    } catch (e: any) {
      showCustomToast('Error', 'Error accepting proposal', 'error', 5000)
    } finally {
      setAccepting(false)
    }
  }

  return (
    <section className='w-full p-4'>
      <div className=''>
        <Link href={'/dashboard'}>
          <Button variant={'link'} className='px-0 font-medium text-primary'>
            <ArrowLeft className='h-5 w-6' />
            Back to dashbaord
          </Button>
        </Link>
      </div>

      <div className='flex items-center justify-between border-b border-border py-6'>
        <div>
          <span className=' font-medium text-muted-foreground'>
            {' '}
            In house proposal
          </span>
          <h3 className=' leading-1  text-2xl font-light'>
            {senderOrg.name} x {receiverOrg.name}
          </h3>
        </div>
        <div className='flex flex-col items-end '>
          <StatusIndication status={proposal.status} />
          <span className='mt-2 inline-flex gap-2   text-muted-foreground'>
            <Clock className='h-6 w-6' />{' '}
            <span className='capitalize'>{type}</span>
            {moment(proposal.lastUpdatedTimestamp).fromNow()}
          </span>
        </div>
      </div>

      <div className='flex items-center justify-between border-b border-border py-6'>
        <div className='flex flex-col gap-3 '>
          <span className=' font-medium text-muted-foreground'>
            {' '}
            Offer from
          </span>
          <div className='flex items-center gap-2'>
            <ImageFallback
              src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${senderOrg.id}`}
              width={200}
              height={200}
              alt={''}
              className='size-12 rounded-full'
            />

            <h3 className='flex items-center text-xl font-medium'>
              {senderOrg.name}
            </h3>
            <Link href={`/company/${senderOrg.code}`}>
              <Button
                variant={'link'}
                className='ml-2 px-0 font-medium text-primary'
              >
                View Profile
              </Button>
            </Link>
          </div>
          {proposal.partnershipMouVersions.length > 0 &&
            proposal.partnershipMouVersions[
              proposal.partnershipMouVersions.length - 1
            ].receiverBenefits.map((offer: any) => {
              return (
                <span
                  key={offer.benefit}
                  className='mt-2 inline-flex max-w-sm gap-2 text-muted-foreground'
                >
                  {offer.benefit}
                </span>
              )
            })}
        </div>
        <div className='flex flex-col items-end gap-3 '>
          <span className=' font-medium text-muted-foreground'>
            {' '}
            Expectation from
          </span>
          <div className='flex items-center gap-2'>
            <Link href={`/company/${receiverOrg.code}`}>
              <Button
                variant={'link'}
                className='mr-2 px-0 font-medium text-primary'
              >
                View Profile
              </Button>
            </Link>
            <ImageFallback
              src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${receiverOrg.id}`}
              width={200}
              height={200}
              alt={''}
              className='size-12 rounded-full'
            />

            <h3 className='flex items-center text-xl font-medium'>
              {receiverOrg.name}
            </h3>
          </div>
          {proposal.partnershipMouVersions.length > 0 &&
            proposal.partnershipMouVersions[
              proposal.partnershipMouVersions.length - 1
            ].senderBenefits.map((offer: any) => {
              return (
                <span
                  key={offer.benefit}
                  className='mt-2 inline-flex max-w-sm gap-2  text-right  text-muted-foreground'
                >
                  {offer.benefit}
                </span>
              )
            })}
        </div>
      </div>

      <div className='mt-6'>
        <p className='font-medium'>Expectation from {receiverOrg.name}</p>
        <div className='mt-4 space-y-2'>
          {proposal.partnershipMouVersions.length > 0 &&
            proposal.partnershipMouVersions[
              proposal.partnershipMouVersions.length - 1
            ].senderBenefits.map((offer: any) => {
              return (
                <div className='flex flex-col gap-0' key={offer.id}>
                  <h6 className='font-medium'>{offer.benefit}</h6>
                  <p className='indent-2 text-sm text-muted-foreground'>
                    {offer.description}
                  </p>
                  <AskClarification
                    offer={offer}
                    senderOrg={senderOrg}
                    receiverOrg={receiverOrg}
                    proposal={proposal}
                    type={'SENDER_BENEFITS'}
                    currentOrganization={currentOrganization}
                  />
                </div>
              )
            })}
        </div>
      </div>

      <div className='mt-6 border-b py-6'>
        <p className='font-medium'>Offers from {senderOrg.name}</p>
        <div className='mt-4 space-y-2'>
          {proposal.partnershipMouVersions.length > 0 &&
            proposal.partnershipMouVersions[
              proposal.partnershipMouVersions.length - 1
            ].receiverBenefits.map((offer: any) => {
              return (
                <div className='flex flex-col gap-0' key={offer.id}>
                  <h6 className='font-medium'>{offer.benefit}</h6>
                  <p className='indent-2 text-sm text-muted-foreground'>
                    {offer.description}
                  </p>
                  <AskClarification
                    offer={offer}
                    senderOrg={senderOrg}
                    receiverOrg={receiverOrg}
                    proposal={proposal}
                    type={'RECEIVER_BENEFITS'}
                    currentOrganization={currentOrganization}
                  />
                </div>
              )
            })}
        </div>
      </div>

      <div className='my-6 mt-8'>
        {proposal.status === 'PENDING' && type === 'recieved' && (
          <div className='flex max-w-4xl'>
            <Button
              className='flex-1 border-primary text-primary transition duration-300 hover:bg-primary hover:text-primary-foreground'
              size='sm'
              variant='outline'
              onClick={handleReject}
              loading={rejecting}
            >
              Reject proposal
            </Button>
            <Button
              className='flex-1'
              size='sm'
              onClick={handleAccept}
              loading={accepting}
            >
              Accept proposal
            </Button>
          </div>
        )}

        {proposal.status === 'PENDING' && type === 'sent' && (
          <div className='flex gap-6 p-2'>
            <Link href={'/dashboard'} className='w-full'>
              <Button className='w-full rounded-full' variant='outline'>
                Cancel Proposal
              </Button>
            </Link>

            <EditProposal
              recieverOrg={receiverOrg}
              userId={userId}
              token={token}
              senderOrg={currentOrganization}
              options={playgroundOptions}
              status={null}
              credits={{
                organziationId: 0,
                aiProposalCredits: 0,
                playgroundCredits: 0,
                collaborationAccepted: 0,
                collaborationSent: 0
              }}
            />
            {/* <Button className='w-full rounded-full border bg-[#0062F1]  font-semibold'>
              Edit and Re-send proposal
            </Button> */}
          </div>
        )}
        {/* {proposal.status === 'ACTIVE' && currentOrganization.verified && (
        <SignMou
          currentOrganization={currentOrganization}
          partnerOrganization={partnerOrganization}
          proposal={proposal}
          type={type}
        />
      )}

      {proposal.status === 'ACTIVE' && !currentOrganization.verified && (
        <KYB organizationId={currentOrganization.id} />
      )} */}
      </div>
    </section>
  )
}

export default Proposal
