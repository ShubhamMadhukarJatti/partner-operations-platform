'use server'

import { OrganizationMappingsByUserId, OrganizationType } from '@/types'
import { z } from 'zod'

import { fetcher, getServerUser } from '@/lib/server'
// import { ProfileSchema } from '@/lib/actions/organization'
import { ProfileSchema } from '@/app/(app)/(account-settings)/settings/profile/type'
import { PreferenceType } from '@/app/(app)/(dashboard-pages)/explore/_components/preference-setting/PreferenceDialog'

export const getCurrentOrganization = async (): Promise<OrganizationType> => {
  const { token, user } = await getServerUser()

  // console.log(user)

  const response = await fetch(
    `${process.env.SHARKDOM_API_URL}/orgUserMapping/allOrganizationMappingsByUserId?userId=${user?.uid}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data: OrganizationMappingsByUserId[] = await response.json()

  console.log('Organization Mapping Response')
  console.log(data)

  const organization = data.find(
    (org) => org.organizationUserMapping.status === 'ACTIVE'
  )?.organization!
  return organization
}

export const fetchconnectedApps = async (): Promise<any> => {
  const { token } = await getServerUser()

  // const response = await getCurrentOrganization()
  let connectedApps: any
  // if (!response?.id) {
  //   throw new Error('org id not found')
  // }
  const fetchApps = await fetch(
    `${process.env.SHARKDOM_API_URL}/organization/integration`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (!fetchApps?.ok) {
    throw new Error('error fetching integration apps')
  }
  connectedApps = await fetchApps.json()

  return connectedApps
}
export const Postintegrationdata = async (data: any): Promise<any> => {
  const { token } = await getServerUser()

  // console.log(user)

  let response: any = await fetch(
    `${process.env.SHARKDOM_API_URL}/organization/integration`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },

      method: 'POST',
      body: data
    }
  )
  response = await response.json()
  return response
}

export const PatchIntegrationData = async (data: any): Promise<any> => {
  const { token, user } = await getServerUser()

  let response: any = await fetch(
    `${process.env.SHARKDOM_API_URL}/organization/integration`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },

      method: 'PATCH',
      body: data
    }
  )
  response = await response.json()
  return response
}
// `${process.env.SHARKDOM_API_URL}/organization/integration?organizationId=${user?.uid}`,

export const getOrganizationById = async (
  id: number
): Promise<OrganizationType> => {
  const { token } = await getServerUser()

  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/v1/partner-organizations/${id}/details`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return await response.json()
  } catch (error) {
    console.error(error)
    throw new Error('Error getting organization')
  }
}

export const getOrgByCode = async (id: number): Promise<OrganizationType> => {
  const { token } = await getServerUser()

  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/code?code=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return await response.json()
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
  const { token } = await getServerUser()

  const response = await fetch(
    `${process.env.SHARKDOM_API_URL}/meetings?organizationA=${orgA}&organizationB=${orgB}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = await response.json()
  return data
}

export const getOrganizationMappingsByUserId = async (
  userId?: string
): Promise<OrganizationMappingsByUserId[]> => {
  const { user, token } = await getServerUser()
  const response = await fetch(
    `${
      process.env.SHARKDOM_API_URL
    }/orgUserMapping/allOrganizationMappingsByUserId?userId=${
      userId || user?.uid
    }`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  const data: OrganizationMappingsByUserId[] = await response.json()

  return data
}

export const getOrganizationFollowers = async (
  followerOrganizationId: number,
  page: number = 0,
  size: number = 10
): Promise<any> => {
  try {
    const { token } = await getServerUser()

    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organizationFollower/followerId?followerOrganizationId=${followerOrganizationId}&page=${page}&size=${size}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return await response.json()
  } catch (error) {
    console.error(error)
    throw new Error('Error fetching organization followers')
  }
}

export const checkIfAFollowsB = async (orgAId: number, orgBId: number) => {
  try {
    const { token } = await getServerUser()

    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organizationFollower/check?organizationA=${orgAId}&organizationB=${orgBId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    return await response.json()
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
    const { token } = await getServerUser()

    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/bookmark?organizationId=${orgId}&page=${page}&size=12`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      // Throw an error if the response status is not OK (200-299)
      throw new Error(`Error fetching organizations: ${response.statusText}`)
    }

    const data = await response.json()
    return data
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
    const { token } = await getServerUser()

    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/bookmark?organizationId=${orgId}&partnerOrganizationId=${otherOrgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        },
        method: 'POST'
      }
    )

    if (!response.ok) {
      throw new Error(`Error fetching organizations: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Failed to fetch saved organizations:', error)

    throw error
  }
}

export const getGetStartedDetails = async (organizationId: number) => {
  try {
    const { token } = await getServerUser()

    const res = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/getting-started?organizationId=${organizationId.toString()}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    return await res.json()
  } catch (error) {
    console.error(error)
    throw new Error('Error while get getting started details')
  }
}

export const getPublicOrg = async (id: number): Promise<any> => {
  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/details?code=${id}`,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    return await response.json()
  } catch (error) {
    console.error(error)
    throw new Error('Error getting organization')
  }
}

export const getPartnershipIntegration = async (id: number): Promise<any> => {
  const { token } = await getServerUser()

  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/partnership-integration?organizationId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    return await response.json()
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
  console.log(params)
  const organizationId = params.organizationId
  const message = params.message
  const email = params.email
  const name = params.name
  const response = await fetcher(
    `/organization/addPartner?email=${email}&organizationId=${organizationId}&message=${message}&name=${name}`,
    {
      method: 'POST'
    }
  )
  return response
}

