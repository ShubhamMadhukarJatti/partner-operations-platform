'use client'

import React, { useEffect, useState } from 'react'
import {
  useJoinedPartnerPrograms,
  usePartnerPrograms
} from '@/http-hooks/partner-programs'

import { ScrollArea } from '@/components/ui/scroll-area'
import PageHeader from '@/components/shared/page-header'

import MetricCard from '../_components/metric-card'
import NewReferralProgram from '../_components/new-referral-program-modal'
import PartnerProgramsSidebar from '../_components/partner-programs-sidebar'
import { ReferralProgramsList } from '../_components/partnerprogram-list'

// Define the data structure based on the provided JSON
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

interface PartnerProgramsData {
  campaignDetails: CampaignDetail[]
  leadsChange: number | null
  partnerChange: number | null
  leadsCount: number
  partnerCount: number
}

const PartnerProgramHome = () => {
  const [activeTab, setActiveTab] = useState<'created' | 'joined'>('created')
  const { data: createdProgram, isLoading: createdProgramLoading } =
    usePartnerPrograms() as unknown as {
      data: PartnerProgramsData
      isLoading: boolean
    }
  const { data: joinedProgram, isLoading: joinedProgramLoading } =
    useJoinedPartnerPrograms() as unknown as {
      data: PartnerProgramsData
      isLoading: boolean
    }

  // Check if there are any campaign details
  const hasCampaigns =
    (createdProgram?.campaignDetails || joinedProgram?.campaignDetails) &&
    (createdProgram?.campaignDetails.length > 0 ||
      joinedProgram?.campaignDetails.length > 0)

  const tabContent = activeTab === 'created' ? createdProgram : joinedProgram

  return (
    <div className='flex h-full'>
      <PartnerProgramsSidebar />
      <ScrollArea className='h-full w-full'>
        <PageHeader
          title='Partner Programs'
          // description='Add subtext about partner programs'
          actionButtons={<NewReferralProgram />}
        />

        <div className='flex flex-col-reverse items-start gap-5 p-6 lg:flex-row'>
          {/* Pass the campaign details correctly to the list component */}
          <ReferralProgramsList
            data={tabContent?.campaignDetails ?? []}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <div className='grid grid-cols-2 gap-5'>
            <MetricCard
              title={'Active Partners'}
              value={createdProgram?.partnerCount}
              change={createdProgram?.partnerChange}
            />
            <MetricCard
              title={'Total Leads'}
              value={createdProgram?.leadsCount}
              change={createdProgram?.leadsChange}
            />
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

export default PartnerProgramHome
