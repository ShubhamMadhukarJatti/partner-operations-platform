import PageHeader from '@/components/shared/page-header'

import BasicResources from './_components/basic-resources'
import RecentlyUpdated from './_components/recently-updated'

async function ResourcesPage() {
  return (
    <div className='flex h-full flex-col bg-[#8B8E9621] '>
      <PageHeader
        title={'Learn how to automate your partnership experience'}
        description={'Supporting guides and videos for platform features'}
      />
      <div className='flex flex-col gap-6 px-8 py-5 '>
        <BasicResources />
        <RecentlyUpdated />
      </div>
    </div>
  )
}

export default ResourcesPage
