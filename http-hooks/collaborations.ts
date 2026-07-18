import { RootState } from '@/redux/store'
import {
  createCollaborationGroup,
  getAllCollaborations,
  getAllCollaborationsCredits,
  getAsignSegmentData
} from '@/services/organization-collaborations'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'

export const useCollaborationsData = (
  tabValue: string = 'all',
  page?: number,
  size?: number
) => {
  // Removed console.log to reduce console noise
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery<any>({
    queryKey: ['collaborations', tabValue, organization?.id, page, size],
    queryFn: async () => {
      try {
        const response = await getAllCollaborations(tabValue, page, size)
        return response
      } catch (error: any) {
        // Log error but don't crash - return empty data structure
        console.error('Error fetching collaborations:', error)
        // Return safe default structure to prevent white screen
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
          number: page || 0,
          size: size || 8
        }
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: false,
    enabled: !!organization?.id,
    // Prevent errors from crashing the page
    throwOnError: false,
    // Prevent duplicate calls
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })

  // Combined loading: either org isn't ready, or query is loading
  const isLoading = !organization?.id || query.isLoading

  return { ...query, isLoading }
}

export const useCollaborationsDetails = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved
  return useQuery<any>({
    queryKey: ['collaborations-details', organization?.id],
    queryFn: async () => {
      try {
        const response = await getAllCollaborationsCredits()
        return response
      } catch (error: any) {
        // Log error but return safe default instead of throwing
        console.error('Error fetching collaborations details:', error)
        return {
          credits: {
            collaborationsLeft: 0,
            collaborationsAllocated: 0,
            aiProposalLeft: 0,
            aiProposalAllocated: 0
          }
        }
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!organization?.id,
    retry: false,
    throwOnError: false // Prevent errors from crashing the page
  })
}

export const useAssignSegmentDetails = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved
  return useQuery<any>({
    queryKey: ['organization-details', organization?.id],
    queryFn: async () => {
      try {
        const response = await getAsignSegmentData(organization?.id)
        return response
      } catch (error: any) {
        // Log error but return empty array instead of throwing
        console.error('Error fetching assign segment details:', error)
        return [] // Return empty array to prevent crashes
      }
    },
    staleTime: 1000 * 60 * 5,
    enabled: !!organization?.id,
    retry: false,
    throwOnError: false // Prevent errors from crashing the page
  })
}

interface CreateGroupParams {
  organizationId: number | undefined
  organizationCollaborationId: number[] | undefined
  category: string
}

export const useCreateCollaborationGroup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: CreateGroupParams) => {
      return await createCollaborationGroup(params)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborations'] })
      showCustomToast('Success', 'Group created successfully', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to create group',
        'error',
        5000
      )
    }
  })
}
