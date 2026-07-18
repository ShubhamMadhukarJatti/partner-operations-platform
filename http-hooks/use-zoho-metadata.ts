// src/http-hooks/use-zoho-metadata.ts
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchZohoMetadata, type ZohoMetadataData } from '@/services/zoho'

import type { SharkdomField } from './use-hubspot-metadata'

export type ZohoTab = 'Contacts' | 'Companies' | 'Deals'

const TAB_TO_METADATA_KEY: Record<ZohoTab, keyof ZohoMetadataData> = {
  Contacts: 'contacts',
  Companies: 'accounts',
  Deals: 'deals'
}

function normalizeZohoSection(fields: string[] | undefined): SharkdomField[] {
  if (!fields || !Array.isArray(fields)) return []

  return fields.map((fieldName) => ({
    apiName: fieldName,
    name: fieldName, // Use field name for the label as well (since Zoho returns flat string arrays)
    type: 'string',
    fieldType: 'string',
    description: `Zoho field: ${fieldName}`,
    groupName: 'Zoho Native',
    options: [],
    hidden: false,
    sourceType: 'full',
    hubspotDefined: false
  }))
}

export function useZohoMetadata(
  organizationId?: number,
  skip: boolean = false
) {
  const cacheKey = useMemo(
    () => `zoho_metadata_cache_${organizationId ?? 'default'}`,
    [organizationId]
  )

  const [metadata, setMetadata] = useState<ZohoMetadataData | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(cacheKey)
        if (cached) {
          return JSON.parse(cached)
        }
      } catch (e) {
        console.warn('Failed to load cached Zoho metadata:', e)
      }
    }
    return null
  })

  const [isLoading, setIsLoading] = useState(() => !skip && !metadata)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (skip) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    const loadMetadata = async () => {
      try {
        setError(null)

        const response = await fetchZohoMetadata()

        if (cancelled) return

        if (response?.data) {
          setMetadata(response.data)
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(response.data))
          } catch (e) {
            console.warn('Failed to cache Zoho metadata:', e)
          }
        }
      } catch (err) {
        if (cancelled) return
        setError(
          err instanceof Error ? err.message : 'Failed to fetch Zoho metadata'
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadMetadata()

    return () => {
      cancelled = true
    }
  }, [cacheKey, skip])

  const fieldsByTab = useMemo<Record<ZohoTab, SharkdomField[]>>(
    () => ({
      Contacts: normalizeZohoSection(metadata?.contacts),
      Companies: normalizeZohoSection(metadata?.accounts),
      Deals: normalizeZohoSection(metadata?.deals)
    }),
    [metadata]
  )

  const getFieldsByTab = useCallback(
    (tab: ZohoTab) => {
      const key = TAB_TO_METADATA_KEY[tab]
      return normalizeZohoSection(metadata?.[key])
    },
    [metadata]
  )

  return {
    metadata,
    isLoading,
    error,
    contacts: fieldsByTab.Contacts,
    companies: fieldsByTab.Companies,
    deals: fieldsByTab.Deals,
    fieldsByTab,
    getFieldsByTab
  }
}
