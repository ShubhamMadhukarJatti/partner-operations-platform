'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RootState } from '@/redux/store'
import { removeShortlisting, saveShortlisting } from '@/services/organizations'
import { useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { useSelector } from 'react-redux'

import { getCurrentUser } from '@/lib/db/user'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { showCustomToast } from '@/components/custom-toast'

const ShortListDialog: React.FC<{
  filled?: boolean
  id?: string
  name?: string
  disabled?: boolean
  isShortlisted?: boolean
}> = ({ filled = true, id, name, disabled = false, isShortlisted = false }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [removeDialogOpen, setRemoveDialogOpen] = useState<boolean>(false)
  const [remark, setRemark] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Get current organization from Redux store
  const { organization: currentOrganization } = useSelector(
    (state: RootState) => state.currentOrg
  )

  const handleSave = async () => {
    if (!remark.trim()) {
      showCustomToast(
        'Required',
        'Please enter a remark before saving',
        'error',
        5000
      )
      return
    }

    if (!currentOrganization?.id || !id) {
      showCustomToast('Error', 'Missing required information', 'error', 5000)
      return
    }

    if (!name) {
      showCustomToast(
        'Error',
        'Missing required information name',
        'error',
        5000
      )
      return
    }

    setIsLoading(true)

    try {
      const user = await getCurrentUser()
      // console.log('user', user)
      await saveShortlisting({
        shortlisted_org_id: Number(id),
        shortlisted_by_user_id: user.id.toString(),
        shortlisted_by_user_name: user.name,
        shortlisted_by_org_id: Number(currentOrganization.id),
        remark: remark.trim()
      })

      showCustomToast(
        'Success',
        'Partner shortlisted successfully!',
        'success',
        5000
      )
      setOpen(false)
      setRemark('')

      // Refresh data from backend
      if (currentOrganization?.id) {
        // Invalidate shortlisted partners list
        await queryClient.invalidateQueries({
          queryKey: ['shortlisted-partners', currentOrganization.id]
        })
        // Invalidate explore-page queries to refresh the star state (partial match)
        await queryClient.invalidateQueries({
          queryKey: ['explore-page'],
          exact: false
        })
        // Refetch to update UI immediately
        await queryClient.refetchQueries({
          queryKey: ['explore-page'],
          exact: false
        })
      }
    } catch (error) {
      console.error('Error saving shortlisting:', error)
      showCustomToast(
        'Error',
        'Failed to save shortlisting. Please try again.',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveShortlisting = async () => {
    if (!id) {
      showCustomToast('Error', 'Missing partner information', 'error', 5000)
      return
    }

    setIsLoading(true)

    try {
      await removeShortlisting(Number(id))

      showCustomToast(
        'Success',
        'Partner removed from shortlist successfully!',
        'success',
        5000
      )
      setRemoveDialogOpen(false)

      // Refresh data from backend
      if (currentOrganization?.id) {
        // Invalidate shortlisted partners list
        await queryClient.invalidateQueries({
          queryKey: ['shortlisted-partners', currentOrganization.id]
        })
        // Invalidate explore-page queries to refresh the star state (partial match)
        await queryClient.invalidateQueries({
          queryKey: ['explore-page'],
          exact: false
        })
        // Refetch to update UI immediately
        await queryClient.refetchQueries({
          queryKey: ['explore-page'],
          exact: false
        })
      }
    } catch (error) {
      console.error('Error removing shortlisting:', error)
      showCustomToast(
        'Error',
        'Failed to remove from shortlist. Please try again.',
        'error',
        5000
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleStarClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (disabled && !isShortlisted) {
      return
    }

    if (isShortlisted) {
      // Open remove confirmation dialog
      setRemoveDialogOpen(true)
    } else {
      // Open add shortlist dialog
      setOpen(true)
    }
  }

  return (
    <>
      {/* Star Icon */}
      <div className='cursor-pointer' onClick={handleStarClick}>
        <Star
          stroke={isShortlisted ? '#6863FB' : filled ? '#C8CFDC' : '#6863FB'}
          size={20}
          fill={isShortlisted ? '#6863FB' : filled ? '#ffffff' : '#6863FB'}
        />
      </div>

      {/* Add Shortlist Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild className='hidden'>
          <span />
        </DialogTrigger>

        <DialogContent
          hideCloseBtn
          className='w-full max-w-[620px] overflow-hidden rounded-2xl border border-[#E4E7EC] p-0 shadow-[0_20px_60px_rgba(16,24,40,0.18)]'
        >
          {/* HEADER */}
          <div className='relative border-b border-[#EAECF0] px-6 pb-4 pt-5'>
            <h3 className='text-[18px] font-semibold text-[#101828]'>
              Shortlisting Remarks
            </h3>

            <p className='mt-1 text-[14px] text-[#667085]'>
              Add remark for shortlisting for future reference
            </p>

            {/* CLOSE ICON */}
            <button
              onClick={() => setOpen(false)}
              className='absolute right-5 top-5 text-[#98A2B3] hover:text-[#344054]'
            >
              ✕
            </button>
          </div>

          {/* BODY */}
          <div className='px-6 py-5'>
            <Textarea
              placeholder='Type here...'
              rows={6}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className='
        resize-none
        rounded-lg
        border
        border-[#D0D5DD]
        bg-white
        px-4 py-3
        text-[14px]
        placeholder:text-[#98A2B3]
        focus:border-[#7C83FD]
        focus:ring-2
        focus:ring-[#E0E7FF]
      '
            />
          </div>

          {/* FOOTER */}
          <div className='flex justify-end gap-3 border-t border-[#EAECF0] bg-[#F9FAFB] px-6 py-4'>
            <Button
              variant='outline'
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className='
        h-[40px]
        rounded-lg
        border-[#D0D5DD]
        bg-white
        px-5
        text-[#344054]
        hover:bg-[#F9FAFB]
      '
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={isLoading || !remark.trim()}
              className='
        h-[40px]
        rounded-lg
        !bg-[#6870FA]
        px-6
        text-white
        hover:!bg-[#6870FA]
        disabled:!bg-[#E0E7FF]
        disabled:text-white
      '
            >
              {isLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Remove Shortlist Confirmation Dialog */}
      <Dialog open={removeDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent
          hideCloseBtn
          className='w-full max-w-[420px] overflow-hidden rounded-2xl border border-[#E4E7EC] p-0 shadow-[0_20px_60px_rgba(16,24,40,0.18)]'
        >
          {/* HEADER */}
          <div className='relative border-b border-[#EAECF0] px-6 pb-4 pt-5'>
            <h3 className='text-[18px] font-semibold text-[#101828]'>
              Remove from Shortlist
            </h3>

            <p className='mt-1 text-[14px] text-[#667085]'>
              Are you sure you want to remove{' '}
              <span className='font-medium text-[#101828]'>{name}</span> from
              your shortlist?
            </p>

            {/* CLOSE ICON */}
            <button
              onClick={() => setRemoveDialogOpen(false)}
              className='absolute right-5 top-5 text-[#98A2B3] hover:text-[#344054]'
            >
              ✕
            </button>
          </div>

          {/* FOOTER */}
          <div className='flex justify-end gap-3 border-t border-[#EAECF0] bg-[#F9FAFB] px-6 py-4'>
            <Button
              variant='outline'
              onClick={() => setRemoveDialogOpen(false)}
              disabled={isLoading}
              className='
                h-[40px]
                rounded-lg
                border-[#D0D5DD]
                bg-white
                px-5
                text-[#344054]
                hover:bg-[#F9FAFB]
              '
            >
              Cancel
            </Button>

            <Button
              onClick={handleRemoveShortlisting}
              disabled={isLoading}
              className='
                h-[40px]
                rounded-lg
                bg-[#EF4444]
                px-6
                text-white
                hover:bg-[#DC2626]
                disabled:bg-[#FCA5A5]
                disabled:text-white
              '
            >
              {isLoading ? 'Removing...' : 'Remove'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ShortListDialog
