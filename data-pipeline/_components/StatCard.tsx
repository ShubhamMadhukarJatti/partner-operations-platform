import { type LucideIcon } from 'lucide-react'

type StatCardProps = {
  label: string
  value: number | string
  icon: LucideIcon
}

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <div className='flex flex-col gap-1.5 rounded-2xl bg-white px-5 py-3.5'>
      <div className='flex items-center gap-4'>
        <span className='flex-1 text-sm font-normal text-[#1C1C1C]'>
          {label}
        </span>
        <Icon className='h-6 w-6 text-[#1C1C1C]' />
      </div>
      <span className='text-2xl font-semibold leading-9 text-[#1C1C1C]'>
        {value}
      </span>
    </div>
  )
}
