'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePartnerMappingOverview } from '@/http-hooks/partner-mapping'

import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import MatrixTable from './_components/MatrixTable'
import OverViewTable from './_components/OverViewTable'
import ReportHistoryTable from './_components/ReportHistoryTable'
import SearchInput from './_components/SearchInput'

// Error boundary wrapper component
class PartnerMappingErrorBoundary extends React.Component<
  { children: React.ReactNode; router: any },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('PartnerMapping error:', error, errorInfo)
    // Redirect to start page
    if (this.props.router) {
      this.props.router.replace('/partner-mapping/start')
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex h-screen items-center justify-center'>
          <div className='text-center'>
            <p className='text-lg text-gray-600'>Redirecting...</p>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const PartnerMappingContent = () => {
  const [tab, setTab] = useState('overview')
  const [hasError, setHasError] = useState(false)
  const { data: overviewData, isLoading, error } = usePartnerMappingOverview()
  const router = useRouter()

  // Redirect to start page on ANY error - don't show errors to users
  useEffect(() => {
    if (error) {
      console.error('[PartnerMapping Component] API error:', error)

      // Always redirect to start page on any error
      // This ensures users never see application errors
      setHasError(true)

      // Delay redirect slightly to show loading message
      const timer = setTimeout(() => {
        console.log(
          '[PartnerMapping Component] Redirecting to start page due to error'
        )
        router.replace('/partner-mapping/start')
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [error, router])

  // If error occurred, show redirecting message (never show actual error to user)
  if (hasError || error) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <p className='text-lg font-semibold text-gray-900'>
            Setting up Partner Mapping...
          </p>
          <p className='mt-2 text-sm text-gray-600'>
            Please wait while we prepare your workspace
          </p>
          <div className='mt-6'>
            <div className='mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600'></div>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state with shimmer
  if (isLoading) {
    return (
      <div className='space-y-4 p-4'>
        {/* Heading + Description Shimmer */}
        <div>
          <Skeleton className='mb-2 h-7 w-48' />
          <Skeleton className='h-4 w-full max-w-2xl' />
          <Skeleton className='mt-2 h-4 w-3/4 max-w-xl' />
        </div>

        {/* Metric Cards Shimmer */}
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className='rounded-2xl shadow-none'>
              <CardContent className='flex flex-col items-start p-6'>
                <Skeleton className='mb-4 h-4 w-32' />
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-8 w-16' />
                  <Skeleton className='h-3 w-20' />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section Shimmer */}
        <div className='w-full'>
          <div className='border-b'>
            <div className='flex gap-4'>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className='h-10 w-32' />
              ))}
            </div>
          </div>
          <div className='pt-4'>
            <Skeleton className='h-64 w-full' />
          </div>
        </div>
      </div>
    )
  }

  const onTabChange = (value: string) => {
    setTab(value)
  }

  const metrics = [
    {
      title: 'Active Partners',
      value: overviewData?.active_partners?.toString() || 'N.A.',
      sub: '+5% Since last month'
    },
    {
      title: 'Total Overlaps',
      value: overviewData?.total_overlaps?.toString() || 'N.A.'
    },
    {
      title: 'Avg. Overlap Rate',
      value: overviewData?.total_overlaps_rate
        ? `${overviewData.total_overlaps_rate}%`
        : 'N.A.'
    },
    {
      title: 'Reports Generated',
      value: overviewData?.report_generated?.toString() || 'N.A.'
    }
  ]

  const navTabs = [
    {
      name: 'Overview',
      value: 'overview'
    },
    {
      name: 'Matrix Comparison',
      value: 'matrix'
    },
    {
      name: 'Reports History',
      value: 'history'
    }
  ]

  const tabContent = () => {
    switch (tab) {
      case 'overview':
        return (
          <div className='flex w-full flex-col gap-4'>
            {/* <Overview collaborationId={params.id} /> */}
            {/* <PartnerMappingEmptyState /> */}
            <OverViewTable partners={overviewData?.my_partners || []} />
          </div>
        )
      case 'matrix':
        return (
          <div className='flex w-full flex-col gap-4'>
            <MatrixTable />
          </div>
        )
      case 'history':
        return (
          <div className='flex w-full flex-col gap-4'>
            <ReportHistoryTable />
          </div>
        )

      default:
        return null
    }
  }
  return (
    // <div className='p-6'>
    //   <Hero />
    // </div>
    <div className='space-y-4 p-4'>
      {/* Heading + Description */}
      <div>
        <h1 className='text-xl font-bold text-text-100'>Partner Mapping</h1>
        <p className='mt-2 text-sm text-text-80'>
          Visually compare your accounts with partners’ data to identify
          overlapping customers, opportunities, and prospects for better
          collaboration and growth. It enables smarter decisions by highlighting
          shared business potential and data insights.
        </p>
      </div>

      {/* Metric Cards */}
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {metrics.map((m, i) => (
          <Card key={i} className='rounded-2xl shadow-none'>
            <CardContent className='flex flex-col items-start p-1'>
              <p className='text-sm text-gray-500'>{m.title}</p>
              <div className='flex items-center gap-2'>
                <p
                  className={`mt-2 text-2xl font-semibold ${
                    m.value === 'N.A.' ? 'text-[#ADB5BD]' : 'text-black'
                  }`}
                >
                  {m.value}
                </p>

                {m.sub && (
                  <span className='mt-1 text-xs text-green-600'>{m.sub}</span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs Section */}

      <div className='w-full'>
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

          <div className='w-full pt-4 '>
            {navTabs.map(
              (tab) => (
                // isLoading ? (
                //   <div
                //     key={tab.value}
                //     className='flex w-full flex-col gap-4'
                //   >
                //     <Skeleton className='h-[100px] w-full' />
                //     <Skeleton className='h-[100px] w-full' />
                //     <Skeleton className='h-[100px] w-full' />
                //   </div>
                // ) : (
                <TabsContent key={tab.value} value={tab.value}>
                  {tabContent()}
                </TabsContent>
              )
              // )
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}

const PartnerMapping = () => {
  const router = useRouter()

  return (
    <PartnerMappingErrorBoundary router={router}>
      <PartnerMappingContent />
    </PartnerMappingErrorBoundary>
  )
}

export default PartnerMapping
