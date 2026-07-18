'use client'

import React from 'react'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { applicationType } from './MainContent'

interface ApplicationTabsProps {
  activeTab: number
  handleTabChange: (e: number) => void
  data: applicationType[]
}

const ApplicantsList: React.FC<ApplicationTabsProps> = ({
  activeTab,
  handleTabChange,
  data
}) => {
  // const [activeTab, setActiveTab] = React.useState<string>('open')
  console.log(data)

  return (
    <div className='w-full'>
      <div className='mb-4'>
        <Tabs
          orientation='vertical'
          defaultValue={activeTab.toString()}
          value={activeTab.toString()}
          onValueChange={(value) => handleTabChange(Number(value))}
          className='flex h-full w-full'
        >
          <div className='h-full grow'>
            <TabsList className=' flex h-full flex-col bg-background'>
              {data?.map((data, index) => (
                <>
                  <TabsTrigger
                    key={data.id}
                    value={index.toString()}
                    className='h-auto w-full items-start justify-start rounded-lg p-3 text-shark-base font-medium text-text-90 data-[state=active]:bg-[#DEE8FF] data-[state=active]:text-primary-blue'
                  >
                    Applicants {index + 1}
                  </TabsTrigger>
                </>
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

export default ApplicantsList
