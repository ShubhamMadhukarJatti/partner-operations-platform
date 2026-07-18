export type ViewMode = 'grid' | 'list'
export type AppType = 'trello' | 'notion' | 'plus'

export interface Board {
  id: string
  name: string
  app: AppType
}

export interface TasksState {
  viewMode: ViewMode
  selectedApp: AppType | null
  selectedBoard: string
}

export interface TrelloBoard {
  id: string
  nodeId: string
  name: string
  desc: string
  closed: boolean
  url: string
  shortLink: string
  shortUrl: string
  dateLastActivity: string
  dateLastView: string
  // Add other fields as needed
}

export interface TrelloBoardsResponse {
  success: boolean
  message: string
  data: TrelloBoard[]
}
