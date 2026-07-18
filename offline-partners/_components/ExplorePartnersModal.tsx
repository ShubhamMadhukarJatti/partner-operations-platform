'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useImportPartners } from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { useInfiniteQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { useSelector } from 'react-redux'

import { getSearchResultByFilter } from '@/lib/db/search'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { showCustomToast } from '@/components/custom-toast'

import { FetchReferralsResponse } from '../../explore-2/_components/OpenForReferralTabContent'
import CardSkeleton from '../../explore/_components/CardSkeleton'
import PartnerSelectionCard from './PartnerSelectionCard'

const FILTER_TAGS = [
  { label: 'Manufacturing', value: 'K' }, // Maps to MANUFACTURING in PREFERRED_SECTORS
  { label: 'Information Technology', value: 'C' }, // Maps to TECH in PREFERRED_SECTORS
  { label: 'Marketing', value: 'G' } // Maps to MARKETING in PREFERRED_SECTORS
]

const MAX_PARTNERS_SELECTION = 4

interface ExplorePartnersModalProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const ExplorePartnersModal: React.FC<ExplorePartnersModalProps> = ({
  children,
  open,
  onOpenChange
}) => {
  const [selectedTag, setSelectedTag] = useState('ALL')
  const [selectedPartners, setSelectedPartners] = useState<Set<number>>(
    new Set()
  )
  const [isOpen, setIsOpen] = useState(open || false)

  const { organization } = useSelector((state: RootState) => state.currentOrg)

  // Handle internal state changes
  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setIsOpen(newOpen)
      onOpenChange?.(newOpen)
    },
    [onOpenChange]
  )

  // Import partners mutation
  const { mutate: importPartnersMutation, isPending: isImporting } =
    useImportPartners()

  // Handle external open state changes
  useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])

  // Query function for fetching partners
  const queryFn = useCallback(
    ({ pageParam = 0 }) => {
      const searchParams = {
        page: pageParam as number,
        size: 20,
        sectors: selectedTag === 'ALL' ? undefined : selectedTag,
        sectorsCommaSeparated: selectedTag === 'ALL' ? undefined : selectedTag,
        queryingOrganizationId: organization?.id,
        organizationId: organization?.id
      }

      return getSearchResultByFilter(
        searchParams
      ) as Promise<FetchReferralsResponse>
    },
    [selectedTag, organization?.id]
  )

  // React Query for infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useInfiniteQuery({
    queryKey: ['explore-partners-modal', selectedTag, organization?.id],
    queryFn,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    initialPageParam: 0,
    enabled: !!organization?.id && isOpen
  })

  console.log('explore-partners-modal', data)

  // Refetch when tag changes
  useEffect(() => {
    if (isOpen && organization?.id) {
      refetch()
    }
  }, [selectedTag, isOpen, organization?.id, refetch])

  // Flatten all organizations from pages
  const allOrganizations = useMemo(
    () => data?.pages.flatMap((page) => page.content) || [],
    [data?.pages]
  )

  console.log('allOrganizations', allOrganizations)
  // Handle partner selection
  const handlePartnerSelect = useCallback(
    (partnerId: number, selected: boolean) => {
      if (selected) {
        // Check if we've reached the maximum selection limit
        if (selectedPartners.size >= MAX_PARTNERS_SELECTION) {
          showCustomToast(
            'Error',
            `You can only select up to ${MAX_PARTNERS_SELECTION} partners at a time. Please deselect a partner before adding a new one.`,
            'error',
            5000
          )
          return
        }
      }

      setSelectedPartners((prev) => {
        const newSet = new Set(prev)
        if (selected) {
          newSet.add(partnerId)
        } else {
          newSet.delete(partnerId)
        }
        return newSet
      })
    },
    [selectedPartners.size]
  )

  // Handle adding selected partners
  const handleAddPartners = useCallback(() => {
    console.log('handleAddPartners called', {
      organizationId: organization?.id,
      selectedPartnersSize: selectedPartners.size,
      allOrganizationsLength: allOrganizations.length
    })

    if (!organization?.id || selectedPartners.size === 0) {
      console.log(
        'Early return: Missing organization ID or no partners selected'
      )
      return
    }

    // Get the selected organizations' data
    const selectedOrgsData = allOrganizations.filter((org: any) =>
      selectedPartners.has(org.id)
    )

    console.log('Selected organizations data:', selectedOrgsData)
    console.log('First selected org fields:', selectedOrgsData[0])

    // Build the payload with isMember: true
    // For existing members, use primaryEmail if available, otherwise create from code/domain
    const partnerInviteDetails = selectedOrgsData.map((org: any) => {
      // Try to get email from various fields
      let email = org.email

      // If no email found, create placeholder from code or domain
      if (!email) {
        if (org.code) {
          email = `${org.code}@member.sharkdom.com`
        } else if (org.domain) {
          email = `contact@${org.domain}`
        } else {
          email = `org-${org.id}@member.sharkdom.com`
        }
      }

      console.log('Processing org:', {
        id: org.id,
        name: org.name,
        code: org.code,
        domain: org.domain,
        primaryEmail: org.primaryEmail,
        email: org.email,
        finalEmail: email,
        allKeys: Object.keys(org)
      })

      return {
        partnerName: org.name || 'Unknown Partner',
        email: email,
        company: org.name || 'Unknown Partner',
        remarks: '',
        isMember: true,
        partnerOrganizationId: org.id // Include org ID for backend reference
      }
    })

    console.log('Partner invite details:', partnerInviteDetails)

    if (partnerInviteDetails.length === 0) {
      console.error('No partners with valid email addresses selected')
      return
    }

    console.log('Calling importPartnersMutation with payload:', {
      organizationId: organization.id,
      partnerInviteDetails
    })

    // Call the import partners API with success handling
    importPartnersMutation(
      {
        organizationId: organization.id,
        partnerInviteDetails
      },
      {
        onSuccess: () => {
          console.log('Partners imported successfully!')
          handleOpenChange(false)
          setSelectedPartners(new Set())
        }
      }
    )
  }, [
    selectedPartners,
    allOrganizations,
    organization?.id,
    importPartnersMutation,
    handleOpenChange
  ])

  // Intersection observer for infinite scroll
  const observerRef = React.useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!observerRef.current || !isOpen) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 1.0 }
    )

    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className='h-[90vh] w-full max-w-6xl gap-0 overflow-hidden p-0'
        hideCloseBtn
      >
        {/* Header */}
        <div className='flex items-center justify-between px-6 pb-0 pt-6'>
          <div>
            <h2 className='mb-2 text-xl font-semibold text-black'>
              Explore New Partners
            </h2>
            <p className='text-base text-gray-800'>
              Discover verified companies open to collaboration, integration, or
              co-selling and bring the right ones into your ecosystem.
            </p>
          </div>
          <button
            onClick={() => handleOpenChange(false)}
            className='rounded-full p-2 transition-colors hover:bg-gray-100'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Filter Tags */}
        <div className='border-b px-6 py-4'>
          <div className='flex flex-wrap items-center gap-1'>
            <button
              onClick={() => setSelectedTag('ALL')}
              className={`rounded-full border px-2.5 py-1 text-sm transition-colors ${
                selectedTag === 'ALL'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 bg-white text-slate-600 hover:border-slate-400'
              }`}
            >
              All
            </button>
            {/* // I want to have a divider in between all and rest | like this  */}
            <div className='mx-2 h-8 w-[1px] bg-slate-400' />
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag.value}
                onClick={() => setSelectedTag(tag.value)}
                className={`rounded-full border px-2.5 py-1 text-sm transition-colors ${
                  selectedTag === tag.value
                    ? 'border-blue-500 bg-blue-50 text-blue-600'
                    : 'border-gray-300 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className='flex-1 overflow-y-auto p-6'>
          {isLoading ? (
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <CardSkeleton key={index} />
              ))}
            </div>
          ) : allOrganizations.length > 0 ? (
            <>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                {allOrganizations.map((org: any) => (
                  <PartnerSelectionCard
                    key={org.id}
                    data={org}
                    selected={selectedPartners.has(org.id)}
                    disabled={org.selectedForExternalPartnerships}
                    onSelect={(selected) =>
                      handlePartnerSelect(org.id, selected)
                    }
                  />
                ))}
              </div>

              {/* Infinite scroll trigger */}
              <div ref={observerRef} className='py-4'>
                {isFetchingNextPage && (
                  <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <CardSkeleton key={index} />
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className='flex h-64 flex-col items-center justify-center text-gray-500'>
              <p className='text-lg font-medium'>No partners found</p>
              <p className='text-sm'>Try selecting a different category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between border-t px-6 pb-6 pt-4'>
          {/* Selection Counter */}
          <div
            className={`flex items-center gap-2 text-sm ${
              selectedPartners.size >= MAX_PARTNERS_SELECTION
                ? 'text-orange-600'
                : 'text-gray-600'
            }`}
          >
            <span className='font-medium'>
              {selectedPartners.size} / {MAX_PARTNERS_SELECTION}
            </span>
            <span>partners selected</span>
            {selectedPartners.size >= MAX_PARTNERS_SELECTION && (
              <span className='text-xs'>(Maximum reached)</span>
            )}
          </div>

          <Button
            onClick={handleAddPartners}
            disabled={selectedPartners.size === 0 || isImporting}
            loading={isImporting}
            className='hover:bg-primary-blue/90 bg-primary-blue text-white'
          >
            {isImporting ? 'Adding Partners...' : 'Add Partners'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ExplorePartnersModal
