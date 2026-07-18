'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useOfflinePartnerDetailsByCode } from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { useUIStore } from '@/store/uiStore'
import { useQueryClient } from '@tanstack/react-query'
import { ArrowLeft } from 'iconsax-react'
import { useSelector } from 'react-redux'

import {
  getCurrentOrganization,
  PatchIntegrationData,
  Postintegrationdata
} from '@/lib/db/organization'
import { isDummyFlow } from '@/lib/dummy-flow'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { showCustomToast } from '@/components/custom-toast'
import PageHeader from '@/components/shared/page-header'

import Tasks from '../_components/Tasks'
import AIPartnerPulse from '../../_components/AIPartnerPulse'
import AnalyticsTable from '../../_components/AnalyticsTable'
import ComposeEmail from '../../_components/ComposeEmail'
import CustomerPersonaComparison from '../../_components/CustomerPersonaComparison'
import DealsTable from '../../_components/DealsTable'
import MailboxSetup from '../../_components/MailBoxSetup'
import OfflinePartnerDocuments from '../../_components/OfflinePartnerDocuments'
import PartnerHeader from '../../_components/PartnerHeader'
import PartnerSidebar from '../../_components/PartnerSidebar'
import AnalyticsContainer from '../../../explore/[id]/_components/AnalyticsContainer'
import { DUMMY_PARTNERS_DATA } from '../../constants'

const navTabs = [
  // {
  //   name: 'Analytics',
  //   value: 'analytics'
  // },
  {
    name: 'Overview',
    value: 'overview'
  },
  {
    name: 'Documents',
    value: 'documents'
  },
  {
    name: 'Tasks',
    value: 'tasks'
  },
  {
    name: 'AI Partner Pulse',
    value: 'ai-partner-pulse'
  },
  {
    name: 'Deals',
    value: 'deals'
  }
  // {
  //   name: 'Email',
  //   value: 'email'
  // },
  // {
  //   name: 'Compare customer persona',
  //   value: 'customer-persona'
  // }
]

