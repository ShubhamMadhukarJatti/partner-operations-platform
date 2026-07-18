'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { usePricingModal } from '@/contexts/pricing-modal-context'
import { hideModal } from '@/redux/slices/registerModal'
import { RootState } from '@/redux/store'
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient
} from '@tanstack/react-query'
import { ArrowRight, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'

import { getDiscoverHome, getSearchResultByFilter } from '@/lib/db/search'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationItem
} from '@/components/ui/pagination'
import { showCustomToast } from '@/components/custom-toast'
import { PagePerformance } from '@/components/performance/page-performance'
import { GradientPageBackground } from '@/components/shared/gradient-page-background'

import { FetchReferralsResponse } from '../explore-2/_components/OpenForReferralTabContent'
import OfflinePartnersEmptyState from '../offline-partners/_components/OfflinePartnersEmptyState'
import AssistantBanner from './_components/AssistantBanner'
import CardSkeleton from './_components/CardSkeleton'
import DiscoverCardGrid from './_components/DiscoverCardGrid'
import FiltersChip from './_components/FilterChip'
import FilterSidebar from './_components/FilterSidebar'
import ShortListDialog from './_components/ShortListDialog'

const DiscoverPage = () => {
  const searchParams = useSearchParams()

  const [searchState, setSearchState] = useState({
    searchQuery: '',
    searchInput: '',
    subSectorsCommaSeparated: '',
    sectorsCommaSeparated: '',
    partnershipType: '',
    partnershipArr: [] as string[],
    useCaseArr: [] as string[],
    sectorArr: [] as string[],
    complianceArr: [] as string[],
    regionArr: [] as string[],
    complianceCommaSeparated: '',
    regionCommaSeparated: ''
  })

  const [mounted, setMounted] = useState(false)
  const [hasOpenedFromSession, setHasOpenedFromSession] = useState(false)
  const [aiRecommendationProcessed, setAiRecommendationProcessed] =
    useState(false)
  const [aiDiscoverData, setAiDiscoverData] = useState<any>(null)
  const [isUsingAiData, setIsUsingAiData] = useState(false)
  const [isLoadingAiData, setIsLoadingAiData] = useState(false)
  const [selectedSort, setSelectedSort] = useState('recommended')
  const [isShortlisted, setIsShortlisted] = useState(false)
  const [page, setPage] = useState(1)
  const [showFilterSidebar, setShowFilterSidebar] = useState(true)

  const dispatch = useDispatch()
  const modalOpenedRef = useRef(false)
  const aiDataLoadedRef = useRef(false)
  const timeoutRef = useRef<NodeJS.Timeout>()
  const observerRef = useRef<HTMLDivElement>(null)
  const prevSearchInputRef = useRef<string>('')
  const isInitialMountRef = useRef(true)
  const totalLengthRef = useRef<number>(0)
  const queryClient = useQueryClient()
  const rootRef = useRef<HTMLDivElement>(null)
  const resultsScrollRef = useRef<HTMLDivElement>(null)

  const { openPricingModal } = usePricingModal()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { loading: orgLoading, organization } = saved

  const isAiRequest = searchParams.get('ai') === 'true'

  // ── Shortlisted partners ──────────────────────────────────────────────────
  const { data: shortlistedPartnersData } = useQuery({
    queryKey: ['shortlisted-partners', organization?.id],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization ID available')
      const res = await fetch(
        `/api/organization/getShortListing/${organization.id}`
      )
      if (!res.ok) throw new Error('Failed to fetch shortlisted partners')
      return (await res.json()) as any[]
    },
    enabled: !!organization?.id,
    retry: 2,
    staleTime: 5 * 60 * 1000
  })

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

  const handleComplianceChange = useCallback(
    (values: string[]) => {
      updateSearchState({
        complianceArr: values,
        complianceCommaSeparated: values.join(',')
      })
    },
    [updateSearchState]
  )

  const handleRegionChange = useCallback(
    (values: string[]) => {
      updateSearchState({
        regionArr: values,
        regionCommaSeparated: values.join(',')
      })
    },
    [updateSearchState]
  )

  const handleSortChange = useCallback((sort: string) => {
    setSelectedSort(sort)
  }, [])

  const handleResetAllFilters = useCallback(() => {
    updateSearchState({
      partnershipArr: [],
      useCaseArr: [],
      sectorArr: [],
      complianceArr: [],
      regionArr: [],
      partnershipType: '',
      subSectorsCommaSeparated: '',
      sectorsCommaSeparated: '',
      complianceCommaSeparated: '',
      regionCommaSeparated: ''
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
              : sectionKey === 'compliance'
                ? 'complianceArr'
                : sectionKey === 'region'
                  ? 'regionArr'
                  : 'sectorArr'
        const commaKey =
          sectionKey === 'partnershipType'
            ? 'partnershipType'
            : sectionKey === 'useCase'
              ? 'subSectorsCommaSeparated'
              : sectionKey === 'sector'
                ? 'sectorsCommaSeparated'
                : null
        const newArr = prev[arrKey].filter((v) => v !== value)
        return {
          ...prev,
          [arrKey]: newArr,
          ...(commaKey ? { [commaKey]: newArr.join(',') } : {})
        }
      })
    },
    []
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // ── AI data from sessionStorage ───────────────────────────────────────────
  useEffect(() => {
    if (!mounted) return

    const aiParam = searchParams.get('ai')

    if (aiParam === 'true' && aiDiscoverData) {
      setIsUsingAiData(true)
      setIsLoadingAiData(false)
      aiDataLoadedRef.current = true
      return
    }

    if (aiDataLoadedRef.current && aiParam === 'true' && !aiDiscoverData) {
      const storedData = sessionStorage.getItem('ai-discover-data')
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setAiDiscoverData(parsedData)
          setIsUsingAiData(true)
          setIsLoadingAiData(false)
          return
        } catch (error) {
          console.error('Failed to restore AI data:', error)
        }
      }
    }

    if (aiParam === 'true' && !aiDiscoverData && !aiDataLoadedRef.current) {
      setIsUsingAiData(true)
      setIsLoadingAiData(true)

      const storedData = sessionStorage.getItem('ai-discover-data')

      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setAiDiscoverData(parsedData)
          setIsLoadingAiData(false)
          aiDataLoadedRef.current = true
        } catch (error) {
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
      if (isUsingAiData || aiDataLoadedRef.current) {
        setIsUsingAiData(false)
        setAiDiscoverData(null)
        setIsLoadingAiData(false)
        aiDataLoadedRef.current = false
        sessionStorage.removeItem('ai-discover-data')
      }
    }
  }, [mounted, searchParams])

  // ── AI text param → call API ──────────────────────────────────────────────
  useEffect(() => {
    const handleAiRecommendation = async () => {
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
        setAiDiscoverData(data)
        setIsLoadingAiData(false)

        if (data.message) {
          showCustomToast('Success', data.message, 'success', 5000)
        }
      } catch (error: any) {
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

  // ── Pricing modal (avail_code=free_trial) ─────────────────────────────────
  useEffect(() => {
    if (mounted && !hasOpenedFromSession && !modalOpenedRef.current) {
      const storedAvailCode = sessionStorage.getItem('avail_code')
      const urlParams = new URLSearchParams(window.location.search)
      const urlAvailCode = urlParams.get('avail_code')

      if (storedAvailCode === 'free_trial' || urlAvailCode === 'free_trial') {
        setHasOpenedFromSession(true)
        modalOpenedRef.current = true
        if (storedAvailCode === 'free_trial') {
          sessionStorage.removeItem('avail_code')
        }
        setTimeout(() => {
          openPricingModal()
        }, 1000)
      }
    }
  }, [mounted, hasOpenedFromSession, openPricingModal])

  // ── Query ─────────────────────────────────────────────────────────────────
  const memoizedQueryKey = useMemo(
    () => [
      'explore-page',
      searchState.sectorsCommaSeparated,
      searchState.partnershipType,
      searchState.subSectorsCommaSeparated,
      searchState.searchQuery,
      searchState.complianceCommaSeparated,
      searchState.regionCommaSeparated,
      selectedSort,
      isShortlisted
    ],
    [
      searchState.sectorsCommaSeparated,
      searchState.partnershipType,
      searchState.subSectorsCommaSeparated,
      searchState.searchQuery,
      searchState.complianceCommaSeparated,
      searchState.regionCommaSeparated,
      selectedSort,
      isShortlisted
    ]
  )

  const debouncedSearch = useCallback(
    (value: string, currentFilters: typeof searchState) => {
      queryClient.invalidateQueries({
        queryKey: [
          'explore-page',
          currentFilters.sectorsCommaSeparated,
          currentFilters.partnershipType,
          currentFilters.subSectorsCommaSeparated,
          value
        ]
      })
    },
    [queryClient]
  )

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      prevSearchInputRef.current = searchState.searchInput
      return
    }

    if (searchState.searchInput === prevSearchInputRef.current) return

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      if (searchState.searchInput !== searchState.searchQuery) {
        debouncedSearch(searchState.searchInput, searchState)
        updateSearchState({ searchQuery: searchState.searchInput })
      }
      prevSearchInputRef.current = searchState.searchInput
    }, 400)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [
    searchState.searchInput,
    searchState.searchQuery,
    debouncedSearch,
    updateSearchState
  ])

  const queryFn = useCallback(
    ({ pageParam = 0 }) => {
      const hasSearch =
        !!searchState.searchQuery ||
        !!searchState.sectorsCommaSeparated ||
        !!searchState.partnershipType ||
        !!searchState.subSectorsCommaSeparated ||
        !!searchState.complianceCommaSeparated ||
        !!searchState.regionCommaSeparated ||
        selectedSort !== 'recommended' ||
        isShortlisted

      const sortFlags = {
        isRecommended: selectedSort === 'recommended' || undefined,
        isPopular: selectedSort === 'popular' || undefined,
        isMostActive: selectedSort === 'more_active' || undefined,
        isHighMatchPercentage: selectedSort === 'high_match' || undefined,
        isLowAcknowledgeTime: selectedSort === 'less_ack_time' || undefined
      }

      if (hasSearch) {
        return getSearchResultByFilter({
          keyword: searchState.searchQuery || undefined,
          sectors: searchState.sectorsCommaSeparated || undefined,
          partnershipTypes: searchState.partnershipType || undefined,
          subSectorsCommaSeparated:
            searchState.subSectorsCommaSeparated || undefined,
          compliance: searchState.complianceCommaSeparated || undefined,
          region: searchState.regionCommaSeparated || undefined,
          ...sortFlags,
          isShortlisted: isShortlisted || undefined,
          page: pageParam as number,
          size: 20,
          organizationId: organization?.id,
          queryingOrganizationId: organization?.id
        }) as Promise<FetchReferralsResponse>
      }

      return getDiscoverHome({
        page: pageParam as number,
        size: 20,
        organizationId: organization?.id,
        queryingOrganizationId: organization?.id
      }) as Promise<FetchReferralsResponse>
    },
    [
      organization?.id,
      searchState.searchQuery,
      searchState.sectorsCommaSeparated,
      searchState.partnershipType,
      searchState.subSectorsCommaSeparated,
      searchState.complianceCommaSeparated,
      searchState.regionCommaSeparated,
      selectedSort,
      isShortlisted
    ]
  )

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching
  } = useInfiniteQuery({
    queryKey: memoizedQueryKey,
    queryFn,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.pageable.pageNumber + 1,
    initialPageParam: 0,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    enabled: !!organization?.id && !isAiRequest && !isUsingAiData,
    refetchOnWindowFocus: false,
    refetchOnMount: 'always',
    refetchOnReconnect: false
  })

  // ── AI data transform ─────────────────────────────────────────────────────
  const displayData = useMemo(() => {
    if (isUsingAiData || isAiRequest) {
      if (aiDiscoverData?.organization) {
        const content = Array.isArray(aiDiscoverData.organization.content)
          ? aiDiscoverData.organization.content
          : []
        return {
          pages: [
            {
              content,
              pageable: aiDiscoverData.organization.pageable || {
                pageNumber: 0,
                pageSize: 1000
              },
              last: aiDiscoverData.organization.last ?? true,
              totalElements:
                aiDiscoverData.organization.totalElements ?? content.length,
              totalPages: aiDiscoverData.organization.totalPages ?? 1,
              first: aiDiscoverData.organization.first ?? true,
              size: aiDiscoverData.organization.size ?? 1000,
              number: aiDiscoverData.organization.number ?? 0,
              sort: aiDiscoverData.organization.sort || {},
              numberOfElements:
                aiDiscoverData.organization.numberOfElements ?? content.length,
              empty: aiDiscoverData.organization.empty ?? content.length === 0
            }
          ],
          pageParams: [0]
        }
      }
      return undefined
    }
    return data
  }, [isUsingAiData, isAiRequest, aiDiscoverData, data])

  const totalLength = useMemo(() => {
    if (isUsingAiData && aiDiscoverData?.organization?.totalElements) {
      return aiDiscoverData.organization.totalElements
    }
    return data?.pages?.[0]?.totalElements ?? 0
  }, [data?.pages?.[0]?.totalElements, isUsingAiData, aiDiscoverData])

  const shouldShowLoading = useMemo(() => {
    if (isAiRequest || isUsingAiData) {
      return !mounted || isLoadingAiData || (isUsingAiData && !aiDiscoverData)
    }
    if (isFetching && mounted) return true
    if (isLoading && !data) return true
    if (data?.pages?.length && !isFetching) {
      if (data.pages[0]?.content?.length) return false
    }
    return (
      !mounted ||
      orgLoading === 'pending' ||
      orgLoading === 'idle' ||
      !organization?.id
    )
  }, [
    mounted,
    orgLoading,
    isLoading,
    isFetching,
    organization?.id,
    data,
    isAiRequest,
    isUsingAiData,
    isLoadingAiData,
    aiDiscoverData
  ])

  const hasResults = useMemo(() => {
    if (shouldShowLoading || !displayData?.pages?.length) return false
    const firstPage = displayData.pages[0]
    const contentLength = Array.isArray(firstPage?.content)
      ? firstPage.content.length
      : 0
    return contentLength > 0 || (firstPage?.totalElements ?? 0) > 0
  }, [displayData, shouldShowLoading])

  const hideModalCallback = useCallback(() => {
    dispatch(hideModal())
  }, [dispatch])

  useEffect(() => {
    hideModalCallback()
  }, [hideModalCallback])

  useEffect(() => {
    if (!mounted) return

    const parentMain = rootRef.current?.closest('main')
    const resultsContainer = resultsScrollRef.current

    if (!parentMain || !resultsContainer) return

    const checkScrollState = () => {
      const isAtBottom =
        resultsContainer.scrollHeight <= resultsContainer.clientHeight ||
        resultsContainer.scrollTop + resultsContainer.clientHeight >=
          resultsContainer.scrollHeight - 5

      if (isAtBottom) {
        parentMain.style.overflowY = 'auto'
      } else if (parentMain.scrollTop === 0) {
        parentMain.style.overflowY = 'hidden'
      }
    }

    checkScrollState()

    resultsContainer.addEventListener('scroll', checkScrollState)

    const handleParentScroll = () => {
      if (parentMain.scrollTop === 0) {
        checkScrollState()
      }
    }
    parentMain.addEventListener('scroll', handleParentScroll)

    return () => {
      resultsContainer.removeEventListener('scroll', checkScrollState)
      parentMain.removeEventListener('scroll', handleParentScroll)
      parentMain.style.overflowY = 'auto'
    }
  }, [mounted, displayData, showFilterSidebar, shouldShowLoading])

  // ── Shortlisted helpers ───────────────────────────────────────────────────
  const shortlistedPartners = useMemo(
    () =>
      shortlistedPartnersData && Array.isArray(shortlistedPartnersData)
        ? shortlistedPartnersData
        : [],
    [shortlistedPartnersData]
  )
  const hasShortlisted = shortlistedPartners.length > 0
  const PAGE_SIZE = 8
  const totalPages = Math.ceil(shortlistedPartners.length / PAGE_SIZE)

  const paginatedPartners = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return shortlistedPartners.slice(start, start + PAGE_SIZE)
  }, [shortlistedPartners, page])

  const formatDate = (timestamp: string) => {
    if (!timestamp) return ''
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <PagePerformance />

      <GradientPageBackground className='min-h-full'>
        <div ref={rootRef} className='relative z-10 space-y-4 p-6'>
          {/* ── Row 1: Title + subtitle ── */}
          <div className='flex items-center justify-between pb-2'>
            <div>
              <h1 className='text-[28px] font-bold leading-9 text-[#2A3241] dark:text-white'>
                Discover
              </h1>
              <p className='mt-1 text-[16px] text-[#4D5C78] dark:text-muted-foreground'>
                Connect your tools to sync data and automate partner workflows
              </p>
            </div>
          </div>

          {/* ── Partners card ── */}
          <div className='rounded-lg '>
            {/* AI recommendation message */}
            {isUsingAiData && aiDiscoverData?.message && (
              <div className='mx-4 mt-3 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 p-4'>
                <p className='text-sm font-semibold text-purple-700'>
                  🤖 {aiDiscoverData.message}
                </p>
              </div>
            )}

            {/* Grid + Sidebar layout */}
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-4'>
              {/* Left: Filter sidebar — toggleable on desktop */}
              <div
                className={`${showFilterSidebar ? 'hidden lg:block' : 'hidden'}`}
              >
                <div className='sticky top-6 flex max-h-[calc(100vh-120px)] flex-col rounded-2xl'>
                  <FilterSidebar
                    partnershipType={searchState.partnershipArr}
                    useCase={searchState.useCaseArr}
                    sector={searchState.sectorArr}
                    compliance={searchState.complianceArr}
                    region={searchState.regionArr}
                    onPartnershipChange={handlePartnershipChange}
                    onUseCaseChange={handleUseCaseChange}
                    onSectorChange={handleSectorChange}
                    onComplianceChange={handleComplianceChange}
                    onRegionChange={handleRegionChange}
                    onResetAll={handleResetAllFilters}
                    selectedSort={selectedSort}
                    onSortChange={handleSortChange}
                    isShortlisted={isShortlisted}
                    onShortlistedChange={setIsShortlisted}
                  />
                </div>
              </div>

              {/* Right: cards / loading / empty */}
              <div
                className={`flex max-h-[calc(100vh-120px)] min-w-0 flex-col gap-4 ${showFilterSidebar ? 'lg:col-span-3' : 'lg:col-span-4'}`}
              >
                {/* Search + Filters applied row */}
                <div className='mt-2 w-full'>
                  <FiltersChip
                    searchQuery={searchState.searchInput}
                    setSearchInput={(value: string) =>
                      updateSearchState({ searchInput: value })
                    }
                    filters={{
                      partnershipType: searchState.partnershipArr,
                      useCase: searchState.useCaseArr,
                      sector: searchState.sectorArr,
                      compliance: searchState.complianceArr,
                      region: searchState.regionArr
                    }}
                    onRemoveFilter={handleRemoveFilter}
                    onClearAll={handleResetAllFilters}
                    onPartnershipChange={handlePartnershipChange}
                    onUseCaseChange={handleUseCaseChange}
                    onSectorChange={handleSectorChange}
                    onComplianceChange={handleComplianceChange}
                    onRegionChange={handleRegionChange}
                    selectedSort={selectedSort}
                    onSortChange={handleSortChange}
                    onToggleFilters={() => setShowFilterSidebar((v) => !v)}
                    filterSidebarVisible={showFilterSidebar}
                    isShortlisted={isShortlisted}
                    onShortlistedChange={setIsShortlisted}
                  />
                </div>

                {/* Results count */}
                {!shouldShowLoading && displayData && (
                  <div className='pb-1'>
                    <span className='text-sm text-[#4D5C78] dark:text-muted-foreground'>
                      {totalLength} Results
                    </span>
                  </div>
                )}

                {/* Scrollable Cards/Results Area */}
                <div
                  ref={resultsScrollRef}
                  className='hide-scrollbar min-h-0 flex-1 overflow-y-auto pb-4 pt-2'
                >
                  {shouldShowLoading ? (
                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
                      {Array.from({ length: 6 }).map((_, i) => (
                        <CardSkeleton key={i} />
                      ))}
                    </div>
                  ) : hasResults ? (
                    <DiscoverCardGrid
                      isFetchingNextPage={
                        isUsingAiData ? false : isFetchingNextPage
                      }
                      observerRef={observerRef}
                      fetchNextPage={fetchNextPage}
                      hasNextPage={isUsingAiData ? false : hasNextPage}
                      data={displayData}
                    />
                  ) : (
                    <div className='flex h-[60vh] items-center justify-center'>
                      <OfflinePartnersEmptyState
                        Heading='No results found!'
                        Description="We couldn't find any results for your search. Try again with different filters or keywords."
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── AI BANNER ── */}
          <div className='my-6'>
            <AssistantBanner />
          </div>
        </div>
      </GradientPageBackground>
    </>
  )
}

export default DiscoverPage
