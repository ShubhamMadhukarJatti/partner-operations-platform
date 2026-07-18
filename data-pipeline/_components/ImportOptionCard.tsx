import { Check, type LucideIcon } from 'lucide-react'

type ImportOptionCardProps = {
  isSelected: boolean
  onToggle: () => void
  icon: LucideIcon
  title: string
  description: string
}

export default function ImportOptionCard({
  isSelected,
  onToggle,
  icon: Icon,
  title,
  description
}: ImportOptionCardProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded p-4 text-left transition-colors ${
        isSelected
          ? 'bg-[#EFF6FF] outline outline-1 outline-[#2B74DA]'
          : 'bg-white outline outline-1 outline-[rgba(33,35,44,0.12)] hover:bg-gray-50'
      }`}
    >
      <div className='mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center'>
        <Icon
          className={`h-6 w-6 ${isSelected ? 'text-[#0D68C5]' : 'text-[#65686F]'}`}
        />
      </div>
      <div className='flex-1'>
        <div className='flex items-center gap-2'>
          <span className='text-base font-semibold text-[#21232C]'>
            {title}
          </span>
          {isSelected && <Check className='h-4 w-4 text-[#0D68C5]' />}
        </div>
        <p className='mt-0.5 text-[13.9px] font-medium leading-[21px] text-[#65686F]'>
          {description}
        </p>
      </div>
    </button>
  )
}
