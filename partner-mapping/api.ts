'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  calculateCoSellHealth,
  createSharedContact,
  fetchDealOwnerDetails,
  fetchIntroTracker,
  fetchJointPitch,
  fetchSharedAccounts,
  fetchSharedAssets,
  fetchSharedContacts,
  generateIntro,
  saveJointPitch,
  sendCoSellNotification,
  uploadSharedAssetFile
} from './api.server'
import type { CreateSharedContactPayload, SharedContact } from './api.server'
import type { SaveJointPitchPayload } from './joint-pitch.types'
import type { SharedAccountsParams } from './shared-accounts-list.types'
import type {
  CoSellHealthPayload,
  CoSellHealthResponse,
  GenerateIntroPayload,
  GenerateIntroResult,
  SendNotificationPayload,
  SendNotificationResult
} from './shared-assets.types'

export type {
  JointPitchData,
  JointPitchGetApiResponse,
  SaveJointPitchPayload,
  SaveJointPitchResult
} from './joint-pitch.types'
export type {
  AccountMappingUploadResponse,
  CreateSharedAssetPayload,
  CreateSharedAssetResult,
  GenerateIntroPayload,
  GenerateIntroResult,
  SharedAsset,
  SharedAssetMutationApiResponse,
  SharedAssetsApiResponse
} from './shared-assets.types'
export type {
  DealStage,
  OverlapType,
  RecommendedAction,
  SharedAccount,
  SharedAccountsApiResponse,
  SharedAccountsData,
  SharedAccountsParams
} from './shared-accounts-list.types'

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGetSharedAccounts = (params: SharedAccountsParams = {}) => {
  return useQuery({
    queryKey: ['shared-accounts', params],
    queryFn: () => fetchSharedAccounts(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    enabled: !!params.partnerOrgId
  })
}

// ─── Joint pitch ───────────────────────────────────────────────────────────────

export const useJointPitch = (
  partnerOrgId: number | null,
  dealId?: string | null
) => {
  return useQuery({
    queryKey: ['joint-pitch', partnerOrgId, dealId],
    queryFn: () => fetchJointPitch(partnerOrgId!, dealId),
    enabled: partnerOrgId != null,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useSaveJointPitch = (partnerOrgId: number | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: SaveJointPitchPayload) => {
      const result = await saveJointPitch(payload)
      if (!result.ok) {
        throw new Error(result.message)
      }
      return result.data
    },
    onSuccess: (_, variables) => {
      if (partnerOrgId != null) {
        void queryClient.invalidateQueries({
          queryKey: ['joint-pitch', partnerOrgId, variables.dealId]
        })
      }
    }
  })
}

// ─── Shared assets (co-sell workspace) ───────────────────────────────────────

export const useSharedAssets = (
  partnerOrgId: number | null,
  dealId?: string | null
) => {
  return useQuery({
    queryKey: ['shared-assets', partnerOrgId, dealId],
    queryFn: () => fetchSharedAssets(partnerOrgId!, dealId),
    enabled: partnerOrgId != null && !!dealId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useCreateSharedAsset = (partnerOrgId: number | null) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (formData: FormData) => {
      return await uploadSharedAssetFile(formData)
    },
    onSuccess: (_, variables) => {
      if (partnerOrgId != null) {
        const dealId = variables.get('dealId')
        void queryClient.invalidateQueries({
          queryKey: ['shared-assets', partnerOrgId, dealId]
        })
      }
    }
  })
}

export const useIntroTracker = (
  partnerId: number | undefined,
  dealId: string | undefined
) => {
  return useQuery({
    queryKey: ['intro-tracker', partnerId, dealId],
    queryFn: () => fetchIntroTracker(partnerId!, dealId!),
    enabled: !!partnerId && !!dealId
  })
}

export const useDealOwnerDetails = (
  organizationId: number | null | undefined,
  dealId: string | null | undefined
) => {
  return useQuery({
    queryKey: ['deal-owner-details', organizationId, dealId],
    queryFn: () => {
      if (!organizationId || !dealId) return null
      return fetchDealOwnerDetails(organizationId, dealId)
    },
    enabled: !!organizationId && !!dealId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export const useGenerateIntro = () => {
  return useMutation({
    mutationFn: (payload: GenerateIntroPayload) => generateIntro(payload)
  })
}

export const useSendCoSellNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SendNotificationPayload) =>
      sendCoSellNotification(payload)
  })
}

export const useCoSellHealth = (payload: CoSellHealthPayload | null) => {
  return useQuery({
    queryKey: ['cosell-health', payload],
    queryFn: () => calculateCoSellHealth(payload!),
    enabled: !!payload,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export type { SharedContact }

export const useSharedContacts = (
  partnerOrgId: number | null,
  dealId?: string | null
) => {
  return useQuery({
    queryKey: ['shared-contacts', partnerOrgId, dealId],
    queryFn: () => {
      if (!partnerOrgId || !dealId) return []
      return fetchSharedContacts(partnerOrgId, dealId)
    },
    enabled:
      partnerOrgId != null &&
      !isNaN(partnerOrgId) &&
      partnerOrgId > 0 &&
      !!dealId,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false
  })
}

export type { CreateSharedContactPayload }

export const useCreateSharedContact = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSharedContactPayload) =>
      createSharedContact(payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['shared-contacts', variables.partnerOrgId, variables.dealId]
      })
    }
  })
}
