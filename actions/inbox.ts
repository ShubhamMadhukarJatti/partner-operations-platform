'use server'

import { fetcher, getServerUser } from '@/lib/server'

type UpdateChatMessagesBody = {
  chatRoomId: number
  query: string
  flag: 'SENDER' | 'RECEIVER'
  senderId: number
  receiverId: number
  linkerId: string
  linkerType: string
}
export const updateChatMessages = async (body: UpdateChatMessagesBody) => {
  try {
    await getServerUser()
    const response = await fetcher<any>('/organizationCollaboration/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      data: body
    })
    console.log(JSON.stringify(body))
    return response
  } catch (error) {
    console.error('There was an error!', error)
  }
}
