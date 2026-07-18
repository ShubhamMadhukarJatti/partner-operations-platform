import { RootState } from '@/redux/store'
import {
  addPartner,
  fetchOrganizationStats,
  fetchPartnerProgramStats,
  inviteTeamMember,
  patchOrganizationData,
  type OrganizationStats,
  type PartnerProgramStats
} from '@/services/organizations'
import { GetStartedDetailsResponse } from '@/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'
import { z } from 'zod'

import { getGetStartedDetails } from '@/lib/db/organization'
import { getServerUser } from '@/lib/server'
import { showCustomToast } from '@/components/custom-toast'
// import { ProfileSchema } from '@/lib/actions/organization'
import { ProfileSchema } from '@/app/(app)/(account-settings)/settings/profile/type'

import { useFetchCurrentOrganisation } from './orgUserMapping'

export const useGetStartedDetails = () => {
  const { data: orgDetails } = useFetchCurrentOrganisation()

  const query = useQuery<GetStartedDetailsResponse>({
    queryKey: ['organization', 'getting-started', orgDetails?.id],
    queryFn: async () => {
      if (!orgDetails?.id) {
        throw new Error('Organization ID is required')
      }
      return await getGetStartedDetails(orgDetails.id)
    },
    enabled: !!orgDetails?.id
  })

  return query
}

interface AddPartnerParams {
  email: string
  message: string
  organizationId: number | undefined
  name: string
}

interface InviteTeamMemberParams {
  email: string
  role: string
  organizationId: number | undefined
}

export const useAddOfflinePartner = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: AddPartnerParams) => await addPartner(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      showCustomToast(
        'Success',
        'Partner invited successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to add partner',
        'error',
        5000
      )
    }
  })
}

export const useInviteTeamMember = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: InviteTeamMemberParams) =>
      await inviteTeamMember(params),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['organization'] })
      // Refetch so new invite shows in list without reload
      await queryClient.refetchQueries({ queryKey: ['team-section'] })
      await queryClient.refetchQueries({ queryKey: ['team-requests'] })
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'Failed to invite team member',
        'error',
        5000
      )
    }
  })
}

export const useGettingStartedDetails = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { organization } = saved

  return useQuery<GetStartedDetailsResponse>({
    queryKey: ['getting-started-data', organization?.id],
    queryFn: () => {
      if (!organization?.id) {
        throw new Error('Organization ID is required')
      }
      return getGetStartedDetails(organization.id)
    },
    enabled: !!organization?.id
  })
}

export const usePatchOrganizationData = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: z.infer<typeof ProfileSchema>) => {
      return await patchOrganizationData(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['organization']
      })
      showCustomToast(
        'Success',
        'Profile Updated successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to update profile',
        'error',
        5000
      )
    }
  })
}

// export const useGetOrganizationByUserId = async () => {
//   const { user } = await getServerUser();
//   return useQuery<GetStartedDetailsResponse>({
//     queryKey: ['organization', user.uid],
//     queryFn: () => getOrgByUser(user.uid),
//     enabled: !!user.uid
//   })
// }

export const useGetCurrentOrganization = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { organization } = saved

  return useQuery<GetStartedDetailsResponse>({
    queryKey: ['organization', organization?.id],
    queryFn: () => {
      if (!organization?.id) {
        throw new Error('Organization ID is required')
      }
      return getGetStartedDetails(organization.id)
    },
    enabled: !!organization?.id
  })
}

export const useGetOrganizationStats = (orgId: number | null) => {
  return useQuery<OrganizationStats>({
    queryKey: ['organization-stats', orgId],
    queryFn: async () => {
      if (!orgId) {
        throw new Error('Organization ID is required')
      }
      return await fetchOrganizationStats(orgId)
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 // 1 minute
  })
}

export const useGetPartnerProgramStats = (orgId: number | null) => {
  return useQuery<PartnerProgramStats>({
    queryKey: ['partner-program-stats', orgId],
    queryFn: async () => {
      if (!orgId) {
        throw new Error('Organization ID is required')
      }
      return await fetchPartnerProgramStats(orgId)
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 // 1 minute
  })
}