// Inner component that uses useSearchParams
const OfflinePartnershipPageInner = ({
  params
}: {
  params: { id: string }
}) => {
  const [tab, setTab] = useState('overview')
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const saved = useSelector((state: RootState) => state.currentOrg)

  const { organization } = saved

  // Check if we're in dummy flow (handles both string and number IDs)
  const inDummyFlow = isDummyFlow(params.id)

  // The URL now contains the external partner code directly (e.g., "cFRwsfJu")
  // No need to fetch the table or do lookups - just use the code from the URL
  const externalPartnerCode = useMemo(() => {
    // In dummy flow, params.id might be "dummy-1", "dummy-2", etc.
    if (inDummyFlow) return ''
    // Otherwise, params.id is the external partner code
    return params.id
  }, [params.id, inDummyFlow])

  // Fetch partner details using the external partner code
  const { data: fullPartnerData, isLoading: isLoadingFullData } =
    useOfflinePartnerDetailsByCode(externalPartnerCode)

  // Use the full partner data from code-based API
  const apiData = fullPartnerData
  const apiLoading = isLoadingFullData

  // Get dummy partner data from constants based on ID
  const dummyPartnerData = useMemo(() => {
    return DUMMY_PARTNERS_DATA.find((dummy) => dummy.id === params.id)
  }, [params.id])

  // Mock data for dummy flow - dynamic based on which dummy partner
  const mockPartnerData = useMemo(() => {
    const partnerName =
      dummyPartnerData?.rowDetails.find((d) => d.id === 'partnerName')?.value ||
      'TechCorp Solutions'
    const partnerEmail =
      dummyPartnerData?.rowDetails.find((d) => d.id === 'partnerEmail')
        ?.value || 'contact@techcorp.com'
    const partnerGroup =
      dummyPartnerData?.rowDetails.find((d) => d.id === 'partnerGroup')
        ?.value || 'RELIABLE_PARTNER'

    // Generate company name with "Inc." suffix
    const companyName = `${partnerName} Inc.`

    return {
      id: params.id,
      name: companyName,
      email: partnerEmail,
      logoUrl:
        'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png',
      code: partnerName.toUpperCase().replace(/\s+/g, '').substring(0, 10),
      contactName: 'Sarah Johnson',
      contactTitle: 'VP of Partnerships',
      phone: '+1 (555) 123-4567',
      website: `https://${partnerName.toLowerCase().replace(/\s+/g, '')}.com`,
      location: 'San Francisco, CA',
      tags: ['Technology', 'SaaS', 'Enterprise'],
      matchPercentage: 95,
      briefDescription: `Leading provider of enterprise solutions with strong track record in the industry.`,
      sector: 'Technology',
      companyType: 'Private Company',
      partnerOrgId: 12345,
      partnerOrganizationId: 12345,
      organizationCollaborationId: 'collab_123',
      organizationId: organization?.id || 1,
      partnerOrgIds: [12345]
    }
  }, [params.id, dummyPartnerData, organization?.id])

  // Use mock data if in dummy flow, otherwise use API data
  const data = inDummyFlow ? mockPartnerData : apiData
  const isLoading = inDummyFlow ? false : apiLoading

  // Real flow: partner not found (invalid code or 404)
  const partnerNotFound =
    !inDummyFlow && !apiLoading && externalPartnerCode.length > 0 && !apiData

  // Set navigating state on mount to track transitions
  useEffect(() => {
    setIsNavigating(false)
  }, [params.id])

  // Handle Trello OAuth callback (Dummy flow - no API calls)
  const handleTrelloCallback = useCallback(async () => {
    setTimeout(() => {
      showCustomToast(
        'Processing',
        'Processing Trello integration... (Demo Mode)',
        'info',
        5000
      )
    }, 1000)
    const hash = window.location.hash
    const tokenMatch = hash.match(/token=([^&]+)/)

    if (tokenMatch) {
      // Simulate successful integration without API calls
      setTimeout(() => {
        showCustomToast(
          'Success',
          'Trello connected successfully! (Demo Mode)',
          'success',
          5000
        )

        // Clean up URL and switch to tasks tab
        const url = new URL(window.location.href)
        url.searchParams.delete('trello_callback')
        url.hash = ''
        router.replace(url.pathname + url.search)

        // Switch to tasks tab after connection
        setTimeout(() => {
          setTab('tasks')
        }, 500)
      }, 2000)
    } else {
      // No token found, redirect back without trello_callback param
      const url = new URL(window.location.href)
      url.searchParams.delete('trello_callback')
      router.replace(url.pathname + url.search)
    }
  }, [router])

  // Handle OAuth success callbacks
  useEffect(() => {
    const trelloCallback = searchParams.get('trello_callback')
    const error = searchParams.get('error')

    if (error === 'access_denied') {
      showCustomToast('Error', 'Trello access denied', 'error', 5000)
      const url = new URL(window.location.href)
      url.searchParams.delete('error')
      router.replace(url.pathname + url.search)
    } else if (trelloCallback === 'true') {
      handleTrelloCallback()
    }
  }, [searchParams, router, handleTrelloCallback])

  const onTabChange = useCallback((value: string) => {
    setTab(value)
  }, [])

  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  // Memoize tab content to prevent unnecessary re-renders
  const tabContent = useMemo(() => {
    switch (tab) {
      case 'analytics':
      case 'overview':
        return (
          <div className='flex w-full flex-col gap-4'>
            <AnalyticsTable />
          </div>
        )
      // case 'overview':
      //   return (
      //     <div className='flex w-full flex-col gap-4'>
      //       <OfflinePartnerStatus />
      //       <OfflinePartnerRemarks />
      //     </div>
      //   )
      case 'documents':
        return (
          <OfflinePartnerDocuments
            orgName={data?.name}
            currentOrgName={organization?.name}
            organizationId={organization?.id}
            currentEmail={organization?.primaryEmail ?? ''}
            otherEmail={data?.email ?? ''}
            inDummyFlow={inDummyFlow}
          />
        )
      case 'tasks':
        return <Tasks partnerId={inDummyFlow ? undefined : params.id} />
      case 'ai-partner-pulse':
        return (
          <div className='mb-2 flex w-full flex-col'>
            <h2 className='mb-4 text-sm text-text-70'>
              AI that understands your preferences and brings your next best
              partner.
            </h2>
            <AIPartnerPulse
              email={inDummyFlow ? undefined : (data?.email ?? undefined)}
              data={
                inDummyFlow
                  ? [
                      {
                        id: 1,
                        image:
                          'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png',
                        title: 'Sample Partner 1',
                        description: 'A great partner for collaboration.',
                        tags: ['Technology', 'Innovation'],
                        chosenReason: 'High compatibility score'
                      },
                      {
                        id: 2,
                        image:
                          'https://s3.ap-south-1.amazonaws.com/sharkdom.co.in/logos/placeholder.png',
                        title: 'Sample Partner 2',
                        description:
                          'Another excellent partnership opportunity.',
                        tags: ['Finance', 'Growth'],
                        chosenReason: 'Strong market presence'
                      }
                    ]
                  : undefined
              }
              isLoading={false}
            />
          </div>
        )
      case 'deals':
        return (
          <div className='flex w-full flex-col gap-4'>
            <DealsTable
              inDummyFlow={inDummyFlow}
              initialPartnerName={data?.name}
              initialPartnerEmail={data?.email}
              initialPartnerCode={externalPartnerCode || null}
            />
          </div>
        )
      case 'email':
        return <ComposeEmail />
      case 'customer-persona':
        return (
          <CustomerPersonaComparison organization={organization} data={data} />
        )
      default:
        return null
    }
  }, [tab, data, organization, params.id, inDummyFlow])

  return (
    <div className='relative flex h-full w-full flex-col'>
      <Image
        src='/partner-detail.jpg'
        alt='Background'
        fill
        className='object-cover object-center'
        priority={false}
        loading='lazy'
        quality={75}
      />
      <div className='relative z-10 flex h-full w-full flex-col'>
        {sidebarOpen && (
          <>
            {/* Page Header with Back Button */}
            <PageHeader
              title='Partner Details'
              backButton={
                <Link href={'/offline-partners'}>
                  <ArrowLeft size={24} color='#000' />
                </Link>
              }
            />

            <div className='flex w-full flex-1 flex-col p-2 md:p-4'>
              {partnerNotFound ? (
                <div className='flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-[#DEE2E6] bg-white p-8'>
                  <p className='text-center text-text-100'>
                    Partner not found or you don&apos;t have access.
                  </p>
                  <Button variant='primary' asChild>
                    <Link href='/offline-partners'>
                      Back to External Partners
                    </Link>
                  </Button>
                </div>
              ) : (
                <>
                  {/* Partner Header with Logo and Action Buttons */}
                  <PartnerHeader data={data} inDummyFlow={inDummyFlow} />

                  {/* Main Content Area */}
                  <div className='flex w-full flex-col gap-4 lg:flex-row'>
                    {/* Left column: Tabs wrapped in AnalyticsContainer */}
                    <div className='no-scrollbar max-w-[calc(100%-300px)] grow overflow-y-auto lg:h-[calc(100dvh-165px)]'>
                      <AnalyticsContainer title='' className='px-4 py-2'>
                        <Tabs
                          defaultValue={navTabs[0].value}
                          onValueChange={onTabChange}
                          value={tab}
                          className='w-full'
                        >
                          <TabsList
                            className='no-scrollbar flex w-full items-start justify-start overflow-x-auto rounded-none
               border-b bg-white md:overflow-visible'
                          >
                            {navTabs.map((currentTab) => (
                              <TabsTrigger
                                key={currentTab.value}
                                value={currentTab.value}
                                className='relative shrink-0 rounded-lg px-4 text-sm font-semibold
                   text-text-100 hover:bg-text-20
                   data-[state=active]:text-primary-blue data-[state=active]:shadow-none'
                              >
                                {currentTab.name}
                                {tab === currentTab.value && (
                                  <hr className='absolute -bottom-1 left-0 h-[4px] w-full rounded-full bg-primary-blue' />
                                )}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          <div className='w-full pt-4'>
                            {navTabs.map((navTab) => (
                              <TabsContent
                                key={navTab.value}
                                value={navTab.value}
                              >
                                {tabContent}
                              </TabsContent>
                            ))}
                          </div>
                        </Tabs>
                      </AnalyticsContainer>
                    </div>

                    {/* Right column: Partner Details Sidebar */}
                    <div className='w-[300px] lg:w-[300px]'>
                      <PartnerSidebar
                        data={data}
                        isLoading={isLoading}
                        inDummyFlow={inDummyFlow}
                        partnerId={params.id}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
        {!sidebarOpen && <MailboxSetup />}
      </div>
    </div>
  )
}

// Wrapper component with proper Suspense boundary
// Next.js dynamic route params are always strings
const OfflinePartnershipPage = ({ params }: { params: { id: string } }) => {
  return (
    <Suspense
      fallback={
        <div className='flex h-screen items-center justify-center'>
          <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary-blue border-t-transparent' />
        </div>
      }
    >
      <OfflinePartnershipPageInner params={params} />
    </Suspense>
  )
}

export default OfflinePartnershipPage
