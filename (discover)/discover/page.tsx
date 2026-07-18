import { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

import { getSearchResultDiscover } from '@/lib/db/search'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from '@/components/ui/pagination'
import { PagePerformance } from '@/components/performance/page-performance'
import { CardSkeleton } from '@/app/(app)/(dashboard-pages)/explore-2/_components/InputBasedTabContent'

// Dynamic import for better code splitting
const OrganizationCardDiscover = dynamic(
  () => import('@/app/(app)/(dashboard-pages)/explore-2/_components/org-card'),
  {
    loading: () => <CardSkeleton />,
    ssr: true
  }
)

export const metadata: Metadata = {
  title: 'Sharkdom Discover | Modern day partner ops platform',
  description:
    'Discover your next ideal Partner with the #1 destination for onboarding Partners to grow and scale your business.'
}

// Memoized pagination component for better performance
const PaginationItems = ({
  currentPage,
  totalPages
}: {
  currentPage: number
  totalPages: number
}) => {
  const paginationItems = []
  const showPages = 3

  // Ensure page and totalPages are valid numbers
  const currentPageNum = isNaN(currentPage) ? 1 : Math.max(1, currentPage)
  const totalPageCount = isNaN(totalPages) ? 1 : totalPages

  // Calculate start and end pages to show
  let startPage = Math.max(1, currentPageNum - Math.floor(showPages / 2))
  let endPage = Math.min(totalPageCount, startPage + showPages - 1)

  // Adjust start page if end page is at the maximum
  if (endPage === totalPageCount) {
    startPage = Math.max(1, endPage - showPages + 1)
  }

  // Show first page and ellipsis if necessary
  if (startPage > 1) {
    paginationItems.push(
      <PaginationItem key={1}>
        <PaginationLink href={`?page=1`} isActive={currentPageNum === 1}>
          1
        </PaginationLink>
      </PaginationItem>
    )
    if (startPage > 2) {
      paginationItems.push(
        <PaginationItem key='start-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
  }

  // Show pages
  for (let i = startPage; i <= endPage; i++) {
    paginationItems.push(
      <PaginationItem key={i}>
        <PaginationLink href={`?page=${i}`} isActive={currentPageNum === i}>
          {i}
        </PaginationLink>
      </PaginationItem>
    )
  }

  // Show last page and ellipsis if necessary
  if (endPage < totalPageCount) {
    if (endPage < totalPageCount - 1) {
      paginationItems.push(
        <PaginationItem key='end-ellipsis'>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
    paginationItems.push(
      <PaginationItem key={totalPageCount}>
        <PaginationLink
          href={`?page=${totalPageCount}`}
          isActive={currentPageNum === totalPageCount}
        >
          {totalPageCount}
        </PaginationLink>
      </PaginationItem>
    )
  }

  return <>{paginationItems}</>
}

// Loading component for the organization grid
const OrganizationGridSkeleton = () => (
  <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: 9 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
)

// Main content component wrapped in Suspense
const DiscoverContent = async ({ searchParams }: { searchParams: any }) => {
  let page = parseInt(searchParams.page, 10) || 1

  try {
    const [searchResult] = await Promise.all([
      getSearchResultDiscover({
        page: page - 1,
        size: 10,
        sectorsCommaSeparated: '',
        partnershipType: ''
      })
    ])

    const totalPages = searchResult.totalPages || 1

    // Early return if no content
    if (!searchResult.content || searchResult.content.length === 0) {
      return (
        <div className='flex h-64 items-center justify-center'>
          <p className='text-shark-lg text-text-80'>
            No organizations found. Please try different search criteria.
          </p>
        </div>
      )
    }

    return (
      <>
        <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {searchResult.content.map((item: any) => (
            <OrganizationCardDiscover key={item.id} organization={item} />
          ))}
        </div>

        {totalPages > 1 && (
          <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className='[&>span]:hidden lg:[&>span]:inline-block'
                    href={`?page=${Math.max(page - 1, 1)}`}
                  />
                </PaginationItem>

                <PaginationItems currentPage={page} totalPages={totalPages} />

                <PaginationItem>
                  <PaginationNext
                    className='[&>span]:hidden lg:[&>span]:inline-block'
                    href={`?page=${Math.min(page + 1, totalPages)}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    )
  } catch (error) {
    console.error('Error fetching discover data:', error)
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-shark-lg text-text-80'>
          Error loading organizations. Please try again later.
        </p>
      </div>
    )
  }
}

const DiscoverPage = async ({ searchParams }: any) => {
  return (
    <>
      <PagePerformance />
      <MaxWidthWrapper className='max-w-6xl'>
        <div className='my-8 flex'>
          <div className=''>
            {/* <ExploreFilters
              // config={{
              //   preferredSectors: preferredSectors,
              //   preferredPartnerships: preferredPartnerships,
              //   preferredSubSectors: preferredSubSectors
              // }}
              isDiscover
            /> */}
          </div>
          <div className='mx-4 lg:mx-12'>
            {/* <SearchHeader isDiscover /> */}
            <div>
              {/* <Tabs tabs={tabs} /> */}
              <Suspense fallback={<OrganizationGridSkeleton />}>
                <DiscoverContent searchParams={searchParams} />
              </Suspense>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  )
}

export default DiscoverPage
