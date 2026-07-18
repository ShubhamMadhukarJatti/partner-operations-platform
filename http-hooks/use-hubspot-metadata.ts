// src\http-hooks\use-hubspot-metadata.ts
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { fetchHubspotMetadata, type HubspotProperty } from '@/services/hubspot'

export type HubspotTab = 'Contacts' | 'Companies' | 'Deals'

export interface SharkdomField {
  apiName: string
  name: string
  type: string
  fieldType: string
  description?: string
  groupName?: string
  options?: HubspotProperty['options']
  displayOrder?: number
  hidden?: boolean
  hubspotDefined?: boolean
  formField?: boolean
  dataSensitivity?: string
  sourceType?: 'full' | 'name-only'
}

type HubspotMetadataSection =
  | {
      results?: HubspotProperty[]
    }
  | string[]
  | undefined

interface FlexibleHubspotMetadataData {
  contacts?: HubspotMetadataSection
  companies?: HubspotMetadataSection
  deals?: HubspotMetadataSection
}

interface FlexibleHubspotMetadataResponse {
  success: boolean
  message: string
  data: FlexibleHubspotMetadataData
}

const TAB_TO_METADATA_KEY: Record<
  HubspotTab,
  keyof FlexibleHubspotMetadataData
> = {
  Contacts: 'contacts',
  Companies: 'companies',
  Deals: 'deals'
}

function toTitleCaseFromApiName(value: string) {
  return value
    .replace(/_/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function normalizeHubspotSection(
  section: HubspotMetadataSection
): SharkdomField[] {
  if (!section) return []

  if (Array.isArray(section)) {
    return section.map((fieldName) => ({
      apiName: fieldName,
      name: toTitleCaseFromApiName(fieldName),
      type: 'unknown',
      fieldType: 'unknown',
      description: 'Metadata details not provided by API for this field.',
      groupName: 'unknown',
      options: [],
      sourceType: 'name-only'
    }))
  }

  const results = section.results ?? []

  return results.map((field) => ({
    apiName: field.name,
    name: field.label?.trim() || toTitleCaseFromApiName(field.name),
    type: field.type,
    fieldType: field.fieldType,
    description: field.description,
    groupName: field.groupName,
    options: field.options,
    displayOrder: field.displayOrder,
    hidden: field.hidden,
    hubspotDefined: field.hubspotDefined,
    formField: field.formField,
    dataSensitivity: field.dataSensitivity,
    sourceType: 'full'
  }))
}

export function useHubspotMetadata(
  organizationId?: number,
  skip: boolean = false
) {
  const cacheKey = useMemo(
    () => `hubspot_metadata_cache_${organizationId ?? 'default'}`,
    [organizationId]
  )

  const [metadata, setMetadata] = useState<FlexibleHubspotMetadataData | null>(
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

        const response = (await fetchHubspotMetadata(
          organizationId ? { organizationId } : undefined
        )) as FlexibleHubspotMetadataResponse

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
              : 'Failed to fetch HubSpot metadata'
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId, cacheKey, skip])

  const fieldsByTab = useMemo<Record<HubspotTab, SharkdomField[]>>(
    () => ({
      Contacts: normalizeHubspotSection(metadata?.contacts),
      Companies: normalizeHubspotSection(metadata?.companies),
      Deals: normalizeHubspotSection(metadata?.deals)
    }),
    [metadata]
  )

  const getFieldsByTab = useCallback(
    (tab: HubspotTab) => {
      const key = TAB_TO_METADATA_KEY[tab]
      return normalizeHubspotSection(metadata?.[key])
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
