import { ArrowRight, ArrowUpRight, LucideIcon } from 'lucide-react'

type Participant = {
  name: string
}

type ActionButton = {
  label: string
  onClick?: () => void
  variant?: 'primary' | 'secondary'
  icon?: LucideIcon
}

type SessionCardProps = {
  participants: Participant[]
  date: string
  time: string
  actions: ActionButton[]
}

export default function SessionCard({
  participants,
  date,
  time,
  actions
}: SessionCardProps) {
  return (
    <div className='max-w-xl'>
      {/* Participants */}
      <div className='flex gap-10'>
        {participants.map((participant, index) => (
          <div key={index}>
            <p className='text-lg font-medium text-slate-800'>
              {participant.name}
            </p>
            <div className='mt-1 h-0.5 w-full bg-slate-700' />
          </div>
        ))}
      </div>

      {/* Date & Time */}
      <div className='mt-6'>
        <p className='text-base font-medium text-slate-800'>{date}</p>
        <p className='mt-1 text-sm text-slate-500'>{time}</p>
      </div>

      {/* Actions */}
      <div className='mt-6 flex gap-4'>
        {actions.map((action, index) => {
          const Icon = action.icon

          const baseClasses =
            'inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition'

          const variantClasses =
            action.variant === 'secondary'
              ? 'border border-indigo-500 text-indigo-600 hover:bg-indigo-50'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'

          return (
            <button
              key={index}
              onClick={action.onClick}
              className={`${baseClasses} ${variantClasses}`}
            >
              {action.label}
              {Icon && <Icon className='h-4 w-4' />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
