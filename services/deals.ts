import { fetcher, getServerUser } from '@/lib/server'

export interface dealForm {
  organizationId: number
  offerDetail: string
  restrictedSectors: string[]
  channelAllowed: string[]
  quotaRemaining: string
  geography: string
  approvalRequired: boolean
  status: string
}

export interface joinDealParam {
  organizationId: number
  dealId: string
}

export interface connectBankAccountParam {
  holderName: string
  ifscCode: string
  accountNumber: string
  accountType: 'business' | 'individual'
  organizationId: number
}
export interface createComisionRequestParam {
  orgId: number
  requestingOrganizationId: number
  transactionId: string
  commission: number
  invoiceAzure: string
}

export const createNewDeal = async (params: dealForm) => {
  const response = await fetcher('/deals/create', {
    method: 'POST',
    data: params
  })

  if (!response) {
    throw new Error('Failed to create new deal')
  }

  return response
}

export const fetchMyDeals = async (
  organizationId: number,
  dealType: string
) => {
  const response = await fetcher(
    `/deals/my?organizationId=${organizationId}&dealType=${dealType.toUpperCase()}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const joinDeals = async (params: joinDealParam) => {
  const { user: currentUser } = await getServerUser()

  if (currentUser) {
    const response = await fetcher('/deals/join', {
      method: 'POST',
      data: {
        ...params,
        userId: currentUser.user_id
      }
    })

    if (!response) {
      throw new Error('Failed to join deal')
    }

    return response
  } else {
    throw new Error('User not found')
  }
}

export const fetchDeals = async (organizationId: number) => {
  const response = await fetcher(
    `/deals/all?organizationId=${organizationId}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const fetchApplications = async (dealId: string, activeTab: string) => {
  const response = await fetcher(
    `/deals/applications?dealId=${dealId}&status=${activeTab}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const fetchDealDetails = async (dealId: string) => {
  const response = await fetcher(`/deals/details?dealId=${dealId}`, {
    method: 'GET'
  })

  return response
}

export const acceptApplication = async (applicationId: number) => {
  const response = await fetcher(
    `/deals/accept/application?applicationId=${applicationId}`,
    {
      method: 'POST'
    }
  )

  if (!response) {
    throw new Error('Failed accept application')
  }

  return response
}

export const connectBankAccount = async (params: connectBankAccountParam) => {
  const { user: currentUser } = await getServerUser()

  if (currentUser) {
    const response = await fetcher('/deals/connectBankAccount', {
      method: 'POST',
      data: {
        ...params,
        userId: currentUser.user_id
      }
    })
    if (!response) {
      throw new Error('Failed to connect bank')
    }

    return response
  } else {
    throw new Error('User not found')
  }
}

export const getConnectedAccounts = async (orgId: number) => {
  const response = await fetcher(
    `/deals/connectedAccounts?organizationId=${orgId}`,
    {
      method: 'GET'
    }
  )

  return response
}
export const getAffiliateLink = async (orgId: number, dealId: string) => {
  const response = await fetcher(
    `/deals/affiliateLink?organizationId=${orgId}&dealId=${dealId}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const rejectApplication = async (applicationId: number) => {
  const response = await fetcher(
    `/deals/reject/application?applicationId=${applicationId}`,
    {
      method: 'POST'
    }
  )

  if (!response) {
    throw new Error('Failed to reject application')
  }

  return response
}
export const endDeal = async (dealId: string) => {
  const response = await fetcher(`/deals/end?dealId=${dealId}`, {
    method: 'POST'
  })

  if (!response) {
    throw new Error('Failed to end deal')
  }

  return response
}

export const getPayoutSummary = async (orgId: number) => {
  const response = await fetcher(`/deals/payout-summary?orgId=${orgId}`, {
    method: 'GET'
  })

  return response
}
export const getTrackedData = async (orgId: number) => {
  const response = await fetcher(
    `/deals/captured-payments?organizationId=${orgId}`,
    {
      method: 'GET'
    }
  )

  return response
}
export const getRequestRecieved = async (orgId: number) => {
  const response = await fetcher(
    `/deals/commission-requests?organizationId=${orgId}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const createComisionRequest = async (
  params: createComisionRequestParam
) => {
  const response = await fetcher('/deals/commission-request', {
    method: 'POST',
    data: params
  })
  if (!response) {
    throw new Error('Failed to send commision')
  }

  return response
}
export const approvePayment = async (id: number) => {
  const response = await fetcher(`/deals/commission-requests/${id}/accept`, {
    method: 'POST'
  })
  if (!response) {
    throw new Error('Failed to approve payment')
  }

  return response
}
export const rejectPayment = async (payload: {
  id: number
  reason: string
}) => {
  const response = await fetcher(
    `/deals/commission-requests/${payload.id}/reject?rejectingReason=${payload.reason}`,
    {
      method: 'POST'
    }
  )
  if (!response) {
    throw new Error('Failed to reject payment')
  }

  return response
}
