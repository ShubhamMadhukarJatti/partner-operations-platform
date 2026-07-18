'use client'

import React, { useEffect, useState } from 'react'

import {
  getTokenRefreshStats,
  triggerTokenRefresh
} from '@/lib/auth/token-refresh'

/**
 * Debug component to monitor and test token refresh
 * Add this to any page to see token refresh status
 */
export function TokenRefreshDebugger() {
  const [stats, setStats] = useState(getTokenRefreshStats())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Update stats every second
    const interval = setInterval(() => {
      setStats(getTokenRefreshStats())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleManualRefresh = async () => {
    setIsRefreshing(true)
    try {
      await triggerTokenRefresh()
      setStats(getTokenRefreshStats())
    } catch (error) {
      console.error('Manual refresh failed:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  const formatTime = (timestamp: number | null) => {
    if (!timestamp) return 'Never'
    const date = new Date(timestamp)
    return date.toLocaleTimeString()
  }

  const getTimeUntilNext = () => {
    if (!stats.nextRefreshTime) return 'N/A'
    const now = Date.now()
    const diff = stats.nextRefreshTime - now
    if (diff <= 0) return 'Due now'
    const minutes = Math.floor(diff / 60000)
    const seconds = Math.floor((diff % 60000) / 1000)
    return `${minutes}m ${seconds}s`
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className='fixed bottom-4 left-4 z-50 rounded-lg bg-blue-500 px-3 py-2 text-sm text-white shadow-lg hover:bg-blue-600'
      >
        🔄 Show Token Debugger
      </button>
    )
  }

  return (
    <div
      id='token-refresh-debugger'
      className='fixed bottom-4 left-4 z-50 rounded-lg border-2 border-blue-500 bg-white p-4 shadow-lg'
    >
      <div className='mb-2 flex items-center justify-between'>
        <h3 className='text-sm font-bold text-gray-800'>
          🔄 Token Refresh Debugger
        </h3>
        <button
          onClick={() => setIsVisible(false)}
          className='text-xs text-gray-500 hover:text-gray-700'
          type='button'
        >
          ✕
        </button>
      </div>

      <div className='space-y-1 text-xs'>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Refresh Count:</span>
          <span className='font-mono font-semibold'>{stats.refreshCount}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Last Refresh:</span>
          <span className='font-mono'>{formatTime(stats.lastRefreshTime)}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Next Refresh:</span>
          <span className='font-mono text-blue-600'>{getTimeUntilNext()}</span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Refresh Interval:</span>
          <span className='font-mono'>
            {Math.floor(stats.refreshInterval / 1000 / 60)} min
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Token Expiry:</span>
          <span className='font-mono'>
            {Math.floor(stats.tokenExpiryTime / 1000 / 60)} min
          </span>
        </div>
        <div className='flex justify-between'>
          <span className='text-gray-600'>Status:</span>
          <span
            className={
              stats.isRefreshing ? 'text-yellow-600' : 'text-green-600'
            }
          >
            {stats.isRefreshing ? '🔄 Refreshing...' : '✅ Active'}
          </span>
        </div>
      </div>

      <button
        onClick={handleManualRefresh}
        disabled={isRefreshing}
        className='mt-3 w-full rounded bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600 disabled:bg-gray-400'
        type='button'
      >
        {isRefreshing ? 'Refreshing...' : '🔄 Manual Refresh'}
      </button>

      <div className='mt-2 text-[10px] text-gray-500'>
        Check browser console for detailed logs
      </div>
    </div>
  )
}
