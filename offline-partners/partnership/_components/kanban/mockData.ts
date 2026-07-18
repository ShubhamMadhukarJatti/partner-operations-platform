import { Task, TaskColumn } from './types'

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Setup partner onboarding flow',
    description:
      'Create comprehensive onboarding documentation and process for new partners',
    status: 'todo',
    assignedTo: {
      id: 'user1',
      name: 'John Doe'
    },
    dueDate: '2024-02-18',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
    priority: 'high',
    tags: ['onboarding', 'documentation']
  },
  {
    id: '2',
    title: 'Review Q1 partnership metrics',
    description:
      'Analyze partnership performance data from Q1 and prepare report',
    status: 'in_progress',
    assignedTo: {
      id: 'user2',
      name: 'Jane Smith'
    },
    dueDate: '2024-02-20',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-16',
    priority: 'medium',
    tags: ['metrics', 'reporting']
  },
  {
    id: '3',
    title: 'Partner API integration',
    description: 'Complete API integration with strategic partner platform',
    status: 'in_progress',
    assignedTo: {
      id: 'user3',
      name: 'Bob Johnson'
    },
    dueDate: '2024-02-25',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-14',
    priority: 'high',
    tags: ['technical', 'integration']
  },
  {
    id: '4',
    title: 'Update partner portal UI',
    description: 'Implement new design system for partner dashboard',
    status: 'todo',
    assignedTo: {
      id: 'user1',
      name: 'John Doe'
    },
    dueDate: '2024-03-01',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-12',
    priority: 'medium',
    tags: ['ui', 'design']
  },
  {
    id: '5',
    title: 'Q4 partner campaign launch',
    description:
      'Successfully launched co-marketing campaign with key partners',
    status: 'completed',
    assignedTo: {
      id: 'user2',
      name: 'Jane Smith'
    },
    dueDate: '2024-01-10',
    createdAt: '2023-12-15',
    updatedAt: '2024-01-10',
    priority: 'high',
    tags: ['marketing', 'campaign']
  },
  {
    id: '6',
    title: 'Partner feedback survey',
    description: 'Conduct quarterly partner satisfaction survey',
    status: 'todo',
    assignedTo: {
      id: 'user3',
      name: 'Bob Johnson'
    },
    dueDate: '2024-02-28',
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14',
    priority: 'low',
    tags: ['feedback', 'survey']
  },
  {
    id: '7',
    title: 'Deprecated partner API sunset',
    description:
      'Phase out old partner API version - cancelled due to extended support requirement',
    status: 'cancelled',
    assignedTo: {
      id: 'user1',
      name: 'John Doe'
    },
    dueDate: '2024-01-15',
    createdAt: '2023-12-01',
    updatedAt: '2024-01-05',
    priority: 'low',
    tags: ['technical', 'deprecation']
  },
  {
    id: '8',
    title: 'Partner training webinar',
    description: 'Host monthly training session for partner teams',
    status: 'completed',
    assignedTo: {
      id: 'user2',
      name: 'Jane Smith'
    },
    dueDate: '2024-01-12',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-12',
    priority: 'medium',
    tags: ['training', 'webinar']
  }
]

export const INITIAL_COLUMNS: TaskColumn[] = [
  {
    id: 'todo',
    title: 'To do',
    color: '#94A3B8',
    tasks: MOCK_TASKS.filter((task) => task.status === 'todo')
  },
  {
    id: 'in_progress',
    title: 'In progress',
    color: '#3B82F6',
    tasks: MOCK_TASKS.filter((task) => task.status === 'in_progress')
  },
  {
    id: 'completed',
    title: 'Completed',
    color: '#10B981',
    tasks: MOCK_TASKS.filter((task) => task.status === 'completed')
  },
  {
    id: 'cancelled',
    title: 'Cancelled',
    color: '#EF4444',
    tasks: MOCK_TASKS.filter((task) => task.status === 'cancelled')
  }
]
