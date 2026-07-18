import { RootState } from '@/redux/store'
import {
  addReferralPartner,
  changeLeadStatus,
  createNewReferralProgram,
  createReferralCode,
  getActivePartners,
  getCampaign,
  getJoinedPartnerPrograms,
  getPartnerDetails,
  getPartnerPrograms,
  getTestedCampaign,
  patchReferralCampaign
} from '@/services/partner-program'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'

export const useCreateReferralProgram = () => {
  const queryClient = useQueryClient()
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useMutation({
    mutationFn: async (payload: {
      // referralCode: string
      // referralLink: string
      status: string
      programName: string
      description: string
      urlRef: string
    }) => {
      return await createNewReferralProgram({
        ...payload,
        organizationId: organization.id
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-referral-program'] })
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to create referral program',
        'error',
        5000
      )
    }
  })
}

export const usePatchReferralCampaign = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      id: string
      programName?: string
      description?: string
      urlRef?: string
      status?: 'ACTIVE' | 'DRAFT' | 'PAUSE' | 'REVOKE'
    }) => {
      return await patchReferralCampaign(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['get-campaign', 'get-referral-program']
      })
      showCustomToast('Success', 'Referral Program Updated', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to update referral program',
        'error',
        5000
      )
    }
  })
}

export const useReferralPartnerInvite = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      message: string
      campaignId: string
      partnerId: string
    }) => {
      return await addReferralPartner({
        ...payload
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get-referral-program'] })
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to add referral parnter',
        'error',
        5000
      )
    }
  })
}

export const useReferralCode = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useQuery({
    queryKey: ['referralCode', organization?.id],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization found')
      return await createReferralCode({
        id: organization.id,
        landing: organization.website
      })
    },
    enabled: !!organization?.id
  })
}

export const usePartnerPrograms = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useQuery({
    queryKey: ['get-referral-program', organization?.id],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization found')
      console.log(
        '🔍 usePartnerPrograms - Fetching with org ID:',
        organization.id
      )
      return await getPartnerPrograms({
        id: organization.id
      })
    },
    enabled: !!organization?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000)
  })
}
export const useJoinedPartnerPrograms = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useQuery({
    queryKey: ['get-joined-referral-program', organization?.id],
    queryFn: async () => {
      if (!organization?.id) throw new Error('No organization found')
      return await getJoinedPartnerPrograms({
        id: organization.id
      })
    },
    enabled: !!organization?.id
  })
}

export const useGetReferralCampaign = (referralCode: string) => {
  return useQuery({
    queryKey: ['get-campaign', referralCode],
    queryFn: async () => {
      if (!referralCode) throw new Error('No campaign found')
      return await getCampaign({
        id: referralCode
      })
    },
    enabled: !!referralCode
  })
}

export const useChangeLeadStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      referralCode: string
      email: string
      leadsStatus: string
    }) => {
      return await changeLeadStatus(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [''] })
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to update referral program',
        'error',
        5000
      )
    }
  })
}

export const useGetPartnerDetails = (partnerId: string) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useQuery({
    queryKey: ['partnerDetails', organization?.id, partnerId],
    queryFn: async () => {
      if (!partnerId) throw new Error('Partner not found')
      return await getPartnerDetails(organization?.id, partnerId)
    },
    enabled: !!organization?.id && !!partnerId
  })
}

export const useGetAllPartners = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  return useQuery({
    queryKey: ['partners', organization?.id],
    queryFn: async () => {
      if (!organization?.id) throw new Error('Partner not found')
      return await getActivePartners(organization?.id)
    },
    enabled: !!organization?.id
  })
}

export const useGetIsTestedCampaign = (
  referralCode: string,
  website: string
) => {
  return useQuery({
    queryKey: ['tested-capaign', referralCode],
    queryFn: async () => {
      if (!referralCode) throw new Error('Campaign not found')
      return await getTestedCampaign(referralCode, website)
    },
    enabled: false
  })
}
