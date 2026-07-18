import * as React from 'react'
import { X } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer'

type AppDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  contentClassName?: string
  headerClassName?: string
}

export function AppDrawer({
  open,
  onOpenChange,
  title,
  children,
  footer,
  contentClassName,
  headerClassName
}: AppDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        className={cn('max-w-[540px] bg-white p-0', contentClassName)}
      >
        <DrawerHeader
          className={cn(
            'flex flex-row items-center justify-between border-b border-[#E5E7EB] px-6 py-4',
            headerClassName
          )}
        >
          <DrawerTitle className='text-lg font-semibold text-[#111111]'>
            {title}
          </DrawerTitle>
          <DrawerClose asChild>
            <Button
              variant='ghost'
              size='icon'
              className='h-8 w-8 hover:bg-[#F3F4F6]'
              aria-label='Close drawer'
            >
              <X className='h-5 w-5 text-[#6B7280]' />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className='flex-1 overflow-y-auto px-6 py-6'>{children}</div>

        {footer ? (
          <div className='border-t border-[#E5E7EB] px-6 py-4'>{footer}</div>
        ) : null}
      </DrawerContent>
    </Drawer>
  )
}
