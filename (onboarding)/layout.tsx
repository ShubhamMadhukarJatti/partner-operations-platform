'use client'

import { usePathname } from 'next/navigation'
import Script from 'next/script'

export default function OnboardingLayout({
  children
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <main className=''>
      <Script src='https://checkout.razorpay.com/v1/checkout.js' />
      {children}

      {/* <MaxWidthWrapper className='max-w-[1440px]'>
        <div className='relative flex min-h-screen flex-col'>{children}</div>
      </MaxWidthWrapper> */}
    </main>
  )
}
