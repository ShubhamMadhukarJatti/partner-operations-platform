'use client'

import { useCallback, useEffect, useState } from 'react'

import {
  ALL_INTEGRATIONS,
  COMING_SOON_INTEGRATIONS,
  INTEGRATION_STATUS
} from '@/lib/constants/integrations'

/**
 * Partner portal: integrations and userId from /api/no/auth/organization/integration/{userId}.
 * No orgId - only userId.
 */
export function usePartnerPortalIntegrations() {
  const [integrations, setIntegrations] = useState<any[] | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const meRes = await fetch('/api/auth/me', { credentials: 'include' })
      const meData = await meRes.json().catch(() => ({}))
      const uid = meData?.user?.uid
      if (!uid) {
        setIntegrations([])
        setUserId(null)
        return
      }
      setUserId(uid)
      const res = await fetch(
        `/api/no/auth/organization/integration/${encodeURIComponent(uid)}`,
        { credentials: 'include' }
      )
      if (!res.ok) throw new Error('Failed to fetch integrations')
      const apps: any = await res.json()
      const list = Array.isArray(apps) ? apps : (apps?.data ?? [])
      const connectedTypes = new Set(
        list
          .filter(
            (app: any) =>
              (app?.connected === true || app?.refreshToken != null) &&
              app?.integrationType
          )
          .map((app: any) => app.integrationType)
      )
      const normalized = ALL_INTEGRATIONS.map((integration) => ({
        ...integration,
        status: COMING_SOON_INTEGRATIONS.has(integration.id)
          ? INTEGRATION_STATUS.COMING_SOON
          : connectedTypes.has(integration.id)
            ? INTEGRATION_STATUS.CONNECTED
            : INTEGRATION_STATUS.NOT_CONNECTED
      }))
      setIntegrations(normalized)
    } catch (e) {
      console.error('Error fetching partner portal integrations:', e)
      setError(e instanceof Error ? e : new Error('Unknown error'))
      setIntegrations([])
      setUserId(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return {
    integrations: integrations ?? [],
    userId,
    isLoading,
    error,
    refetch
  }
}
