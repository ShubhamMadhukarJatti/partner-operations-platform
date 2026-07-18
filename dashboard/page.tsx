'use client'

import React, { Component, ErrorInfo, ReactNode, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useCollaborationsData,
  useCollaborationsDetails
} from '@/http-hooks/collaborations'

import { GradientPageBackground } from '@/components/shared/gradient-page-background'
import PageHeader from '@/components/shared/page-header'

import PartnersTabContent from './_components/PartnersTabContent'
import SegmentsTabContent from './_components/SegmentsTabContent'

class CollaborationsErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      'CollaborationsTable Error Boundary caught:',
      error,
      errorInfo
    )
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className='flex h-[400px] items-center justify-center'>
          <div className='text-center'>
            <p className='mb-2 text-lg font-semibold text-gray-800'>
              Unable to load partners
            </p>
            <p className='mb-4 text-sm text-gray-600'>
              There was an error loading the partners table. Please try
              refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700'
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

const DashboardPage = () => {
  // Add global error handler for unhandled promise rejections
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason)
      // Prevent default browser error handling
      event.preventDefault()
      // Don't crash - just log the error
    }

    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error)
      // Prevent default browser error handling
      event.preventDefault()
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  const [selectedTab, setSelectedTab] = useState('partners')
  const [proposalType, setProposalType] = useState('all')

  // Hooks must be called unconditionally - can't wrap in try-catch
  // Fetch all data without pagination (page=0, size=200)
  const {
    data,
    isLoading,
    error: collaborationsError
  } = useCollaborationsData(proposalType?.toUpperCase() || 'ALL', 0, 200)
  const { data: creditsData, isLoading: creditsLoading } =
    useCollaborationsDetails()

  // Safe defaults to prevent crashes
  const partnersData = Array.isArray(data?.content) ? data.content : []
  const credits = creditsData?.credits ?? {
    collaborationsLeft: 0,
    collaborationsAllocated: 0,
    aiProposalLeft: 0,
    aiProposalAllocated: 0
  }

  // Log errors but don't crash
  if (collaborationsError) {
    console.error('Collaborations data error:', collaborationsError)
  }

  // const proposalTypes = [
  //   {
  //     label: `Active`,
  //     value: 'active'
  //   },
  //   {
  //     label: `Proposals sent`,
  //     value: 'sent'
  //   },
  //   {
  //     label: `Proposals received`,
  //     value: 'received'
  //   },
  //   {
  //     label: `Rejected`,
  //     value: 'rejected'
  //   }
  // ].map((tab) => ({
  //   ...tab,
  //   tabContent: (
  //     <div className='-mx-8'>
  //       <CollaborationsTable proposals={partnersData} isLoading={isLoading} />
  //     </div>
  //   )
  // }))

  const proposalTypes = [
    { label: 'All', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Proposal Sent', value: 'sent' },
    { label: 'Proposal Received', value: 'received' },
    { label: 'Rejected', value: 'rejected' }
  ]

  const dashboardTabs = [
    {
      label: `Partners`,
      value: 'partners',
      tooltipText: 'Track your partnership enquiries here'
    },
    {
      label: `Segments`,
      value: 'segments',
      tooltipText: 'Categorize your partners and assign activities based on it'
    }
  ]

  return (
    <GradientPageBackground className='flex min-h-[calc(100vh-64px)] flex-col'>
      <PageHeader
        title=''
        description='Send more proposals and keep track of any terms update from your partners.'
        tabs={dashboardTabs}
        onTabChange={(value) => setSelectedTab(value)}
        toolTip={true}
      />

      {selectedTab == 'partners' && (
        <PartnersTabContent
          data={data}
          isLoading={isLoading}
          credits={credits}
          proposalType={proposalType}
          setProposalType={setProposalType}
        />
      )}

      {selectedTab == 'segments' && <SegmentsTabContent data={data} />}
    </GradientPageBackground>
  )
}

export default DashboardPage