export const inviteTeamMember = async (params: {
  email: string
  role: string
  organizationId: number | undefined
}) => {
  const { email, role, organizationId } = params

  const response = await fetcher(
    `/user/addUser?email=${email}&organizationId=${organizationId}&role=${role}`,
    {
      method: 'POST'
    }
  )

  return response
}

export const patchOrganizationData = async (
  values: z.infer<typeof ProfileSchema>
) => {
  const {
    id,
    briefDescription,
    about,
    city,
    // dateOfIncorporation,
    registrationType,
    state,
    website,
    companyType,
    targetMarket,
    referralProgram,
    legalName
  } = values

  const response = await fetcher(`/organization?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json'
    },
    data: [
      {
        op: 'replace',
        path: '/briefDescription',
        value: briefDescription || null
      },
      { op: 'replace', path: '/about', value: about || null },
      { op: 'replace', path: '/website', value: website || null },
      { op: 'replace', path: '/city', value: city || null },
      { op: 'replace', path: '/state', value: state || null },
      { op: 'replace', path: '/targetMarket', value: targetMarket || null },
      {
        op: 'replace',
        path: '/referralProgram',
        value: referralProgram || null
      },
      {
        op: 'replace',
        path: '/registrationType',
        value: registrationType || null
      },
      {
        op: 'replace',
        path: '/legalName',
        value: legalName || null
      },

      {
        op: 'replace',
        path: '/companyType',
        value: companyType
      }
      // {
      //   op: 'replace',
      //   path: '/dateOfIncorporation',
      //   value: dateOfIncorporation || null
      // },
    ]
  })

  return response
}

export const updatePreferences = async (params: PreferenceType, id: number) => {
  const response = await fetcher(`/organization?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json-patch+json'
    },
    data: [
      {
        op: 'replace',
        path: '/companyType',
        value: params.companyType || null
      },
      {
        op: 'replace',
        path: '/preferredSectors',
        value: params.preferredSectors || null
      },
      {
        op: 'replace',
        path: '/preferredPartnershipTypes',
        value: params.preferredPartnershipTypes || null
      },
      {
        op: 'replace',
        path: '/onboardedPartners',
        value: params.onboardedPartners || null
      },
      {
        op: 'replace',
        path: '/excludeCompanySize',
        value: params.excludeCompanySize || null
      },
      {
        op: 'replace',
        path: '/excludePartnershipGoals',
        value: params.excludePartnershipGoals || null
      },
      {
        op: 'replace',
        path: '/avoidGeographicRegion',
        value: params.avoidGeographicRegion || null
      },
      {
        op: 'replace',
        path: '/excludeBusinessMaturityLevel',
        value: params.excludeBusinessMaturityLevel || null
      },
      {
        op: 'replace',
        path: '/excludeCompaniesTechnology',
        value: params.excludeCompaniesTechnology || null
      },
      {
        op: 'replace',
        path: '/companySixMonthOperation',
        value: params.companySixMonthOperation || null
      },
      {
        op: 'replace',
        path: '/companyFundRaising',
        value: params.companyFundRaising || null
      }
    ]
  })

  return response
}

export const saveShortlisting = async (params: {
  shortlisted_org_id: number
  shortlisted_by_user_id: string
  shortlisted_by_user_name: string
  remark: string
  shortlisted_by_org_id: number
}) => {
  const { token } = await getServerUser()

  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/saveShortlisting`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(params)
      }
    )

    if (!response.ok) {
      throw new Error(`Error saving shortlisting: ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to save shortlisting:', error)
    throw error
  }
}

export const removeShortlisting = async (shortlistedOrgId: number) => {
  const { token } = await getServerUser()

  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization/removeShortlisting/${shortlistedOrgId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/hal+json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    // Just check status code, don't parse response body
    if (response.status === 200 || response.status === 204) {
      return { success: true }
    }

    throw new Error(`Error removing shortlisting: ${response.status}`)
  } catch (error) {
    console.error('Failed to remove shortlisting:', error)
    throw error
  }
}

export interface OrganizationStats {
  views: number
  inquiries: number
  rank: number
  visibilityScore: number
  eliteBadgeApplicable: boolean
}

export const fetchOrganizationStats = async (
  orgId: number
): Promise<OrganizationStats> => {
  const { token } = await getServerUser()

  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/v1/partner-organizations/${orgId}/stats`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/hal+json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Error fetching organization stats: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch organization stats:', error)
    throw error
  }
}

export interface PartnerProgramStats {
  id: number
  title: string
  description: string
  organizationId: number
  url: string
  enabledReferralProgram: boolean
  createdDate: string
  applicationReviewTimeAllotted: boolean
  discountAllotted: boolean
  totalClicks: number
  totalSubmits: number
  numberOfQuestions: number
  timeToFill: number
  partnerTierAllotted: boolean
}

export const fetchPartnerProgramStats = async (
  orgId: number
): Promise<PartnerProgramStats> => {
  const { token } = await getServerUser()

  try {
    const response = await fetch(
      `${process.env.SHARKDOM_API_URL}/api/v1/partner-organizations/${orgId}/partner-program`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/hal+json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!response.ok) {
      throw new Error(
        `Error fetching partner program stats: ${response.status}`
      )
    }

    return await response.json()
  } catch (error) {
    console.error('Failed to fetch partner program stats:', error)
    throw error
  }
}
