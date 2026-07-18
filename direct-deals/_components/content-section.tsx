'use client'

import React, { useState } from 'react'
import { useGetDeals } from '@/http-hooks/deals'

import { Search } from '@/components/ui/search'

import MyDealsContent from './MyDealsContent'
import OpenDealsContent from './OpenDealsContent'
import PayoutsContent from './PayoutsContent'

const ContentSection: React.FC<{
  activeTab: string
  handleOpenDrawer: () => void
}> = ({ activeTab, handleOpenDrawer }) => {
  const [sectorsCommaSeparated, setSectorsCommaSeparated] = useState<string>('')

  return (
    <div className='p-4'>
      {activeTab === 'openDeals' && (
        <OpenDealsContent
          key='openDeals'
          sectorsCommaSeparated={sectorsCommaSeparated}
          setSectorsCommaSeparated={setSectorsCommaSeparated}
          handleCreateDeal={handleOpenDrawer}
        />
      )}
      {activeTab === 'myDeals' && (
        <MyDealsContent handleCreateDeal={handleOpenDrawer} key='myDeals' />
      )}
      {activeTab === 'payout-earning' && <PayoutsContent />}
    </div>
  )
}

export default ContentSection
