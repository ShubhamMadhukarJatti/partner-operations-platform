import { cn } from '@/lib/utils'

export const StatusIndication = ({ status }: { status: string }) => {
  return (
    <span
      className={cn(
        'flex h-[20px] w-fit items-center gap-1 rounded-full border px-2  text-[10px] text-sm font-bold  leading-[12.1px]',
        {
          'border-emerald-500 text-emerald-500': status === 'ACTIVE'
        },
        {
          ' border-semantic-caution text-semantic-caution': status === 'PENDING'
        },
        {
          'border-red-500  text-red-500': status === 'REJECTED'
        },
        {
          'border-gray-500 text-gray-500':
            status === 'EXPIRED' || 'Invittation sent'
        }
      )}
    >
      <span
        className={cn(
          'h-2.5 w-2.5 shrink-0 rounded-full',
          {
            'bg-emerald-500': status === 'ACTIVE'
          },
          {
            'bg-semantic-caution': status === 'PENDING'
          },
          {
            'bg-red-500': status === 'REJECTED'
          },
          {
            'bg-gray-500': status === 'EXPIRED' || 'Invittation sent'
          }
        )}
      ></span>
      <span className='font-bold lowercase tracking-wide first-letter:capitalize'>
        {status}
      </span>
    </span>
  )
}
