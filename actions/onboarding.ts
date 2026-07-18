'use server'

import { redirect } from 'next/navigation'

// import { uploadFile } from '@/lib/actions/s3'
import { getServerUser } from '@/lib/server'

import { getCurrentOrganization } from '../db/organization'

// create user
export async function createUser(
  formData: { name: string; role: string },
  userData: { email: string; emailVerified: boolean }
) {
  const { token, user } = await getServerUser()
  const name = formData.name
  const role = formData.role
  const email = userData.email
  const emailVerified = userData.emailVerified
  try {
    const res = await fetch(`${process.env.SHARKDOM_API_URL}/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        userId: user?.uid,
        name: name,
        userType: role,
        email: email,
        emailVerified: emailVerified,
        status: 'ACTIVE'
      })
    })
    if (res.ok) {
      console.log('res,', res)
      const data = await res.json()
      console.info('user created', data)
    }
    console.log(res)
  } catch (error) {
    console.error('Error creating user', error)
    throw new Error('Something went wrong, please try again.')
  }
}

// update user
export async function updateUser(
  formData: { name: string; role: string }
  // userData: { email: string; emailVerified: boolean }
) {
  const { token, user } = await getServerUser()
  const name = formData.name
  const role = formData.role
  // const emailVerified = userData.emailVerified
  try {
    const res = await fetch(
      `${process.env.SHARKDOM_API_URL}/user?userId=${user.uid}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify([
          // {
          //   op: 'replace',
          //   path: '/userId',
          //   value: user?.uid
          // },
          {
            op: 'replace',
            path: '/name',
            value: name
          },
          {
            op: 'replace',
            path: '/userType',
            value: role
          }
          // {
          //   op: 'replace',
          //   path: '/emailVerified',
          //   value: emailVerified
          // }
        ])
      }
    )
    if (res.ok) {
      const data = await res.json()
      console.info('user updated', data)
      return data
    }
  } catch (error) {
    console.error('Error creating user', error)
    throw new Error('Something went wrong, please try again.')
  }
}

// create organizationa and map user to organization.
export const createOrganization = async (data: any) => {
  const { token, user } = await getServerUser()

  const newOrganization = {
    ...data,
    // primaryEmail: email,  //after new auth coming from form...getting from sessionStorage
    primaryEmailVerified: true,
    status: 'ACTIVE',
    source: 'Web'
  }

  console.log(newOrganization)

  try {
    // create organization
    const res = await fetch(`${process.env.SHARKDOM_API_URL}/organization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newOrganization)
    })

    const org = await res.json()

    if (!res.ok) {
      console.log(org.errorMessage, `creating org while onboarding`)

      throw new Error(org.errorMessage)
    }

    console.log('organization success')

    console.log('Organization created:', org)
    // upload logo
    // uploadFile({ id: org.id, file: logo })
    //  map user to organization
    const mapuser = await fetch(
      `${process.env.SHARKDOM_API_URL}/orgUserMapping`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.uid,
          organizationId: org?.id,
          role: 'ADMIN',
          status: 'ACTIVE'
        })
      }
    )
    const mapUserData = await mapuser.json()
    if (!mapuser.ok) {
      console.log(mapUserData.errorMessage, `user mapping while onboarding`)
      throw new Error(mapUserData.errorMessage)
    }

    // await mapuser.json()
    console.log('User mapped to organization successfully')
  } catch (error: any) {
    throw new Error(error)
  }
}

export const updateUserGoals = async (
  preferredSectors: any,
  preferredPartnershipTypes: any
) => {
  const { token } = await getServerUser()
  const org = await getCurrentOrganization()
  console.log('hit', preferredSectors, preferredPartnershipTypes)
  // FIXME this should be updated to array, refer orgnaization.ts updatePreferences function

  try {
    const res = await fetch(
      `${process.env.SHARKDOM_API_URL}/organization?id=${org?.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify([
          { op: 'replace', path: '/preferredSectors', value: preferredSectors },
          {
            op: 'replace',
            path: '/preferredPartnershipTypes',
            value: preferredPartnershipTypes
          }
        ])
      }
    )
    if (!res.ok) {
      console.log('error', res)
    }
    const data = await res.json()
    console.log(data)
  } catch (error: any) {
    console.error('error', error.message)
    throw new Error('Error updating organization details')
  }
}

// join existing organization
export const JoinOrganization = async (formData: FormData) => {
  const { token, user } = await getServerUser()
  const designation = formData.get('designation')
  const orgId = formData.get('startup')
  // map user to organization
  try {
    const mapuser = await fetch(
      `${process.env.SHARKDOM_API_URL}/orgUserMapping`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.uid,
          organizationId: orgId,
          designation: designation,
          role: 'VIEWER',
          status: 'UNAPPROVED'
        })
      }
    )
    if (mapuser.ok) {
      const data = await mapuser.json()
    } else {
      throw new Error('Error while mapping user to organization.')
    }
  } catch (error) {
    console.error('Error while mapping user to organization', error)
    throw new Error('Something went wrong, please try again.')
  }
  redirect('/onboarding/waiting')
  // redirec to waiting screen untill accepted
}

export const JoinOrganizationWithoutFormData = async ({
  designation,
  startup,
  role
}: {
  designation: string
  startup: string
  role: string
}) => {
  const { token, user } = await getServerUser()
  // map user to organization
  try {
    const mapuser = await fetch(
      `${process.env.SHARKDOM_API_URL}/orgUserMapping`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user?.uid,
          organizationId: startup,
          designation: designation,
          role: role,
          status: 'ACTIVE'
        })
      }
    )
    if (mapuser.ok) {
      const data = await mapuser.json()
      return data
    } else {
      console.log(mapuser)
      throw new Error('Error while mapping user to organization.')
    }
  } catch (error) {
    console.error('Error while mapping user to organization', error)
    throw new Error('Something went wrong, please try again.')
  }
}

export const getExistingOrganizations = async (value: string): Promise<any> => {
  const { token, user } = await getServerUser()

  try {
    // create organization
    const res = await fetch(
      `${process.env.SHARKDOM_API_URL}/discovery?partialName=${value}&page=0&size=30`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      throw new Error('Error while fetching organizations.')
    }

    const org = await res.json()
    return org?.content
  } catch (error) {
    console.error('Error Creating Organization', error)
    throw new Error('Error while creating organization. Please try again.')
  }
}
