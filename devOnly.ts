/**
 * Utility to conditionally render components only in development mode
 * @param children - React components to render only in dev
 * @returns JSX element or null
 */
import React from 'react'

export const devOnly = (children: React.ReactNode): React.ReactNode => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    const isDev = host === 'localhost'

    if (!isDev) {
      return null
    }
  }

  return children
}

/**
 * Hook version of devOnly for use in components
 * @returns boolean indicating if we're in development mode
 */
export const useDevOnly = (): boolean => {
  if (typeof window !== 'undefined') {
    const host = window.location.hostname
    return host === 'localhost'
  }

  return false
}
