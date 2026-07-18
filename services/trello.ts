'use server'

import { fetcher } from '@/lib/server'

export interface TrelloList {
  id: string
  name: string
  closed: boolean
  idBoard: string
  pos: number
}

export interface TrelloListsResponse {
  success: boolean
  message: string
  data: TrelloList[]
}

/**
 * Fetch lists for a specific Trello board.
 * Endpoint: GET /api/gtm/trello/boards/{boardId}/list
 */
export const fetchTrelloLists = async (
  boardId: string
): Promise<TrelloListsResponse> => {
  if (!boardId) {
    throw new Error('Board ID is required to fetch Trello lists')
  }

  return fetcher<TrelloListsResponse>(
    `/api/gtm/trello/boards/${boardId}/lists`,
    {
      method: 'GET'
    }
  )
}

export interface TrelloLabel {
  id: string
  idBoard: string
  name: string
  color: string
}

export interface TrelloCard {
  id: string
  name: string
  desc: string
  closed: boolean
  idList: string
  idBoard: string
  pos: number
  due?: string
  dateLastActivity?: string
  labels?: TrelloLabel[]
}

export interface TrelloCardsResponse {
  success: boolean
  message: string
  data: TrelloCard[]
}

/**
 * Fetch cards for a specific Trello list.
 * Endpoint: GET /api/gtm/trello/list/{listId}/cards
 */
export const fetchTrelloCards = async (
  listId: string
): Promise<TrelloCardsResponse> => {
  if (!listId) {
    throw new Error('List ID is required to fetch Trello cards')
  }

  return fetcher<TrelloCardsResponse>(`/api/gtm/trello/list/${listId}/cards`, {
    method: 'GET'
  })
}
