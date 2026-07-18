// components/EmailPreviewDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface EmailPreviewDialogProps {
  template: {
    subject: string
    bodyHtml: string
  }
}

const EmailPreviewDialog: React.FC<EmailPreviewDialogProps> = ({
  template
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className='h-[37px] rounded-md bg-blue-500 px-4 py-2 text-white'>
          Preview Email
        </button>
      </DialogTrigger>
      <DialogContent className='max-w-4xl'>
        <DialogHeader>
          <DialogTitle>{template.subject}</DialogTitle>
        </DialogHeader>
        <div className='h-[70vh] overflow-auto'>
          {/* Use dangerouslySetInnerHTML to inject HTML template */}
          <div dangerouslySetInnerHTML={{ __html: template.bodyHtml }} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EmailPreviewDialog
