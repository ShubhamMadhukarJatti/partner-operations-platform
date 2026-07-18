import { ReactNode, Suspense } from 'react'

function PartnerMappingLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
}

export default PartnerMappingLayout
