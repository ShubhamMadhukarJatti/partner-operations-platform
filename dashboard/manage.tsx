'use client'

import { useState } from 'react'
import { CollaborationType, OrganizationType } from '@/types'
import { BadgeCheck } from 'lucide-react'

import { acceptProposal, rejectProposal } from '@/lib/actions/collaboration'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showCustomToast } from '@/components/custom-toast'
import { ImageFallback } from '@/components/shared/image-with-fallback'
import { KYB } from '@/app/(app)/(dashboard-pages)/_components/kyb'
import { StatusIndication } from '@/app/(app)/(dashboard-pages)/_components/status-indicator'
import { SignMou } from '@/app/(app)/(dashboard-pages)/dashboard/sign-mou'

type Props = {
  currentOrganization: OrganizationType
  partnerOrganization: OrganizationType
  proposal: CollaborationType
  type: 'sent' | 'recieved'
}

export const ManagePartnership = ({
  currentOrganization,
  partnerOrganization,
  proposal,
  type
}: Props) => {
  const { name, briefDescription, code, website, verified } =
    partnerOrganization
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
    <div className='flex flex-col gap-2'>
      <div className='flex items-center justify-between'>
        <ImageFallback
          src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${partnerOrganization.id}`}
          width={100}
          height={100}
          alt={name}
          className='size-16 rounded-full border'
        />
        <StatusIndication status={proposal.status} />
      </div>
      <div>
        <h2 className='flex items-center text-2xl font-medium'>
          {name}
          {verified && <BadgeCheck className='ml-2 inline-flex' size={20} />}
        </h2>
        {/* {website && (
          <a href={website} className='text-muted-foreground' target='_blank'>
            {new URL(website).hostname}{' '}
            <ArrowUpRightFromSquare size={16} className='inline-flex' />
          </a>
        )} */}
      </div>
      <p className='line-clamp-3 text-base text-muted-foreground'>
        {briefDescription}
      </p>
      <h2 className='text-lg font-medium tracking-wide'>Proposal Details</h2>
      <Tabs defaultValue='Offers' className=''>
        <TabsList className='mb-2 gap-2 bg-card p-0'>
          <TabsTrigger
            value='Offers'
            className='rounded-lg border border-primary text-primary data-[state=active]:bg-primary data-[state=active]:text-white '
          >
            Offers
          </TabsTrigger>
          <TabsTrigger
            value='Expectations'
            className='rounded-lg border border-primary text-primary data-[state=active]:bg-primary data-[state=active]:text-white '
          >
            Expectations
          </TabsTrigger>
        </TabsList>
        <TabsContent value='Offers' className='mt-0 flex w-full flex-col gap-4'>
          <div className='flex w-full items-center gap-2'>
            <ImageFallback
              src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${proposal.senderOrganizationId}`}
              alt=''
              width={100}
              height={100}
              className='h-16 w-16 rounded-full border bg-white object-cover p-1 shadow-md'
            />
            <div className='relative inline-flex w-full flex-1 items-center justify-center'>
              <hr className='my-8 h-0.5 w-full bg-border' />
              <span className='absolute left-1/2 -translate-x-1/2 bg-card px-3 font-medium text-card-foreground'>
                to
              </span>
            </div>
            <ImageFallback
              src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${proposal.receiverOrganizationId}`}
              alt=''
              width={100}
              height={100}
              className='h-16 w-16 rounded-full border bg-white object-cover p-1 shadow-md'
            />
          </div>
          <div className='flex flex-col gap-2'>
            {proposal.partnershipMouVersions.length > 0 &&
              proposal.partnershipMouVersions[
                proposal.partnershipMouVersions.length - 1
              ].senderBenefits.map((offer) => {
                return (
                  <div className='space-y-2' key={offer.id}>
                    <div className='flex flex-col gap-2'>
                      <h3 className='font-medium'>{`${offer.benefit}`}</h3>
                      <p className='indent-2 text-muted-foreground'>
                        {offer.description}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </TabsContent>
        <TabsContent
          value='Expectations'
          className='mt-0 flex w-full flex-col gap-4'
        >
          <div className='flex w-full items-center gap-2'>
            <ImageFallback
              src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${proposal.receiverOrganizationId}`}
              alt=''
              width={100}
              height={100}
              className='h-16 w-16 rounded-full border bg-white object-cover p-1 shadow-md'
            />
            <div className='relative inline-flex w-full flex-1 items-center justify-center'>
              <hr className='my-8 h-0.5 w-full bg-border' />
              <span className='absolute left-1/2 -translate-x-1/2 bg-card px-3 font-medium text-card-foreground'>
                to
              </span>
            </div>
            <ImageFallback
              src={`${process.env.NEXT_PUBLIC_S3_URL}/logos/${proposal.senderOrganizationId}`}
              alt=''
              width={100}
              height={100}
              className='h-16 w-16 rounded-full border bg-white object-cover p-1 shadow-md'
            />
          </div>
          <div className='flex flex-col gap-2'>
            {proposal.partnershipMouVersions.length > 0 &&
              proposal.partnershipMouVersions[
                proposal.partnershipMouVersions.length - 1
              ].receiverBenefits.map((offer) => {
                return (
                  <div className='space-y-2' key={offer.id}>
                    <div className='flex flex-col gap-2'>
                      <h3 className='font-medium'>{`${offer.benefit}`}</h3>
                      <p className='indent-2 text-muted-foreground'>
                        {offer.description}
                      </p>
                    </div>
                  </div>
                )
              })}
          </div>
        </TabsContent>
      </Tabs>
      {proposal.status === 'PENDING' && type === 'recieved' && (
        <div className='flex gap-2'>
          <Button
            className='flex-1 border-destructive text-destructive transition duration-300 hover:bg-destructive hover:text-destructive-foreground'
            size='sm'
            variant='outline'
            onClick={handleReject}
            loading={rejecting}
          >
            Reject
          </Button>
          <Button
            className='flex-1'
            size='sm'
            onClick={handleAccept}
            loading={accepting}
          >
            Accept
          </Button>
        </div>
      )}
      {proposal.status === 'ACTIVE' && currentOrganization.verified && (
        <SignMou
          currentOrganization={currentOrganization}
          partnerOrganization={partnerOrganization}
          proposal={proposal}
          type={type}
        />
      )}

      {proposal.status === 'ACTIVE' && !currentOrganization.verified && (
        <KYB organizationId={currentOrganization.id} />
      )}
    </div>
  )
}
