'use server'

import { getServerUser } from '@/lib/server'

export interface ShortlistedPartner {
  shortlistedOrgId: number
  shortlistedByUserId: string
  shortlistedByUserName: string
  shortlistedByOrgId: number
  remark: string
  logoUrl: string
  name: string
  creationTimestamp: string
}

export const getShortlistedPartners = async (
  orgId: number
): Promise<ShortlistedPartner[]> => {
  const { token } = await getServerUser()

  if (!token) {
    throw new Error('Unauthorized')
  }

  const response = await fetch(
    `${process.env.SHARKDOM_API_URL}/organization/getShortListing/${orgId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (!response.ok) {
    throw new Error(
      `Failed to fetch shortlisted partners: ${response.statusText}`
    )
  }

  return await response.json()
}
