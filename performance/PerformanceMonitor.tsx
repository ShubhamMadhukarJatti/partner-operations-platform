'use client'

import React, { useEffect, useRef } from 'react'

interface PerformanceMetrics {
  navigationStart: number
  loadTime: number
  renderTime: number
  memoryUsage?: number
  networkTiming?: {
    dns: number
    connect: number
    request: number
    response: number
  }
}

const PerformanceMonitor: React.FC = () => {
  const startTime = useRef<number>(performance.now())
  const renderStart = useRef<number>(performance.now())

  useEffect(() => {
    const measurePerformance = () => {
      const navigationStart = performance.timing?.navigationStart || 0
      const loadTime = performance.now() - startTime.current
      const renderTime = performance.now() - renderStart.current

      const metrics: PerformanceMetrics = {
        navigationStart,
        loadTime,
        renderTime
      }

      // Add memory usage if available
      if ('memory' in performance) {
        metrics.memoryUsage = (performance as any).memory.usedJSHeapSize
      }

      // Add network timing if available
      if (performance.timing) {
        const timing = performance.timing
        metrics.networkTiming = {
          dns: timing.domainLookupEnd - timing.domainLookupStart,
          connect: timing.connectEnd - timing.connectStart,
          request: timing.responseStart - timing.requestStart,
          response: timing.responseEnd - timing.responseStart
        }
      }

      // Log performance metrics for debugging
      console.log('🚀 Performance Metrics:', {
        loadTime: `${metrics.loadTime.toFixed(2)}ms`,
        renderTime: `${metrics.renderTime.toFixed(2)}ms`,
        memoryUsage: metrics.memoryUsage
          ? `${(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`
          : 'N/A',
        networkTiming: metrics.networkTiming,
        timestamp: new Date().toISOString()
      })

      // Send custom event for PerformanceDashboard
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('performance-metrics', {
            detail: {
              ...metrics,
              timestamp: new Date().toISOString()
            }
          })
        )
      }

      // Send to analytics if needed
      if (typeof window !== 'undefined' && 'gtag' in window) {
        ;(window as any).gtag('event', 'performance_metrics', {
          load_time: metrics.loadTime,
          render_time: metrics.renderTime,
          memory_usage: metrics.memoryUsage
        })
      }
    }

    // Measure performance after component mounts
    const timeoutId = setTimeout(measurePerformance, 100)

    return () => clearTimeout(timeoutId)
  }, [])

  // Track render time
  useEffect(() => {
    renderStart.current = performance.now()
  })

  return null
}

export default PerformanceMonitor
