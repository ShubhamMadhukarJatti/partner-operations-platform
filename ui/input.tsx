// import * as React from 'react'

// import { cn } from '@/lib/utils'

// export interface InputProps
//   extends React.InputHTMLAttributes<HTMLInputElement> {}

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   ({ className, type, ...props }, ref) => {
//     return (
//       <input
//         type={type}
//         className={cn(
//           'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
//           className
//         )}
//         ref={ref}
//         {...props}
//       />
//     )
//   }
// )
// Input.displayName = 'Input'

// export { Input }
import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
  fullWidth?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, icon, fullWidth, ...props }, ref) => {
    return (
      <div className={cn('relative', fullWidth && 'w-full')}>
        {icon && (
          <span className='absolute left-3 top-1/2 -translate-y-1/2 text-inputField-content'>
            {icon}
          </span>
        )}
        <input
          ref={ref}
          value={value}
          className={cn(
            'flex h-10 w-full rounded-md px-3 py-2 text-sm transition-colors',
            'placeholder:text-inputField-placeholder border border-inputField-border bg-inputField-bg text-inputField-content',
            'placeholder:text-inputField-content',
            'focus:outline-none focus:ring-0 focus:ring-inputField-ring focus:ring-offset-0',
            'focus:bg-inputField-bg-focus focus:text-inputField-content-focus',
            'disabled:cursor-not-allowed disabled:border-inputField-border-disabled disabled:bg-inputField-bg-disabled disabled:text-inputField-content-disabled',
            icon && 'pl-10',
            className
          )}
          {...props}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
