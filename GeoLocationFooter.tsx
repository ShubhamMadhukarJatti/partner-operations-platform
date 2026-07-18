'use client'

import React, { useEffect, useState } from 'react'

type Props = {}

const GeoLocationFooter = (props: Props) => {
  const [footerContent, setFooterContent] = useState(
    'Loading footer content...'
  )

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Simple geographic check for India
          const isIndia =
            latitude > 8 && latitude < 37 && longitude > 68 && longitude < 97
          setFooterContent(
            isIndia ? 'India Footer Content' : 'International Footer Content'
          )
        },
        (error) => {
          console.error('Error fetching location:', error)
          setFooterContent('Default International Footer Content')
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser.')
      setFooterContent('Default International Footer Content')
    }
  }, [])
  return <div>{footerContent}</div>
}

export default GeoLocationFooter
