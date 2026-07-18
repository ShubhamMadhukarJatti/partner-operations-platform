import React from 'react'

import { campaignListData } from '../campaignData'
import { useEmailDomainRecords } from '../hooks/useGetEmailDomainRecords'
import { ITemplateData } from '../interfaces'
import CampaignCard from './campaign-card'
import CampaignCardSkeleton from './campaign-card-skeleton'
import SetupEmailCard from './setup-email-card'

export const CampaignList: React.FC = () => {
  const {
    domain,
    loading: isEmailDomainRecordsLoading,
    isVerified
  } = useEmailDomainRecords()

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {isEmailDomainRecordsLoading ? null : (
        <SetupEmailCard
          domain={domain}
          isEmailDomainRecordsLoading={isEmailDomainRecordsLoading}
          isVerified={isVerified}
        />
      )}
      {isEmailDomainRecordsLoading
        ? [1, 2, 3, 4, 5, 6].map((cur) => <CampaignCardSkeleton key={cur} />)
        : campaignListData.map((item: ITemplateData, index) => (
            <CampaignCard key={index} item={item} />
          ))}
    </div>
  )
}
