import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { XCircle } from 'lucide-react'

import { cn } from '@/lib/utils'

const ReplyUi: React.FC<{
  title: string
  description: string
  replying?: boolean
  children?: ReactNode
  flag: 'SENDER' | 'RECEIVER'
}> = ({ title, description, replying = false, children, flag }) => {
  const router = useRouter()

  const handleRemoveReply = () => {
    router.replace(window.location.pathname)
  }
  return !replying ? (
    <div className='group rounded-xl border border-[#B6C0D3] p-2.5'>
      <div
        className={cn(
          'relative border-l border-black p-2 pl-6',
          flag === 'SENDER' ? 'bg-[#E7FCF2]' : 'bg-[#E7EEFC]'
        )}
      >
        <p className='text-sm font-medium text-black'>{title}</p>
        <p className='mt-2 line-clamp-1 overflow-hidden overflow-ellipsis text-sm font-normal text-[#535862]'>
          {description}
        </p>
        <button
          onClick={() => handleRemoveReply()}
          className='absolute right-0 top-0 hidden group-hover:inline'
        >
          <XCircle size={16} />{' '}
        </button>
      </div>
    </div>
  ) : (
    <div className='relative  max-w-[442px] rounded-b-lg border border-[#E9EAEB] bg-[#FAFAFA] p-2.5'>
      <div className='mb-1 rounded-xl '>
        <div
          className={cn(
            'border-l border-black bg-[#E7FCF2] p-2 pl-6',
            flag === 'SENDER' ? 'bg-[#E7FCF2]' : 'bg-[#E7EEFC]'
          )}
        >
          <p className='text-sm font-medium text-black'>{title}</p>
          <p className='mt-2 text-sm font-normal text-[#535862]'>
            {description}
          </p>
        </div>{' '}
      </div>
      {children}
    </div>
  )
}

export default ReplyUi
