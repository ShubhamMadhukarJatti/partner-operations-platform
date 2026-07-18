'use server'

import { EmailStatisticsPaginatedResponse } from '@/types'

import { fetcher } from '@/lib/server'

export type EmailStatsEventType = 'Open' | 'Click' | 'Bounce'
export type EmailStatsEnv = 'DEV' | 'PROD'

export type EmailStatsArgs = {
  eventType: EmailStatsEventType
  env: EmailStatsEnv
  templateCode: string

  sentAt: string
  page: number
  size: number
}

export const getEmailStatistics = async (
  { eventType, env, templateCode, sentAt, page, size }: EmailStatsArgs,
  _token?: string
): Promise<EmailStatisticsPaginatedResponse> => {
  const queryParams = new URLSearchParams({
    eventType,
    env,
    templateCode,
    sentAt: sentAt.toString(),
    page: page.toString(),
    size: size.toString()
  })

  try {
    const data = await fetcher<EmailStatisticsPaginatedResponse>(
      `/email/statistics?${queryParams}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    )
    return data
  } catch (error) {
    console.error('Error fetching email statistics:', error)
    throw error
  }
}

export const getEmailCampaigns = async (page: number) => {
  try {
    const data = await fetcher<any>(
      `/email/campaign/statistics?page=${page}&size=10`,
      {
        method: 'GET'
      }
    )

    return data
  } catch (error) {
    console.error('Error fetching email statistics:', error)
    throw error
  }
}
