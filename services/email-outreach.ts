interface EmailMessage {
  id: number
  creationTimestamp: string
  lastUpdatedTimestamp: string
  from: string
  to: string
  subject: string
  body: string
  message_id: string
  org_id: number
  partner_org_id: number
  thread_id: string | null
  is_external_partner: boolean
  external_partner_code: string | null
  sender_org_email: string | null
}

export const fetchSentEmails = async (): Promise<EmailMessage[]> => {
  try {
    const response = await fetch('/api/email/outreach/message/sends', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Ensure cookies are sent with the request
    })

    console.log('response', response)
    if (!response.ok) {
      console.log('response', response)
      throw new Error(`Failed to fetch sent emails: ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching sent emails:', error)
    throw error
  }
}

export const fetchReceivedEmails = async (): Promise<EmailMessage[]> => {
  try {
    const response = await fetch('/api/email/outreach/message/receives', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Ensure cookies are sent with the request
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch received emails: ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching received emails:', error)
    throw error
  }
}

export const fetchDraftEmails = async (): Promise<EmailMessage[]> => {
  try {
    const response = await fetch('/api/email/outreach/message/drafts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' // Ensure cookies are sent with the request
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch draft emails: ${response.statusText}`)
    }

    const data = await response.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching draft emails:', error)
    throw error
  }
}

export type { EmailMessage }
