import { ReactNode } from 'react'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { GoogleTagManager } from '@next/third-parties/google'

import Providers from './_components/Providers'

export const metadata: Metadata = {
  title: 'Sharkdom Integrations | Modern day partner ops platform',
  description: 'Sharkdom Integrations | Modern day partner ops platform',
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/integrations'
  }
}

const inter = Inter({ subsets: ['latin'] })

export default function IntegrationsLayout({
  children
}: {
  children: ReactNode
}) {
  return (
    <div className={inter.className}>
      <Providers>
        {children}
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      </Providers>
    </div>
  )
}
