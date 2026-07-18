'use server'

import { getCurrentOrganization } from '@/lib/db/organization'
import { fetcher, getServerUser } from '@/lib/server'

/** Create organizationCollaboration for new user after onboarding (utm_register flow) */
export async function createCollaborationFromUtmPartner(
  receiverOrgId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { user } = await getServerUser()
    const currentOrg = await getCurrentOrganization()

    if (!user?.uid || !currentOrg?.id) {
      return { success: false, error: 'User or organization not found' }
    }

    const receiverId = Number(receiverOrgId)
    if (!Number.isFinite(receiverId) || receiverId <= 0) {
      return { success: false, error: 'Invalid receiver organization ID' }
    }

    const payload = {
      senderOrganizationId: currentOrg.id,
      receiverOrganizationId: receiverId,
      senderUserId: user.uid,
      status: 'PENDING',
      chatAccessAllowed: true,
      contactPersonUserId: user.uid,
      partnershipMouVersions: [
        {
          senderOrgcontactPerson: user.uid,
          status: 'PENDING_SIGN',
          senderBenefits: [],
          receiverBenefits: []
        }
      ]
    }

    await fetcher<unknown>('/organizationCollaboration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: payload
    })

    return { success: true }
  } catch (error: any) {
    console.error('createCollaborationFromUtmPartner error:', error)
    return {
      success: false,
      error: error?.message ?? 'Failed to create collaboration'
    }
  }
}

