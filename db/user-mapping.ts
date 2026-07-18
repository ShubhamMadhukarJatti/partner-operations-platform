'use server'

import { UserMappingsByOrgId } from '@/types'

import { getCurrentOrganization } from '@/lib/db/organization'
import { fetcher, getServerUser } from '@/lib/server'

export async function getAllUserMappingsByOrgid(
  orgId?: number
): Promise<UserMappingsByOrgId[]> {
  try {
    const { token } = await getServerUser()
    const id = orgId || (await getCurrentOrganization()).id

    const data = await fetcher<UserMappingsByOrgId[]>(
      `/orgUserMapping/allByOrganizationId?id=${id}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return data
  } catch (error: any) {
    console.error('Error fetching user mappings:', error.message)
    throw new Error('Error fetching user mappings')
  }
}
