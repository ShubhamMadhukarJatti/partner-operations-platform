'use client'

import { useEffect } from 'react'

interface PerformanceMetrics {
  FCP: number | null
  LCP: number | null
  FID: number | null
  CLS: number | null
  TTFB: number | null
}

export const PagePerformance = () => {
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Log performance metrics for monitoring
        if (entry.entryType === 'navigation') {
          const navEntry = entry as PerformanceNavigationTiming
          console.log('Page Performance Metrics:', {
            TTFB: navEntry.responseStart - navEntry.requestStart,
            DOMContentLoaded:
              navEntry.domContentLoadedEventEnd -
              navEntry.domContentLoadedEventStart,
            LoadComplete: navEntry.loadEventEnd - navEntry.loadEventStart,
            TotalTime: navEntry.loadEventEnd - navEntry.fetchStart
          })
        }
      }
    })

    // Observe navigation timing
    observer.observe({ entryTypes: ['navigation'] })

    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const fcp = entries[entries.length - 1]
        if (fcp) {
          console.log('FCP:', fcp.startTime)
        }
      }).observe({ entryTypes: ['paint'] })

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lcp = entries[entries.length - 1]
        if (lcp) {
          console.log('LCP:', lcp.startTime)
        }
      }).observe({ entryTypes: ['largest-contentful-paint'] })

      // First Input Delay
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'first-input') {
            const fidEntry = entry as PerformanceEventTiming
            console.log('FID:', fidEntry.processingStart - fidEntry.startTime)
          }
        }
      }).observe({ entryTypes: ['first-input'] })

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        let cls = 0
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'layout-shift') {
            const layoutShiftEntry = entry as any
            if (!layoutShiftEntry.hadRecentInput) {
              cls += layoutShiftEntry.value
            }
          }
        }
        console.log('CLS:', cls)
      }).observe({ entryTypes: ['layout-shift'] })
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}
