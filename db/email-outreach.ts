import { fetcher } from '@/lib/server'

/**
 * Check if the organization has claimed their mailbox
 */
export const checkMailboxClaim = async (): Promise<{
  is_claimed: boolean
}> => {
  try {
    const data = await fetcher<{ is_claimed: boolean }>(
      '/api/email/outreach/mailbox/claim/check',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    return data
  } catch (error) {
    console.error('Error in checkMailboxClaim:', error)
    throw error
  }
}

/**
 * Claim the organization's mailbox
 */
export const claimMailbox = async (): Promise<{
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  organizationId: number
  claimed: boolean
}> => {
  try {
    const data = await fetcher<{
      id: number
      creationTimestamp: string
      lastUpdatedTimestamp: string
      organizationId: number
      claimed: boolean
    }>('/api/email/outreach/mailbox/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: {}
    })
    return data
  } catch (error) {
    console.error('Error in claimMailbox:', error)
    throw error
  }
}

/**
 * Utility function to fetch mailbox claim status
 * Returns the claim status and any error that occurred
 */
export const fetchMailboxClaimStatus = async (): Promise<{
  isClaimed: boolean
  error?: string
}> => {
  try {
    const data = await checkMailboxClaim()
    return {
      isClaimed: data.is_claimed,
      error: undefined
    }
  } catch (error) {
    console.error('Error fetching mailbox claim status:', error)
    return {
      isClaimed: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export interface EmailEventSummary {
  orgId: number
  totalEmails: number
  opened: number
  delivered: number
  bounced: number
  dropped: number
  complained: number
  unsubscribed: number
  accepted: number
  clicked: number
  engagementRate: number
  openRate: number
  clickRate: number
}

/**
 * Fetch email event summary for a collaboration
 */
export const getEmailEventSummary = async (
  collaborationId: number
): Promise<EmailEventSummary> => {
  try {
    const data = await fetcher<EmailEventSummary>(
      '/api/email/outreach/message/event/summary',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: [collaborationId]
      }
    )
    // console.log("email event summary: ", data)
    return data
  } catch (error) {
    console.error('Error in getEmailEventSummary:', error)
    throw error
  }
}
