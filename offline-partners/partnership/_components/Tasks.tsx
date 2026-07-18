'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIntegrationApps } from '@/http-hooks/app-integration'
import { useOfflinePartnerDetailsByCode } from '@/http-hooks/offline-partners'
import {
  getTrelloCardsQueryOptions,
  useTrelloLists,
  type TrelloCard
} from '@/http-hooks/use-trello'
import { useQueries, useQuery } from '@tanstack/react-query'

import { INTEGRATION_STATUS, INTEGRATIONS } from '@/lib/constants/integrations'
import { isDummyFlow } from '@/lib/dummy-flow'
import { showCustomToast } from '@/components/custom-toast'

import AppConnectionBanner from './AppConnectionBanner'
import ConnectAppsBanner from './ConnectAppsBanner'
import CreateTaskModal from './CreateTaskModal'
import CreateTaskSection from './CreateTaskSection'
import { TaskGroups } from './kanban'
import type { Task, TaskColumn } from './kanban/types'
import type { AppType, ViewMode } from './types'

interface TasksProps {
  partnerId?: string // This is now the external partner code from the URL
}

interface ApiTask {
  id: number
  task_title: string
  status: string
  stage: string
  target_type: string
  start_date: string
  end_date: string
  owner_id: string | number
  note: string
  organization_id: number
  external_partner_id?: number
  created_at: string
  updated_at: string
  username?: string
}

interface TasksApiResponse {
  status: string
  message: string
  data: {
    content: ApiTask[]
    pageable: any
    last: boolean
    totalElements: number
    totalPages: number
    first: boolean
    size: number
    number: number
    sort: any
    numberOfElements: number
    empty: boolean
  }
}

// Map API status to TaskStatus
const mapStatusToTaskStatus = (status: string): Task['status'] => {
  const statusMap: Record<string, Task['status']> = {
    'Not Started': 'todo',
    'In Progress': 'in_progress',
    'On Track': 'in_progress',
    'At Risk': 'in_progress',
    Delayed: 'in_progress',
    Paused: 'in_progress',
    Blocked: 'in_progress',
    Completed: 'completed',
    Cancelled: 'cancelled'
  }
  return statusMap[status] || 'todo'
}

// Map TaskStatus back to API status
const mapTaskStatusToApiStatus = (taskStatus: Task['status']): string => {
  const statusMap: Record<Task['status'], string> = {
    todo: 'Not Started',
    in_progress: 'In Progress', // Default to 'In Progress' for in_progress status
    completed: 'Completed',
    cancelled: 'Cancelled'
  }
  return statusMap[taskStatus] || 'Not Started'
}

// Map API task to Task type
const mapApiTaskToTask = (apiTask: any): Task => {
  return {
    id: String(apiTask.id),
    title: apiTask.task_title || apiTask.title || 'Untitled Task',
    description: apiTask.note || apiTask.description || '',
    status: mapStatusToTaskStatus(apiTask.status),
    assignedTo: {
      id: String(apiTask.owner_id || apiTask.ownerId),
      name: apiTask.username || `User ${apiTask.owner_id || apiTask.ownerId}`
    },
    dueDate:
      apiTask.end_date ||
      apiTask.endDate ||
      apiTask.start_date ||
      apiTask.startDate ||
      new Date().toISOString(),
    createdAt:
      apiTask.created_at || apiTask.createdAt || new Date().toISOString(),
    updatedAt:
      apiTask.updated_at || apiTask.updatedAt || new Date().toISOString(),
    priority: 'medium',
    tags: [apiTask.stage, apiTask.target_type || apiTask.targetType].filter(
      Boolean
    )
  }
}

// Map Trello card to canonical Task model.
// Note: Task.status is populated with a placeholder value because Trello card
// column placement is determined by the surrounding TaskColumn/SortableContext,
// not by the Task.status field itself for Trello boards.
const mapTrelloCardToTask = (card: TrelloCard): Task => {
  return {
    id: card.id,
    title: card.name || 'Untitled Card',
    description: card.desc || '',
    status: 'todo', // Placeholder status
    assignedTo: {
      id: '',
      name: ''
    },
    dueDate: card.due || '',
    createdAt: card.dateLastActivity || '',
    updatedAt: card.dateLastActivity || '',
    priority: 'medium',
    tags: card.labels?.map((label) => label.name).filter(Boolean) || []
  }
}

