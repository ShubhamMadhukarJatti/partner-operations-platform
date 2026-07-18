'use server'

import { revalidatePath } from 'next/cache'
import * as z from 'zod'

import { getCurrentOrganization } from '@/lib/db/organization'
import { ProfileSchema } from '@/app/(app)/(account-settings)/settings/profile/type'

import { fetcher, getServerUser } from '../server'

// update organization details
const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional()
})

export const updateOrganization = async (
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
    preferedPartnershipTypes,
    companyType,
    services,
    targetMarket,
    referralProgram,
    dateOfIncorporation,
    code,
    country,
    address,
    contactNumber,
    startupName
  } = values

  const preferedPartnershipTypesList = preferedPartnershipTypes.map((item) => {
    return {
      area: item.value
    }
  })

  const patchBody = [
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
    { op: 'replace', path: '/referralProgram', value: referralProgram || null },
    { op: 'replace', path: '/name', value: startupName || null },
    { op: 'replace', path: '/contactNumber', value: contactNumber || null },
    { op: 'replace', path: '/country', value: country || null },
    { op: 'replace', path: '/address', value: address || null },
    {
      op: 'replace',
      path: '/dateOfIncorporation',
      value: dateOfIncorporation || null
    },
    {
      op: 'replace',
      path: '/registrationType',
      value: registrationType || null
    },
    {
      op: 'replace',
      path: '/preferredPartnershipTypes',
      value: preferedPartnershipTypesList
    },
    { op: 'replace', path: '/services', value: services || null },
    { op: 'replace', path: '/companyType', value: companyType }
  ]
  try {
    const data = await fetcher<unknown>(`/organization?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json-patch+json' },
      data: patchBody
    })
    revalidatePath('/settings')
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error updating organization details')
  }
}

export const updateOrganizationDetails = async (
  values: z.infer<typeof ProfileSchema>
) => {
  const {
    id,
    inHousePartnership,
    brandingPage,
    activePartnerProgram,
    currentPartnerCount
  } = values
  const patchBody = [
    { op: 'replace', path: '/inHouseTeam', value: inHousePartnership || null },
    { op: 'replace', path: '/brandingPage', value: brandingPage || null },
    {
      op: 'replace',
      path: '/activePartnerProgram',
      value: activePartnerProgram || null
    },
    {
      op: 'replace',
      path: '/currentPartnerCount',
      value: currentPartnerCount || null
    }
  ]
  try {
    const data = await fetcher<unknown>(
      `/organization/getting-started?organizationId=${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json-patch+json' },
        data: patchBody
      }
    )
    revalidatePath('/settings')
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error updating organization details')
  }
}

export interface OrganizationDetailsShape {
  inHouseTeam?: string | null
  brandingPage?: string | null
  activePartnerProgram?: string | null
  currentPartnerCount?: string | null
}

export const getOrganizationDetails = async (
  orgId: any
): Promise<OrganizationDetailsShape> => {
  try {
    const data = await fetcher<OrganizationDetailsShape>(
      `/organization/getting-started?organizationId=${orgId}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json-patch+json' }
      }
    )
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error getting details')
  }
}

export const updateOrganizationModal = async (
  values: z.infer<typeof ProfileSchema>
) => {
  const {
    id,
    briefDescription,
    about,
    city,
    registrationType,
    state,
    website,
    companyType,
    targetMarket,
    referralProgram
  } = values

  const patchBody = [
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
    { op: 'replace', path: '/referralProgram', value: referralProgram || null },
    {
      op: 'replace',
      path: '/registrationType',
      value: registrationType || null
    },
    { op: 'replace', path: '/companyType', value: companyType }
  ]
  try {
    const data = await fetcher<unknown>(`/organization?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json-patch+json' },
      data: patchBody
    })
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error updating organization details')
  }
}

export const followOrganization = async (organizationId: number) => {
  const [{ user }, currentOrganization] = await Promise.all([
    getServerUser(),
    getCurrentOrganization()
  ])
  try {
    await fetcher('/organizationFollower', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {
        organizationId,
        followerOrganizationId: currentOrganization.id,
        followingFor: 'all',
        followedByUserId: user?.uid
      }
    })
  } catch (error: any) {
    console.log(error)
    throw new Error('Error following organization')
  }
}

export const updateOrganizationProfile = async ({
  fieldValue,
  name,
  id
}: any) => {
  const patchData = [
    { op: 'replace', path: `/${name}`, value: fieldValue || null }
  ]
  try {
    const result = await fetcher<unknown>(`/organization?id=${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json-patch+json' },
      data: patchData
    })
    return result
  } catch (error) {
    console.error('Error updating organization:', error)
    throw error
  }
}
