'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAcceptApplications, useRejectApplication } from '@/http-hooks/deals'
import { getOrganizationById } from '@/services/organizations'
import { Flag, X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import AffiliateLinkBanner from './AffiliateLinkBanner'
import RejectDialogue from './RejectDialogue'

const Container: React.FC<{
  children: React.ReactNode
  className?: string
}> = ({ children, className }) => (
  <div
    className={cn(
      'flex w-full flex-col rounded-xl border border-text-20 p-4',
      className
    )}
  >
    {children}
  </div>
)

export interface applicationType {
  id: number
  dealId: string
  userId: string
  organizationId: number
  status: string
  affiliateCode: string
  organizationName: string
  affiliateLink: string
  testWebhookUrl: string
  prodWebhookUrl: string
}

interface organizationT {
  name: string
  logoUrl: string
  companyType: string
  creationTimestamp: string
  activePartnerships: number
  about: string
}

export const formatDate = (timestamp: string | undefined) => {
  if (!timestamp) return
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const MainContent: React.FC<{
  orgId: number
  data: applicationType[]
  activeApplication: number
  activeTab: string
}> = ({ data, activeApplication, activeTab, orgId }) => {
  const currentApplication = data[Number(activeApplication)]
  const [openDialogue, setOpenDialogue] = useState<boolean>(false)
  const { mutate: acceptApplication, isPending } = useAcceptApplications()
  const { mutate: rejectApplication, isPending: isRejectPending } =
    useRejectApplication()
  const applicationId = currentApplication?.id
  const [organization, setOrganization] = useState<organizationT | null>(null)

  console.log(currentApplication)

  const handleAcceptApplication = () => {
    if (applicationId) acceptApplication(applicationId)
  }

  const handleRejectApplication = (applicationId: number) => {
    if (applicationId) rejectApplication(applicationId)
  }

  useEffect(() => {
    const fetchOrganization = async () => {
      const orgData = await getOrganizationById(orgId)
      setOrganization(orgData)
    }

    if (currentApplication && currentApplication.id) {
      fetchOrganization()
    }
  }, [orgId])

  return (
    <>
      {!(data.length && organization) ? (
        <div className='h-full'></div>
      ) : (
        <>
          <RejectDialogue
            isOpen={openDialogue}
            setIsOpen={setOpenDialogue}
            handleRejectApplication={handleRejectApplication}
            id={applicationId}
          />
          {activeTab === 'APPROVED' && (
            <AffiliateLinkBanner
              affiliateLink={currentApplication?.affiliateLink}
            />
          )}
          <Container className={'h-full gap-4'}>
            <>
              <div className='flex w-full grow justify-between'>
                <div className='flex gap-4'>
                  <Image
                    src={organization?.logoUrl}
                    alt='company logo'
                    width={45}
                    height={45}
                    className='aspect-square overflow-hidden rounded-lg'
                  />

                  <div className='flex flex-col gap-1'>
                    <p className='text-shark-lg font-bold text-text-100'>
                      {organization?.name}
                    </p>
                    <Badge className='shrink rounded-[4px] bg-[#E5EFFE] px-2 py-[2px] text-shark-xs  text-text-100 hover:bg-[#E5EFFE]'>
                      {organization?.companyType}
                    </Badge>
                  </div>
                </div>
                {activeTab === 'PENDING' && (
                  <div className='flex gap-4'>
                    <Button onClick={() => handleAcceptApplication()}>
                      Accept Application
                    </Button>
                    <Button
                      onClick={() => setOpenDialogue(true)}
                      className='border border-destructive bg-white text-destructive hover:bg-destructive hover:text-white'
                      variant={'destructive'}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {activeTab === 'REJECTED' && (
                  <Badge className='max-h-6 self-center bg-[#FFEBEB] text-shark-xs text-destructive'>
                    <X size={16} /> Rejected
                  </Badge>
                )}
              </div>
              <p className='mb-2 flex gap-0.5'>
                <span>
                  <Flag
                    size={16}
                    className='text-shark-xs font-normal text-text-80'
                  />
                </span>
                <span className='text-shark-xs font-normal text-text-80'>
                  Member since:
                </span>{' '}
                <span className='text-shark-xs font-bold'>
                  {formatDate(organization?.creationTimestamp)}
                </span>
              </p>
            </>
          </Container>
          <Container className={'gap-3'}>
            <p className='text-shark-base font-bold'>About</p>
            <p className='text-shark-sm font-normal text-text-70'>
              {organization?.about}
            </p>
          </Container>

          <Container>
            <p className='text-shark-base font-bold text-text-100'>
              More Details
            </p>
            <div className='mt-3 grid grid-cols-4'>
              <div className='flex flex-col gap-1'>
                <p className='text-shark-xs text-text-60'>
                  Active Partnerships
                </p>
                <p className='text-shark-xs font-bold text-text-100'>
                  {organization?.activePartnerships}
                </p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-shark-xs text-text-60'>Founded On</p>
                <p className='text-shark-xs font-bold text-text-100'>{}</p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-shark-xs text-text-60'>POC</p>
                <p className='text-shark-xs font-bold text-text-100'></p>
              </div>
              <div className='flex flex-col gap-1'>
                <p className='text-shark-xs text-text-60'>Bussines profile</p>
                <Link href={'/explore'} className='text-shark-xs font-bold'>
                  View on marketplace
                </Link>
              </div>
            </div>
          </Container>
          <Container className={'min-h-[398px]'}>
            <p className='text-shark-base font-bold text-text-100'>
              Customer persona match
            </p>
          </Container>
        </>
      )}
    </>
  )
}

export default MainContent
