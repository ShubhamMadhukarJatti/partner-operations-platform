'use client'

import React from 'react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface DirectDealsTabsProps {
  activeTab: string
  handleTabChange: (e: string) => void
}

interface DirectDealsTabDataType {
  id: string
  label: string
}
const DirectDealsTabs: React.FC<DirectDealsTabsProps> = ({
  activeTab,
  handleTabChange
}) => {
  // const [activeTab, setActiveTab] = React.useState<string>('open')

  const directDealsTabData: DirectDealsTabDataType[] = [
    {
      id: 'openDeals',
      label: 'Open Deals'
    },
    {
      id: 'myDeals',
      label: 'My Deals'
    },
    {
      id: 'payout-earning',
      label: 'My payouts/earnings'
    }
  ]

  return (
    <div className=' mt-5 w-full  '>
      <div className='mb-4 flex items-center justify-between'>
        <Tabs
          defaultValue='openDeals'
          value={activeTab}
          onValueChange={(value) => handleTabChange(value)}
          className='w-full'
        >
          <div className='flex items-center justify-between px-4'>
            <TabsList className=' h-[44px] items-center gap-4 bg-background '>
              {directDealsTabData.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className='rounded-lg border border-text-30 p-3 text-shark-base font-medium text-text-100 data-[state=active]:bg-[#10366F] data-[state=active]:text-primary-foreground'
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* {directDealsTabData.map((tab) => (
            <TabsContent className='mt-0' key={tab.id} value={tab.id}>
              {tab.label}
            </TabsContent>
          ))} */}
        </Tabs>
      </div>
    </div>
  )
}

export default DirectDealsTabs
