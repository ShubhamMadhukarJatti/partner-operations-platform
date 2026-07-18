'use client'

import React from 'react'

import PageHeader from '@/components/shared/page-header'

import ReferralAnalytics from '../_components/analytics'
import GraphTabs from '../_components/GraphTabs'
import PartnerProgramsSidebar from '../_components/partner-programs-sidebar'

const AnalyticsPage = () => {
  return (
    <div>
      <PartnerProgramsSidebar />
      <div className='w-full'>
        <PageHeader
          title={'Referral Analytics'}
          customTitle={
            <>
              <p className='text-sm text-text-80 '>
                Referral program for early adopters with special incentives and
                rewards
              </p>
            </>
          }
          actionButtons={
            <>
              <GraphTabs />
            </>
          }
        />
      </div>
      <ReferralAnalytics />
    </div>
  )
}

export default AnalyticsPage
