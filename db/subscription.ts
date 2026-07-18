'use server'

import { fetcher, getServerUser } from '@/lib/server'
import { fetchBillingCustomer } from './payment'

import { getCurrentOrganization } from './organization'

export const getCredits = async () => {
  const org = await getCurrentOrganization()

  const data = await fetcher<any>(`/credits?organizationId=${org?.id}`, {
    method: 'GET'
  })

  return data
}
export const getSubscription = async () => {
  try {
    const data = await fetcher<any>(`/api/v1/billing/subscription/summary`, {
      method: 'GET'
    })

    return data?.data ?? data
  } catch (error: any) {
    // Any failure (404, network error, etc.) means no active subscription — show free trial UI
    console.warn(
      'Subscription fetch failed, treating as no subscription:',
      error?.message ?? error
    )
    return null
  }
}

export const getBillingOverview = async () => {
  try {
    let cardDetails = []
    // 1. Get current user and fetch customer data for card details
    try {
      const { user } = await getServerUser()
      if (user?.uid) {
        const customerData = await fetchBillingCustomer(user.uid)
        cardDetails = customerData?.cardDetails || []
      }
    } catch (err) {
      console.warn('Failed to fetch captured card details:', err)
    }

    // 2. Fetch main billing overview
    // Add timestamp to bypass potential caching
    const data = await fetcher<any>(
      `/api/v1/billing/billing/overview?t=${Date.now()}`,
      {
        method: 'GET'
      }
    )

    const normalizedData = data?.data ?? data

    // Merge card details into the overview data
    return {
      ...normalizedData,
      cardDetails
    }
  } catch (error: any) {
    console.warn('Billing overview fetch failed:', error?.message ?? error)
    return null
  }
}

export const cancelSubscription = async (id: string) => {
  const data = await fetcher<any>(
    `/subscription/cancel?cancellationReason=&subscriptionId=${id}`,
    {
      method: 'POST'
    }
  )

  console.log(data)

  return data
}
