import { MoreHorizontal } from 'lucide-react'

type InsightStatCardProps = {
  label: string
  value: string | number
  badge?: string
  hasMenu?: boolean
}

export default function InsightStatCard({
  label,
  value,
  badge,
  hasMenu
}: InsightStatCardProps) {
  return (
    <div className='relative flex flex-1 flex-col gap-2 rounded-xl bg-white p-4 shadow-[0px_1px_2px_rgba(10,13,18,0.05)] outline outline-1 outline-[#E9EAEB] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:outline-[#BEBCFF]'>
      <div className='flex items-center justify-between'>
        <span className='text-sm font-medium text-[#535862]'>{label}</span>
        {hasMenu && (
          <button className='text-[#A4A7AE] hover:text-[#535862]'>
            <MoreHorizontal className='h-5 w-5' />
          </button>
        )}
      </div>
      <div className='flex items-end gap-3'>
        <span className='text-[30px] font-semibold leading-[38px] text-[#181D27]'>
          {value}
        </span>
        {badge && (
          <span className='mb-2 rounded-full bg-[#E2EBFF] px-3 py-1 text-sm font-semibold text-[#2A3067]'>
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}
