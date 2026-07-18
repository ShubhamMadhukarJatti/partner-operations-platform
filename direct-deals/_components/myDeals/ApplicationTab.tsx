'use client'

import React from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ApplicationTabsProps {
  activeTab: string
  handleTabChange: (e: string) => void
}

interface ApplicationTabDataType {
  id: 'PENDING' | 'APPROVED' | 'REJECTED'
  label: string
}
const ApplicationTabs: React.FC<ApplicationTabsProps> = ({
  activeTab,
  handleTabChange
}) => {
  // const [activeTab, setActiveTab] = React.useState<string>('open')

  const directDealsTabData: ApplicationTabDataType[] = [
    {
      id: 'PENDING',
      label: 'New Applicants'
    },
    {
      id: 'APPROVED',
      label: 'Accepted Applicants'
    },
    {
      id: 'REJECTED',
      label: 'Rejected Applicants'
    }
  ]

  return (
    <div className='w-full  '>
      <div className='flex items-center justify-between'>
        <Tabs
          defaultValue={activeTab}
          value={activeTab}
          onValueChange={(value) => handleTabChange(value)}
          className='w-full'
        >
          <div className='flex items-center justify-between'>
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

export default ApplicationTabs
