import {
  getDweepChat,
  getDweepQueries,
  PromptInterface,
  ProposalPayload,
  sendPrompts,
  sendProposals
} from '@/services/dweep-ai'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { parseMdx } from '@/lib/parsedMdx'
import { showCustomToast } from '@/components/custom-toast'

export const useGetDweepChats = () => {
  const query = useQuery({
    queryKey: ['dweep'],
    queryFn: async () => {
      const rawMessages = await getDweepQueries()

      console.log({ rawMessages })

      const parsedMessages = await Promise.all(
        // @ts-ignore
        (rawMessages ?? [])?.map(async (msg: any) => {
          if (msg.bot) {
            try {
              const mdxParsed = await parseMdx(msg.message)
              return { ...msg, parsedText: mdxParsed }
            } catch (err) {
              console.error('MDX parse failed:', err)
              return { ...msg, parsedText: null, error: true }
            }
          }
          return msg
        })
      )

      return parsedMessages
    },
    enabled: true
  })

  return query
}

export const useGetDweepChat = (chatId: number) => {
  const query = useQuery({
    queryKey: ['dweep-message', chatId],
    queryFn: async () => {
      const rawMessages = await getDweepChat(chatId)

      const parsedMessages = await Promise.all(
        //@ts-ignore
        rawMessages?.map(async (msg: any) => {
          if (msg.bot) {
            const mdxParsed = await parseMdx(msg.message)
            return { ...msg, parsedText: mdxParsed }
          }
          return msg
        })
      )

      return parsedMessages
    },
    enabled: !!chatId
  })
}

export const useSendPrompts = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: PromptInterface) => {
      return await sendPrompts(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dweep'] })
    },
    onError: (error) => {}
  })
}

export const useSendProposals = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProposalPayload) => {
      return await sendProposals(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [''] })
      showCustomToast(
        'Sending',
        'Sending proposal, please wait...',
        'info',
        5000
      )
    },
    onError: (error) => {}
  })
}
