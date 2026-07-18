import {
  addSignedDocument,
  getIsPartnerSpaceCreated,
  updateHistoryStatus,
  updateStatusParam
} from '@/services/dashboard'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import {
  getDocuments,
  getOrganizationCollaborationHistory
} from '@/lib/db/collaboration'
import { showCustomToast } from '@/components/custom-toast'

export const useChangeHistoryStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: updateStatusParam) => {
      return await updateHistoryStatus(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] })
      showCustomToast('Success', 'Status Updated', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to update status',
        'error',
        5000
      )
    }
  })
}

export const useGetOrganizationCollaborationHistory = (
  collaborationId: number
) => {
  const query = useQuery({
    queryKey: ['history', collaborationId],
    queryFn: async () =>
      await getOrganizationCollaborationHistory(collaborationId),
    enabled: !!collaborationId
  })

  return query
}

export const useGetDocuments = (collaborationId: number) => {
  const query = useQuery({
    queryKey: ['documents', collaborationId],
    queryFn: async () => await getDocuments(collaborationId),
    enabled: !!collaborationId
  })

  return query
}

export const useGetIsPartnerSpaceCreated = (collaborationId: number) => {
  const query = useQuery({
    queryKey: ['isPartnerSpaceCreates', collaborationId],
    queryFn: async () => await getIsPartnerSpaceCreated(collaborationId),
    enabled: !!collaborationId
  })

  return query
}
export const useSignDocument = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (
      params: { organizationCollaborationId: number } & { binaryPdf: File }
    ) => {
      return await addSignedDocument(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
      showCustomToast(
        'Success',
        'Documents Uploaded successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to upload document',
        'error',
        5000
      )
    }
  })
}
