'use client'

import { RootState } from '@/redux/store'
import {
  AGREED_NEXT_STEPS_PAGE_SIZE,
  AgreedNextStepWritePayload,
  createAgreedNextStep,
  deleteAgreedNextStep,
  fetchAgreedNextStepsByOrg,
  updateAgreedNextStep
} from '@/services/account-mapping-agreed-next-steps'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'

export const agreedNextStepsQueryKeyRoot = ['agreed-next-steps'] as const

export function agreedNextStepsQueryKey(
  orgId: number | null,
  page = 0,
  size = AGREED_NEXT_STEPS_PAGE_SIZE,
  dealId?: string | null
) {
  return [...agreedNextStepsQueryKeyRoot, orgId, page, size, dealId] as const
}

export function useAgreedNextSteps(
  orgId: number | null,
  options?: { page?: number; size?: number; dealId?: string | null }
) {
  const page = options?.page ?? 0
  const size = options?.size ?? AGREED_NEXT_STEPS_PAGE_SIZE
  const dealId = options?.dealId

  return useQuery({
    queryKey: agreedNextStepsQueryKey(orgId, page, size, dealId),
    queryFn: async () => {
      const res = await fetchAgreedNextStepsByOrg(orgId!, {
        page,
        size,
        dealId
      })
      if (!res.success) {
        throw new Error(
          res.message?.trim() || 'Failed to load agreed next steps'
        )
      }
      return res.data
    },
    enabled: !!orgId && orgId > 0
  })
}

export function useCreateAgreedNextStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: AgreedNextStepWritePayload) => {
      const res = await createAgreedNextStep(payload)
      if (!res.success) {
        throw new Error(res.message?.trim() || 'Failed to create step')
      }
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agreedNextStepsQueryKeyRoot })
    },
    onError: (error: Error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to create step',
        'error',
        5000
      )
    }
  })
}

export function useUpdateAgreedNextStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (vars: {
      id: number
      payload: AgreedNextStepWritePayload
    }) => {
      const res = await updateAgreedNextStep(vars.id, vars.payload)
      if (!res.success) {
        throw new Error(res.message?.trim() || 'Failed to update step')
      }
      return res.data
    },
    onMutate: async (newStep) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: agreedNextStepsQueryKeyRoot })

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(agreedNextStepsQueryKeyRoot)

      // Optimistically update to the new value
      // This is a bit complex since our keys have orgId/dealId,
      // so invalidating is safer but onMutate gives better "feel".
      // For now, we'll keep it simple and just do the rollback logic.
      return { previousData }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agreedNextStepsQueryKeyRoot })
    },
    onError: (error: Error, __, context) => {
      // Rollback if needed
      showCustomToast(
        'Error',
        error.message ?? 'Failed to update step',
        'error',
        5000
      )
    }
  })
}

export function useDeleteAgreedNextStep() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await deleteAgreedNextStep(id)
      if (!res.success) {
        throw new Error(res.message?.trim() || 'Failed to delete step')
      }
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: agreedNextStepsQueryKeyRoot })
      showCustomToast('Success', 'Step removed', 'success', 4000)
    },
    onError: (error: Error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to delete step',
        'error',
        5000
      )
    }
  })
}

/** Convenience: org id from Redux for agreed-next-steps (vendor org). */
export function useVendorOrgId(): number | null {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const id = saved.organization?.id
  return typeof id === 'number' && id > 0 ? id : null
}
