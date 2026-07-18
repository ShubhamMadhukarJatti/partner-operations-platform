'use server'

import { fetcher } from '@/lib/server'

export const getNotificationData = async (
  organizationId: string,

  page: number = 0,
  size: number = 40,
  forMobile: boolean = false,
  forWeb: boolean = true
): Promise<any> => {
  const url = `/notification/organizationId?organizationId=${organizationId}&forMobile=${forMobile}&forWeb=${forWeb}&page=${page}&size=${size}`

  const data: any = await fetcher<any>(url, {
    method: 'GET'
  })

  return data.content
}
