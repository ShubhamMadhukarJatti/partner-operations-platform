import { IconHeart, IconMessage } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

import { Comment } from './types'

interface CommentItemProps {
  comment: Comment
  onLike: (commentId: string) => void
}

export const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onLike
}) => {
  return (
    <div className='space-y-2'>
      <div className='flex gap-3'>
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className='h-8 w-8 flex-shrink-0 rounded-full'
        />
        <div className='flex-1'>
          <div className='text-sm text-text-70'>
            <span className='font-medium'>{comment.user.name}</span>
            <span className='ml-1'>added a comment</span>
            <span className='ml-2 text-text-50'>{comment.timestamp}</span>
          </div>
        </div>
      </div>

      <div className='ml-11 rounded-lg border border-gray-100 bg-white p-3'>
        <div className='mb-2 flex items-center gap-2'>
          <span className='text-sm font-medium text-text-70'>
            {comment.user.name}
          </span>
          <span className='text-xs text-text-50'>{comment.timestamp}</span>
        </div>
        <p className='mb-3 text-sm text-text-70'>{comment.content}</p>
        <div className='border-t pt-2'>
          <div className='flex items-center gap-4'>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 px-2 text-text-60'
              onClick={() => onLike(comment.id)}
            >
              <IconHeart
                size={14}
                className={comment.isLiked ? 'fill-red-500 text-red-500' : ''}
              />
              {comment.likes > 0 && (
                <span className='ml-1'>{comment.likes}</span>
              )}
            </Button>
            <Button variant='ghost' size='sm' className='h-6 px-2 text-text-60'>
              <IconMessage size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
