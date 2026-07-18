'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { useGetPersona, useGetPersonaPreview } from '@/http-hooks/partner-match'
import { fetchCurrentOrgRedux } from '@/redux/slices/organization'
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'

import { devOnly } from '@/lib/devOnly'
import { Button } from '@/components/ui/button'
import { PageSkeleton } from '@/components/ui/loading-skeleton'
import { showCustomToast } from '@/components/custom-toast'
import ApiCallDebugger from '@/components/debug/ApiCallDebugger'
import ReduxStateDebugger from '@/components/debug/ReduxStateDebugger'
import PerformanceTester from '@/components/performance/PerformanceTester'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import ConnectYourCRM from './_components/ConnectYourCRM'
import CRMFeatureCards from './_components/CRMFeatureCards'
import DataUploadInfo from './_components/DataUploadInfo'
import OtherWaysToConnect from './_components/OtherWaysToConnect'
import PerformanceMonitor from './_components/PerformanceMonitor'

// Memoized loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className='flex flex-col gap-8 p-6'>
    {/* Skeleton for ConnectYourCRM */}
    <div className='flex flex-col gap-8 rounded-2xl border border-[#A1BAF1] bg-white p-8 dark:border-border dark:bg-card'>
      <div className='flex flex-col gap-8 md:flex-row md:items-center md:justify-between'>
        <div className='w-4/12'>
          <div className='mb-2 h-8 animate-pulse rounded bg-gray-200'></div>
          <div className='mb-6 h-4 animate-pulse rounded bg-gray-200'></div>
          <div className='flex flex-row items-center gap-4'>
            <div className='h-10 w-32 animate-pulse rounded-lg bg-gray-200'></div>
            <div className='flex items-center gap-4'>
              <div className='h-6 w-6 animate-pulse rounded bg-gray-200'></div>
              <div className='h-6 w-6 animate-pulse rounded bg-gray-200'></div>
              <div className='h-6 w-6 animate-pulse rounded bg-gray-200'></div>
            </div>
          </div>
        </div>
        <div className='flex flex-1 flex-col justify-end gap-4 md:flex-row'>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className='flex min-h-[160px] w-56 flex-col items-center justify-center rounded-xl border border-[#E4E7EE] p-6 dark:border-border'
            >
              <div className='mb-2'>
                <div className='flex animate-pulse items-center justify-center rounded-full bg-gray-200 p-3'>
                  <div className='h-5 w-5 rounded bg-gray-300'></div>
                </div>
              </div>
              <div className='mb-1 h-8 animate-pulse rounded bg-gray-200'></div>
              <div className='mb-1 h-4 w-4/6 animate-pulse rounded bg-gray-200'></div>
              <div className='h-3 w-full animate-pulse rounded bg-gray-200'></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Skeleton for OtherWaysToConnect */}
    <div className='flex flex-col gap-8'>
      <div>
        <div className='mb-1 h-6 animate-pulse rounded bg-gray-200'></div>
        <div className='mb-4 h-4 animate-pulse rounded bg-gray-200'></div>
      </div>
      <div className='flex flex-col gap-4'>
        {[1, 2].map((i) => (
          <div
            key={i}
            className='flex min-h-[80px] flex-1 items-center gap-4 rounded-lg border-2 border-[#E3E8EF] bg-[#F9FAFB] p-4 dark:border-border dark:bg-card'
          >
            <div className='h-6 w-6 animate-pulse rounded bg-gray-200'></div>
            <div className='flex-1'>
              <div className='mb-1 h-4 animate-pulse rounded bg-gray-200'></div>
              <div className='h-3 animate-pulse rounded bg-gray-200'></div>
            </div>
            <div className='flex items-center gap-2'>
              <div className='h-4 w-4 animate-pulse rounded bg-gray-200'></div>
              <div className='h-4 w-8 animate-pulse rounded bg-gray-200'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
))

LoadingSkeleton.displayName = 'LoadingSkeleton'

// Memoized main content component
const MyDataContent = React.memo(() => {
  const dispatch = useDispatch<AppDispatch>()
  const currentOrg = useSelector((state: RootState) => state.currentOrg)
  const organizationData = useSelector((state: RootState) => state.organization)
  const [organization, setOrganization] = useState<any>(null)
  const [isOrgReady, setIsOrgReady] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Refresh organization data function
  const refreshOrganizationData = async () => {
    setIsRefreshing(true)
    try {
      console.log('Refreshing organization data...')
      // Dispatch the fetch action to refresh organization data
      const result = await dispatch(fetchCurrentOrgRedux({ payload: {} }))
      if (fetchCurrentOrgRedux.fulfilled.match(result)) {
        console.log('Organization data refreshed successfully')
      } else if (fetchCurrentOrgRedux.rejected.match(result)) {
        console.error('Failed to refresh organization data:', result.error)
      }
    } catch (error) {
      console.error('Error refreshing organization data:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Get organization from either Redux location
  useEffect(() => {
    const org = currentOrg.organization?.id
      ? currentOrg.organization
      : organizationData.organizationData

    if (org?.id) {
      setOrganization(org)
      setIsOrgReady(true)
    } else if (
      currentOrg.loading === 'failed' ||
      currentOrg.loading === 'idle'
    ) {
      // If no organization data, try to fetch it automatically
      if (!org && currentOrg.loading === 'idle') {
        // console.log('No organization data found, fetching automatically...')
        dispatch(fetchCurrentOrgRedux({ payload: {} })).catch((error) => {
          console.error('Error auto-fetching organization data:', error)
        })
      }
      setIsOrgReady(true)
    }
  }, [currentOrg, organizationData, dispatch])

  // Timeout mechanism to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isOrgReady) {
        setIsOrgReady(true)
      }
    }, 10000) // 10 second timeout

    return () => clearTimeout(timeout)
  }, [isOrgReady])

  // Auto-fetch organization data if not available
  useEffect(() => {
    const checkAndFetchOrganization = () => {
      const org = currentOrg.organization?.id
        ? currentOrg.organization
        : organizationData.organizationData

      if (!org?.id && currentOrg.loading === 'idle' && !isRefreshing) {
        // console.log('Auto-fetching organization data...')
        dispatch(fetchCurrentOrgRedux({ payload: {} })).catch((error) => {
          console.error('Error auto-fetching organization data:', error)
        })
      }
    }

    // Check immediately
    checkAndFetchOrganization()

    // Also check after a short delay to ensure Redux state is updated
    const delayTimeout = setTimeout(checkAndFetchOrganization, 1000)

    return () => clearTimeout(delayTimeout)
  }, [currentOrg, organizationData, dispatch, isRefreshing])

  const { data, isLoading, error } = useGetPersona()
  const {
    data: personaData,
    isLoading: isLoadingPersona,
    error: personaError
  } = useGetPersonaPreview()

  // Show loading state while organization is loading or not ready
  if (!isOrgReady || isRefreshing || currentOrg.loading === 'pending') {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center p-8'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>
            {isRefreshing
              ? 'Refreshing organization data...'
              : currentOrg.loading === 'pending'
                ? 'Fetching organization data...'
                : 'Loading organization data...'}
          </p>
        </div>
      </div>
    )
  }

  // Show error if no organization
  if (!organization?.id) {
    return (
      <div className='flex flex-col items-center justify-center p-8'>
        <div className='text-center'>
          <h3 className='mb-2 text-lg font-semibold text-red-600'>
            Organization Not Found
          </h3>
          <p className='mb-4 text-gray-600'>
            Unable to load organization data. This might be because you need to
            complete your profile setup.
          </p>
          <div className='mb-4 text-sm text-gray-500'>
            <p>Current Status:</p>
            <ul className='mt-2 text-left'>
              <li>• Current Org Loading: {currentOrg.loading}</li>
              <li>
                • Organization Data:{' '}
                {organizationData.organizationData
                  ? 'Available'
                  : 'Not Available'}
              </li>
              <li>
                • Last Fetched:{' '}
                {organizationData.lastFetched
                  ? new Date(organizationData.lastFetched).toLocaleString()
                  : 'Never'}
              </li>
            </ul>
          </div>
          <div className='flex gap-2'>
            <button
              onClick={refreshOrganizationData}
              disabled={isRefreshing}
              className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Organization Data'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className='rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state while any API is loading
  if (isLoading || isLoadingPersona) {
    return <PageSkeleton />
  }

  // Show error state if there are API errors
  if (error || personaError) {
    return (
      <div className='flex flex-col items-center justify-center p-8'>
        <div className='text-center'>
          <h3 className='mb-2 text-lg font-semibold text-red-600'>
            Error Loading Data
          </h3>
          <p className='mb-4 text-gray-600'>
            {error?.message || personaError?.message || 'Failed to load data'}
          </p>
          <div className='flex gap-2'>
            <button
              onClick={refreshOrganizationData}
              disabled={isRefreshing}
              className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className='rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show loading state if no data but still loading
  if (!data && (isLoading || isLoadingPersona)) {
    return <PageSkeleton />
  }

  // Show empty state only if we're sure there's no data and not loading
  if (!data && !isLoading && !isLoadingPersona) {
    return (
      <div className='flex flex-col items-center justify-center p-8'>
        <div className='text-center'>
          <h3 className='mb-2 text-lg font-semibold text-gray-600'>
            No Data Available
          </h3>
          <p className='mb-4 text-gray-500'>
            No persona data found. This might be because no data has been
            uploaded yet.
          </p>
          <div className='flex gap-2'>
            <button
              onClick={refreshOrganizationData}
              disabled={isRefreshing}
              className='rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50'
            >
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button
              onClick={() => window.location.reload()}
              className='rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700'
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-8'>
      {devOnly(<PerformanceMonitor />)}
      <ConnectYourCRM personaData={data} />
      <OtherWaysToConnect personaData={data} locked={personaData} />
      {/* {devOnly(<PerformanceTester />)} */}
      {/* {devOnly(<ApiCallDebugger />)} */}
      {/* {devOnly(<ReduxStateDebugger />)} */}
    </div>
  )
})

MyDataContent.displayName = 'MyDataContent'

const MyData = () => {
  return (
    <GradientPageBackground className='min-h-screen'>
      <Suspense fallback={<PageSkeleton />}>
        <MyDataContent />
      </Suspense>
    </GradientPageBackground>
  )
}

export default MyData
