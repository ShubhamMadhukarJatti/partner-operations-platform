import dynamicImport from 'next/dynamic'
import { redirect, RedirectType } from 'next/navigation'
import { checkPartnerMappingStatus } from '@/services/placeholder-status'

// Dynamic import to prevent hydration issues
const PartnerMapping = dynamicImport(() => import('./partner-mapping'), {
  ssr: false,
  loading: () => (
    <div className='flex h-screen items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900'></div>
    </div>
  )
})

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function PartnerMappingDemoPage() {
  try {
    // Check placeholder status using isolated service function
    const result = await checkPartnerMappingStatus()

    console.log('[Partner Mapping Page] Status Check:', result)

    if (!result.canContinue) {
      console.log(
        '[Partner Mapping Page] Cannot continue, redirecting to start page:',
        result.error
      )
      redirect('/partner-mapping/start', RedirectType.replace)
    }

    // Success UI - but wrap in error boundary
    return <PartnerMapping />
  } catch (error) {
    console.error('[Partner Mapping Page] Error:', error)
    // Always redirect to start page on any error
    redirect('/partner-mapping/start', RedirectType.replace)
  }
}

export default PartnerMappingDemoPage
