'use client'

import React, { useEffect, useState } from 'react'
import {
  useGetReferralCampaign,
  usePatchReferralCampaign
} from '@/http-hooks/partner-programs'
import { Calendar, Gift, Link } from 'iconsax-react'
import { Copy, CopyCheck } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import PageHeader from '@/components/shared/page-header'

import PartnerProgramsSidebar from '../../_components/partner-programs-sidebar'
import ProgramSettingsForm from '../../_components/program-settings-form'
import Settings from '../../_components/settings'
import { formatDate } from '../../../direct-deals/_components/myDeals/MainContent'

type Props = {}

const PartnerProgramSettings: React.FC<{ params: { code: string } }> = ({
  params: { code }
}) => {
  const { data: referralData } = useGetReferralCampaign(code) as any
  const [copyLink, setCopyLink] = useState<boolean>(false)
  const mutation = usePatchReferralCampaign()
  const [selectedTab, setSelectedTab] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

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

  const handleTabChange = (newTab: 'ACTIVE' | 'PAUSE' | 'DRAFT') => {
    setSelectedTab(newTab)
    mutation.mutate({ id: referralData?.id, status: newTab }) // Call API to update status
  }

  useEffect(() => {
    if (referralData?.status && !initialized) {
      setSelectedTab(referralData?.status)
      setInitialized(true)
    }
  }, [referralData, initialized])

  return (
    <div className='flex'>
      <PartnerProgramsSidebar />
      <div className='flex w-full flex-col gap-6'>
        <PageHeader
          title={referralData?.programName}
          customTitle={
            <>
              <p className='text-sm text-text-80 '>
                Referral program for early adopters with special incentives and
                rewards
              </p>

              <div className='mt-3 flex flex-wrap items-center gap-4 text-shark-sm text-[#707684]'>
                <div className='flex items-center gap-1'>
                  <Calendar size={16} />
                  <span>
                    Created {formatDate(referralData?.creationTimestamp)}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Gift size={16} />
                  <span>Fixed Rewards</span>
                </div>
                <button
                  onClick={() => handleCopy(referralData?.referralLink)}
                  className='flex items-center gap-1 '
                >
                  <Link size={16} />
                  <span className='text-[#3E50F7]'>
                    {referralData?.referralLink}
                  </span>
                  {copyLink ? <CopyCheck size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </>
          }
          actionButtons={
            <>
              <Tabs
                value={selectedTab || 'ACTIVE'}
                onValueChange={(val: any) => handleTabChange(val)}
              >
                <TabsList className='border-[#E9EAEB grid h-auto w-full grid-cols-2 gap-1 rounded-lg border bg-[#FAFAFA] p-1 '>
                  <TabsTrigger
                    className='rounded-md bg-transparent px-3 py-2 text-sm font-semibold shadow-sm data-[state=active]:bg-[#83C413] data-[state=active]:text-white '
                    value='ACTIVE'
                  >
                    Running
                  </TabsTrigger>
                  <TabsTrigger
                    className='rounded-md bg-transparent px-3 py-2 text-sm font-semibold shadow-sm data-[state=active]:bg-[#83C413] data-[state=active]:text-white '
                    value='PAUSE'
                  >
                    Pause
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </>
          }
        />
        <Settings referralData={referralData} />
      </div>
    </div>
  )
}

export default PartnerProgramSettings
