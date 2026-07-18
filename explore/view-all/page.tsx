'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePricingModal } from '@/contexts/pricing-modal-context'
import { hideModal } from '@/redux/slices/registerModal'
import { RootState } from '@/redux/store'
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, SlidersHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { getSearchResultByFilter } from '@/lib/db/search'
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
import ParentWithChips from '../_components/FilterChip'
import FiltersChip from '../_components/FilterChip'
import FilterDropdown from '../_components/FiltersDropdown'
import FilterDropdownAdvance from '../_components/FiltersDropdown'
import { HeaderSection } from '../_components/HeaderWrapper'
import MobileFilters from '../_components/mobile-components/MobileFilters'
import MobileHeader from '../_components/mobile-components/MobileHeader'
import PreferenceSetting from '../_components/preference-setting/PreferenceSetting'
import RecommendedDropdown from '../_components/RecommendedDropdown'
import SearchInput from '../_components/search'
import { FetchReferralsResponse } from '../../explore-2/_components/OpenForReferralTabContent'
import OfflinePartnersEmptyState from '../../offline-partners/_components/OfflinePartnersEmptyState'

interface Tab {
  id: string
  label: string
}

const tabs: Tab[] = [
  { id: '/discover', label: 'Open for partner referrals' },
  { id: '/discover/search', label: 'Based on your inputs' }
]

// Memoized loading skeleton component
const LoadingSkeleton = React.memo(() => (
  <div className=''>
    <div className='grid grid-cols-1 gap-4'>
      {Array(4)
        .fill(0)
        .map((_, index) => (
          <CardSkeleton key={index} />
        ))}
    </div>
  </div>
))

LoadingSkeleton.displayName = 'LoadingSkeleton'

// Memoized sidebar component
const Sidebar = React.memo(
  ({
    searchInput,
    setSearchInput
  }: {
    searchInput: string
    setSearchInput: (value: string) => void
  }) => (
    <aside className='ml-6 hidden h-full w-[305px] shrink-0 flex-col gap-6 lg:flex'>
      <ScrollArea className='hide-scrollbar h-[calc(100vh-110px)]'>
        <div className='flex h-full w-full flex-col gap-6'>
          <PreferenceSetting />
          <SearchInput
            searchQuery={searchInput}
            handleInput={(e) => setSearchInput(e.target.value)}
          />
          <CompanyProfileFilter />
        </div>
      </ScrollArea>
    </aside>
  )
)

Sidebar.displayName = 'Sidebar'

