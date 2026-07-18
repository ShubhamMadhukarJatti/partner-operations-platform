import React from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useGetAffiliateLink } from '@/http-hooks/deals'

import AdminHeader from '../_components/admin-header'
import CampaignTable from '../_components/CampaignTable'

const EmailCampaigns = () => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <AdminHeader />
      <CampaignTable />
    </div>
  )
}

export default EmailCampaigns
