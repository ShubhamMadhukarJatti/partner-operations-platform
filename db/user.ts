'use server'

import { UserType } from '@/types'

import { fetcher, getServerUser } from '@/lib/server'

export const getCurrentUser = async (): Promise<UserType> => {
  const { user } = await getServerUser()
  const userData = await fetcher<UserType>(`/user/userId?userId=${user?.uid}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  return userData
}
