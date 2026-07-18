'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { usePartnerPrograms } from '@/http-hooks/partner-programs'
import { fetchCurrentOrgRedux } from '@/redux/slices/organization'
import { AppDispatch, RootState } from '@/redux/store'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import PageHeader from '@/components/shared/page-header'

import MetricCard from './_components/metric-card'
import NewReferralProgram from './_components/new-referral-program-modal'
import PartnerProgramsSidebar from './_components/partner-programs-sidebar'
import { ReferralProgramsList } from './_components/partnerprogram-list'
import PartnerProgramPlaceholder from './_components/partnerprogram-new'

// Define the data structure based on the provided JSON
interface CampaignDetail {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationId: number
  referralCode: string
  urlRef: string | null
  emailRef: string | null
  status: 'DRAFT' | 'ACTIVE' | string
  referralLink: string
  partnerOrganizationName: string | null
  domain: string | null
  partnerId: string | null
  emailVerified: boolean
  domainVerified: boolean
  programName: string
  commission: boolean
  commissionPercentage: number | null
  minimumThreshold: number | null
  commissionType: string | null
  impressionCount: number
  leadsCount: number
  description: string | null
}

interface PartnerProgramsData {
  campaignDetails: CampaignDetail[]
  leadsChange: number | null
  partnerChange: number | null
  leadsCount: number
  partnerCount: number
}

type Props = {}

const PartnerProgramsContent = React.memo(
  ({ isVisible }: { isVisible?: boolean }) => {
    const dispatch = useDispatch<AppDispatch>()
    const currentOrg = useSelector((state: RootState) => state.currentOrg)
    const [isOrgReady, setIsOrgReady] = useState(false)

    // Debug logging
    useEffect(() => {
      console.log('🔍 Partner Programs Content - Component rendered', {
        isVisible
      })
    }, [isVisible])

    // Ensure content is visible even if animations fail
    useEffect(() => {
      if (isVisible) {
        const timer = setTimeout(() => {
          const element = document.querySelector(
            '[data-partner-programs-content]'
          ) as HTMLElement
          if (element) {
            console.log('🔍 Ensuring partner programs content visibility')
            // Force visibility in case animations get stuck
            element.style.opacity = '1'
          }
        }, 500)
        return () => clearTimeout(timer)
      }
    }, [isVisible])

    const { data, isLoading, error } = usePartnerPrograms() as unknown as {
      data: PartnerProgramsData
      isLoading: boolean
      error: any
    }

    // Log the query state for debugging
    useEffect(() => {
      console.log('Partner Programs Query State:', {
        isLoading,
        error,
        hasData: !!data,
        campaignCount: data?.campaignDetails?.length || 0,
        organizationId: currentOrg.organization?.id
      })
    }, [isLoading, error, data, currentOrg.organization?.id])

    // Check if there are any campaign details
    const hasCampaigns =
      data?.campaignDetails && data?.campaignDetails.length > 0

    // Ensure organization data is available
    useEffect(() => {
      const org = currentOrg.organization?.id ? currentOrg.organization : null

      console.log('Partner Programs - Organization State:', {
        currentOrg: currentOrg.organization,
        currentOrgLoading: currentOrg.loading,
        hasOrgId: !!org?.id
      })

      if (org?.id) {
        setIsOrgReady(true)
      } else if (currentOrg.loading === 'idle') {
        // console.log('No organization data found, fetching automatically...')
        dispatch(fetchCurrentOrgRedux({ payload: {} })).catch((error) => {
          console.error('Error auto-fetching organization data:', error)
        })
      } else if (currentOrg.loading === 'failed') {
        setIsOrgReady(true) // Don't block UI on failure
      }
    }, [currentOrg, dispatch])

    // Reduced timeout to 3 seconds for better UX
    useEffect(() => {
      const timeout = setTimeout(() => {
        if (!isOrgReady) {
          console.log('Partner Programs - Timeout reached, marking as ready')
          setIsOrgReady(true)
        }
      }, 3000) // Reduced from 10 seconds to 3 seconds

      return () => clearTimeout(timeout)
    }, [isOrgReady])

    // Show loading state only if actively loading organization data
    if (currentOrg.loading === 'pending') {
      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='mb-4'>
              <Loader2 className='mx-auto h-12 w-12 animate-spin text-blue-600' />
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Loading Partner Programs
            </h3>
            <p className='mb-4 text-gray-600'>
              Please wait while we load your data...
            </p>
          </div>
        </div>
      )
    }

    // Show error state only if organization is definitively not available
    if (!currentOrg.organization?.id && currentOrg.loading === 'failed') {
      return (
        <div className='flex min-h-screen items-center justify-center bg-gray-50'>
          <div className='text-center'>
            <div className='mb-4 text-red-500'>
              <svg
                className='mx-auto h-12 w-12'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                />
              </svg>
            </div>
            <h3 className='mb-2 text-lg font-semibold text-gray-900'>
              Organization Not Found
            </h3>
            <p className='mb-4 text-gray-600'>
              Unable to load organization data. Please complete your profile
              setup.
            </p>
            <button
              onClick={() => window.location.reload()}
              className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    // Show error state for API failures but still render the page structure
    if (error) {
      console.error('Partner Programs API Error:', error)
    }

    // Show loading state for data only if organization is ready
    if (isLoading && isOrgReady) {
      return (
        <div className='flex'>
          <div className='w-full'>
            <PageHeader
              title='Partner Programs'
              actionButtons={<NewReferralProgram />}
            />
            <div className='mx-8 py-6'>
              <div className='flex items-center justify-center p-8'>
                <div className='text-center'>
                  <Loader2 className='mx-auto h-8 w-8 animate-spin text-blue-600' />
                  <p className='mt-2 text-gray-600'>
                    Loading partner programs...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Show error state for data
    if (error) {
      return (
        <div className='flex'>
          <div className='w-full'>
            <PageHeader
              title='Partner Programs'
              actionButtons={<NewReferralProgram />}
            />
            <div className='mx-8 py-6'>
              <div className='flex items-center justify-center p-8'>
                <div className='text-center'>
                  <div className='mb-4 text-red-500'>
                    <svg
                      className='mx-auto h-12 w-12'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
                      />
                    </svg>
                  </div>
                  <h3 className='mb-2 text-lg font-semibold text-gray-900'>
                    Error Loading Data
                  </h3>
                  <p className='mb-4 text-gray-600'>
                    {error?.message || 'Failed to load partner programs data'}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className='rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700'
                  >
                    Refresh Page
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className='flex h-full w-full'>
        <div className='w-full' data-partner-programs-content='true'>
          <PageHeader
            title='Partner Programs'
            actionButtons={<NewReferralProgram />}
          />
          <div className='mx-8 py-6'>
            <PartnerProgramPlaceholder hasCampaign={hasCampaigns} />
          </div>
        </div>
      </div>
    )
  }
)

PartnerProgramsContent.displayName = 'PartnerProgramsContent'

const PartnerPrograms = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    console.log('🔍 Partner Programs - Component mounted')
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className='relative h-full w-full flex-1'>
      <Suspense
        fallback={
          <div className='flex items-center justify-center p-8'>
            <Loader2 className='h-8 w-8 animate-spin text-blue-600' />
          </div>
        }
      >
        <PartnerProgramsContent
          key={`partner-programs-${isVisible}`}
          isVisible={isVisible}
        />
      </Suspense>
    </div>
  )
}

PartnerPrograms.displayName = 'PartnerPrograms'

export default PartnerPrograms
