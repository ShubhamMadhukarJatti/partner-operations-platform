'use client'

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { useSearchParams } from 'next/navigation'
import {
  filterTableRowsByTab,
  partnerTableDataToTableRows,
  useOfflinePartnersData,
  usePartnerTableByOrg
} from '@/http-hooks/offline-partners'
import { useQuery } from '@tanstack/react-query'

import { isDummyFlow } from '@/lib/dummy-flow'
import { getServerUser } from '@/lib/server'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import {
  DownloadIcon,
  GroupIcon,
  TootipIcon,
  WorldCode
} from '@/components/icons/icons'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import ExplorePartnersModal from './_components/ExplorePartnersModal'
import InvitePartnerDrawer from './_components/InvitePartnerDrawer'
import OfflinePartnersDataBanner from './_components/OfflinePartnersDataBanner'
import OfflinePartnersInitialBanner from './_components/OfflinePartnersInitialBanner'
import OfflinePartnersTable from './_components/OfflinePartnersTable'
import { DUMMY_PARTNERS_DATA, OFFLINE_PARTNERS_TABS } from './constants'

const OfflinePartnersPageContent = () => {
  const [open, setOpen] = useState(false)
  const [exploreModalOpen, setExploreModalOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState('ALL')
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({})

  const searchParams = useSearchParams()
  const [shouldHighlight, setShouldHighlight] = useState(false)
  const importButtonRef = useRef<HTMLButtonElement>(null)
  const hasHighlighted = useRef(false)

  useEffect(() => {
    if (hasHighlighted.current) return

    if (searchParams.get('import') === 'true') {
      hasHighlighted.current = true
      setShouldHighlight(true)

      const scrollTimer = setTimeout(() => {
        if (importButtonRef.current) {
          importButtonRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          })
          importButtonRef.current.focus()
        }
      }, 300)

      const highlightTimer = setTimeout(() => {
        setShouldHighlight(false)
      }, 4000)

      return () => {
        clearTimeout(scrollTimer)
        clearTimeout(highlightTimer)
      }
    }
  }, [searchParams])

  const handleDownloadTemplate = useCallback(() => {
    const link = document.createElement('a')
    link.href = '/csv-files/Sharkdom_External_Partner_format.csv'
    link.download = 'Sharkdom_External_Partner_format.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  // Helper function to filter dummy data by tab value (same logic as OfflinePartnersTable)
  const getFilteredDummyData = useCallback((tabValue: string) => {
    if (tabValue === 'ALL') return DUMMY_PARTNERS_DATA

    return DUMMY_PARTNERS_DATA.filter((dummyRow) => {
      const status = dummyRow.rowDetails.find(
        (detail) => detail.id === 'partnerStatus'
      )?.value

      switch (tabValue) {
        case 'INVITE_SENT':
          return status === 'INVITE_SENT' || status === 'SENT'
        case 'VERIFIED':
          return status === 'VERIFIED'
        case 'ONBOARDED':
          return status === 'ONBOARDED'
        case 'INVITE_NOT_SENT':
          return status === 'INVITE_NOT_SENT' || status === 'UNINVITED'
        default:
          return true
      }
    })
  }, [])

  const inDummyFlow = useMemo(() => isDummyFlow(), [])

  // Single source of truth for non-dummy flow: table API (same as OfflinePartnersTable)
  const { data: tableData, isPending: isTableLoading } = usePartnerTableByOrg({
    enabled: !inDummyFlow
  })

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { user } = await getServerUser()
      return user
    }
  })
  console.log('user', user)

  // Calculate dummy data counts for each tab (used only in dummy flow)
  const dummyCounts = useMemo(
    () => ({
      ALL: getFilteredDummyData('ALL').length,
      INVITE_SENT: getFilteredDummyData('INVITE_SENT').length,
      VERIFIED: getFilteredDummyData('VERIFIED').length,
      ONBOARDED: getFilteredDummyData('ONBOARDED').length,
      INVITE_NOT_SENT: getFilteredDummyData('INVITE_NOT_SENT').length
    }),
    [getFilteredDummyData]
  )

  // Tab counts: from table API when not dummy (matches table), from dummy data when dummy
  const calculatedTabCounts = useMemo(() => {
    if (inDummyFlow) {
      return {
        ALL: dummyCounts.ALL,
        INVITE_SENT: dummyCounts.INVITE_SENT,
        VERIFIED: dummyCounts.VERIFIED,
        ONBOARDED: dummyCounts.ONBOARDED,
        INVITE_NOT_SENT: dummyCounts.INVITE_NOT_SENT
      }
    }

    if (tableData?.data?.rows?.length) {
      const allRows = partnerTableDataToTableRows(tableData.data)
      return {
        ALL: filterTableRowsByTab(allRows, 'ALL').length,
        INVITE_SENT: filterTableRowsByTab(allRows, 'INVITE_SENT').length,
        VERIFIED: filterTableRowsByTab(allRows, 'VERIFIED').length,
        ONBOARDED: filterTableRowsByTab(allRows, 'ONBOARDED').length,
        INVITE_NOT_SENT: filterTableRowsByTab(allRows, 'INVITE_NOT_SENT').length
      }
    }

    return {
      ALL: 0,
      INVITE_SENT: 0,
      VERIFIED: 0,
      ONBOARDED: 0,
      INVITE_NOT_SENT: 0
    }
  }, [inDummyFlow, tableData?.data, dummyCounts])

  // Update tab counts when calculated counts change
  useEffect(() => {
    setTabCounts(calculatedTabCounts)
  }, [calculatedTabCounts])

  // Legacy/dummy: useOfflinePartnersData. Table uses same source via useOfflinePartnersTable.
  const { data, isPending: isPartnersLoading } =
    useOfflinePartnersData(currentTab)

  // Loading: use table API state when not dummy (matches table), else legacy/dummy state
  const isLoading = inDummyFlow ? isPartnersLoading : isTableLoading

  // Banner: show data banner when we have real partners (table API when not dummy, else legacy/dummy)
  const hasRealData = inDummyFlow
    ? Boolean(data?.length)
    : Boolean(tableData?.data?.rows?.length)

  const changeTab = useCallback((tabValue: string) => {
    setCurrentTab(tabValue)
  }, [])

  const offlinePartnersTabs = useMemo(
    () =>
      OFFLINE_PARTNERS_TABS.map((tab) => ({
        ...tab,
        count: tabCounts[tab.value] || 0,
        tooltipText:
          tab.value === 'ALL'
            ? 'Name of the external partners as in column of the imported data'
            : tab.value === 'VERIFIED'
              ? 'Partners whose authenticity has been verified'
              : undefined,
        tabContent: <OfflinePartnersTable tabValue={tab.value} />
      })),
    [tabCounts]
  )

  return (
    <GradientPageBackground className='flex min-h-[calc(100vh-64px)] flex-col'>
      <div className='w-full border-b bg-white px-4 dark:border-border dark:bg-transparent lg:px-8'>
        <div className='flex items-center justify-between py-3'>
          <h1 className='text-xl font-bold text-text-100 dark:text-foreground'>
            <div className='flex items-center gap-4'>
              External Partners
              <div className='flex items-end'>
                <Tooltip>
                  <TooltipTrigger>
                    <TootipIcon />
                  </TooltipTrigger>
                  <TooltipContent side='bottom'>
                    Your existings partnerships before jumping to sharkdom
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </h1>
          <div className='flex gap-2'>
            <Button
              variant='primary'
              className='flex items-center gap-2'
              onClick={handleDownloadTemplate}
            >
              <DownloadIcon color='white' size={18} />
            </Button>
            <Button
              ref={importButtonRef}
              variant='primary'
              onClick={() => setOpen(true)}
              className={cn(
                'flex items-center gap-2 transition-all duration-300',
                shouldHighlight &&
                  'scale-105 animate-pulse shadow-[0_0_25px_rgba(104,99,251,0.8)] ring-[6px] ring-[#6863FB]/40'
              )}
            >
              <GroupIcon color='white' size={18} />
              Import partners
            </Button>
            <ExplorePartnersModal
              open={exploreModalOpen}
              onOpenChange={setExploreModalOpen}
            >
              <Button variant='primary' className='flex items-center gap-2'>
                <WorldCode size={18} />
                Explore partners
              </Button>
            </ExplorePartnersModal>
          </div>
        </div>
      </div>

      {/* Banner Section */}
      <div className='m-4'>
        {hasRealData ? (
          <OfflinePartnersDataBanner
            onExplore={() => setExploreModalOpen(true)}
          />
        ) : (
          <OfflinePartnersInitialBanner
            onExploreOpportunity={() => setExploreModalOpen(true)}
            onImportPartners={() => setOpen(true)}
            buttonRef={importButtonRef}
            shouldHighlight={shouldHighlight}
          />
        )}
      </div>

      <div className='w-full'>
        <div
          className='m-4 rounded-lg border border-[#DEE2E6] dark:border-[#252666]'
          style={{ backgroundColor: 'var(--colors-background-card)' }}
        >
          <Tabs
            value={currentTab}
            onValueChange={(value) => {
              changeTab(value)
            }}
            defaultValue={offlinePartnersTabs[0]?.value}
            className='overflow-y-hidden'
          >
            <TabsList className='flex items-start justify-start overflow-y-hidden rounded-none border-b bg-white px-5 dark:border-border dark:bg-transparent'>
              {offlinePartnersTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className='relative rounded-lg px-2 text-sm font-semibold text-text-100 hover:bg-text-20 data-[state=active]:text-primary-blue data-[state=active]:shadow-none dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-foreground dark:data-[state=active]:text-indigo-400 lg:px-4'
                >
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className='ml-1'>({tab.count})</span>
                  )}
                  {tab.tooltipText && (
                    <div className='flex pl-1'>
                      <Tooltip>
                        <TooltipTrigger>
                          <TootipIcon />
                        </TooltipTrigger>
                        <TooltipContent
                          side='top'
                          className='max-w-[220px] whitespace-normal break-words text-sm font-normal leading-snug'
                        >
                          {tab.tooltipText}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                  {currentTab === tab.value && (
                    <hr className='absolute -bottom-1 left-0 h-[4px] w-full rounded-full bg-black dark:bg-indigo-400'></hr>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
            {offlinePartnersTabs.map((tab) => (
              <TabsContent key={tab.value} value={tab.value}>
                {isLoading ? (
                  <div className='flex h-[80vh] items-center justify-center bg-[#F9F9F9] dark:bg-transparent sm:h-[70vh] md:h-[75vh]'>
                    <div className='flex flex-col items-center gap-2'>
                      <div className='h-10 w-10 animate-spin rounded-full border-4 border-t-transparent dark:border-indigo-400 dark:border-t-transparent' />
                      <div className='text-sm text-gray-600 dark:text-gray-300'>
                        Loading partners…
                      </div>
                    </div>
                  </div>
                ) : (
                  tab.tabContent
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      {open && (
        <InvitePartnerDrawer
          isOpen={open}
          onOpenChange={(value) => setOpen(value)}
        />
      )}
    </GradientPageBackground>
  )
}

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className='flex h-[80vh] items-center justify-center bg-[#F9F9F9] dark:bg-transparent sm:h-[70vh] md:h-[75vh]'>
          <div className='flex flex-col items-center gap-2'>
            <div className='h-10 w-10 animate-spin rounded-full border-4 border-t-transparent dark:border-indigo-400 dark:border-t-transparent' />
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              Loading...
            </div>
          </div>
        </div>
      }
    >
      <OfflinePartnersPageContent />
    </Suspense>
  )
}

export default Page
