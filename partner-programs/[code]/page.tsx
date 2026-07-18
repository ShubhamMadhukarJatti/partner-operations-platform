'use client'

import React, { useState } from 'react'
import { useGetReferralCampaign } from '@/http-hooks/partner-programs'
import { Calendar, Copy, CopyCheck, Gift, Link } from 'lucide-react'

import { Button } from '@/components/ui/button'
import PageHeader from '@/components/shared/page-header'
import RoundedTitleCard from '@/components/shared/rounded-title-card'

import ReferralAnalytics from '../_components/analytics'
import MetricCard from '../_components/metric-card'
import PartnerProgramsSidebar from '../_components/partner-programs-sidebar'
import ProgramPartners from '../_components/program-partners'
import { formatDate } from '../../direct-deals/_components/myDeals/MainContent'

type Props = {}

const ReferralProgramDetails: React.FC<{ params: { code: string } }> = ({
  params: { code }
}) => {
  const { data } = useGetReferralCampaign(code) as any
  const [copyLink, setCopyLink] = useState(false)

  const handleCopy = async (link: string) => {
    const textToCopy = link
    if (textToCopy) {
      await navigator.clipboard.writeText(textToCopy)
      setCopyLink(true)
      setTimeout(() => setCopyLink(false), 2000)
    }

    // setCopied(true)
    // setTimeout(() => setCopied(false), 2000)
  }
  // console.log({ data })
  return (
    <div className='flex'>
      <PartnerProgramsSidebar />
      <div className='w-full'>
        <PageHeader
          title={data?.programName}
          customTitle={
            <>
              <p className='text-sm text-text-80 '>
                Referral program for early adopters with special incentives and
                rewards
              </p>

              <div className='mt-3 flex flex-wrap items-center gap-4 text-shark-sm text-[#707684]'>
                <div className='flex items-center gap-1'>
                  <Calendar size={16} />
                  <span>Created {formatDate(data?.creationTimestamp)}</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Gift size={16} />
                  <span>Fixed Rewards</span>
                </div>
                <button
                  onClick={() => handleCopy(data?.referralLink)}
                  className='flex items-center gap-1 '
                >
                  <Link size={16} />
                  <span className='text-[#3E50F7]'>{data?.referralLink}</span>
                  {copyLink ? <CopyCheck size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </>
          }
        />
        {/* <div className='space-y-6 p-6'>
          <RoundedTitleCard
            className='bg-[#F8FBFF]'
            title='Performance Overview'
          >
            <div className='flex items-center gap-2 p-4'>
              <MetricCard title={'Active Partners'} value={'24'} />
              <MetricCard title={'Total Leads'} value={data?.leadsCount ?? '0'} />

              <MetricCard title={'Conversion Rate'} value={data?.commissionPercentage ?? '0'} />

              <MetricCard title={'Revenue Generated'} value={'24'} />
            </div>
          </RoundedTitleCard>
          <ProgramPartners />
        </div> */}
        <ReferralAnalytics />
      </div>
    </div>
  )
}

export default ReferralProgramDetails