// Update user name
export async function updateUserName(name: string) {
  const { user } = await getServerUser()

  try {
    const patchBody = [
      {
        op: 'replace',
        path: '/name',
        value: name
      }
    ]

    const data = await fetcher<any>(`/user?userId=${user.uid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data: patchBody
    })
    return { success: true, data }
  } catch (error: any) {
    console.error('Error updating user name:', error)
    throw new Error(error.message || 'Something went wrong, please try again.')
  }
}

// Create organization or update website (called on step 2)
export async function createOrganization(website: string, email?: string) {
  const { user } = await getServerUser()

  try {
    // const currentOrg = await getCurrentOrganization()
    // console.log('currentOrg', currentOrg)
    // First check if user already has an organization
    const existingOrg = await checkUserOrganization()
    // console.log('existingOrg', existingOrg)

    if (existingOrg?.id) {
      // User already has an organization, just update the website
      console.log('User already has organization, updating website')
      return await updateOrganizationField('website', website)
    }

    // User doesn't have an organization, create new one
    // console.log('No existing organization found, creating new one')

    // Get email from user session if not provided
    const userEmail = email || user?.email || ''

    // User doesn't have an organization, create new one
    const newOrganization = {
      website: website,
      primaryEmailVerified: true,
      status: 'ACTIVE',
      source: 'Web',
      primaryEmail: userEmail
    }

    // console.log('Creating new organization:', newOrganization)

    let org
    try {
      // Create organization
      org = await fetcher<any>('/organization', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        data: newOrganization
      })
    } catch (error: any) {
      const message: string = error?.message || ''
      // Check if the error is about existing website domain
      if (message.includes('website domain already exists')) {
        console.log(
          'Organization with website already exists, updating website instead'
        )
        try {
          // Try to update the existing organization's website (only works if user already has an org)
          return await updateOrganizationField('website', website)
        } catch (updateError: any) {
          // User has no org yet (e.g. new user, website taken by another org).
          // Return structured result so the client can show the message (throwing is hidden in production).
          return {
            success: false,
            errorCode: 'WEBSITE_ALREADY_EXISTS',
            message: 'Organization with website already exists'
          }
        }
      }
      throw new Error(message || 'Failed to create organization')
    }

    // Map user to organization
    const mapUserData = await fetcher<any>('/orgUserMapping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: {
        userId: user?.uid,
        organizationId: org?.id,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    })

    // console.log('Organization created and user mapped successfully')
    return { success: true, data: org }
  } catch (error: any) {
    console.error('Error in createOrganization:', error)
    throw new Error(error.message || 'Something went wrong, please try again.')
  }
}

// Fetch onboarding step-completion progress for current user
export async function getOnboardingProgress() {
  const { user } = await getServerUser()

  if (!user?.uid) {
    throw new Error('User ID not found')
  }

  // IMPORTANT: This runs on the server (server action). The fetcher helper
  // prefixes with SHARKDOM_API_URL/NEXT_PUBLIC_SHARKDOM_API_URL and handles tokens.
  // If backend has no record yet (404 / "No static resource"), return null so new users see normal onboarding.
  try {
    const data = await fetcher<any>(`/api/onboarding/steps/${user.uid}`, {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    })
    return data
  } catch (error: any) {
    const msg = error?.message ?? ''
    if (
      msg.includes('404') ||
      msg.includes('No static resource') ||
      msg.toLowerCase().includes('not found')
    ) {
      console.warn(
        'No onboarding progress record found for user, treating as new user'
      )
      return null
    }
    throw error
  }
}

// Helper function to check if user has organization without throwing error
async function checkUserOrganization() {
  try {
    const { user } = await getServerUser()

    // First get user's organization mappings to find organization ID
    const mappingData = await fetcher<any[]>(
      `/orgUserMapping/allOrganizationMappingsByUserId?userId=${user?.uid}`,
      {
        method: 'GET'
      }
    )
    // console.log('mappingData', mappingData)

    const activeMapping = mappingData.find(
      (org: any) => org.organizationUserMapping.status === 'ACTIVE'
    )

    if (!activeMapping?.organization?.id) {
      return null
    }
    // console.log('activeMapping', activeMapping)
    // Now use the GET organization API to check if organization exists
    // console.log('activeMapping.organization.id', activeMapping.organization.id)
    const organization = await fetcher<any>(
      `/organization/id?id=${activeMapping.organization.id}`,
      {
        method: 'GET'
      }
    )
    // console.log('checkUserOrganization', organization)
    return organization
  } catch (error) {
    console.log('Error checking user organization:', error)
    return null
  }
}

// Update onboarding step completion
export async function updateOnboardingStep(stepNumber: number) {
  const { user } = await getServerUser()

  if (!user?.uid) {
    throw new Error('User not authenticated')
  }

  try {
    // Helper function to convert step number to word
    const getStepWord = (num: number): string => {
      const stepWords = [
        '',
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven'
      ]
      return stepWords[num] || 'unknown'
    }

    // Build payload with all completed steps up to current step
    // Include user_id as required by the API
    const payload: any = {
      user_id: user.uid
    }

    // Mark all steps up to and including the current step as completed
    for (let i = 1; i <= stepNumber; i++) {
      const stepField = `step_${getStepWord(i)}_completed`
      payload[stepField] = true
    }

    console.log('Updating onboarding steps:', payload)

    // IMPORTANT: Must use /api/onboarding/steps (with /api prefix) to match backend route
    // Otherwise backend returns "No static resource onboarding/steps"
    const response = await fetcher<any>('/api/onboarding/steps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: payload
    })

    return response
  } catch (error: any) {
    console.error('Error updating onboarding step:', error)
    // Re-throw with the actual error message
    throw new Error(error.message || 'Failed to update step completion')
  }
}

// Generic function to update organization field
async function updateOrganizationField(path: string, value: any) {
  try {
    const org = await getCurrentOrganization()

    if (!org?.id) {
      throw new Error('No active organization found')
    }

    const patchBody = [
      {
        op: 'replace',
        path: `/${path}`,
        value: value
      }
    ]

    console.log(`Updating ${path}:`, JSON.stringify(patchBody, null, 2))

    const data = await fetcher<any>(`/organization?id=${org.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data: patchBody
    })
    return { success: true, data }
  } catch (error: any) {
    console.error(`Error updating organization ${path}:`, error)
    throw new Error(error.message || 'Something went wrong, please try again.')
  }
}

