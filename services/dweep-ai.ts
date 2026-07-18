import { fetcher } from '@/lib/server'

export type PromptInterface = {
  query: string
  promptId: number
}

export type ProposalPayload = {
  query: ''
  promptId: number
  orgIdList: number[]
}

export const getDweepQueries = async () => {
  const response = await fetcher('/chatbot/sharkq-query', {
    method: 'GET'
  })

  return response
}

export const getDweepChat = async (chatId: number) => {
  const response = await fetcher(`/chatbot/sharkq-query/id?id=${chatId}`, {
    method: 'GET'
  })

  return response
}

export const sendPrompts = async (payload: PromptInterface) => {
  const response = await fetcher('/chatbot/sharkq-query', {
    method: 'POST',
    data: payload
  })

  return response
}

export const sendProposals = async (payload: ProposalPayload) => {
  const response = await fetcher('/dweep/sendProposal', {
    method: 'POST',
    data: payload
  })

  return response
}
