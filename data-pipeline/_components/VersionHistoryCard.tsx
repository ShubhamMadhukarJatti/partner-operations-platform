import { Eye, Pencil, RefreshCw, User } from 'lucide-react'

type ChangeRecord = {
  field: string
  oldValue: string
  newValue: string
  forEmail: string
}

type VersionHistoryCardProps = {
  recordCount: number
  changes: ChangeRecord[]
  author: {
    initials: string
    name: string
    email: string
  }
}

function ChangeRow({ change }: { change: ChangeRecord }) {
  return (
    <div className='flex items-center justify-between border-l-2 border-[#4D5C78] bg-[#F8F8F8] px-2.5 py-1.5'>
      <div className='flex flex-wrap items-center gap-1.5'>
        <span className='rounded-full bg-[#E5EDFF] px-3 py-0.5 text-sm font-medium text-[rgba(49,49,49,0.70)]'>
          {change.field}
        </span>
        <span className='text-sm text-[#4D5C78]'>Record changed for</span>
        <span className='rounded-full bg-[#E5EDFF] px-3 py-0.5 text-sm text-[rgba(49,49,49,0.70)]'>
          {change.oldValue}
        </span>
        <span className='text-sm text-[#4D5C78]'>to</span>
        <span className='rounded-full bg-[#FFEACC] px-3 py-0.5 text-sm text-[rgba(49,49,49,0.70)]'>
          {change.newValue}
        </span>
      </div>
      <div className='flex shrink-0 items-center gap-6 pl-4'>
        <span className='text-sm text-[#4D5C78]'>For</span>
        <div className='flex items-center gap-1.5 rounded-full bg-white px-3 py-0.5 text-sm text-[rgba(49,49,49,0.70)] outline outline-1 outline-[#DCE9FF]'>
          <User className='h-[18px] w-[18px]' />
          {change.forEmail}
        </div>
      </div>
    </div>
  )
}

export default function VersionHistoryCard({
  recordCount,
  changes,
  author
}: VersionHistoryCardProps) {
  return (
    <div className='flex flex-col gap-4 overflow-hidden rounded-xl bg-white p-5'>
      {/* Header */}
      <div className='flex items-start justify-between'>
        <span className='text-base font-semibold text-[#40455E]'>
          Modified for {recordCount} records
        </span>
        <div className='flex items-center gap-3.5'>
          <Pencil className='h-[18px] w-[18px] text-black' />
          <RefreshCw className='h-[18px] w-[18px] text-black' />
          <Eye className='h-[18px] w-[18px] text-black' />
        </div>
      </div>

      {/* Change rows */}
      <div className='flex flex-col gap-2.5'>
        {changes.map((change, i) => (
          <ChangeRow key={i} change={change} />
        ))}
      </div>

      {/* Author */}
      <div className='flex items-center gap-3'>
        <div className='flex h-8 w-8 items-center justify-center rounded-full bg-[#ECECED]'>
          <span className='text-[13px] font-semibold uppercase leading-5 text-[#65686F]'>
            {author.initials}
          </span>
        </div>
        <div className='flex flex-col'>
          <span className='text-xs font-medium text-[#2A3241]'>
            {author.name}
          </span>
          <span className='text-[10px] text-[#7688A8]'>{author.email}</span>
        </div>
      </div>
    </div>
  )
}
