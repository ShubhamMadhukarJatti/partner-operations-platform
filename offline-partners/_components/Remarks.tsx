import { Input } from '@/components/ui/input'

interface RemarkItemProps {
  remark: string
  date: string
  username?: string
}

const RemarkItem: React.FC<RemarkItemProps> = ({
  remark,
  date,
  username = 'User'
}) => {
  return (
    <div className='flex w-full items-start gap-3 rounded-xl border border-[#DFE3E8] bg-white p-3'>
      <div className='flex w-full items-start justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='text-sm font-medium text-gray-900'>{username}</p>
          <p className='text-sm text-gray-600'>{remark}</p>
        </div>
        <div className='text-xs text-gray-500'>{date}</div>
      </div>
    </div>
  )
}

export default function Remarks() {
  const remarks = [
    {
      remark: 'Please review section 3.2 regarding the liability terms.',
      date: '2 hours ago',
      username: 'Nikhil Saini'
    }
  ]

  return (
    <div className='flex flex-col gap-3'>
      {remarks.map((item, i) => (
        <RemarkItem key={i} {...item} />
      ))}
      <div className='flex items-center gap-2'>
        <Input
          type='text'
          placeholder='Add a comment...'
          className='flex-1 rounded-[8px] text-sm'
        />
        <button className='rounded-[8px] bg-black px-4 py-2 text-sm text-white hover:bg-gray-800'>
          Post
        </button>
      </div>
    </div>
  )
}
