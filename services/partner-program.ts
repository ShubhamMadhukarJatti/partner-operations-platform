import { fetcher } from '@/lib/server'

export const createNewReferralProgram = async (params: any) => {
  console.log(params, `these are params`)

  const response = await fetcher('/referral/campaign', {
    method: 'POST',
    data: params
  })

  if (!response) {
    throw new Error('Failed to create partner program!')
  }

  return response
}

export const addReferralPartner = async (params: any) => {
  console.log(params, `these are params`)

  const response = await fetcher('/referral/campaign/invite', {
    method: 'POST',
    data: params
  })

  if (!response) {
    throw new Error('Failed to add partner!')
  }

  return response
}

export const createReferralCode = async ({
  id,
  landing
}: {
  id: string
  landing: string
}) => {
  const response = await fetcher(
    `/referral/generate?organizationId=${id}&landingPage=${landing}`,
    {
      method: 'POST'
    }
  )

  if (!response) {
    throw new Error('Failed to create referral code!')
  }

  return response
}

export const getPartnerPrograms = async ({
  id
}: {
  id: string
}): Promise<any> => {
  const response = await fetcher<any>(
    `/referral/campaigns?organizationId=${id}`,
    {}
  )

  if (!response) {
    throw new Error('Failed to get partner programs')
  }

  return response
}
export const getJoinedPartnerPrograms = async ({ id }: { id: string }) => {
  const response = await fetcher(
    `/referral/campaigns-joined?organizationId=${id}`,
    {}
  )

  if (!response) {
    throw new Error('Failed to get partner programs')
  }

  return response
}
export const getCampaign = async ({ id }: { id: string }) => {
  const response = await fetcher(`/referral/campaign?referralCode=${id}`, {})

  if (!response) {
    throw new Error('Failed to get campaign')
  }

  return response
}
export const getLeads = async ({
  id,
  page,
  size = 20
}: {
  id: string
  page: number
  size: number
}) => {
  const response = await fetcher(
    `/referral/leads/stats?referralCode=${id}&page=${page}&size=${size}`,
    {
      method: 'GET'
    }
  )

  if (!response) {
    throw new Error('Failed to get campaign')
  }

  return response
}
export const getGraphData = async ({
  id,
  from,
  to
}: {
  id: string
  from: string
  to: string
}) => {
  const response = await fetcher(
    `/referral/data?referralCode=${id}&from=${from}&to=${to}`,
    {
      method: 'GET'
    }
  )

  if (!response) {
    throw new Error('Failed to get campaign')
  }

  console.log(response)

  return response
}

export const patchReferralCampaign = async (payload: {
  id: string
  programName?: string
  description?: string
  urlRef?: string
  status?: 'ACTIVE' | 'DRAFT' | 'PAUSE' | 'REVOKE'
}) => {
  const id = payload.id
  const programName = payload.programName ?? false
  const description = payload.description ?? false
  const urlRef = payload.urlRef ?? false
  const status = payload.status ?? false
  if (!id) {
    throw new Error('Id not found')
  }

  const response = await fetcher(`/referral/campaign?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json' // Ensure this matches your API expectations
    },
    data: [
      programName
        ? { op: 'replace', path: '/programName', value: programName }
        : null,
      description
        ? { op: 'replace', path: '/description', value: description }
        : null,
      urlRef ? { op: 'replace', path: '/urlRef', value: urlRef } : null,
      status ? { op: 'replace', path: '/status', value: status } : null
    ].filter(Boolean)
  })

  if (!response) {
    throw new Error(`Failed to update values: ${response}`)
  }

  return response
}
export const changeLeadStatus = async (payload: {
  email: string
  leadsStatus: string
  referralCode: string
}) => {
  const response = await fetcher(`/referral/lead/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json' // Ensure this matches your API expectations
    },
    data: payload
  })

  if (!response) {
    throw new Error(`Failed to update values: ${response}`)
  }

  return response
}

export const getPartnerDetails = async (orgId: number, partnerId: string) => {
  const response = await fetcher(`/referral/${orgId}/partner/${partnerId}`, {
    method: 'GET'
  })

  if (!response) {
    throw new Error('Failed to fetch partner details')
  }

  return response
}
export const getActivePartners = async (orgId: number) => {
  const response = await fetcher(`/referral/partners?organizationId=${orgId}`, {
    method: 'GET'
  })

  if (!response) {
    throw new Error('Failed to fetch partner details')
  }

  return response
}
export const getTestedCampaign = async (
  referralCode: string,
  website: string
) => {
  const response = await fetcher(
    `/referral/tested-campaign?referralCode=${referralCode}&website=${website}`,
    {
      method: 'GET'
    }
  )

  if (!response) {
    throw new Error('Failed to fetch tested campaign')
  }

  return response
}
