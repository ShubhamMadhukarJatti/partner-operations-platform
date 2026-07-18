'use server'

import { getServerUser } from '../server'

export const getSlackToken = async () => {
  try {
    let { user, token } = await getServerUser()

    let res = await fetch(
      `${process.env.SHARKDOM_API_URL}/user/slack/token?userId=${user?.uid}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      console.log(await res.json(), ``)
      throw new Error('Failed to get slack token')
    }

    return res.json()
  } catch (error) {
    console.error('Error fetching slack token :', error)
    throw error
  }
}

export const saveSlackChannel = async ({
  channelId
}: {
  channelId: string
}) => {
  try {
    let { user, token } = await getServerUser()

    let res = await fetch(
      `${process.env.SHARKDOM_API_URL}/user/slack/channel?userId=${user?.uid}&channelId=${channelId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )

    if (!res.ok) {
      console.log(await res.json(), `helloo`)
      throw new Error('Failed to save slack channel')
    }

    return res.json()
  } catch (error) {
    console.error('Error saving slack channel :', error)
    throw error
  }
}
