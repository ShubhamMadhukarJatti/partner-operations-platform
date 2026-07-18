import dynamicImport from 'next/dynamic'
import { redirect, RedirectType } from 'next/navigation'
import { checkDealPipelineStatus } from '@/services/placeholder-status'

// Dynamic import to prevent hydration issues
// If any client-side error occurs, error.tsx will catch it and redirect to /start
const DealPipeline = dynamicImport(() => import('./deal-pipeline'), {
  ssr: false,
  loading: () => (
    <div className='flex h-screen items-center justify-center'>
      <div className='h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900'></div>
    </div>
  )
})

export const dynamic = 'force-dynamic'

async function DemoPage() {
  try {
    // Check placeholder status using isolated service function
    const result = await checkDealPipelineStatus()

    if (process.env.NODE_ENV === 'development') {
      console.log('[Deal Pipeline Page] Status Check:', result)
    }

    if (!result.canContinue) {
      if (process.env.NODE_ENV === 'development') {
        console.log(
          '[Deal Pipeline Page] Cannot continue, redirecting to start page:',
          result.error
        )
      }
      redirect('/deal-pipeline/start', RedirectType.replace)
    }

    // Render the component - any client-side errors will be caught by error.tsx
    return <DealPipeline />
  } catch (error) {
    // Server-side errors are caught here and redirected
    if (process.env.NODE_ENV === 'development') {
      console.error('[Deal Pipeline Page] Server Error:', error)
    }
    // Always redirect to start page on any error
    redirect('/deal-pipeline/start', RedirectType.replace)
  }
}

export default DemoPage
