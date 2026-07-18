import React, { Suspense } from 'react'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'

// Lazy load components
const VideoPlayer = dynamic(() => import('@/components/common/VideoPlayer'), {
  loading: () => <div className='h-[500px] animate-pulse bg-gray-100' />
})

const EbookDownloadSection = dynamic(
  () => import('@/components/marketing/EbookDownloadSection'),
  {
    loading: () => <div className='h-[400px] animate-pulse bg-gray-100' />
  }
)

const PartnerGroupAccessSection = dynamic(
  () => import('@/components/marketing/PartnerGroupAccessSection'),
  {
    loading: () => <div className='h-[400px] animate-pulse bg-gray-100' />
  }
)

const PartnerMarketingSection = dynamic(
  () => import('@/components/marketing/PartnerMarketingSection'),
  {
    loading: () => <div className='h-[400px] animate-pulse bg-gray-100' />
  }
)

const Calculate = dynamic(() => import('../_components/home-v2/Calculate'), {
  loading: () => <div className='h-[400px] animate-pulse bg-gray-100' />
})

const Calculate2 = dynamic(() => import('../_components/home-v2/Calculate2'), {
  loading: () => <div className='h-[400px] animate-pulse bg-gray-100' />
})

const FooterCta = dynamic(() => import('../_components/home-v2/FooterCta'), {
  loading: () => <div className='h-[200px] animate-pulse bg-gray-100' />
})

const Orbit = dynamic(() => import('../_components/home-v2/Orbit'), {
  loading: () => <div className='h-[400px] animate-pulse bg-gray-100' />
})

const SecureAccountMapping = dynamic(
  () => import('../_components/home-v2/SecureAccountMapping'),
  {
    loading: () => <div className='h-[400px] animate-pulse bg-gray-100' />
  }
)

export const metadata: Metadata = {
  title: 'Partner with Sharkdom',
  description:
    "Join Sharkdom's partner network and grow your business through strategic partnerships.",
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/partner'
  }
}

// Loading component for sections
const SectionLoader = ({ height = '400px' }: { height?: string }) => (
  <div className={`h-[${height}] animate-pulse bg-gray-100`} />
)

export default function PartnerPage() {
  return (
    <main className='container mx-auto px-4 py-2'>
      {/* Ebook Download Section */}
      <Suspense fallback={<SectionLoader />}>
        <div className='mx-auto max-w-6xl'>
          <EbookDownloadSection />
        </div>
      </Suspense>

      <Suspense fallback={<SectionLoader height='500px' />}>
        <VideoPlayer
          src='https://storage.googleapis.com/sharkdom_resources/dashboard_play/partner-mapping.mp4'
          height={{ base: '300px', md: '500px' }}
        />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <div className='mx-auto mt-8 max-w-6xl'>
          <PartnerMarketingSection />
        </div>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <div className='mx-auto mt-8 max-w-6xl'>
          <PartnerGroupAccessSection />
        </div>
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Calculate2 />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Calculate />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <SecureAccountMapping />
      </Suspense>

      <Suspense fallback={<SectionLoader />}>
        <Orbit />
      </Suspense>

      {/* <Suspense fallback={<SectionLoader height='200px' />}>
        <FooterCta />
      </Suspense> */}
    </main>
  )
}
