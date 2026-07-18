'use client'

import {
  fetchTrelloCards,
  fetchTrelloLists,
  type TrelloCard,
  type TrelloList
} from '@/services/trello'
import { useQuery } from '@tanstack/react-query'

export type { TrelloCard }

export interface UseTrelloListsOptions {
  enabled?: boolean
  isDummy?: boolean
}

/**
 * Reusable React Query hook to fetch Trello lists for a given board.
 * Supports dummy/demo mode fallback list data.
 */
export function useTrelloLists(
  boardId: string | null | undefined,
  options?: UseTrelloListsOptions
) {
  const enabled = options?.enabled ?? true
  const isDummy = options?.isDummy ?? false

  return useQuery<TrelloList[]>({
    queryKey: ['trello-lists', boardId, isDummy],
    queryFn: async () => {
      if (!boardId) return []

      if (isDummy) {
        // Return static mock lists for the dummy/demo flow
        return [
          {
            id: 'list-todo',
            name: 'To Do',
            closed: false,
            idBoard: boardId,
            pos: 16384
          },
          {
            id: 'list-in-progress',
            name: 'In Progress',
            closed: false,
            idBoard: boardId,
            pos: 32768
          },
          {
            id: 'list-done',
            name: 'Done',
            closed: false,
            idBoard: boardId,
            pos: 49152
          }
        ]
      }

      const res = await fetchTrelloLists(boardId)
      if (!res.success) {
        throw new Error(res.message || 'Failed to fetch Trello lists')
      }
      return res.data
    },
    enabled: enabled && !!boardId,
    retry: false,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    refetchOnWindowFocus: false
  })
}

/**
 * Get static mock cards mapped to our dummy/demo board lists.
 */
export function getMockTrelloCards(listId: string): TrelloCard[] {
  if (listId === 'list-todo') {
    return [
      {
        id: 'card-1',
        name: 'Review contract terms',
        desc: 'Legal review of partnership agreement terms',
        closed: false,
        idList: listId,
        idBoard: 'board-1',
        pos: 16384
      },
      {
        id: 'card-2',
        name: 'Set up joint marketing campaign',
        desc: 'Plan and execute co-branded marketing initiatives',
        closed: false,
        idList: listId,
        idBoard: 'board-1',
        pos: 32768
      }
    ]
  }
  if (listId === 'list-in-progress') {
    return [
      {
        id: 'card-3',
        name: 'Follow up on partnership proposal',
        desc: 'Send email to discuss next steps and contract terms',
        closed: false,
        idList: listId,
        idBoard: 'board-1',
        pos: 16384
      },
      {
        id: 'card-4',
        name: 'Prepare integration documentation',
        desc: 'Create API documentation for seamless integration',
        closed: false,
        idList: listId,
        idBoard: 'board-1',
        pos: 32768
      }
    ]
  }
  if (listId === 'list-done') {
    return [
      {
        id: 'card-5',
        name: 'Schedule technical demo call',
        desc: 'Arrange technical demonstration of our platform',
        closed: false,
        idList: listId,
        idBoard: 'board-1',
        pos: 16384
      },
      {
        id: 'card-6',
        name: 'Conduct market analysis',
        desc: 'Analyze market positioning and competitive landscape',
        closed: false,
        idList: listId,
        idBoard: 'board-1',
        pos: 32768
      }
    ]
  }
  return []
}

export interface UseTrelloCardsOptions {
  enabled?: boolean
  isDummy?: boolean
}

/**
 * Builds the query options object for a Trello list's cards.
 * Facilitates usage with react-query's useQueries hook for parallel calls.
 */
export function getTrelloCardsQueryOptions(
  listId: string | null | undefined,
  options?: UseTrelloCardsOptions
) {
  const enabled = options?.enabled ?? true
  const isDummy = options?.isDummy ?? false

  return {
    queryKey: ['trello-cards', listId, isDummy],
    queryFn: async () => {
      if (!listId) return []

      if (isDummy) {
        return getMockTrelloCards(listId)
      }

      const res = await fetchTrelloCards(listId)
      if (!res.success) {
        throw new Error(res.message || 'Failed to fetch Trello cards')
      }
      return res.data
    },
    enabled: enabled && !!listId,
    retry: false,
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    refetchOnWindowFocus: false
  }
}

/**
 * Reusable React Query hook to fetch Trello cards for a given list.
 */
export function useTrelloCards(
  listId: string | null | undefined,
  options?: UseTrelloCardsOptions
) {
  return useQuery<TrelloCard[]>(getTrelloCardsQueryOptions(listId, options))
}
