'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import RoundedTitleCard from '@/components/shared/rounded-title-card'

import {
  notSetStyle,
  openOpportunityStyle,
  prospectsStyle,
  qualifiedLeadStyle
} from './LeadsTable'
import ReferralAddPartner from './referral-add-parnter'
import ViewCodeDialog from './ViewCodeDialog'

interface CampaignDetail {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationId: number
  referralCode: string
  urlRef: string | null
  emailRef: string | null
  status: 'DRAFT' | 'ACTIVE' | string
  referralLink: string
  partnerOrganizationName: string | null
  domain: string | null
  partnerId: string | null
  emailVerified: boolean
  domainVerified: boolean
  programName: string
  commission: boolean
  commissionPercentage: number | null
  minimumThreshold: number | null
  commissionType: string | null
  impressionCount: number
  leadsCount: number
  description: string | null
}

export function ReferralProgramsList({
  data,
  activeTab,
  setActiveTab
}: {
  data: CampaignDetail[]
  activeTab: 'created' | 'joined'
  setActiveTab: React.Dispatch<React.SetStateAction<'created' | 'joined'>>
}) {
  const router = useRouter()
  return (
    <RoundedTitleCard
      className='flex-1 rounded-lg border border-[#E9EAEB]'
      title={'Referrals Programs'}
      action={
        <>
          <Tabs
            onValueChange={(val: any) => setActiveTab(val)}
            defaultValue='created'
            className=''
          >
            <TabsList className='grid w-full grid-cols-2 rounded-lg border border-border bg-white'>
              <TabsTrigger
                className='rounded-lg data-[state=active]:bg-primary-blue data-[state=active]:text-shark-sm data-[state=active]:text-white '
                value='created'
              >
                Created
              </TabsTrigger>
              <TabsTrigger
                className='rounded-lg data-[state=active]:bg-primary-blue data-[state=active]:text-shark-sm data-[state=active]:text-white '
                value='joined'
              >
                Joined
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </>
      }
    >
      {data?.map((program, index) => (
        <div
          key={program.id}
          className={cn('p-6', {
            'border-b border-[#E9EAEB]': index !== data.length - 1
          })}
        >
          <div className='mb-2 flex items-start justify-between'>
            <div>
              <div className='mb-1 flex items-center gap-3'>
                <h2 className='fds-text-lead-semibold text-[#181D27]'>
                  {program.programName}
                </h2>
                <Badge
                  variant='outline'
                  className='border-[#ABEFC6] bg-[#ECFDF3] text-shark-sm font-medium text-[#067647]'
                  style={
                    program.status === 'ACTIVE'
                      ? openOpportunityStyle
                      : program.status === 'PAUSE'
                        ? notSetStyle
                        : program.status === 'DRAFT'
                          ? prospectsStyle
                          : notSetStyle
                  }
                >
                  {program.status}
                </Badge>
              </div>
              <p className='text-shark-sm text-[#535862]'>
                {program.description}
              </p>
            </div>
            <div className='flex gap-2'>
              {program.partnerId ? (
                <Button
                  onClick={() =>
                    router.push(`/partner-programs/${program.referralCode}`)
                  }
                  variant='link'
                  className='fds-text-sm text-primary-blue'
                  size='sm'
                >
                  View Details
                </Button>
              ) : (
                <ReferralAddPartner
                  campaignId={String(program.id)}
                  programName={program.programName}
                  description={program.description ?? ''}
                  referralCode={program.referralCode}
                  referralLink={program.referralLink}
                  buttonVariant='link'
                />
              )}

              {activeTab === 'created' && (
                <ViewCodeDialog referralCode={program.referralCode} />
              )}
              {activeTab === 'created' && (
                <Button
                  variant='link'
                  className='fds-text-sm text-[#25224A]'
                  size='sm'
                  onClick={() =>
                    router.push(
                      `/partner-programs/${program.referralCode}/edit`
                    )
                  }
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className='mt-6 flex items-center  gap-6'>
            <div>
              <p className='mb-1 text-shark-sm font-medium text-[#92A0B9]'>
                Partners
              </p>
              <p className='fds-text-semibold text-[#181D27]'>1</p>
            </div>
            <div>
              <p className='mb-1 text-shark-sm font-medium text-[#92A0B9]'>
                Conversions
              </p>
              <p className='fds-text-semibold text-[#181D27]'>
                {/* {program.conversions} */} -
              </p>
            </div>
            {/* <div>
              <p className='mb-1 text-shark-sm font-medium text-[#92A0B9]'>
                Reward Model
              </p>
              <p className='fds-text-semibold text-[#181D27]'>
                {program.rewardModel}
              </p>
            </div> */}
            {/* <div>
              <p className='mb-1 text-shark-sm font-medium text-[#92A0B9]'>
                Referral Link
              </p>
              <p className='fds-text-semibold text-[#181D27]'>
                {program.referralLink}
              </p>
            </div> */}
          </div>
        </div>
      ))}
    </RoundedTitleCard>
  )
}
