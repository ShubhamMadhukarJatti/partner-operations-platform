'use server'

import { fetcher } from '../server'
import { getCurrentOrganization } from './organization'

export const getOfflinePartnerById = async (id: number): Promise<any> => {
  try {
    const data = await fetcher<any>(
      `/organization/partner-details/id?id=${id}`,
      { method: 'GET' }
    )
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching partner details ')
  }
}

export const getOfflinePartners = async (tab: string): Promise<any> => {
  try {
    const organization = await getCurrentOrganization()
    if (!organization.id) throw new Error('org id not found')

    const data = await fetcher<any>(
      `/organization/partner-details?organizationId=${organization.id}&status=${tab}`,
      { method: 'GET' }
    )
    return data
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching offline partners')
  }
}
