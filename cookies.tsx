'use client'

import { useEffect, useState } from 'react'
import { hasCookie, setCookie } from 'cookies-next'

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(true)

  useEffect(() => {
    setShowConsent(hasCookie('localConsent'))
  }, [])

  const acceptCookie = () => {
    setShowConsent(true)
    setCookie('localConsent', 'true', { maxAge: 100 * 365 * 24 * 60 * 60 }) // maxAge set to 100 years.
  }

  if (showConsent) {
    return null
  }

  return (
    <div className='fixed bottom-0 left-0 z-50 flex w-full flex-col items-center gap-2 rounded-lg border border-text-20 bg-shark-blue-50 p-4 shadow-lg'>
      <p className='text-lg font-semibold text-gray-800 lg:text-xl'>
        We value your privacy
      </p>
      <p className='text-sm text-gray-600 lg:text-base'>
        We use cookies to personalize content, run ads, and analyze traffic to
        improve your experience.
      </p>
      <button
        className='w-fit rounded-lg bg-primary-light-blue px-6 py-3  font-bold text-white transition-transform focus:outline-none focus:ring-4 focus:ring-blue-300'
        onClick={() => acceptCookie()}
      >
        Accept & Continue
      </button>
    </div>
  )
}

export default CookieConsent
