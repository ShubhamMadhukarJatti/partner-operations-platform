import MaxWidthWrapper from '@/components/ui/max-width-wrapper'
import { CardSkeleton } from '@/app/(app)/(dashboard-pages)/explore-2/_components/InputBasedTabContent'

// Loading component for the organization grid
const OrganizationGridSkeleton = () => (
  <div className='mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
    {Array.from({ length: 9 }).map((_, index) => (
      <CardSkeleton key={index} />
    ))}
  </div>
)

export default function DiscoverLoading() {
  return (
    <MaxWidthWrapper className='max-w-6xl'>
      <div className='my-8 flex'>
        <div className=''>{/* Placeholder for filters */}</div>
        <div className='mx-4 lg:mx-12'>
          {/* Placeholder for search header */}
          <div>
            {/* Placeholder for tabs */}
            <OrganizationGridSkeleton />
          </div>
        </div>
      </div>
    </MaxWidthWrapper>
  )
}
