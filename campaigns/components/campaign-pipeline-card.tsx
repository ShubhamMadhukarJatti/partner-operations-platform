import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'iconsax-react'

import { Badge } from '@/components/ui/badge'

import { CampaignPipelineI } from '../interfaces'
import { getBadgeColorFromStatus, getCtaTitle } from './campaign-card'

const CampaignPipelineCard: React.FC<{ item: CampaignPipelineI }> = ({
  item
}) => {
  const router = useRouter()
  return (
    <div className='h-134 ml-0 cursor-pointer rounded-xl border border-[#E4E7EE] p-3 shadow-sm'>
      <Badge
        className='rounded-full border bg-white text-[10px] font-bold hover:bg-white'
        style={{
          borderColor: getBadgeColorFromStatus(item.status),
          color: getBadgeColorFromStatus(item.status)
        }}
      >
        <div
          className='mr-1 h-[10px] w-[10px] rounded-full'
          style={{
            backgroundColor: getBadgeColorFromStatus(item.status)
          }}
        />
        {item.status}
      </Badge>
      <p className='mt-2 text-xs font-medium text-[#2A3241]'>created on</p>
      <h2 className='mt-2 text-base font-bold text-[#2A3241]'>
        {item.campaignName}
      </h2>
      <button
        onClick={() => router.push('/campaigns/' + item.id)}
        className='mt-4 flex w-32 transform transition-all duration-300 ease-in-out hover:scale-105'
      >
        <p className='mr-2 text-xs text-[#0062F1]'>
          {getCtaTitle(item.status)}
        </p>
        <ArrowRight size={16} color='#0062F1' />
      </button>
    </div>
  )
}

export default CampaignPipelineCard
