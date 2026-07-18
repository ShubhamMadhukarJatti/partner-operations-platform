import { useState } from 'react'
import { IconChevronRight } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

import { ActivityItem } from './ActivityItem'
import { CommentInput } from './CommentInput'
import { CommentItem } from './CommentItem'
import { Activity, Comment } from './types'

interface ActivitySidebarProps {
  activities: Activity[]
  comments: Comment[]
  onClose: () => void
  onLikeComment: (commentId: string) => void
  onAddComment: (comment: Comment) => void
}

export const ActivitySidebar: React.FC<ActivitySidebarProps> = ({
  activities,
  comments,
  onClose,
  onLikeComment,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('')

  const handleSendComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
        },
        timestamp: 'now',
        content: newComment.trim(),
        likes: 0,
        isLiked: false
      }
      onAddComment(comment)
      setNewComment('')
    }
  }

  return (
    <div className='flex w-1/3 flex-col border-l border-gray-200 bg-[#F9FAFB]'>
      {/* Sidebar Header */}
      <div className='flex items-center justify-between border-b border-gray-200 p-4'>
        <h3 className='text-base font-bold text-text-70'>
          Activity & Comments
        </h3>
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6'
          onClick={onClose}
        >
          <IconChevronRight size={14} />
          <IconChevronRight size={14} className='-ml-1' />
        </Button>
      </div>

      {/* Activities List */}
      <div className='flex-1 space-y-4 overflow-y-auto p-4'>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}

        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onLike={onLikeComment}
          />
        ))}
      </div>

      {/* Comment Input */}
      <CommentInput
        value={newComment}
        onChange={setNewComment}
        onSend={handleSendComment}
      />
    </div>
  )
}
