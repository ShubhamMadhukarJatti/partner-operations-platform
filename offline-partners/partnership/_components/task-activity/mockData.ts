import { Activity, Comment } from './types'

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: '1',
    type: 'created',
    user: {
      name: 'Sahil',
      avatar:
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2 mo ago',
    description: 'created this task'
  },
  {
    id: '2',
    type: 'comment',
    user: {
      name: 'Bharat',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2 mo ago',
    content:
      'This looks great! I think we should prioritize this task as it aligns well with our Q4 goals.',
    description: 'added a comment'
  }
]

export const MOCK_COMMENTS: Comment[] = [
  {
    id: '1',
    user: {
      name: 'Bharat',
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    timestamp: '2 mo ago',
    content:
      'This looks great! I think we should prioritize this task as it aligns well with our Q4 goals.',
    likes: 2,
    isLiked: false
  }
]
