'use client'

import { PropsWithChildren, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function QueryProvider({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Optimized caching strategy
            staleTime: 10 * 60 * 1000, // 10 minutes - increased from 5
            gcTime: 30 * 60 * 1000, // 30 minutes - increased from 10
            // Reduce background refetch frequency
            refetchOnWindowFocus: false,
            refetchOnReconnect: 'always',
            refetchOnMount: true,
            // Optimized retry configuration
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.status >= 400 && error?.status < 500) {
                return false
              }
              // Don't retry on network errors more than once
              if (error?.code === 'NETWORK_ERROR' && failureCount >= 1) {
                return false
              }
              return failureCount < 2
            },
            retryDelay: (attemptIndex) =>
              Math.min(1000 * 2 ** attemptIndex, 10000) // Reduced max delay
          },
          mutations: {
            // Optimized mutation retry
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) {
                return false
              }
              return failureCount < 1
            },
            retryDelay: 1000
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition='bottom-left'
        />
      )}
    </QueryClientProvider>
  )
}
