// src/http-hooks/use-salesforce-metadata.ts
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  fetchSalesforceMetadata,
  type SalesforceField,
  type SalesforceMetadataData
} from '@/services/salesforce'

import type { SharkdomField } from './use-hubspot-metadata'

export type SalesforceTab = 'Contacts' | 'Companies' | 'Deals'

interface FlexibleSalesforceMetadataResponse {
  success: boolean
  message?: string
  data: SalesforceMetadataData
}

const TAB_TO_METADATA_KEY: Record<SalesforceTab, keyof SalesforceMetadataData> =
  {
    Contacts: 'contacts',
    Companies: 'accounts',
    Deals: 'opportunities'
  }

function normalizeSalesforceSection(
  section: { fields?: SalesforceField[] } | undefined
): SharkdomField[] {
  if (!section || !Array.isArray(section.fields)) return []

  return section.fields.map((field) => ({
    apiName: field.name,
    name: field.label?.trim() || field.name,
    type: field.type || 'unknown',
    fieldType: field.type || 'unknown',
    description: `Salesforce ${field.type} field`,
    groupName: 'Salesforce Native',
    options: [], // Salesforce picklists could be mapped here if needed
    hidden: false,
    sourceType: 'full',
    hubspotDefined: false // It's salesforce
  }))
}

export function useSalesforceMetadata(
  organizationId?: number,
  skip: boolean = false
) {
  const cacheKey = useMemo(
    () => `salesforce_metadata_cache_${organizationId ?? 'default'}`,
    [organizationId]
  )

  const [metadata, setMetadata] = useState<SalesforceMetadataData | null>(
    () => {
      if (typeof window !== 'undefined') {
        try {
          const cached = sessionStorage.getItem(cacheKey)
          if (cached) {
            return JSON.parse(cached)
          }
        } catch (e) {
          console.warn('Failed to load cached metadata:', e)
        }
      }
      return null
    }
  )

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
        if (!metadata) {
          setIsLoading(true)
        }
        setError(null)

        const response = (await fetchSalesforceMetadata(
          organizationId ? { organizationId } : undefined
        )) as FlexibleSalesforceMetadataResponse

        if (cancelled) return

        if (response?.data) {
          setMetadata(response.data)
          try {
            sessionStorage.setItem(cacheKey, JSON.stringify(response.data))
          } catch (e) {
            console.warn('Failed to cache metadata:', e)
          }
        }
      } catch (err) {
        if (cancelled) return
        if (!metadata) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to fetch Salesforce metadata'
          )
        }
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
  }, [organizationId, cacheKey, skip])

  const fieldsByTab = useMemo<Record<SalesforceTab, SharkdomField[]>>(
    () => ({
      Contacts: normalizeSalesforceSection(metadata?.contacts),
      Companies: normalizeSalesforceSection(metadata?.accounts),
      Deals: normalizeSalesforceSection(metadata?.opportunities)
    }),
    [metadata]
  )

  const getFieldsByTab = useCallback(
    (tab: SalesforceTab) => {
      const key = TAB_TO_METADATA_KEY[tab]
      return normalizeSalesforceSection(metadata?.[key])
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
