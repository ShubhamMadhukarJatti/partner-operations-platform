export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'cancelled'

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignedTo: {
    id: string
    name: string
    avatar?: string
  }
  dueDate: string
  createdAt: string
  updatedAt: string
  priority?: 'low' | 'medium' | 'high'
  tags?: string[]
}

export interface TaskColumn {
  id: string
  title: string
  color: string
  tasks: Task[]
}

export interface KanbanBoard {
  columns: TaskColumn[]
}
