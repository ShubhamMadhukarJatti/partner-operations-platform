import { Metadata } from 'next'

import {
  configPartnership,
  configSectors,
  configSubSector
} from '@/config/data'
import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { Providers } from '@/components/providers'
import ExploreFilters from '@/app/(app)/(dashboard-pages)/explore-2/_components/explore-filters'
import SearchHeader from '@/app/(app)/(dashboard-pages)/explore-2/_components/search-header'
import ExploreSearchResults from '@/app/(app)/(dashboard-pages)/explore-2/_components/search-page'
import Tabs from '@/app/(app)/(dashboard-pages)/explore-2/_components/tabs'

export const metadata: Metadata = {
  title: 'Sharkdom Search | Modern day partner ops platform',
  description:
    'Search your next ideal Partner with the #1 destination for onboarding Partners to grow and scale your business.'
}

type Props = {}
interface Tab {
  id: string
  label: string
}
const tabs: Tab[] = [
  { id: '/discover', label: 'Open for partner referrals' },
  { id: '/discover/search', label: 'Based on your inputs' }
]
const ExploreSearchPage = async ({ searchParams }: any) => {
  return (
    <MaxWidthWrapper className='max-w-6xl'>
      <div className='my-8 flex'>
        <div>
          <ExploreFilters isDiscover />
        </div>
        <div>
          {/* <SearchHeader isDiscover /> */}
          <div>
            {/* <Tabs tabs={tabs} /> */}
            <div>
              <ExploreSearchResults currentOrganization={{}} />
            </div>
            <div></div>
            {/* <div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href={`?page=${Math.max(page - 1, 1)}`} />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    href={`?page=${Math.min(page + 1, totalPages)}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div> */}
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}

export default ExploreSearchPage
