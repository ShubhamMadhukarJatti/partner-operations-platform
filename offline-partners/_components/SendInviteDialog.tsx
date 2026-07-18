'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import {
  useOfflinePartnersTable,
  useSendInvite
} from '@/http-hooks/offline-partners'
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from '@/components/ui/dialog'

interface SendInviteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  emails?: string[]
  tabValue: string
}

const SendInviteDialog = ({
  isOpen,
  onOpenChange,
  emails,
  tabValue
}: SendInviteDialogProps) => {
  const { organizationData } = useSelector(
    (state: RootState) => state.organization
  )
  const { rows, getSelectedRowsData } = useOfflinePartnersTable(tabValue)

  const { mutateAsync: sendInvite, isPending } = useSendInvite()

  // Call this when component mounts or when dialog opens
  const handleSendInvite = async () => {
    const orgId = organizationData?.id
    if (!orgId) {
      console.error('Organization context is missing')
      return
    }
    const selectedRows = getSelectedRowsData()
    const invites = selectedRows
      .map((row) => {
        const email =
          row.rowDetails.find((d) => d.id === 'partnerEmail')?.value ?? ''
        const name =
          row.rowDetails.find((d) => d.id === 'partnerName')?.value ?? ''
        return { email, name }
      })
      .filter((inv) => inv.email?.trim())
    if (invites.length === 0) {
      console.error('No valid recipients selected')
      return
    }
    try {
      await sendInvite({
        organizationId: orgId,
        invites
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to send invite:', error)
    }
  }

  useEffect(() => {
    if (isOpen && emails) {
      handleSendInvite()
    }
  }, [isOpen, emails])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='flex w-[568px] flex-col items-center justify-center gap-4 p-8 text-center'>
        <Image
          src='/send-invite.svg'
          alt='Sending invite'
          width={40}
          height={40}
        />

        <DialogTitle className='text-2xl font-semibold text-text-black'>
          Sending invites
        </DialogTitle>

        <DialogDescription className='mt-2 text-base text-slate-600'>
          This will take some time. We will notify when it is complete
        </DialogDescription>

        <div className='w-full max-w-sm'>
          <div className='rounded-xl bg-text-20 px-3 py-2 text-center text-sm'>
            <p className='text-slate-600'>Sending invite to</p>

            <p className='mt-1 whitespace-normal break-all font-medium'>
              {emails?.join(', ')}
            </p>
          </div>

          {/* <div className='relative h-2 w-full overflow-hidden rounded-full bg-[#EAECF0]'>
            <div
              className='absolute left-0 h-full bg-primary transition-all duration-500'
              style={{ width: '30%' }} // Progress percentage
            />
          </div>

          <p className='mt-2 text-sm text-[#475467]'>10 min remaining...</p> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SendInviteDialog
