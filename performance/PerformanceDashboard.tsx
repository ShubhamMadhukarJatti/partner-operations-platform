'use client'

import React, { useEffect, useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  memoryUsage?: number
  networkTiming?: {
    dns: number
    connect: number
    request: number
    response: number
  }
  timestamp: string
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([])
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Listen for performance metrics from PerformanceMonitor
    const handlePerformanceMetrics = (event: CustomEvent) => {
      setMetrics((prev) => [event.detail, ...prev.slice(0, 9)]) // Keep last 10 metrics
    }

    window.addEventListener(
      'performance-metrics',
      handlePerformanceMetrics as EventListener
    )

    return () => {
      window.removeEventListener(
        'performance-metrics',
        handlePerformanceMetrics as EventListener
      )
    }
  }, [])

  const averageLoadTime =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length
      : 0

  const averageRenderTime =
    metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.renderTime, 0) / metrics.length
      : 0

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className='fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 px-4 py-2 text-white shadow-lg hover:bg-blue-700'
      >
        📊 Performance
      </button>
    )
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 w-80'>
      <Card>
        <CardHeader className='pb-2'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-sm'>Performance Monitor</CardTitle>
            <button
              onClick={() => setIsVisible(false)}
              className='text-gray-500 hover:text-gray-700'
            >
              ✕
            </button>
          </div>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='grid grid-cols-2 gap-2 text-xs'>
            <div>
              <div className='text-gray-500'>Avg Load Time</div>
              <div className='font-mono text-green-600'>
                {averageLoadTime.toFixed(0)}ms
              </div>
            </div>
            <div>
              <div className='text-gray-500'>Avg Render</div>
              <div className='font-mono text-blue-600'>
                {averageRenderTime.toFixed(0)}ms
              </div>
            </div>
          </div>

          {metrics.length > 0 && (
            <div className='space-y-1'>
              <div className='text-xs text-gray-500'>Recent Metrics</div>
              {metrics.slice(0, 3).map((metric, index) => (
                <div key={index} className='flex justify-between text-xs'>
                  <span>{metric.loadTime.toFixed(0)}ms</span>
                  <span className='text-gray-400'>
                    {new Date(metric.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className='border-t pt-2'>
            <div className='text-xs text-gray-500'>
              Target: &lt;400ms load, &lt;100ms render
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PerformanceDashboard
