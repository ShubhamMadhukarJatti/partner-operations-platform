'use server'

import { fetcher, getServerUser } from '@/lib/server'

export const getCampaignsByOrgId = async (values: { orgId: number }) => {
  const { orgId } = values

  try {
    const data = await fetcher<any>(
      `/referral/campaigns?organizationId=${orgId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      }
    )
    console.log({ data })
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error getCampaignsByOrgId')
  }
}

export const getReferralDataByReferralCode = async (values: {
  referralCode: string
  uniqueImpressions: boolean
}) => {
  const { referralCode, uniqueImpressions = false } = values

  try {
    const data = await fetcher<any>(
      `/referral/data?referralCode=${referralCode}&uniqueImpressions=${uniqueImpressions}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      }
    )
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error getReferralDataByReferralCode')
  }
}

export const getCampaignByReferralCode = async (values: {
  referralCode: string
}) => {
  const { referralCode } = values

  try {
    const data = await fetcher<any>(
      `/referral/campaign?referralCode=${referralCode}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json-patch+json'
        }
      }
    )
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error getCampaignByReferralCode')
  }
}

export const generateReferralLink = async (values: {
  orgId: number
  landingPage: string
}) => {
  try {
    await getServerUser()
    const { orgId, landingPage } = values

    const data = await fetcher<any>(
      `/referral/generate?organizationId=${orgId}&landingPage=${landingPage}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: {
          landingPage,
          organizationId: orgId
        }
      }
    )
    console.log('data', data)
    return data
  } catch (error) {
    console.error('Error generateReferralLink', error)
    throw new Error('Error generateReferralLink')
  }
}

export type CREATE_REFERRAL_CAMPAIGN_POST_PAYLOAD = {
  organizationId?: number
  referralCode?: string
  urlRef?: string
  emailRef?: string
  referralLink?: string
  partnerOrganizationName?: string
  partnerId?: number
  status?: string
}

export const createReferralCampaign = async (
  values: CREATE_REFERRAL_CAMPAIGN_POST_PAYLOAD
) => {
  try {
    await getServerUser()
    const data = await fetcher<any>('/referral/campaign', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: values
    })
    return data
  } catch (error) {
    console.error('Error createReferralCampaign', error)
    throw new Error('Error createReferralCampaign')
  }
}

export const getReferralAnalyticsData = async (values: {
  referralCode: string
  page: string
  size: string
}) => {
  try {
    const { referralCode, page, size } = values

    const data = await fetcher<any>(
      `/referral/leads/stats?referralCode=${referralCode}&page=${page}&size=${size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return data
  } catch (error) {
    console.error('Error getReferralAnalyticsData', error)
    throw new Error('Error getReferralAnalyticsData')
  }
}
export const getLeadsGraphData = async (values: {
  referralCode: string
  from: string
  to: string
}) => {
  try {
    const { referralCode, from, to } = values

    const data = await fetcher<any>(
      `/referral/data?referralCode=${referralCode}&from=${from}&to=${to}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return data
  } catch (error) {
    console.error('Error getReferralAnalyticsData', error)
    throw new Error('Error getReferralAnalyticsData')
  }
}
