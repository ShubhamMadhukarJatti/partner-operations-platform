import { fetcher } from '@/lib/server'
import { ChannelKeys } from '@/app/(app)/(dashboard-pages)/partner-space/[id]/_components/SpaceSidebar'

export interface createSpacePayload {
  spaceName: string
  partnerJoined: number[]
  spaceType: 'B2B' | 'D2C' | 'OTHER'
  creatorOrgId: number
}

export interface UpdateChatMessagesBody {
  chatRoomId: number
  query: string
  flag: 'SENDER' | 'RECEIVER'
  senderId: number
  receiverId: number
  linkerId: string
  linkerType: string
}

export const createSpace = async (payload: createSpacePayload) => {
  const response = await fetcher(`/organizationCollaboration/partner-space`, {
    method: 'POST',
    data: payload
  })

  if (!response) {
    throw new Error('Failed to create space')
  }

  console.log(response)

  return response
}

export const fetchMessage = async (
  chatRoomId: number,
  channel: ChannelKeys | null
) => {
  const response = await fetcher(
    `/organizationCollaboration/messages/${chatRoomId}?size=40${channel ? `&channel=${channel}` : ''}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const fetchSpace = async (orgId: number) => {
  const response = await fetcher(
    `/organizationCollaboration/partner-space/organization`,
    {
      method: 'GET'
    }
  )

  return response
}
export const getBenefit = async (
  linkerId: string | null,
  type: string | null
) => {
  if (!(linkerId && type)) return
  const response = await fetcher(
    `/organizationCollaboration/benefits?benefitId=${linkerId}&linkerType=${type}`,
    {
      method: 'GET'
    }
  )

  return response
}

export const createMessage = async (chatsPayload: UpdateChatMessagesBody) => {
  if (!chatsPayload) return
  const response = await fetcher('/organizationCollaboration/messages', {
    method: 'POST',
    data: chatsPayload
  })

  if (!response) throw new Error('Failed to send message')
  return response
}
