'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface VideoDialogProps {
  videoInfo: { title: string; url: string } | null
  onClose: () => void
}

export function VideoDialog({ videoInfo, onClose }: VideoDialogProps) {
  return (
    <Dialog open={!!videoInfo} onOpenChange={onClose}>
      <DialogContent className='w-full max-w-[95vw] sm:max-w-[800px]'>
        <DialogHeader>
          <DialogTitle>{videoInfo?.title}</DialogTitle>
        </DialogHeader>
        {videoInfo && (
          <video controls className='h-auto w-full max-w-full rounded-lg'>
            <source src={videoInfo.url} type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        )}
      </DialogContent>
    </Dialog>
  )
}
