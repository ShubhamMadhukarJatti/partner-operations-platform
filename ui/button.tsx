import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import LoadingIcon from '@/components/ui/loading-icon'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      variant: {
        default:
          'bg-primary-light-blue text-text-10 font-bold text-sm hover:bg-primary/90',
        primary:
          'bg-brandPrimary text-white font-bold text-sm hover:bg-brandPrimary-hover',
        disable:
          'bg-brandPrimary-light text-white font-bold text-sm hover:bg-brandPrimary-light-hover',
        destructiveSolid:
          'bg-brandDestructive text-white font-bold text-sm hover:bg-brandDestructive-hover focus-visible:ring-brandDestructive',
        destructiveLight:
          'bg-brandDestructive-light text-brandDestructive font-bold text-sm hover:bg-brandDestructive-light-hover hover:text-brandDestructive-hover focus-visible:ring-brandDestructive',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 focus-visible:ring-destructive',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        primanyOutline:
          'border border-primary-blue bg-accent text-primary hover:text-accent-foreground px-4 py-2 rounded w-full',
        toolbar:
          'border border-[#D5D7DA] bg-white text-[#364153] shadow-[0px_1px_2px_rgba(10,13,18,0.05)] hover:bg-gray-50'
      },
      size: {
        default: 'h-10 px-4 py-2',
        xs: 'h-8 px-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8 text-base',
        icon: 'h-10 w-10',
        fullWidth: `w-[100%] px-4 py-2`
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading,
      loadingText = 'Loading',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
        disabled={loading || props.disabled}
      >
        {loading ? (
          <span className='flex items-center'>
            <LoadingIcon className='mr-2' /> {loadingText}
          </span>
        ) : (
          props.children
        )}
      </Comp>
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
