import { fetcher, getServerUser } from '@/lib/server'

type CheckResponseType = {
  user_id: string
  is_continue_free_deal: boolean
  is_continue_free_partner_mapping: boolean
}

/**
 * Check if user can continue with Deal Pipeline (server-side only)
 * @returns Object with canContinue boolean and optional error message
 */
export async function checkDealPipelineStatus(): Promise<{
  canContinue: boolean
  error?: string
}> {
  try {
    const userData = await getServerUser()

    if (!userData?.user?.uid) {
      return { canContinue: false, error: 'User ID is missing' }
    }

    if (!userData?.token) {
      return { canContinue: false, error: 'Authentication required' }
    }

    const url = `/user/check/continue/free/deal/${userData.user.uid}`

    // Pass headers explicitly to avoid redundant getServerUser() call in fetcher
    const response = (await fetcher(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`
      }
    })) as CheckResponseType

    if (!response) {
      console.error(
        'No response from server while fetching deal pipeline status'
      )
      return { canContinue: false, error: 'Failed to fetch status' }
    }

    return { canContinue: response.is_continue_free_deal }
  } catch (error: any) {
    console.error('Error checking deal pipeline placeholder status:', error)
    return {
      canContinue: false,
      error: error?.message || 'Failed to check deal pipeline status'
    }
  }
}

/**
 * Check if user can continue with Partner Mapping (server-side only)
 * @returns Object with canContinue boolean and optional error message
 */
export async function checkPartnerMappingStatus(): Promise<{
  canContinue: boolean
  error?: string
}> {
  try {
    const userData = await getServerUser()

    if (!userData?.user?.uid) {
      return { canContinue: false, error: 'User ID is missing' }
    }

    if (!userData?.token) {
      return { canContinue: false, error: 'Authentication required' }
    }

    const url = `/user/check/continue/free/pm/${userData.user.uid}`

    // Pass headers explicitly to avoid redundant getServerUser() call in fetcher
    const response = (await fetcher(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userData.token}`
      }
    })) as CheckResponseType

    if (!response) {
      console.error(
        'No response from server while fetching partner mapping status'
      )
      return { canContinue: false, error: 'Failed to fetch status' }
    }

    return { canContinue: response.is_continue_free_partner_mapping }
  } catch (error: any) {
    console.error('Error checking partner mapping placeholder status:', error)
    return {
      canContinue: false,
      error: error?.message || 'Failed to check partner mapping status'
    }
  }
}
