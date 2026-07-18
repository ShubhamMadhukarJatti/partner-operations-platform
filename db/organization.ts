'use server'

import { OrganizationMappingsByUserId, OrganizationType } from '@/types'

import { fetcher, getServerUser } from '@/lib/server'

export const getCurrentOrganization = async (): Promise<OrganizationType> => {
  const { user } = await getServerUser()

  const data: OrganizationMappingsByUserId[] = await fetcher(
    `/orgUserMapping/allOrganizationMappingsByUserId?userId=${user?.uid}`,
    { headers: { 'Content-Type': 'application/json' } }
  )
  const organization = data?.find(
    (org) => org.organizationUserMapping.status === 'ACTIVE'
  )?.organization!

  return organization
}

export const fetchconnectedApps = async (): Promise<any> => {
  const connectedApps = await fetcher<any>('/organization/integration', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  return connectedApps
}

type OrgIntegrationData = {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationId: number
  refreshToken: string
  integrationType: 'HUBSPOT'
}

export const Postintegrationdata = async (data: any): Promise<any> => {
  const response = await fetcher<any>('/organization/integration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: typeof data === 'string' ? JSON.parse(data) : data
  })
  return response
}

export const PatchIntegrationData = async (data: any): Promise<any> => {
  const response = await fetcher<any>('/organization/integration', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    data: typeof data === 'string' ? JSON.parse(data) : data
  })
  return response
}
// `${process.env.SHARKDOM_API_URL}/organization/integration?organizationId=${user?.uid}`,

export const getOrganizationById = async (
  id: number
): Promise<OrganizationType> => {
  const { token } = await getServerUser()

  // try {
  return await fetcher(`/organization/id?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  // } catch (error) {
  //   console.error(error)
  //   throw new Error('Error getting organization')
  // }
}

export const getOrgByCode = async (id: number): Promise<OrganizationType> => {
  try {
    return await fetcher<OrganizationType>(`/organization/code?code=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error getting organization')
  }
}

// export const getOrgByCode = async (code: string): Promise<OrganizationType> => {
//   const { token } = await getServerUser()

//   return fetch(
//     `${process.env.SHARKDOM_API_URL}/organization/code?code=${code}`,
//     {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     }
//   ).then((response) => response.json())
// }

export const getMeetingId = async (
  orgA: number,
  orgB: number
): Promise<{
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationA: number
  organizationB: number
  meetingId: string
}> => {
  return fetcher(`/meetings?organizationA=${orgA}&organizationB=${orgB}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
}

export const getOrganizationMappingsByUserId = async (
  userId?: string
): Promise<OrganizationMappingsByUserId[]> => {
  return fetcher<OrganizationMappingsByUserId[]>(
    `/orgUserMapping/allOrganizationMappingsByUserId?userId=${userId ?? (await getServerUser()).user?.uid}`
  )
}

export const getOrganizationFollowers = async (
  followerOrganizationId: number,
  page: number = 0,
  size: number = 10
): Promise<any> => {
  try {
    return await fetcher(
      `/organizationFollower/followerId?followerOrganizationId=${followerOrganizationId}&page=${page}&size=${size}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching organization followers')
  }
}

export const checkIfAFollowsB = async (orgAId: number, orgBId: number) => {
  try {
    return await fetcher(
      `/organizationFollower/check?organizationA=${orgAId}&organizationB=${orgBId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching organization followers')
  }
}

export const getSavedOrganizations = async (
  orgId: number,
  page: number
): Promise<any> => {
  try {
    return await fetcher(
      `/organization/bookmark?organizationId=${orgId}&page=${page}&size=12`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Failed to fetch saved organizations:', error)
    throw error
  }
}

export const bookmarkOrganization = async (
  orgId: number,
  otherOrgId: number
): Promise<any> => {
  try {
    await fetcher(
      `/organization/bookmark?organizationId=${orgId}&partnerOrganizationId=${otherOrgId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Failed to fetch saved organizations:', error)
    throw error
  }
}

export const getGetStartedDetails = async (organizationId: number) => {
  try {
    return await fetcher(
      `/organization/getting-started?organizationId=${organizationId.toString()}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error(error)
    throw new Error('Error while get getting started details')
  }
}

export const getPublicOrg = async (id: number): Promise<any> => {
  try {
    return await fetcher(`/organization/details?code=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error getting organization')
  }
}

export const getPartnershipIntegration = async (id: number): Promise<any> => {
  try {
    return await fetcher(`/partnership-integration?organizationId=${id}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error(error)
    throw new Error('Error getting organization')
  }
}

export const addPartner = async (params: {
  email: string
  message: string
  organizationId: number | undefined
  name: string
}) => {
  return fetcher(
    `/organization/addPartner?email=${params.email}&organizationId=${params.organizationId}&message=${params.message}&name=${params.name}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: params
    }
  )
}

export const inviteTeamMember = async (params: {
  email: string
  role: string
  organizationId: number | undefined
}) => {
  const { email, role, organizationId } = params
  try {
    return await fetcher(
      `/user/addUser?email=${email}&organizationId=${organizationId}&role=${role}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: params
      }
    )
  } catch (error: any) {
    throw new Error('Failed to invite team member')
  }
}
