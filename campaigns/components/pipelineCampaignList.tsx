import React from 'react'

import { useCampaigns } from '../hooks/useCampaigns'
import CampaignCardSkeleton from './campaign-card-skeleton'
import CampaignPipelineCard from './campaign-pipeline-card'

export const PipelineCampaignList: React.FC = () => {
  const { loading, campaignTriggers } = useCampaigns()

  return (
    <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {loading
        ? [1, 2, 3, 4, 5, 6].map((cur) => <CampaignCardSkeleton key={cur} />)
        : campaignTriggers.map((item, index) => (
            <CampaignPipelineCard item={item} key={index} />
          ))}
    </div>
  )
}
