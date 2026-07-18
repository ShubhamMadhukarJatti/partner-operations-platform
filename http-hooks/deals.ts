import { RootState } from '@/redux/store'
import {
  acceptApplication,
  approvePayment,
  connectBankAccount,
  connectBankAccountParam,
  createComisionRequest,
  createComisionRequestParam,
  createNewDeal,
  dealForm,
  endDeal,
  fetchApplications,
  fetchDealDetails,
  fetchDeals,
  fetchMyDeals,
  getAffiliateLink,
  getConnectedAccounts,
  getPayoutSummary,
  getRequestRecieved,
  getTrackedData,
  joinDealParam,
  joinDeals,
  rejectApplication,
  rejectPayment
} from '@/services/deals'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'

export const useCreateNewDeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: dealForm) => {
      return await createNewDeal(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['all-deals', 'mydeals'] })
      showCustomToast(
        'Success',
        'New Deal created successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to create new deal',
        'error',
        5000
      )
    }
  })
}

export const useGetMyDeals = (dealType: string) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['mydeals', dealType],
    queryFn: async () => await fetchMyDeals(organization?.id, dealType),
    enabled: !!organization?.id
  })

  return query
}

export const useJoinDeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: joinDealParam) => {
      return await joinDeals(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['joined-deal', 'mydeals'] })
      showCustomToast('Success', 'deal is joined', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to join deal',
        'error',
        5000
      )
    }
  })
}

export const useGetDeals = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  // console.log(organization)

  const query = useQuery({
    queryKey: ['all-deals'],
    queryFn: async () => await fetchDeals(organization?.id),
    enabled: !!organization?.id
  })

  return query
}

export const useGetApplications = (dealId: string, activeTab: string) => {
  const query = useQuery({
    queryKey: ['deal-applications', dealId, activeTab],
    queryFn: async () => await fetchApplications(dealId, activeTab),
    enabled: !!(dealId && activeTab)
  })
  return query
}

export const useGetDealDetails = (dealId: string) => {
  const query = useQuery({
    queryKey: ['deal', dealId],
    queryFn: async () => await fetchDealDetails(dealId),
    enabled: !!dealId
  })
  return query
}

export const useAcceptApplications = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: number) => {
      return await acceptApplication(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application'] })
      showCustomToast('Success', 'Application accepted', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to accept application',
        'error',
        5000
      )
    }
  })
}

export const useConnectBankAccount = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: connectBankAccountParam) => {
      return await connectBankAccount(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bank-account'] })
      showCustomToast('Success', 'Bank account is connected', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to connect bank account',
        'error',
        5000
      )
    }
  })
}

export const useCheckConnectedAccounts = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['accounts-connected', organization?.id],
    queryFn: async () => await getConnectedAccounts(organization?.id),
    enabled: !!organization?.id
  })
  return query
}
export const useGetAffiliateLink = (dealId: string) => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  console.log(organization?.id)

  const query = useQuery({
    queryKey: ['affiliate-link', organization?.id, dealId],
    queryFn: async () => await getAffiliateLink(organization?.id, dealId),
    enabled: !!dealId
  })
  return query
}

export const useRejectApplication = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: number) => {
      return await rejectApplication(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rejected-application'] })
      showCustomToast('Success', 'Application is rejected', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to reject application',
        'error',
        5000
      )
    }
  })
}

export const useEndDeal = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: string) => {
      return await endDeal(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ended-deals', 'mydeals'] })
      showCustomToast('Success', 'Deal is ended', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to end deal',
        'error',
        5000
      )
    }
  })
}

export const useGetPayoutSummary = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['payout-summary', organization?.id],
    queryFn: async () => await getPayoutSummary(organization?.id),
    enabled: !!organization?.id
  })
  return query
}

export const useGetPaymentTrackedData = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['tracked-data', organization?.id],
    queryFn: async () => await getTrackedData(organization?.id),
    enabled: !!organization?.id
  })
  return query
}
export const useGetRequestRecievedData = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)
  const { organization } = saved

  const query = useQuery({
    queryKey: ['request-recieved', organization?.id],
    queryFn: async () => await getRequestRecieved(organization?.id),
    enabled: !!organization?.id
  })
  return query
}

export const useCreateComisionRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: createComisionRequestParam) => {
      return await createComisionRequest(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commisions'] })
      showCustomToast('Success', 'Comission sent successfully', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to send commision',
        'error',
        5000
      )
    }
  })
}

export const useApprovePaymentRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: number) => {
      return await approvePayment(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['approved-payment'] })
      showCustomToast(
        'Success',
        'Payment approved successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to approve payment',
        'error',
        5000
      )
    }
  })
}
export const useRejectPaymentRequest = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { id: number; reason: string }) => {
      return await rejectPayment(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reject-payment'] })
      showCustomToast(
        'Success',
        'Payment rejected successfully',
        'success',
        5000
      )
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to reject payment',
        'error',
        5000
      )
    }
  })
}
