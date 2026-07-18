'use client'

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'

interface RouteTransitionProps {
  children: React.ReactNode
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const pathname = usePathname()

  // Completely disable RouteTransition for partner program stats page
  if (pathname?.includes('/home/partner-program-stats')) {
    return <>{children}</>
  }

  /* Framer `AnimatePresence mode="wait"` + `opacity: 0` enter can leave this route blank
     if the motion layer never reaches `animate` (flex/height churn). Co-sell workspace is full-page. */
  if (pathname?.includes('/partner-mapping/cosell-workspace')) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.15,
          ease: 'easeInOut'
        }}
        className='h-full w-full'
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export default RouteTransition
