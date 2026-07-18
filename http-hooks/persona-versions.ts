'use client'

import { useQuery } from '@tanstack/react-query'

async function fetchPersonaVersions(personaMode: string) {
  const res = await fetch(
    `/api/persona/versions?personaMode=${encodeURIComponent(personaMode)}`,
    { credentials: 'include' }
  )
  const json = await res.json()
  if (!res.ok)
    throw new Error(json?.message ?? 'Failed to fetch persona versions')
  return json
}

async function fetchPersonaVersionData(params: {
  orgId: number
  personaMode: string
  version: number
}) {
  const { orgId, personaMode, version } = params
  const res = await fetch(
    `/api/persona/version/data?orgId=${encodeURIComponent(orgId)}&personaMode=${encodeURIComponent(personaMode)}&version=${encodeURIComponent(String(version))}`,
    { credentials: 'include' }
  )
  const json = await res.json()
  if (!res.ok)
    throw new Error(json?.message ?? 'Failed to fetch persona version data')
  return json
}

export function usePersonaVersions(personaMode: string, enabled = true) {
  return useQuery({
    queryKey: ['persona-versions', personaMode],
    queryFn: () => fetchPersonaVersions(personaMode),
    enabled: enabled && !!personaMode
  })
}

export function usePersonaVersionData(
  orgId: number | undefined,
  personaMode: string,
  version: number | null,
  enabled: boolean
) {
  return useQuery({
    queryKey: ['persona-version-data', orgId, personaMode, version],
    queryFn: () =>
      fetchPersonaVersionData({
        orgId: orgId!,
        personaMode,
        version: version!
      }),
    enabled:
      enabled && !!orgId && !!personaMode && version != null && version > 0
  })
}

// ─── New hooks ───────────────────────────────────────────────────────────────

/**
 * Fetches all available versions for the org from
 * GET /persona/overlap-records/{orgId}/versions
 * Response: { success: boolean; data: Array<{ version: number; versionId: number }> }
 */
async function fetchOverlapRecordVersions(
  orgId: number,
  recordType: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY' = 'CUSTOMER'
) {
  const res = await fetch(
    `/api/persona/overlap-records/${orgId}/versions?recordType=${encodeURIComponent(recordType)}`,
    { credentials: 'include' }
  )
  const json = await res.json()
  if (!res.ok)
    throw new Error(json?.message ?? 'Failed to fetch overlap versions')
  return json as {
    success: boolean
    message?: string
    data: Array<{ version: number; versionId: number }>
  }
}

export type OverlapVersionRow = { version: number; versionId: number }

/**
 * Deduplicate by versionId, then sort newest first (semantic `version` desc, then `versionId` desc).
 */
export function sortOverlapVersionsNewestFirst(
  raw: OverlapVersionRow[] | undefined | null
): OverlapVersionRow[] {
  const unique = Array.from(
    new Map((raw ?? []).map((v) => [v.versionId, v])).values()
  )
  unique.sort((a, b) => {
    if (b.version !== a.version) return b.version - a.version
    return b.versionId - a.versionId
  })
  return unique
}

/** versionId of the newest overlap version, or undefined if none. */
export function getLatestOverlapVersionId(
  raw: OverlapVersionRow[] | undefined | null
): number | undefined {
  return sortOverlapVersionsNewestFirst(raw)[0]?.versionId
}

export function useOverlapRecordVersions(
  orgId: number | undefined,
  enabled = true,
  recordType: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY' = 'CUSTOMER'
) {
  return useQuery({
    queryKey: ['overlap-record-versions', orgId, recordType],
    queryFn: () => fetchOverlapRecordVersions(orgId!, recordType),
    enabled: enabled && !!orgId,
    staleTime: 0,
    refetchOnWindowFocus: true
  })
}

/**
 * Fetches versioned preview-table records from
 * GET /persona/overlap/v2/my-records?recordType=...&versionId=...
 */
async function fetchVersionedOverlapRecords(params: {
  recordType: string
  versionId: number
}) {
  const { recordType, versionId } = params
  const res = await fetch(
    `/api/persona/overlap/v2/my-records?recordType=${encodeURIComponent(recordType)}&versionId=${encodeURIComponent(String(versionId))}`,
    { credentials: 'include' }
  )
  const json = await res.json()
  if (!res.ok)
    throw new Error(json?.message ?? 'Failed to fetch versioned records')
  return json
}

export function useVersionedOverlapRecords(
  recordType: string,
  versionId: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: ['versioned-overlap-records', recordType, versionId],
    queryFn: () =>
      fetchVersionedOverlapRecords({ recordType, versionId: versionId! }),
    enabled: enabled && !!recordType && versionId != null,
    staleTime: 0,
    refetchOnWindowFocus: true
  })
}

/**
 * Fetches persona details (including pie-chart category data) for a specific version from
 * GET /persona/v1/details/{id}?page=0&size=20
 */
async function fetchPersonaDetailsByVersion(versionId: number) {
  const res = await fetch(
    `/api/persona/v1/details/${encodeURIComponent(String(versionId))}?page=0&size=20`,
    { credentials: 'include' }
  )
  const json = await res.json()
  if (!res.ok)
    throw new Error(
      json?.message ?? 'Failed to fetch persona details by version'
    )
  return json
}

export function usePersonaDetailsByVersion(
  versionId: number | null,
  enabled = true
) {
  return useQuery({
    queryKey: ['persona-details-by-version', versionId],
    queryFn: () => fetchPersonaDetailsByVersion(versionId!),
    enabled: enabled && versionId != null,
    staleTime: 0
  })
}
