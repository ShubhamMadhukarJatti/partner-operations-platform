import * as React from 'react'

import { cn } from '@/lib/utils'

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
}

const OutlinedTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, value, onFocus, ...props }, ref) => {
    return (
      <div className='relative'>
        <textarea
          //   className={cn(
          //     'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          //     className
          //   )}

          className={cn(
            'flex min-h-[80px] w-full rounded-lg border  border-text-40 px-3 py-2 text-sm',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-text-60',
            'focus-visible:border focus-visible:border-primary focus-visible:outline-none',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          value={value}
          ref={ref}
          {...props}
        />

        {label && (
          <label
            className={cn(
              'pointer-events-none absolute left-2 top-3 -translate-y-5 bg-background px-1 text-xs text-text-60 transition-all duration-200'
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

OutlinedTextarea.displayName = 'OutlinedTextarea'

export { OutlinedTextarea }