const DiscoverPage = () => {
  // Consolidate related state into objects to reduce re-renders
  const [searchState, setSearchState] = useState({
    searchQuery: '',
    searchInput: '',
    subSectorsCommaSeparated: '',
    partnershipType: '',
    sectorsCommaSeparated: '',
    partnershipArr: [] as string[],
    useCaseArr: [] as string[],
    sectorArr: [] as string[]
  })

  const [mounted, setMounted] = useState(false)
  const [hasOpenedFromSession, setHasOpenedFromSession] = useState(false)
  const [aiRecommendationProcessed, setAiRecommendationProcessed] =
    useState(false)
  const [aiDiscoverData, setAiDiscoverData] = useState<any>(null)
  const [isUsingAiData, setIsUsingAiData] = useState(false)
  const [isLoadingAiData, setIsLoadingAiData] = useState(false)
  const dispatch = useDispatch()
  const modalOpenedRef = useRef(false)
  const aiDataLoadedRef = useRef(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const searchParams = useSearchParams()

  // Check immediately if this is an AI request
  const isAiRequest = searchParams.get('ai') === 'true'

  // Pricing modal hook - using global context
  const { openPricingModal } = usePricingModal()

  const observerRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const queryClient = useQueryClient()
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization } = saved

  // Memoized state setters to prevent unnecessary re-renders
  const updateSearchState = useCallback(
    (updates: Partial<typeof searchState>) => {
      setSearchState((prev) => ({ ...prev, ...updates }))
    },
    []
  )

  const handlePartnershipChange = useCallback(
    (values: string[]) => {
      updateSearchState({
        partnershipArr: values,
        partnershipType: values.join(',')
      })
    },
    [updateSearchState]
  )

  const handleUseCaseChange = useCallback(
    (values: string[]) => {
      updateSearchState({
        useCaseArr: values,
        subSectorsCommaSeparated: values.join(',')
      })
    },
    [updateSearchState]
  )

  const handleSectorChange = useCallback(
    (values: string[]) => {
      updateSearchState({
        sectorArr: values,
        sectorsCommaSeparated: values.join(',')
      })
    },
    [updateSearchState]
  )

  const handleResetAllFilters = useCallback(() => {
    updateSearchState({
      partnershipArr: [],
      useCaseArr: [],
      sectorArr: [],
      partnershipType: '',
      subSectorsCommaSeparated: '',
      sectorsCommaSeparated: ''
    })
  }, [updateSearchState])

  const handleRemoveFilter = useCallback(
    (sectionKey: string, value: string) => {
      setSearchState((prev) => {
        const arrKey =
          sectionKey === 'partnershipType'
            ? 'partnershipArr'
            : sectionKey === 'useCase'
              ? 'useCaseArr'
              : 'sectorArr'
        const commaKey =
          sectionKey === 'partnershipType'
            ? 'partnershipType'
            : sectionKey === 'useCase'
              ? 'subSectorsCommaSeparated'
              : 'sectorsCommaSeparated'
        const newArr = prev[arrKey].filter((v) => v !== value)
        return { ...prev, [arrKey]: newArr, [commaKey]: newArr.join(',') }
      })
    },
    []
  )

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Check for AI discover data in sessionStorage - run when mounted or ai param changes
  useEffect(() => {
    if (!mounted) return

    const aiParam = searchParams.get('ai')

    // If we already have data in state AND it's an AI request, preserve it
    if (aiParam === 'true' && aiDiscoverData) {
      setIsUsingAiData(true)
      setIsLoadingAiData(false)
      aiDataLoadedRef.current = true
      console.log('✅ Preserving existing AI data in state')
      return
    }

    // If already loaded but lost state somehow, try to restore from sessionStorage
    if (aiDataLoadedRef.current && aiParam === 'true' && !aiDiscoverData) {
      const storedData = sessionStorage.getItem('ai-discover-data')
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setAiDiscoverData(parsedData)
          setIsUsingAiData(true)
          setIsLoadingAiData(false)
          console.log('✅ Restored AI data from sessionStorage')
          return
        } catch (error) {
          console.error('❌ Failed to restore AI data:', error)
        }
      }
    }

    if (aiParam === 'true' && !aiDiscoverData && !aiDataLoadedRef.current) {
      setIsUsingAiData(true) // Set this immediately to prevent normal query
      setIsLoadingAiData(true)

      const storedData = sessionStorage.getItem('ai-discover-data')
      console.log('📦 Checking sessionStorage for AI data...', {
        hasData: !!storedData
      })

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          console.log('✅ Parsed AI discover data:', {
            hasMessage: !!parsedData.message,
            hasOrganization: !!parsedData.organization,
            contentLength: parsedData.organization?.content?.length || 0,
            totalElements: parsedData.organization?.totalElements || 0
          })

          setAiDiscoverData(parsedData)
          setIsLoadingAiData(false)
          aiDataLoadedRef.current = true
          // DO NOT remove from sessionStorage - keep it for state persistence
        } catch (error) {
          console.error('❌ Failed to parse AI discover data:', error)
          showCustomToast(
            'Error',
            'Failed to load AI recommendations',
            'error',
            5000
          )
          setIsLoadingAiData(false)
          setIsUsingAiData(false)
          aiDataLoadedRef.current = false
          sessionStorage.removeItem('ai-discover-data')
        }
      } else {
        // No data found in sessionStorage
        console.warn('⚠️ No AI data in sessionStorage')
        setIsLoadingAiData(false)
        setIsUsingAiData(false)
        aiDataLoadedRef.current = false
        showCustomToast(
          'Error',
          'AI recommendations data not found. Please try again.',
          'error',
          5000
        )
      }
    } else if (aiParam !== 'true') {
      // Not an AI request anymore - clear AI data
      if (isUsingAiData || aiDataLoadedRef.current) {
        console.log('🔄 Clearing AI data - not an AI request')
        setIsUsingAiData(false)
        setAiDiscoverData(null)
        setIsLoadingAiData(false)
        aiDataLoadedRef.current = false
        sessionStorage.removeItem('ai-discover-data')
      }
    }
  }, [mounted, searchParams])

  // Handle AI recommendation from URL parameter - call Dweep AI API when text parameter exists
  useEffect(() => {
    const handleAiRecommendation = async () => {
      // Skip if already processed, not mounted, no org, or if it's an AI request (handled by sessionStorage)
      if (
        !mounted ||
        aiRecommendationProcessed ||
        !organization?.id ||
        isAiRequest
      )
        return

      const textParam = searchParams.get('text')
      if (!textParam) return

      try {
        setAiRecommendationProcessed(true)
        setIsLoadingAiData(true)
        setIsUsingAiData(true)

        // Call Dweep AI API when text parameter exists
        const res = await fetch(
          `/api/ai-discover?input=${encodeURIComponent(textParam)}`
        )

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(
            errorData.message || 'Failed to get AI recommendations'
          )
        }

        const data = await res.json()

        console.log('📥 API Response:', {
          hasMessage: !!data.message,
          hasOrganization: !!data.organization,
          contentLength: data.organization?.content?.length || 0,
          totalElements: data.organization?.totalElements || 0,
          organization: data.organization
        })

        // Set AI discover data directly
        setAiDiscoverData(data)
        setIsLoadingAiData(false)

        // Show success message with remaining credits
        if (data.message) {
          showCustomToast('Success', data.message, 'success', 5000)
        }

        console.log('✅ Set AI discover data state, isLoadingAiData:', false)
      } catch (error: any) {
        console.error('Error getting AI recommendations:', error)
        showCustomToast(
          'Error',
          error.message ||
            'Failed to get AI recommendations. Please try again.',
          'error',
          5000
        )
        setAiRecommendationProcessed(false)
        setIsLoadingAiData(false)
        setIsUsingAiData(false)
      }
    }

    handleAiRecommendation()
  }, [
    mounted,
    aiRecommendationProcessed,
    organization?.id,
    searchParams,
    isAiRequest
  ])

  // Check for avail_code=free_trial and open pricing modal (only once)
  useEffect(() => {
    if (mounted && !hasOpenedFromSession && !modalOpenedRef.current) {
      // Check both sessionStorage and URL parameters
      const storedAvailCode = sessionStorage.getItem('avail_code')
      const urlParams = new URLSearchParams(window.location.search)
      const urlAvailCode = urlParams.get('avail_code')

      if (storedAvailCode === 'free_trial' || urlAvailCode === 'free_trial') {
        setHasOpenedFromSession(true)
        modalOpenedRef.current = true
        // Clear the stored value so it doesn't open again
        if (storedAvailCode === 'free_trial') {
          sessionStorage.removeItem('avail_code')
        }
        // Small delay to ensure the page is fully loaded
        setTimeout(() => {
          openPricingModal()
        }, 1000)
      }
    }
  }, [mounted, hasOpenedFromSession, openPricingModal]) // Now safe to include openPricingModal since it's memoized

  // Memoized query key to prevent unnecessary query invalidation
  const memoizedQueryKey = useMemo(
    () => [
      'discover-page',
      searchState.partnershipType,
      searchState.subSectorsCommaSeparated,
      searchState.sectorsCommaSeparated,
      searchState.searchQuery
    ],
    [
      searchState.partnershipType,
      searchState.subSectorsCommaSeparated,
      searchState.sectorsCommaSeparated,
      searchState.searchQuery
    ]
  )

  // Debounced search logic with useCallback
  const debouncedSearch = useCallback(
    (value: string) => {
      queryClient.invalidateQueries({
        queryKey: [
          'discover-page',
          searchState.partnershipType,
          searchState.subSectorsCommaSeparated,
          searchState.sectorsCommaSeparated,
          value
        ]
      })
    },
    [queryClient, memoizedQueryKey]
  )

  // Optimized debounced search effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      debouncedSearch(searchState.searchInput)
      updateSearchState({ searchQuery: searchState.searchInput })
    }, 400)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [searchState.searchInput, debouncedSearch, updateSearchState])

  // Memoized query function to prevent unnecessary re-creation
  const queryFn = useCallback(
    ({ pageParam = 0 }) => {
      const searchParams = {
        page: pageParam as number,
        size: 20,
        keyword: searchState.searchQuery.trim() || undefined, // Only send if not empty
        filters: searchState.subSectorsCommaSeparated.trim() || undefined,
        sectorType: searchState.sectorsCommaSeparated.trim() || undefined, // Sector filters
        partnershipTypes: searchState.partnershipType.trim() || undefined, // Main partnership types
        subSectorsCommaSeparated:
          searchState.subSectorsCommaSeparated.trim() || undefined,
        queryingOrganizationId: organization?.id,
        organizationId: organization?.id
      }

      console.log('Search params being sent:', searchParams)

      return getSearchResultByFilter(
        searchParams
      ) as Promise<FetchReferralsResponse>
    },
    [
      searchState.searchQuery,
      searchState.subSectorsCommaSeparated,
      searchState.sectorsCommaSeparated,
      searchState.partnershipType ??
        organization?.preferredPartnershipTypes.join(','),
      organization?.id
    ]
  )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  } = useInfiniteQuery({
    queryKey: memoizedQueryKey,
    queryFn,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes (formerly cacheTime)
    enabled: !!organization?.id && !isAiRequest && !isUsingAiData // Disable query if AI request
  })

  // Transform AI discover data to match the expected data structure
  const displayData = useMemo(() => {
    // If using AI data, only return it if we actually have the data
    if (isUsingAiData || isAiRequest) {
      if (aiDiscoverData) {
        console.log('🔄 Transforming AI data:', {
          hasOrganization: !!aiDiscoverData.organization,
          hasContent: !!aiDiscoverData.organization?.content,
          contentLength: aiDiscoverData.organization?.content?.length || 0,
          totalElements: aiDiscoverData.organization?.totalElements || 0
        })

        // Check if we have the organization data
        if (aiDiscoverData.organization) {
          const content = Array.isArray(aiDiscoverData.organization.content)
            ? aiDiscoverData.organization.content
            : []

          const transformedData = {
            pages: [
              {
                content: content,
                pageable: aiDiscoverData.organization.pageable || {
                  pageNumber: 0,
                  pageSize: 1000,
                  sort: { sorted: true, empty: false, unsorted: false },
                  offset: 0,
                  paged: true,
                  unpaged: false
                },
                last: aiDiscoverData.organization.last ?? true,
                totalElements:
                  aiDiscoverData.organization.totalElements ?? content.length,
                totalPages: aiDiscoverData.organization.totalPages ?? 1,
                first: aiDiscoverData.organization.first ?? true,
                size: aiDiscoverData.organization.size ?? 1000,
                number: aiDiscoverData.organization.number ?? 0,
                sort: aiDiscoverData.organization.sort || {
                  sorted: true,
                  empty: false,
                  unsorted: false
                },
                numberOfElements:
                  aiDiscoverData.organization.numberOfElements ??
                  content.length,
                empty: aiDiscoverData.organization.empty ?? content.length === 0
              }
            ],
            pageParams: [0]
          }
          console.log('✅ Transformed AI data:', {
            pages: transformedData.pages.length,
            contentLength: transformedData.pages[0].content.length,
            totalElements: transformedData.pages[0].totalElements,
            numberOfElements: transformedData.pages[0].numberOfElements
          })
          return transformedData
        } else {
          console.warn('⚠️ AI data exists but organization is missing')
        }
      }
      // If AI request but no data yet, return undefined to show loading
      console.log('⚠️ AI data not ready yet', {
        isUsingAiData,
        isAiRequest,
        hasAiData: !!aiDiscoverData
      })
      return undefined
    }
    // Otherwise return normal query data
    return data
  }, [isUsingAiData, isAiRequest, aiDiscoverData, data])

  console.log('📊 Display data:', displayData)
  console.log('🤖 Is using AI data:', isUsingAiData)
  console.log('🤖 AI request:', isAiRequest)
  console.log('🤖 AI discover data:', aiDiscoverData)
  // Memoized loading state calculation
  const shouldShowLoading = useMemo(() => {
    // If it's an AI request, show loading only while loading AI data or not mounted
    if (isAiRequest || isUsingAiData) {
      return !mounted || isLoadingAiData || (isUsingAiData && !aiDiscoverData)
    }
    // Otherwise use normal loading logic
    return (
      !mounted ||
      orgLoading === 'pending' ||
      orgLoading === 'idle' ||
      isLoading ||
      !organization?.id
    )
  }, [
    mounted,
    orgLoading,
    isLoading,
    organization?.id,
    isAiRequest,
    isUsingAiData,
    isLoadingAiData,
    aiDiscoverData
  ])

  // Memoized hide modal callback
  const hideModalCallback = useCallback(() => {
    dispatch(hideModal())
  }, [dispatch])

  useEffect(() => {
    hideModalCallback()
  }, [hideModalCallback])

  // Memoized mobile filters props
  const mobileFiltersProps = useMemo(
    () => ({
      searchQuery: searchState.searchQuery,
      setSearchQuery: ((value: string | ((prev: string) => string)) => {
        const newValue =
          typeof value === 'function' ? value(searchState.searchQuery) : value
        updateSearchState({ searchQuery: newValue })
      }) as React.Dispatch<React.SetStateAction<string>>,
      subSectorsCommaSeparated: searchState.subSectorsCommaSeparated,
      setSubSectorsCommaSeparated: ((
        value: string | ((prev: string) => string)
      ) => {
        const newValue =
          typeof value === 'function'
            ? value(searchState.subSectorsCommaSeparated)
            : value
        updateSearchState({ subSectorsCommaSeparated: newValue })
      }) as React.Dispatch<React.SetStateAction<string>>,
      partnershipType: searchState.partnershipType,
      setPartnershipType: ((value: string | ((prev: string) => string)) => {
        const newValue =
          typeof value === 'function'
            ? value(searchState.partnershipType)
            : value
        updateSearchState({ partnershipType: newValue })
      }) as React.Dispatch<React.SetStateAction<string>>
    }),
    [searchState, updateSearchState]
  )

  // Memoized advance filter props
  const advanceFilterProps = useMemo(
    () => ({
      searchQuery: searchState.searchQuery,
      setSearchQuery: ((value: string | ((prev: string) => string)) => {
        const newValue =
          typeof value === 'function' ? value(searchState.searchQuery) : value
        updateSearchState({ searchQuery: newValue })
      }) as React.Dispatch<React.SetStateAction<string>>,
      subSectorsCommaSeparated: searchState.subSectorsCommaSeparated,
      setSubSectorsCommaSeparated: ((
        value: string | ((prev: string) => string)
      ) => {
        const newValue =
          typeof value === 'function'
            ? value(searchState.subSectorsCommaSeparated)
            : value
        updateSearchState({ subSectorsCommaSeparated: newValue })
      }) as React.Dispatch<React.SetStateAction<string>>,
      partnershipType: searchState.partnershipType,
      setPartnershipType: ((value: string | ((prev: string) => string)) => {
        const newValue =
          typeof value === 'function'
            ? value(searchState.partnershipType)
            : value
        updateSearchState({ partnershipType: newValue })
      }) as React.Dispatch<React.SetStateAction<string>>
    }),
    [searchState, updateSearchState]
  )

  // Memoized mobile header props
  const mobileHeaderProps = useMemo(
    () => ({
      searchQuery: searchState.searchQuery,
      setSearchQuery: ((value: string | ((prev: string) => string)) => {
        const newValue =
          typeof value === 'function' ? value(searchState.searchQuery) : value
        updateSearchState({ searchQuery: newValue })
      }) as React.Dispatch<React.SetStateAction<string>>,
      partnershipType: searchState.partnershipType,
      subSectorsCommaSeparated: searchState.subSectorsCommaSeparated
    }),
    [searchState, updateSearchState]
  )

  const handleSort = (opt: any) => {
    console.log('selected sort:', opt)
    // apply sort/filter logic
  }

  // Check if we should show results
  const hasResults = useMemo(() => {
    if (shouldShowLoading) {
      console.log('⏳ Still loading, not showing results')
      return false
    }
    if (!displayData) {
      console.log('❌ No display data')
      return false
    }
    if (!displayData.pages || displayData.pages.length === 0) {
      console.log('❌ No pages in display data')
      return false
    }

    const firstPage = displayData.pages[0]
    if (!firstPage) {
      console.log('❌ First page is missing')
      return false
    }

    const content = firstPage.content
    const contentLength = Array.isArray(content) ? content.length : 0
    const totalElements = firstPage.totalElements ?? 0

    console.log('📊 Results check:', {
      contentLength,
      totalElements,
      hasContent: !!content,
      isArray: Array.isArray(content),
      willShow: contentLength > 0 || totalElements > 0
    })

    // Show results if we have content OR totalElements > 0
    return contentLength > 0 || totalElements > 0
  }, [displayData, shouldShowLoading])

  return (
    <>
      <PagePerformance />
      <div className=''>
        <div className='hide-scrollbar p-0'>
          <HeaderSection title={'All Partners'} />

          <div className='relative m-6 flex h-full flex-col gap-6 rounded-lg border'>
            {/* Mobile filters */}
            {/* <MobileFilters {...mobileFiltersProps} /> */}

            {/* Desktop sidebar */}
            {/* <Sidebar
              searchInput={searchState.searchInput}
              setSearchInput={(value: string) =>
                updateSearchState({ searchInput: value })
              }
            /> */}

            <section className='grow px-4 lg:px-0 '>
              <div className='w-full'>
                <FiltersChip
                  searchQuery={searchState?.searchInput}
                  setSearchInput={(value: string) =>
                    updateSearchState({ searchInput: value })
                  }
                  filters={{
                    partnershipType: searchState.partnershipArr,
                    useCase: searchState.useCaseArr,
                    sector: searchState.sectorArr
                  }}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleResetAllFilters}
                  onPartnershipChange={handlePartnershipChange}
                  onUseCaseChange={handleUseCaseChange}
                  onSectorChange={handleSectorChange}
                />
              </div>
              {(() => {
                console.log('🎨 Rendering check:', {
                  shouldShowLoading,
                  hasDisplayData: !!displayData,
                  hasResults,
                  isUsingAiData,
                  aiDataLength:
                    aiDiscoverData?.organization?.content?.length || 0
                })

                if (shouldShowLoading) {
                  return (
                    <div className='w-full p-4'>
                      <LoadingSkeleton />
                    </div>
                  )
                }

                if (displayData && hasResults) {
                  return (
                    <>
                      {isUsingAiData && aiDiscoverData?.message && (
                        <div className='mx-4 my-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-4'>
                          <p className='text-sm font-semibold text-purple-700'>
                            🤖 {aiDiscoverData.message}
                          </p>
                        </div>
                      )}
                      <DiscoverCardGrid
                        isFetchingNextPage={
                          isUsingAiData ? false : isFetchingNextPage
                        }
                        observerRef={observerRef}
                        fetchNextPage={fetchNextPage}
                        hasNextPage={isUsingAiData ? false : hasNextPage}
                        data={displayData}
                      />
                    </>
                  )
                }

                return (
                  <div className='flex h-[80vh] items-center justify-center bg-[#F9F9F9] sm:h-[70vh] md:h-[75vh]'>
                    <OfflinePartnersEmptyState
                      Heading='No results found!'
                      Description="We couldn't find any results for your search. Try again with different filters or keywords."
                    />
                  </div>
                )
              })()}
              {/* <MobileHeader {...mobileHeaderProps} />
              <AssistantBanner /> */}

              {/* <div className='my-6'>
                <AdvanceFilter {...advanceFilterProps} />
              </div> */}
            </section>
          </div>
        </div>
      </div>
    </>
  )
}

export default DiscoverPage
