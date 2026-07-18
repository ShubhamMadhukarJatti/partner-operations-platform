'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { usePricingModal } from '@/contexts/pricing-modal-context'
import { hideModal } from '@/redux/slices/registerModal'
import { RootState } from '@/redux/store'
import { ShortlistedPartner } from '@/services/shortlisted-partners'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import {
  ArrowLeft,
  ArrowRight,
  Download,
  SlidersHorizontal
} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { getSearchResult } from '@/lib/db/search'
import { Button } from '@/components/ui/button'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast, Toaster } from '@/components/ui/sonner'
import { showCustomToast } from '@/components/custom-toast'
import { PagePerformance } from '@/components/performance/page-performance'

// import { FetchReferralsResponse } from '../explore-2/_components/OpenForReferralTabContent'
import AdvanceFilter from '../_components/AdvanceFilter'
import { AdvanceFilterDropdown } from '../_components/AdvanceFilterDropdown'
import AssistantBanner from '../_components/AssistantBanner'
import CardSkeleton from '../_components/CardSkeleton'
import CompanyProfileFilter from '../_components/CompanyProfileFilter'
import DiscoverCardGrid from '../_components/DiscoverCardGrid'
import { HeaderSection } from '../_components/HeaderWrapper'
import MobileFilters from '../_components/mobile-components/MobileFilters'
import MobileHeader from '../_components/mobile-components/MobileHeader'
import PreferenceSetting from '../_components/preference-setting/PreferenceSetting'
import RecommendedDropdown from '../_components/RecommendedDropdown'
import SearchInput from '../_components/search'
import { FetchReferralsResponse } from '../../explore-2/_components/OpenForReferralTabContent'

interface Tab {
  id: string
  label: string
}

