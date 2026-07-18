'use client'

import React, { useEffect } from 'react'

interface PerformanceMetrics {
  navigationStart: number
  loadTime: number
  renderTime: number
}

const PerformanceMonitor: React.FC = () => {
  useEffect(() => {
    const startTime = performance.now()

    // Track navigation timing
    const navigationStart = performance.timing?.navigationStart || 0
    const loadTime = performance.now() - startTime

    // Track render completion
    const renderTime = performance.now() - startTime

    const metrics: PerformanceMetrics = {
      navigationStart,
      loadTime,
      renderTime
    }

    // Log performance metrics for debugging
    // console.log('My-Data Page Performance Metrics:', {
    //   loadTime: `${metrics.loadTime.toFixed(2)}ms`,
    //   renderTime: `${metrics.renderTime.toFixed(2)}ms`,
    //   timestamp: new Date().toISOString()
    // })

    // Track Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with web-vitals library if available
      // console.log('Core Web Vitals tracked for my-data page')
    }
  }, [])

  return null // This component doesn't render anything
}

export default React.memo(PerformanceMonitor)
