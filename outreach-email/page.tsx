'use client'

import { useEffect, useState } from 'react'

import { fetchMailboxClaimStatus } from '@/lib/db/email-outreach'
import { getCurrentOrganization } from '@/lib/db/organization'
import PageHeader from '@/components/shared/page-header'

import EmailPage from './components/EmailPage'
import StatsDashboard from './components/StatisticsTable'

const Page = () => {
  const [selectedTab, setSelectedTab] = useState('statistics')

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isClaimed, setIsClaimed] = useState<boolean>(false)
  const [org, setOrg] = useState<any | null>(null)

  const pageTabs = [
    {
      label: `Statistics`,
      value: 'statistics'
      //   tooltipText: 'Track your partnership enquiries here'
    },
    {
      label: `Emails`,
      value: 'emails'
      //   tooltipText: 'Categorize your partners and assign activities based on it'
    }
  ]

  useEffect(() => {
    const loadClaimStatus = async () => {
      const [{ isClaimed }, org] = await Promise.all([
        fetchMailboxClaimStatus(),
        getCurrentOrganization()
      ])
      setIsClaimed(isClaimed)
      setOrg(org)
      setIsLoading(false)
    }

    loadClaimStatus()
  }, [])

  return (
    <div className='flex flex-col'>
      <PageHeader
        title=''
        description='Send more proposals and keep track of any terms update from your partners.'
        tabs={pageTabs}
        onTabChange={(value) => setSelectedTab(value)}
        // toolTip={true}
      />
      <div className='bg-[#F0F2F2] '>
        {selectedTab == 'statistics' && (
          <div>
            <StatsDashboard
              isClaimed={isClaimed}
              isLoading={isLoading}
              org={org}
            />
          </div>
        )}
        {selectedTab == 'emails' && (
          <div>
            <EmailPage isClaimed={isClaimed} isLoading={isLoading} org={org} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Page
