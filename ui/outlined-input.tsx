import * as React from 'react'

import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  isFill?: boolean
  labelClassName?: string
}

const OutlinedInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      label,
      value,
      isFill,
      onFocus,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false)
    const [isFilled, setIsFilled] = React.useState(isFill || false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setIsFilled(e.target.value !== '')
    }

    return (
      <div className='relative w-full'>
        <input
          type={type}
          value={value}
          className={cn(
            'flex h-12 w-full rounded-lg border px-3 py-2 text-sm transition-colors',
            'border-inputField-border bg-inputField-bg text-inputField-content',
            'placeholder:text-inputField-content',
            'focus:outline-none focus:ring-2 focus:ring-inputField-ring focus:ring-offset-0',
            'focus:bg-inputField-bg-focus focus:text-inputField-content-focus',
            'disabled:cursor-not-allowed disabled:border-inputField-border-disabled disabled:bg-inputField-bg-disabled disabled:text-inputField-content-disabled',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            '!autofill:bg-white',
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlurCapture={handleBlur}
          {...props}
        />
        {label && (
          <label
            className={cn(
              'pointer-events-none absolute left-2 top-3 -translate-y-5 bg-background px-1 text-xs text-text-60 transition-all duration-200',
              labelClassName
            )}
          >
            {label}
          </label>
        )}
      </div>
    )
  }
)

OutlinedInput.displayName = 'OutlinedInput'

export { OutlinedInput }
