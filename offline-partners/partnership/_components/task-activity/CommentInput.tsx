import { IconPaperclip, IconSend } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'

interface CommentInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
}

export const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onSend
}) => {
  return (
    <div className='border-t border-gray-200 p-4'>
      <div className='space-y-2 rounded-lg border border-gray-200 bg-white p-2'>
        {/* Text Input */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder='Add a comment...'
          className='max-h-24 min-h-[32px] w-full resize-none border-none text-sm outline-none'
          rows={1}
        />

        {/* Action Icons Row */}
        <div className='flex items-center justify-between border-t border-gray-100 pt-1'>
          {/* Attachment Icon - Extreme Left */}
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 rounded-2xl bg-gray-200'
          >
            <IconPaperclip size={14} />
          </Button>

          {/* Send Icon - Extreme Right */}
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 bg-gray-200 p-2'
            onClick={onSend}
            disabled={!value.trim()}
          >
            <IconSend size={18} />
          </Button>
        </div>
      </div>
    </div>
  )
}
