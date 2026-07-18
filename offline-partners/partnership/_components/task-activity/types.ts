export interface User {
  name: string
  avatar: string
}

export interface Activity {
  id: string
  type: 'created' | 'comment' | 'status_change' | 'assignment'
  user: User
  timestamp: string
  content?: string
  description: string
}

export interface Comment {
  id: string
  user: User
  timestamp: string
  content: string
  likes: number
  isLiked: boolean
}
