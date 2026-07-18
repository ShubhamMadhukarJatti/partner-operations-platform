'use client'

import React, { useEffect, useState } from 'react'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

const ApiCallDebugger: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [apiCalls, setApiCalls] = useState<any[]>([])

  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization, loading } = saved

  useEffect(() => {
    // Listen for API calls
    const originalFetch = window.fetch
    const originalXHR = window.XMLHttpRequest

    // Override fetch
    window.fetch = async (...args) => {
      const [url, options] = args
      const startTime = performance.now()

      console.log('🌐 API Call Started:', {
        url,
        method: options?.method || 'GET',
        timestamp: new Date().toISOString()
      })

      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const duration = endTime - startTime

        console.log('✅ API Call Completed:', {
          url,
          method: options?.method || 'GET',
          status: response.status,
          duration: `${duration.toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        })

        setApiCalls((prev) => [
          {
            url,
            method: options?.method || 'GET',
            status: response.status,
            duration: duration,
            timestamp: new Date().toISOString(),
            success: response.ok
          },
          ...prev.slice(0, 9)
        ])

        return response
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        const errorMessage =
          error instanceof Error ? error.message : String(error)

        console.log('❌ API Call Failed:', {
          url,
          method: options?.method || 'GET',
          error: errorMessage,
          duration: `${duration.toFixed(2)}ms`,
          timestamp: new Date().toISOString()
        })

        setApiCalls((prev) => [
          {
            url,
            method: options?.method || 'GET',
            status: 'ERROR',
            duration: duration,
            timestamp: new Date().toISOString(),
            success: false,
            error: errorMessage
          },
          ...prev.slice(0, 9)
        ])

        throw error
      }
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className='fixed bottom-4 right-4 z-50 rounded-lg bg-blue-600 px-3 py-2 text-sm text-white shadow-lg hover:bg-blue-700'
      >
        🔍 Debug API
      </button>
    )
  }

  return (
    <div className='fixed bottom-4 right-4 z-50 max-h-96 max-w-md overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 shadow-lg'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='font-semibold text-gray-800'>API Call Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          className='text-gray-500 hover:text-gray-700'
        >
          ✕
        </button>
      </div>

      <div className='mb-3 rounded bg-gray-100 p-2 text-xs'>
        <div>
          <strong>Organization:</strong>{' '}
          {organization?.id ? `ID: ${organization.id}` : 'Not loaded'}
        </div>
        <div>
          <strong>Loading State:</strong> {loading}
        </div>
        <div>
          <strong>Organization Name:</strong> {organization?.name || 'N/A'}
        </div>
      </div>

      <div className='space-y-2'>
        <h4 className='text-sm font-medium text-gray-700'>Recent API Calls:</h4>
        {apiCalls.length === 0 ? (
          <p className='text-xs text-gray-500'>No API calls detected</p>
        ) : (
          apiCalls.map((call, index) => (
            <div
              key={index}
              className={`rounded p-2 text-xs ${
                call.success
                  ? 'border-l-2 border-green-500 bg-green-50'
                  : 'border-l-2 border-red-500 bg-red-50'
              }`}
            >
              <div className='flex items-start justify-between'>
                <div className='flex-1'>
                  <div className='font-mono text-xs'>
                    {call.method} {call.url}
                  </div>
                  <div className='text-gray-600'>
                    Status: {call.status} | {call.duration.toFixed(2)}ms
                  </div>
                  {call.error && (
                    <div className='text-xs text-red-600'>{call.error}</div>
                  )}
                </div>
                <div className='ml-2 text-xs text-gray-400'>
                  {new Date(call.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setApiCalls([])}
        className='mt-3 w-full rounded bg-gray-200 px-2 py-1 text-xs hover:bg-gray-300'
      >
        Clear History
      </button>
    </div>
  )
}

export default ApiCallDebugger