// Generic function to update user field
async function updateUserField(path: string, value: any) {
  const { user } = await getServerUser()

  try {
    const patchBody = [
      {
        op: 'replace',
        path: `/${path}`,
        value: value
      }
    ]

    const data = await fetcher<any>(`/user?userId=${user.uid}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json-patch+json'
      },
      data: patchBody
    })
    return { success: true, data }
  } catch (error: any) {
    console.error(`Error updating user ${path}:`, error)
    throw new Error(error.message || 'Something went wrong, please try again.')
  }
}

// Step 3: Update user type
export async function updateUserType(userType: string) {
  return updateUserField('userType', userType)
}

// Step 4: Update company type
export async function updateCompanyType(companyType: string) {
  return updateOrganizationField('companyType', companyType)
}

// Step 5: Update inhouse partnership
export async function updateInhousePartnership(inhousePartnership: boolean) {
  return updateOrganizationField('isInHousePartnership', inhousePartnership)
}

// Step 6: Update team size
export async function updateTeamSize(teamSize: string) {
  return updateOrganizationField('partnershipTeamSize', teamSize)
}

// Step 7: Update onboarded partners
export async function updateOnboardedPartners(onboardedPartners: string) {
  return updateOrganizationField('onboardedPartners', onboardedPartners)
}

// Step 8: Update goals to use sharkdom
export async function updateGoalsToUseSharkdom(goals: string[]) {
  return updateOrganizationField('goalsToUseSharkdom', goals)
}

// Step 9: Update region to partner with
export async function updateRegionToPartnerWith(region: string[]) {
  return updateOrganizationField('regionToPartnerWith', region)
}

// Step 10: Update ignore fundraising
export async function updateIgnoreFundraising(ignoreFundraising: boolean) {
  return updateOrganizationField('ignoreFundRaising', ignoreFundraising)
}

// Step 11: Update preferred partnership types
export async function updatePreferredPartnershipTypes(
  partnershipTypes: Array<{ area: string }>
) {
  return updateOrganizationField('preferredPartnershipTypes', partnershipTypes)
}

// Step 12: Update user subtype
export async function updateUserSubtype(userSubtype: string) {
  return updateUserField('userSubtype', userSubtype)
}

// Step 13: Update served customers
export async function updateServedCustomers(servedCustomers: string[]) {
  return updateOrganizationField('servedCustomers', servedCustomers)
}

// Step 14: Update ranged values
export async function updateRangedValues(rangedValues: string) {
  return updateOrganizationField('customerBase', rangedValues)
}

// Function to get user onboarding data and determine current step
export async function getUserOnboardingData() {
  try {
    const { user } = await getServerUser()

    // Get user data
    const userData = await fetcher<any>(
      `/orgUserMapping/allOrganizationMappingsByUserId?userId=+${user?.uid}`,
      {
        method: 'GET'
      }
    )
    // console.log('userData', userData)

    // Get organization data
    const org = await checkUserOrganization()

    if (!org) {
      return { userData, organizationData: null, currentStep: 1 }
    }

    // Determine current step based on completed fields
    let currentStep = 1

    // Step 1: Name (user.name)
    if (userData.name) {
      currentStep = 2
    }

    // Step 2: Website (organization.website)
    if (org.website) {
      currentStep = 3
    }

    // Step 3: User type (user.userType)
    if (userData.userType) {
      currentStep = 4
    }

    // Step 4: Company type (organization.companyType)
    if (org.companyType && org.companyType !== 'N/A') {
      currentStep = 5
    }

    // Step 5: Inhouse partnership (organization.isInHousePartnership)
    if (org.isInHousePartnership !== null) {
      currentStep = 6
    }

    // Step 6: Team size (organization.partnershipTeamSize)
    if (org.partnershipTeamSize) {
      currentStep = 7
    }

    // Step 7: Onboarded partners (organization.onboardedPartners)
    if (org.onboardedPartners) {
      currentStep = 8
    }

    // Step 8: Goals (organization.goalsToUseSharkdom)
    if (org.goalsToUseSharkdom && org.goalsToUseSharkdom.length > 0) {
      currentStep = 9
    }

    // Step 9: Region (organization.regionToPartnerWith)
    if (org.regionToPartnerWith) {
      currentStep = 10
    }

    // Step 10: Ignore fundraising (organization.ignoreFundRaising)
    if (org.ignoreFundRaising !== null) {
      currentStep = 11
    }

    // Step 11: Partnership types (organization.preferredPartnershipTypes)
    if (
      org.preferredPartnershipTypes &&
      org.preferredPartnershipTypes.length > 0
    ) {
      currentStep = 12
    }

    // Step 12: User subtype (user.userSubtype)
    if (userData.userSubtype) {
      currentStep = 13
    }

    // Step 13: Served customers (organization.servedCustomers)
    if (org.servedCustomers) {
      currentStep = 14
    }

    // Step 14: Customer strength (organization.rangedValues)
    if (org.rangedValues) {
      currentStep = 15 // All steps completed
    }

    return { userData, organizationData: org, currentStep }
  } catch (error: any) {
    console.error('Error fetching user onboarding data:', error)
    throw new Error(error.message || 'Failed to fetch user data')
  }
}
