'use server'

import moment from 'moment'

import { fetcher } from '@/lib/server'

export const getDemoData = async (
  { date, date2 }: any,
  _token?: any
): Promise<any> => {
  const from = moment(date).format('YYYY-MM-DD')
  const to = moment(date2).format('YYYY-MM-DD')
  const data = await fetcher<any>(`/demo-book/data?from=${from}&to=${to}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  return data
}
