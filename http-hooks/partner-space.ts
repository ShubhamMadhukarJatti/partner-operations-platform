import { RootState } from '@/redux/store'
import {
  createMessage,
  createSpace,
  createSpacePayload,
  fetchMessage,
  fetchSpace,
  getBenefit,
  UpdateChatMessagesBody
} from '@/services/partner-space'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

import { showCustomToast } from '@/components/custom-toast'
import { ChannelKeys } from '@/app/(app)/(dashboard-pages)/partner-space/[id]/_components/SpaceSidebar'

export const useCreateSpace = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: createSpacePayload) => {
      return await createSpace(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-space'] })

      showCustomToast('Success', 'Space created', 'success', 5000)
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to create space',
        'error',
        5000
      )
    }
  })
}

export const useGetMessage = (
  chatRoomId: number,
  channel: ChannelKeys | null
) => {
  const query = useQuery({
    queryKey: ['messages', chatRoomId, channel],
    queryFn: async () => await fetchMessage(chatRoomId, channel),
    enabled: !!chatRoomId
  })

  return query
}

export const useGetSpace = () => {
  const saved = useSelector((state: RootState) => state.currentOrg)

  const { loading: orgLoading, organization } = saved

  console.log(organization)

  const query = useQuery({
    queryKey: ['partner-space', organization.id],
    queryFn: async () => await fetchSpace(organization.id),
    enabled: !!organization.id
  })
  console.log(query)

  return query
}

export const useGetBenefits = (
  linkerId: string | null,
  type: string | null
) => {
  console.log({ linkerId, type })

  const query = useQuery({
    queryKey: ['benefit', linkerId],
    queryFn: async () => await getBenefit(linkerId, type),
    enabled: !!linkerId
  })
  console.log(query)

  return query
}

export const useUpdateMessages = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (chatsPayload: UpdateChatMessagesBody) => {
      return await createMessage(chatsPayload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages'] })
      // toast.success("message sent")

      // toast.success('Space created')
    },
    onError: (error) => {
      showCustomToast(
        'Error',
        error.message ?? 'failed to send message',
        'error',
        5000
      )
    }
  })
}
