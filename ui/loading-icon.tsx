import { cn } from '@/lib/utils'

const LoadingIcon = ({ className = '' }) => {
  return (
    <div
      className={cn(
        'inline-block h-4 w-4 animate-spin rounded-full border-[3px] border-current border-t-transparent text-current',
        className
      )}
      role='status'
      aria-label='loading'
    >
      <span className='sr-only'>Loading...</span>
    </div>
  )
}

export default LoadingIcon
