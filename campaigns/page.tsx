'use client'

import React from 'react'

import { CampaignList } from './components/campaignList'
import { PipelineCampaignList } from './components/pipelineCampaignList'

export default function Campaigns() {
  return (
    <div className='h-full overflow-hidden p-4'>
      <div>
        <h1 className='text-2xl font-semibold text-[0F172A]'>Email Campaign</h1>
        <p className='mb-4 mt-1 text-shark-sm text-text-80'>
          Some pre-built triggers to get your started with
        </p>
      </div>
      <CampaignList />
      <div className='mb-4 mt-20'>
        <h2 className='text-2xl font-semibold text-[0F172A]'>
          Campaign Pipeline
        </h2>
      </div>
      <PipelineCampaignList />
    </div>
  )
}