const ShortlistPartners = () => {
  // Get current organization from Redux store
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization: currentOrganization } = saved
  const router = useRouter()

  // Fetch shortlisted partners data
  const {
    data: shortlistedPartners,
    isLoading,
    error
  } = useQuery<ShortlistedPartner[]>({
    queryKey: ['shortlisted-partners', currentOrganization?.id],
    queryFn: async () => {
      if (!currentOrganization?.id) {
        throw new Error('No organization ID available')
      }

      const response = await fetch(
        `/api/organization/getShortListing/${currentOrganization.id}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch shortlisted partners')
      }
      return response.json()
    },
    enabled: !!currentOrganization?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  // Format date for display
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return (
      date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) +
      ' | ' +
      date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }) +
      ' Hrs'
    )
  }

  // CSV export functionality
  const convertToCSV = (data: ShortlistedPartner[]) => {
    const headers = [
      'Partner Name',
      'Organization ID',
      'Shortlisted By',
      'Shortlisted Date',
      'Remark'
    ]

    const csvContent = [
      headers.join(','),
      ...data.map((partner) =>
        [
          `"${partner.name.replace(/"/g, '""')}"`,
          partner.shortlistedOrgId,
          `"${partner.shortlistedByUserName.replace(/"/g, '""')}"`,
          `"${formatDate(partner.creationTimestamp)}"`,
          `"${(partner.remark || 'No remark provided').replace(/"/g, '""')}"`
        ].join(',')
      )
    ].join('\n')

    return csvContent
  }

  const downloadCSV = () => {
    if (!shortlistedPartners || shortlistedPartners.length === 0) {
      showCustomToast('Error', 'No data available to export', 'error', 5000)
      return
    }

    try {
      const csvContent = convertToCSV(shortlistedPartners)
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')

      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob)
        link.setAttribute('href', url)
        link.setAttribute(
          'download',
          `shortlisted-partners-${new Date().toISOString().split('T')[0]}.csv`
        )
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        showCustomToast(
          'Success',
          'CSV file downloaded successfully',
          'success',
          5000
        )
      }
    } catch (error) {
      console.error('Error downloading CSV:', error)
      showCustomToast('Error', 'Failed to download CSV file', 'error', 5000)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <>
        <PagePerformance />
        <div className=''>
          <div className='hide-scrollbar p-0'>
            <HeaderSection title={'Shortlisted Partners'} />
            <div className='m-6 min-h-screen rounded-lg border bg-[#F9F9F9] p-4'>
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                  <p className='text-sm text-gray-600'>
                    Loading shortlisted partners...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Error state
  if (error) {
    return (
      <>
        <PagePerformance />
        <div className=''>
          <div className='hide-scrollbar p-0'>
            <HeaderSection title={'Shortlisted Partners'} />
            <div className='m-6 min-h-screen rounded-lg border bg-[#F9F9F9] p-4'>
              <div className='flex items-center justify-center py-12'>
                <div className='text-center'>
                  <p className='text-sm text-red-600'>
                    Error loading shortlisted partners
                  </p>
                  <p className='mt-2 text-xs text-gray-500'>{error.message}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PagePerformance />
      <Toaster />
      <div className=''>
        <div className='hide-scrollbar p-0'>
          <HeaderSection title={'Shortlisted Partners'} />

          <div className='m-6 min-h-screen rounded-lg border bg-[#F9F9F9] p-4'>
            {/* Header with export button */}
            <div className='mb-4 flex items-center justify-between'>
              <div className='text-lg font-semibold text-[#0F1724]'>
                {shortlistedPartners?.length || 0} Shortlisted Partners
              </div>
              <Button
                variant={
                  !shortlistedPartners || shortlistedPartners.length === 0
                    ? 'disable'
                    : 'primary'
                }
                onClick={downloadCSV}
                disabled={
                  !shortlistedPartners || shortlistedPartners.length === 0
                }
                className='flex items-center gap-2'
              >
                <Download size={16} />
                Export CSV
              </Button>
            </div>

            {/* Table header: visible and aligned */}
            <div className='grid grid-cols-12 gap-4 border-b bg-white px-6 py-3 text-xs font-medium text-[#97A0B4]'>
              <div className='col-span-4'>Partner Name</div>
              <div className='col-span-3'>Shortlisted By</div>
              <div className='col-span-4'>Remark</div>
              <div className='col-span-1 text-right'>View Info</div>
            </div>

            {/* Rows - aligned to the header columns */}
            <div className=''>
              {shortlistedPartners && shortlistedPartners.length > 0 ? (
                shortlistedPartners.map((partner) => (
                  <div
                    key={partner.shortlistedOrgId}
                    className='border-b border-[#F1F4F7] bg-white px-6 py-4'
                  >
                    <div className='grid grid-cols-12 items-center gap-4'>
                      {/* Partner Name: star + logo + text */}
                      <div className='col-span-4 flex items-center gap-4'>
                        <div className='flex-shrink-0'>
                          <div className='flex h-6 w-6 items-center justify-center rounded-full border border-[#F6C84C] bg-white'>
                            <svg
                              width='12'
                              height='12'
                              viewBox='0 0 24 24'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                d='M12 17.3L6.2 20l1.1-6.4L2 9.5l6.5-.9L12 3l3.5 5.6 6.5.9-5.3 4.1L17.8 20 12 17.3z'
                                fill='#F6C84C'
                              />
                            </svg>
                          </div>
                        </div>

                        <div className='flex items-center gap-3'>
                          {partner.logoUrl ? (
                            <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-[#E6EEF0] bg-white'>
                              <img
                                src={partner.logoUrl}
                                alt={partner.name}
                                className='h-8 w-8 object-contain'
                              />
                            </div>
                          ) : (
                            <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-md border border-[#E6EEF0] bg-white'>
                              <div className='text-xs font-semibold text-[#0F1724]'>
                                {partner.name.charAt(0).toUpperCase()}
                              </div>
                            </div>
                          )}

                          <div>
                            <div className='text-lg font-semibold text-[#0F1724]'>
                              {partner.name}
                            </div>
                            <div className='mt-1 text-xs text-[#64748B]'>
                              Organization ID: {partner.shortlistedOrgId}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shortlisted By */}
                      <div className='col-span-3'>
                        <div className='text-sm font-medium text-[#334155]'>
                          {partner.shortlistedByUserName}
                        </div>
                        <div className='mt-1 text-xs text-[#97A0B4]'>
                          {formatDate(partner.creationTimestamp)}
                        </div>
                      </div>

                      {/* Remark */}
                      <div className='col-span-4 text-sm leading-relaxed text-[#475569]'>
                        {partner.remark || 'No remark provided'}
                      </div>

                      {/* View Info (arrow) */}
                      <div className='col-span-1 flex justify-end'>
                        <Button
                          variant='primary'
                          size='icon'
                          className='h-10 w-10'
                          onClick={() =>
                            router.push(`/explore/${partner.shortlistedOrgId}`)
                          }
                        >
                          <ArrowRight />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className='flex items-center justify-center py-12'>
                  <div className='text-center'>
                    <p className='text-sm text-gray-600'>
                      No shortlisted partners found
                    </p>
                    <p className='mt-2 text-xs text-gray-500'>
                      Start exploring partners to add them to your shortlist
                    </p>
                  </div>
                </div>
              )}

              <div className='h-48' />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ShortlistPartners
