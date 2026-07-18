import React from 'react'

import { Badge } from '@/components/ui/badge'

import { CampaignStatus, ITemplateData } from '../interfaces'
import { DialogueButton } from './dialogueButton'

export const getCtaTitle = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.Active:
    case CampaignStatus.Archived:
      return 'Edit'
    case CampaignStatus.Draft:
      return 'Finish Setup'
    default:
      return 'Start Setup'
  }
}

export const getBadgeColorFromStatus = (status: CampaignStatus) => {
  switch (status) {
    case CampaignStatus.Active:
      return '#83C413'
    case CampaignStatus.Draft:
      return '#FCAA3F'
    case CampaignStatus.Archived:
      return '#FC362F'
    default:
      return '#7688A8'
  }
}

const CampaignCard: React.FC<{ item: ITemplateData }> = ({ item }) => {
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
      <p className='mt-2 text-xs font-medium text-[#2A3241]'>{item.since}</p>
      <h2 className='mt-2 text-base font-bold text-[#2A3241]'>{item.title}</h2>
      <DialogueButton title={getCtaTitle(item.status)} templateData={item} />
    </div>
  )
}

export default CampaignCard
