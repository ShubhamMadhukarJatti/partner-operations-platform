'use server'

import { revalidatePath } from 'next/cache'

import { fetcher, getServerUser } from '@/lib/server'

// update organization details
export const updateOrganizationAfterPANVerification = async (values: {
  orgId: number
  verified: boolean
  verifiedBy: string | 'API'
  verifiedOn: number
  legalName?: string
}) => {
  await getServerUser()
  const { orgId, verified, legalName, verifiedOn, verifiedBy } = values

  const payload = [
    {
      op: 'replace',
      path: '/verified',
      value: verified
    },
    {
      op: 'replace',
      path: '/verifiedBy',
      value: verifiedBy
    },
    {
      op: 'replace',
      path: '/verifiedOn',
      value: verifiedOn
    }
  ]

  if (legalName) {
    payload.push({
      op: 'replace',
      path: '/legalName',
      value: legalName
    })
  }

  try {
    const data = await fetcher<any>(`/organization?id=${orgId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data: payload
    })
    revalidatePath('/settings')
    return data
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error updating organization details')
  }
}
