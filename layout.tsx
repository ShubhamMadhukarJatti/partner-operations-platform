import { Metadata } from 'next'
import { headers } from 'next/headers'
import Script from 'next/script'

import {
  DEFAULT_PRICING_REGION,
  detectPricingRegion,
  MARKETING_LOCALE_HEADER,
  pricingRegionFromLocalePrefix
} from '@/lib/pricing-region'

import { Footer } from './_components/layout/footer'
import NewHeader from './_components/layout/NewHeader'

export const metadata: Metadata = {
  title: 'Sharkdom | Modern day Partner ops Platform',
  description:
    'Sharkdom is the AI-native partner ops platform for B2B SaaS teams. Handle onboarding deal registration co-sell pipeline and AI partner matching all in one place.',
  keywords: [
    'partner management platform',
    'partner ops B2B SaaS',
    'AI partner matching'
  ],
  robots: {
    index: true,
    follow: true
  },
  alternates: {
    canonical: 'https://www.sharkdom.com/'
  }
}

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  const headerList = headers()
  const localeFromPath = headerList.get(MARKETING_LOCALE_HEADER)
  const forcedRegionFromLocale = pricingRegionFromLocalePrefix(localeFromPath)
  const detectedRegion = await detectPricingRegion(headerList, {
    allowIpLookup: false
  })
  const initialRegion =
    forcedRegionFromLocale ?? detectedRegion ?? DEFAULT_PRICING_REGION

  return (
    <>
      <Script
        id='preload-hero-image'
        strategy='beforeInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = '/hero-image.webp';
            document.head.appendChild(link);
          `
        }}
      />

      <Script
        id='schema-service-pages'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'sharkdom',
            image:
              'https://www.sharkdom.com/_next/static/media/full-logo.ead0e140.svg',
            '@id': '',
            url: 'https://www.sharkdom.com/',
            telephone: '+91 99158 29350',
            address: {
              '@type': 'PostalAddress',
              streetAddress:
                'Cyberhub, 77-A, DLF Cyber City, Gurugram, Haryana, 122015.',
              addressLocality: 'Haryana',
              postalCode: '122015',
              addressCountry: 'IN'
            },
            sameAs: [
              'https://twitter.com/SharkdomIndia',
              'https://www.linkedin.com/company/sharkdomer/',
              'instagram.com/sharkdomdotcom?igsh=MXFpZGZyNjg3NWd2Yg==',
              'https://www.youtube.com/@sharkdomIndia'
            ]
          })
        }}
      />

      <Script
        id='apollo-website-tracker'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            function initApollo(){
              var n=Math.random().toString(36).substring(7),
                  o=document.createElement("script");
              o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,
              o.async=!0,
              o.defer=!0,
              o.onload=function(){
                window.trackingFunctions.onLoad({
                  appId:"6a0aa0a7b2c1d50018e8451c"
                })
              },
              document.head.appendChild(o)
            }
            initApollo();
          `
        }}
      />

      <NewHeader />
      {children}
      <Footer initialRegion={initialRegion} />
    </>
  )
}
