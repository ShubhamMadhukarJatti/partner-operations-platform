import React, { ReactNode } from 'react'
import { GoogleTagManager } from '@next/third-parties/google'

const ExploreLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      {children}
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
    </div>
  )
}

export default ExploreLayout
