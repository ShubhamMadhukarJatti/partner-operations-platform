'use client'

import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Heading } from '@/components/ui/heading'

import ContentSection from './_components/content-section'
import CreateDealDrawer from './_components/CreateDealDrawer'
import DirectDealsTabs from './_components/Tabs'

const DirectDealsPage = () => {
  const [activeTab, setActivetab] = React.useState<string>('openDeals')
  const [openDrawer, setOpenDrawer] = useState<boolean>(false)

  const handleTabChange = (tab: string) => {
    setActivetab(tab)
  }

  const handleOpenDrawer = () => {
    setOpenDrawer(true)
  }

  return (
    <>
      <CreateDealDrawer open={openDrawer} setOpen={setOpenDrawer} />
      <div>
        <div className='border-b border-text-20 pt-4'>
          <div className='flex w-full items-center justify-between pr-4'>
            <Heading
              title='Direct Deals'
              description='Create your partnership deals and explore deals based on your business needs'
            />
            <Button onClick={() => setOpenDrawer(true)} className='p-3'>
              Create Deal
            </Button>
          </div>
          <DirectDealsTabs
            activeTab={activeTab}
            handleTabChange={handleTabChange}
          />
        </div>

        <section>
          <ContentSection
            activeTab={activeTab}
            handleOpenDrawer={handleOpenDrawer}
          />
        </section>
      </div>
    </>
  )
}

export default DirectDealsPage
