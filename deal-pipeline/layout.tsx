import { ReactNode, Suspense } from 'react'

import { GradientPageBackground } from '@/components/shared/gradient-page-background'

function DealPipelineLayout({ children }: { children: ReactNode }) {
  return (
    <GradientPageBackground className='min-h-full'>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </GradientPageBackground>
  )
}

export default DealPipelineLayout
