'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useGetApplications } from '@/http-hooks/deals'
import { X } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerClose, DrawerContent } from '@/components/ui/drawer'

import ApplicantsList from './applicantsList'
import ApplicationTabs from './ApplicationTab'
import MainContent from './MainContent'
import RejectDialogue from './RejectDialogue'

interface ApplicationsDrawerProps {
  open: boolean
  setOpen: (e: boolean) => void
  dealId: string
}

interface ApplicationData {
  id: number
  dealId: string
  userId: string
  organizationId: number
  status: string
  affiliateCode: string
  organizationName: string
  affiliateLink: string
  testWebhookUrl: string
  prodWebhookUrl: string
}

const ApplicationsDrawer: React.FC<ApplicationsDrawerProps> = ({
  open,
  setOpen,
  dealId
}) => {
  const [activeTab, setActiveTab] = React.useState<string>('PENDING')

  const handleTabChange = (newtab: string) => {
    setActiveTab(newtab)
    setActiveApplication(0)
  }

  const { data } = useGetApplications(dealId, activeTab) as {
    data: ApplicationData[] | null
  }
  const [activeApplication, setActiveApplication] = useState<number>(0)
  const handleActiveApplicationTabChange = (applicationId: number) => {
    setActiveApplication(applicationId)
  }

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className='max-w-[85%] p-0'>
          <div className='block h-full'>
            <div className='flex items-center justify-between border-b border-l-0 border-r-0 border-t-0 border-[#E4E7EE] px-6 py-3'>
              <p className='text-shark-base font-semibold sm:text-xl'>
                Applications received for deal
              </p>
              <div className='flex sm:gap-4'>
                <DrawerClose asChild>
                  <Button
                    variant='link'
                    onClick={() => {
                      setOpen(false)
                    }}
                  >
                    <X size={24} color='#2A3241' />
                  </Button>
                </DrawerClose>
              </div>
            </div>

            <div className='border-b border-text-20 px-4 py-3'>
              <ApplicationTabs
                activeTab={activeTab}
                handleTabChange={handleTabChange}
              />
            </div>

            {/* main content  */}
            <div className='flex h-full'>
              <aside className='relative w-[180px] max-w-[180px] border-r border-[#EAECF0] p-3'>
                <>
                  {data && (
                    <ApplicantsList
                      activeTab={activeApplication}
                      handleTabChange={handleActiveApplicationTabChange}
                      data={data ?? []}
                    />
                  )}
                </>
              </aside>

              <main className='flex h-full grow flex-col gap-2.5 border-l border-[#EAECF0] p-4'>
                {data && Array.isArray(data) ? (
                  <MainContent
                    orgId={data[activeApplication]?.organizationId}
                    activeTab={activeTab}
                    activeApplication={activeApplication}
                    data={data ?? []}
                  />
                ) : (
                  <></>
                )}
              </main>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default ApplicationsDrawer
