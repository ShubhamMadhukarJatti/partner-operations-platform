'use client'

import React from 'react'
import { RootState } from '@/redux/store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'

export interface OverlapTableColumn {
  columnId: number
  name: string
  type: string
  displayOrder: number
  visible: boolean
}

export interface OverlapTableRow {
  rowId: number
  values: Record<string, string>
}

export interface OverlapTableData {
  tableId: number
  tableName: string
  orgId: number
  columns: OverlapTableColumn[]
  rows: OverlapTableRow[]
}

export interface OverlapTableResponse {
  success: boolean
  message: string
  data: OverlapTableData
}

const EMPTY_OVERLAP_RESPONSE: OverlapTableResponse = {
  success: true,
  message: '',
  data: {
    tableId: 0,
    tableName: '',
    orgId: 0,
    columns: [],
    rows: []
  }
}

/** Fetch Overlap table via API route (runs on server) */
async function fetchOverlapTable(
  recordType: string = 'CUSTOMER'
): Promise<OverlapTableResponse> {
  const res = await fetch(
    `/api/overlap/table?recordType=${encodeURIComponent(recordType)}`,
    { credentials: 'include' }
  )
  const json = await res.json()
  if (!res.ok) throw new Error(json?.message ?? 'Failed to fetch overlap table')
  if (!json?.success || !json?.data) return EMPTY_OVERLAP_RESPONSE
  return json
}

export const useOverlapTable = (options?: {
  enabled?: boolean
  recordType?: 'CUSTOMER' | 'PROSPECT' | 'OPPORTUNITY'
}) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved
  const recordType = options?.recordType ?? 'CUSTOMER'

  return useQuery<OverlapTableResponse, Error>({
    queryKey: ['overlap-table', organization?.id, recordType],
    queryFn: async () => {
      try {
        return await fetchOverlapTable(recordType)
      } catch {
        return EMPTY_OVERLAP_RESPONSE
      }
    },
    enabled: (options?.enabled ?? true) && !!organization?.id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useAddOverlapColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      tableId: number
      name: string
      type: 'TEXT' | 'STATUS' | 'TAG'
    }) => {
      const res = await fetch('/api/overlap/table/column', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message ?? 'Failed to create column')
      return json
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['get-persona-preview'] })
      await queryClient.refetchQueries({ queryKey: ['overlap-table'] })
    }
  })
}

export const useRenameOverlapColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: { columnId: number; newName: string }) => {
      const res = await fetch('/api/overlap/table/column/rename', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params)
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message ?? 'Failed to rename column')
      return json
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['get-persona-preview'] })
      await queryClient.refetchQueries({ queryKey: ['overlap-table'] })
    }
  })
}

export const useUpdateOverlapColumnOrder = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: { columnId: number; newOrder: number }) => {
      const res = await fetch('/api/overlap/table/column/order', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params)
      })
      const json = await res.json()
      if (!res.ok)
        throw new Error(json?.message ?? 'Failed to update column order')
      return json
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['get-persona-preview'] })
      await queryClient.refetchQueries({ queryKey: ['overlap-table'] })
    }
  })
}

export const useRemoveOverlapColumn = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (columnId: number) => {
      const res = await fetch(`/api/overlap/table/column/${columnId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.message ?? 'Failed to delete column')
      return json
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['get-persona-preview'] })
      await queryClient.refetchQueries({ queryKey: ['overlap-table'] })
      showCustomToast('Success', 'Column deleted successfully', 'success', 3000)
    },
    onError: (error: Error) => {
      console.error('[useRemoveOverlapColumn] Failed to delete column:', error)
      showCustomToast(
        'Error',
        'Something went wrong. Please try again.',
        'error',
        5000
      )
    }
  })
}

export const useUpdateOverlapRowValues = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (params: {
      rowId: number
      values: Record<string, string>
    }) => {
      const res = await fetch('/api/overlap/table/row/values', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(params)
      })
      const json = await res.json()
      if (!res.ok)
        throw new Error(json?.message ?? 'Failed to update row values')
      return json
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['get-persona-preview'] })
      await queryClient.refetchQueries({ queryKey: ['overlap-table'] })
    }
  })
}
