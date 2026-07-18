import React from 'react'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode
}

const Search = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          'flex w-full items-center overflow-hidden rounded-xl',
          className
        )}
      >
        <Input
          {...props}
          type='search'
          ref={ref}
          icon={<SearchIcon className='h-[16px] w-[16px]' />}
          className='rounded-xl'
        />
      </div>
    )
  }
)

Search.displayName = 'Search'

export { Search }
