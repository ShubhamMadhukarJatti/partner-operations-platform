import { Eye, Link, Paperclip } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export const Track = ({ classname }: { classname?: string }) => {
  return (
    <Card className={cn('p-0', classname)}>
      <CardContent className='flex flex-col gap-2 py-4'>
        <div className='flex items-center gap-2 px-4'>
          <Eye size={20} />
          <div>
            <h3 className='text-sm font-medium'>Track Visibility</h3>
            <p className='text-sm text-muted-foreground'>
              6 Companies viewed your profile
            </p>
          </div>
        </div>
        <Separator />
        <div className='flex items-center gap-2 px-4'>
          <Link size={20} />
          <div>
            <h3 className='text-sm font-medium'>Check Links</h3>
            <p className='text-sm text-muted-foreground'>
              Type form, collabera form, Shoutout link
            </p>
          </div>
        </div>
        <Separator />
        <div className='flex items-center gap-2 px-4'>
          <Paperclip size={20} />
          <div>
            <h3 className='text-sm font-medium'>Check Attachments</h3>
            <p className='text-sm text-muted-foreground'>MOU, NDA</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
