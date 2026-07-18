'use client'

import { useQuery } from '@tanstack/react-query'

import { getServerUser } from '@/lib/server'

export default function MarketingAuthPrefetch() {
  useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { token, user } = await getServerUser()
      if (!token) {
        return null // User not authenticated, stay on marketing page
      }
      return user
    },
    retry: false,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })

  return null
}
