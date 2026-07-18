'use server'

import { ConfigType } from '@/types'

import { fetcher, getServerUser } from '@/lib/server'

export const getConfigByType = async (
  type:
    | 'PLAYGROUND'
    | 'PLAYGROUND_HINT'
    | 'PREFERRED_SECTORS'
    | 'TRENDING_STARTUP'
    | 'USER_DESIGNATION'
    | 'BENEFITS'
    | 'PREFERRED_PARTNERSHIPS'
    | 'ACCESS_CONTROL'
    | 'PREFERRED_SUB_SECTORS'
    | 'NEW_PRICING'
    | 'TRIAL_PRICING'
    | 'RESTRICTED_INDUSTRY'
    | 'GEOGRAPHY_DD'
    | 'MARKETING_CHANNELS'
    | 'COMPLIANCE',
  tokenAdmin?: string
): Promise<ConfigType[]> => {
  try {
    const { token } = await getServerUser()
    const userToken = tokenAdmin ? tokenAdmin : token

    const configData = await fetcher<ConfigType[]>(
      `/configuration/allActiveByType?type=${type}`,
      {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      }
    )

    return configData
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching configuration data')
  }
}

export const getAllPlanConfigurations = async (): Promise<any> => {
  try {
    const { token } = await getServerUser()

    const configData = await fetcher<any>(
      '/sharkdom-stripe/v1/all-plan-configuration',
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return configData
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching all plan configurations')
  }
}

export const getCouponByCode = async (couponCode: string): Promise<any> => {
  try {
    const { token } = await getServerUser()

    const couponData = await fetcher<any>(
      `/sharkdom-stripe/v1/coupon/${encodeURIComponent(couponCode)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return couponData
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching coupon data')
  }
}

export const getAllCoupons = async (): Promise<any> => {
  try {
    const { token } = await getServerUser()

    const coupons = await fetcher<any>('/sharkdom-stripe/v1/coupons', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return coupons
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching all coupons')
  }
}
