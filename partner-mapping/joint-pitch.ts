'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { fetchJointPitch, saveJointPitch } from './api.server'
import type { SaveJointPitchPayload } from './joint-pitch.types'

export type JointPitchModel = {
  body: string
  lastEditedBy: string
  lastEditedRelative: string
}

function pickStr(o: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = o[k]
    if (typeof v === 'string' && v.trim()) return v
    if (typeof v === 'number') return String(v)
  }
  return ''
}

/** Normalize GET/POST JSON (envelope or HAL-style) into UI model; empty pitch → null */
export function parseJointPitchResponse(raw: unknown): JointPitchModel | null {
  if (raw === null || raw === undefined) return null
  let o: Record<string, unknown> =
    typeof raw === 'object' && raw !== null
      ? (raw as Record<string, unknown>)
      : {}

  if ('data' in o && typeof o.data === 'object' && o.data !== null) {
    o = o.data as Record<string, unknown>
  }

  const body = pickStr(o, [
    'pitch',
    'body',
    'text',
    'content',
    'jointPitch'
  ]).trim()
  if (!body) return null

  return {
    body,
    lastEditedBy:
      pickStr(o, [
        'lastEditedBy',
        'lastEditedByName',
        'updatedBy',
        'editedBy'
      ]) || '—',
    lastEditedRelative:
      pickStr(o, [
        'lastEditedRelative',
        'lastUpdatedRelative',
        'updatedAtRelative',
        'updatedAt'
      ]) || '—'
  }
}

export function useJointPitch(
  partnerOrgId: string | number | null,
  dealId?: string | null
) {
  return useQuery({
    queryKey: ['joint-pitch', partnerOrgId, dealId],
    queryFn: async () => {
      const raw = await fetchJointPitch(partnerOrgId!, dealId)
      return parseJointPitchResponse(raw)
    },
    enabled: Boolean(partnerOrgId),
    staleTime: 15 * 1000,
    refetchOnWindowFocus: false
  })
}

export function useSaveJointPitch(partnerOrgId: string | null) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SaveJointPitchPayload) => saveJointPitch(payload),
    onSuccess: (raw) => {
      if (!partnerOrgId) return
      const parsed = parseJointPitchResponse(raw)
      if (parsed) {
        qc.setQueryData(['joint-pitch', partnerOrgId], parsed)
      } else {
        qc.invalidateQueries({ queryKey: ['joint-pitch', partnerOrgId] })
      }
    }
  })
}