// Map Trello lists and grouped cards to TaskColumn[]
const mapTrelloListsToColumns = (
  trelloLists: any[],
  groupedTrelloCards: Record<string, TrelloCard[]>
): TaskColumn[] => {
  const colors = [
    '#94A3B8', // Slate
    '#3B82F6', // Blue
    '#10B981', // Emerald
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#8B5CF6', // Violet
    '#14B8A6' // Teal
  ]

  return trelloLists.map((list, index) => ({
    id: list.id,
    title: list.name,
    color: colors[index % colors.length],
    tasks: (groupedTrelloCards[list.id] || []).map(mapTrelloCardToTask)
  }))
}

const Tasks: React.FC<TasksProps> = ({ partnerId }) => {
  const [viewMode] = useState<ViewMode>('grid')
  const [selectedApp, setSelectedApp] = useState<AppType | null>(null)
  const [selectedBoard, setSelectedBoard] = useState<string>('')
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false)
  const [groupedTrelloCards, setGroupedTrelloCards] = useState<
    Record<string, TrelloCard[]>
  >({})

  // Check if we're in dummy flow
  const inDummyFlow = useMemo(() => isDummyFlow(partnerId), [partnerId])

  // Fetch integration apps to check Trello connection status (only in real flow)
  const { integrations } = useIntegrationApps()

  // Check if Trello is actually connected via OAuth
  const isTrelloConnected = useMemo(() => {
    // In dummy flow, simulate Trello as connected
    if (inDummyFlow) return true

    const trelloIntegration = integrations?.find(
      (integration: any) => integration.id === INTEGRATIONS.TRELLO
    )
    return trelloIntegration?.status === INTEGRATION_STATUS.CONNECTED
  }, [integrations, inDummyFlow])

  // Automatically select Trello when it becomes connected
  useEffect(() => {
    if (isTrelloConnected && !selectedApp) {
      setSelectedApp('trello')
      setSelectedBoard('')
    }
  }, [isTrelloConnected, selectedApp])

  // Mock partner ID for dummy flow (fixed number for demo data)
  const mockPartnerId = 1001

  // Mock tasks data for dummy flow (no API calls)
  const mockTasksData: TasksApiResponse = {
    status: 'success',
    message: 'Mock tasks data for demo',
    data: {
      content: [
        {
          id: 1,
          task_title: 'Follow up on partnership proposal',
          status: 'IN_PROGRESS',
          stage: 'FOLLOW_UP',
          target_type: 'PARTNER',
          start_date: '2024-01-15T10:00:00Z',
          end_date: '2024-01-20T10:00:00Z',
          owner_id: 'user_1',
          note: 'Send email to discuss next steps and contract terms',
          organization_id: 1,
          external_partner_id: mockPartnerId,
          created_at: '2024-01-10T09:00:00Z',
          updated_at: '2024-01-15T14:30:00Z',
          username: 'John Doe'
        },
        {
          id: 2,
          task_title: 'Schedule technical demo call',
          status: 'COMPLETED',
          stage: 'DEMO',
          target_type: 'PARTNER',
          start_date: '2024-01-12T14:00:00Z',
          end_date: '2024-01-12T15:00:00Z',
          owner_id: 'user_1',
          note: 'Arrange technical demonstration of our platform',
          organization_id: 1,
          external_partner_id: mockPartnerId,
          created_at: '2024-01-08T11:00:00Z',
          updated_at: '2024-01-12T15:30:00Z',
          username: 'Jane Smith'
        },
        {
          id: 3,
          task_title: 'Review contract terms',
          status: 'PENDING',
          stage: 'CONTRACT_REVIEW',
          target_type: 'PARTNER',
          start_date: '2024-01-22T09:00:00Z',
          end_date: '2024-01-25T17:00:00Z',
          owner_id: 'user_2',
          note: 'Legal review of partnership agreement terms',
          organization_id: 1,
          external_partner_id: mockPartnerId,
          created_at: '2024-01-15T16:00:00Z',
          updated_at: '2024-01-15T16:00:00Z',
          username: 'Mike Johnson'
        },
        {
          id: 4,
          task_title: 'Prepare integration documentation',
          status: 'IN_PROGRESS',
          stage: 'INTEGRATION',
          target_type: 'PARTNER',
          start_date: '2024-01-18T09:00:00Z',
          end_date: '2024-01-22T17:00:00Z',
          owner_id: 'user_3',
          note: 'Create API documentation for seamless integration',
          organization_id: 1,
          external_partner_id: mockPartnerId,
          created_at: '2024-01-16T10:00:00Z',
          updated_at: '2024-01-18T11:00:00Z',
          username: 'Sarah Wilson'
        },
        {
          id: 5,
          task_title: 'Conduct market analysis',
          status: 'COMPLETED',
          stage: 'ANALYSIS',
          target_type: 'PARTNER',
          start_date: '2024-01-10T13:00:00Z',
          end_date: '2024-01-14T15:00:00Z',
          owner_id: 'user_1',
          note: 'Analyze market positioning and competitive landscape',
          organization_id: 1,
          external_partner_id: mockPartnerId,
          created_at: '2024-01-09T14:00:00Z',
          updated_at: '2024-01-14T16:00:00Z',
          username: 'John Doe'
        },
        {
          id: 6,
          task_title: 'Set up joint marketing campaign',
          status: 'PENDING',
          stage: 'MARKETING',
          target_type: 'PARTNER',
          start_date: '2024-01-25T10:00:00Z',
          end_date: '2024-02-05T17:00:00Z',
          owner_id: 'user_4',
          note: 'Plan and execute co-branded marketing initiatives',
          organization_id: 1,
          external_partner_id: mockPartnerId,
          created_at: '2024-01-17T09:30:00Z',
          updated_at: '2024-01-17T09:30:00Z',
          username: 'Alex Chen'
        }
      ],
      pageable: {
        pageNumber: 0,
        pageSize: 10,
        sort: {
          sorted: true,
          unsorted: false,
          empty: false
        },
        offset: 0,
        paged: true,
        unpaged: false
      },
      last: true,
      totalElements: 6,
      totalPages: 1,
      first: true,
      size: 10,
      number: 0,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false
      },
      numberOfElements: 6,
      empty: false
    }
  }

  // Fetch partner details by code to get numeric id (for real flow only)
  const { data: partnerDetails } = useOfflinePartnerDetailsByCode(
    inDummyFlow ? '' : (partnerId ?? '')
  )
  const numericPartnerId =
    partnerDetails && typeof partnerDetails.id === 'number'
      ? partnerDetails.id
      : undefined
  const externalPartnerCode = partnerId ?? undefined

  // Fetch Trello lists when selectedApp is 'trello' and a board is selected
  const {
    data: trelloLists,
    isLoading: isLoadingTrelloLists,
    error: errorTrelloLists
  } = useTrelloLists(selectedBoard, {
    enabled: selectedApp === 'trello' && !!selectedBoard,
    isDummy: inDummyFlow
  })

  // Fetch Trello cards for all lists in parallel
  const cardsQueries = useQueries({
    queries: useMemo(
      () =>
        (trelloLists || []).map((list) =>
          getTrelloCardsQueryOptions(list.id, {
            enabled: selectedApp === 'trello' && !!selectedBoard,
            isDummy: inDummyFlow
          })
        ),
      [trelloLists, selectedApp, selectedBoard, inDummyFlow]
    )
  })

  // Synchronize dynamic parallel queries data into state
  useEffect(() => {
    if (!trelloLists || trelloLists.length === 0) {
      setGroupedTrelloCards((prev) =>
        Object.keys(prev).length === 0
          ? prev
          : ({} as Record<string, TrelloCard[]>)
      )
      return
    }

    const grouped: Record<string, TrelloCard[]> = {}
    trelloLists.forEach((list, index) => {
      const query = cardsQueries[index]
      grouped[list.id] = query?.data || []
    })

    setGroupedTrelloCards((prev) => {
      const isIdentical =
        Object.keys(grouped).length === Object.keys(prev).length &&
        Object.keys(grouped).every(
          (key) =>
            grouped[key] === prev[key] ||
            JSON.stringify(grouped[key]) === JSON.stringify(prev[key])
        )
      return isIdentical ? prev : grouped
    })
  }, [cardsQueries, trelloLists])

  // Console log BOTH trello lists and grouped cards
  useEffect(() => {
    if (trelloLists) {
      console.log('Fetched Trello lists:', trelloLists)
    }
  }, [trelloLists])

  useEffect(() => {
    const allSettled =
      cardsQueries.length > 0 && cardsQueries.every((q) => !q.isLoading)
    if (allSettled) {
      console.log('Grouped Trello cards by list ID:', groupedTrelloCards)
    }
  }, [groupedTrelloCards, cardsQueries])

  // Use real API or mock data based on dummy flow
  const {
    data: realTasksData,
    isLoading: isLoadingRealTasks,
    refetch: refetchRealTasks
  } = useQuery({
    queryKey: ['tasks', partnerId],
    queryFn: async () => {
      const response = await fetch(
        `/api/tasks/list/external/partner?externalPartnerCode=${partnerId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }

      return response.json()
    },
    enabled: !inDummyFlow && !!partnerId,
    retry: false
  })

  // Use mock data if in dummy flow, otherwise use real data
  const tasksData = inDummyFlow ? mockTasksData : realTasksData
  const isLoadingTasks = inDummyFlow ? false : isLoadingRealTasks
  const refetchTasks = inDummyFlow ? () => {} : refetchRealTasks

  // Extract apiTasks safely based on potential backend response wrappers
  const apiTasks: ApiTask[] =
    (Array.isArray(tasksData?.data)
      ? tasksData?.data
      : tasksData?.data?.content) ||
    tasksData?.content ||
    []

  const tasks: Task[] = apiTasks.map(mapApiTaskToTask)

  const adaptedTrelloColumns = useMemo(
    () => mapTrelloListsToColumns(trelloLists || [], groupedTrelloCards),
    [trelloLists, groupedTrelloCards]
  )

  const isLoadingTrelloCards = cardsQueries.some((q) => q.isLoading)
  const isLoadingTrello = isLoadingTrelloLists || isLoadingTrelloCards

  const handleAppSelect = (app: AppType) => {
    setSelectedApp(app)
    setSelectedBoard('')
  }

  const handleCreateTask = () => {
    setIsCreateTaskModalOpen(true)
  }

  const handleUpdateTaskStatus = async (
    taskId: string,
    newStatus: Task['status']
  ): Promise<void> => {
    if (inDummyFlow) {
      showCustomToast(
        'Info',
        'No edit access for this dummy account',
        'info',
        5000
      )
      return
    }

    try {
      console.log('handleUpdateTaskStatus called:', { taskId, newStatus })

      // Map TaskStatus back to API status enum
      const apiStatus = mapTaskStatusToApiStatus(newStatus)
      console.log('Updating task status:', { taskId, newStatus, apiStatus })

      const response = await fetch(`/api/tasks/${taskId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: apiStatus })
      })

      console.log('PATCH response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('PATCH error:', errorData)
        throw new Error(
          errorData.message ||
            `Failed to update task status: ${response.statusText}`
        )
      }

      const responseData = await response.json()
      console.log('PATCH success:', responseData)

      // Refetch tasks to get updated data
      refetchTasks()
    } catch (error) {
      console.error('Failed to update task status:', error)
      throw error // Re-throw to let TaskGroups handle the error and revert UI
    }
  }

  // Refetch tasks when modal closes (after task creation)
  const handleModalClose = (open: boolean) => {
    if (!open) {
      // Modal closed, refetch tasks to get the latest list
      refetchTasks()
    }
  }

  return (
    <div className='flex w-full flex-col gap-6'>
      {/* <TasksToolbar viewMode={viewMode} onViewModeChange={setViewMode} /> */}

      {isTrelloConnected && selectedApp ? (
        <AppConnectionBanner
          selectedApp={selectedApp}
          selectedBoard={selectedBoard}
          onBoardChange={setSelectedBoard}
        />
      ) : (
        <ConnectAppsBanner
          onAppSelect={handleAppSelect}
          partnerId={numericPartnerId ?? undefined}
          inDummyFlow={inDummyFlow}
        />
      )}

      {viewMode === 'grid' ? (
        selectedApp === 'trello' && !selectedBoard ? (
          <div className='flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-16 text-center'>
            <div className='text-sm font-medium text-text-60'>
              Select a Trello board from the dropdown above to view lists and
              cards
            </div>
          </div>
        ) : (
          <TaskGroups
            tasks={selectedApp === 'trello' ? [] : tasks}
            columns={
              selectedApp === 'trello' ? adaptedTrelloColumns : undefined
            }
            emptyPlaceholder={selectedApp === 'trello' ? 'No cards' : undefined}
            isLoading={
              selectedApp === 'trello' ? isLoadingTrello : isLoadingTasks
            }
            onCreateTask={
              selectedApp === 'trello' ? undefined : handleCreateTask
            }
            onUpdateTaskStatus={
              selectedApp === 'trello' ? undefined : handleUpdateTaskStatus
            }
          />
        )
      ) : (
        <CreateTaskSection isDisabled={!selectedBoard} />
      )}

      <CreateTaskModal
        open={isCreateTaskModalOpen}
        onOpenChange={(open) => {
          setIsCreateTaskModalOpen(open)
          handleModalClose(open)
        }}
        externalPartnerId={numericPartnerId ?? undefined}
        externalPartnerCode={externalPartnerCode}
        inDummyFlow={inDummyFlow}
      />
    </div>
  )
}

export default Tasks
