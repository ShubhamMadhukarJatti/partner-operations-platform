import {
  useDeleteOfflinePartners,
  useOfflinePartnersTable
} from '@/http-hooks/offline-partners'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

interface DeletePartnersDialogProps {
  isOpen: boolean
  onClose: () => void
  tabValue: string
}

const DeletePartnersDialog = ({
  isOpen,
  onClose,
  tabValue
}: DeletePartnersDialogProps) => {
  const { selectedRows, rows } = useOfflinePartnersTable(tabValue)
  const { mutate: deletePartners, isPending } = useDeleteOfflinePartners()

  const count = selectedRows.length

  const handleDeletePartners = () => {
    for (let eachRow of rows) {
      deletePartners({
        organizationId: eachRow.orgId,
        email: eachRow.rowDetails.find((detail) => detail.id === 'partnerEmail')
          ?.value as string
      })
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[468px]'>
        <DialogHeader className='flex flex-col gap-4'>
          <DialogTitle>Delete {count} offline partners?</DialogTitle>
          <DialogDescription className='text-text-80'>
            This action cant be undone. You have to add the partners again and
            invite them
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='flex w-full gap-3 sm:justify-end'>
          <Button
            variant='primary'
            className={cn(
              'flex-1 font-bold sm:flex-initial',
              isPending && 'cursor-not-allowed'
            )}
            onClick={onClose}
            disabled={isPending}
          >
            Go back
          </Button>
          <Button
            variant={isPending ? 'destructiveLight' : 'destructiveSolid'}
            className={cn(
              'flex-1 font-bold sm:flex-initial',
              isPending && 'cursor-not-allowed'
            )}
            onClick={handleDeletePartners}
            disabled={isPending}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeletePartnersDialog
