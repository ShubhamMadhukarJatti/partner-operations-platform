import { Clock } from 'lucide-react'

interface HistoryItemProps {
  title: string
  date: string
}

const HistoryItem: React.FC<HistoryItemProps> = ({ title, date }) => {
  return (
    <div className='flex w-full max-w-xl items-start gap-3 rounded-[12px] border border-[#DFE3E8] bg-[#FCFCFD] p-3'>
      <Clock size={18} className='mt-1 text-gray-500' />
      <div className='flex flex-col'>
        <p className='text-sm font-medium text-gray-900'>{title}</p>
        <span className='text-xs text-[#4D5C78]'>{date}</span>
      </div>
    </div>
  )
}

export default function HistoryList() {
  const history = [
    {
      title: 'Document created',
      date: 'Aug 18, 2023 at 04:12 pm'
    },
    {
      title: 'Document created',
      date: 'Oct 13, 2023 at 08:05 am'
    }
  ]

  return (
    <div className='flex flex-col gap-3'>
      {history.map((item, i) => (
        <HistoryItem key={i} {...item} />
      ))}
    </div>
  )
}
