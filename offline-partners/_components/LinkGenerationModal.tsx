'use client'

import React, { useMemo, useState } from 'react'
import { IconCopy, IconMail, IconX } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogFooter } from '@/components/ui/dialog'
import EmailInput from '@/components/ui/EmailInput'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import InvitationSentView from './InvitationSentView'

interface LinkGenerationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDeals: string[]
}

const LinkGenerationModal: React.FC<LinkGenerationModalProps> = ({
  isOpen,
  onClose,
  selectedDeals
}) => {
  const [emails, setEmails] = useState<string[]>([])
  const [accessLevel, setAccessLevel] = useState('view')
  const [allowSubmitDeals, setAllowSubmitDeals] = useState(false)
  const [includeProgress, setIncludeProgress] = useState(true)
  const [includeNotes, setIncludeNotes] = useState(true)
  const [expiryDays, setExpiryDays] = useState('7')
  const [linkCopied, setLinkCopied] = useState(false)
  const [showInvitationSent, setShowInvitationSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatedLink = 'join.untitledui.com/project'

  const expiryDate = useMemo(() => {
    const date = new Date()
    date.setDate(date.getDate() + parseInt(expiryDays))
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }, [expiryDays])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleSend = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const access = accessLevel === 'edit' ? 'EDIT' : 'VIEWER'

      // For each email: get code then share
      for (const email of emails) {
        const codeRes = await fetch(
          `/api/offline-partner/code?email=${encodeURIComponent(email)}`
        )
        const codeData = await codeRes.json().catch(() => ({}))
        if (!codeRes.ok || !codeData?.data) {
          throw new Error(
            codeData?.message ?? 'Failed to get partner code for ' + email
          )
        }
        const externalPartnerCodeFromApi = String(codeData.data)

        const shareRes = await fetch('/api/partner/portal/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            access,
            externalPartnerCode: externalPartnerCodeFromApi
          })
        })
        const shareData = await shareRes.json().catch(() => ({}))
        if (!shareRes.ok) {
          throw new Error(shareData?.message ?? 'Failed to share snapshot')
        }
      }

      setShowInvitationSent(true)
    } catch (err) {
      console.error('Error sending invitation:', err)
      setError(err instanceof Error ? err.message : 'Failed to send invitation')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setEmails([])
    setAccessLevel('view')
    setAllowSubmitDeals(false)
    setIncludeProgress(true)
    setIncludeNotes(true)
    setExpiryDays('7')
    setShowInvitationSent(false)
    onClose()
  }

  const handleCloseInvitationSent = () => {
    setEmails([])
    setAccessLevel('view')
    setAllowSubmitDeals(false)
    setIncludeProgress(true)
    setIncludeNotes(true)
    setExpiryDays('7')
    setShowInvitationSent(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='mx-auto max-w-2xl p-0' hideCloseBtn>
        {showInvitationSent ? (
          <div className='py-8'>
            <InvitationSentView
              emails={emails}
              onClose={handleCloseInvitationSent}
            />
          </div>
        ) : (
          <>
            {/* Header with close button */}
            <div className='relative border-b p-6 pb-4'>
              <button
                onClick={onClose}
                className='absolute right-6 top-6 rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
              >
                <IconX size={20} />
              </button>

              {/* Mail Icon */}
              <div className='mb-3 flex justify-center'>
                <div
                  className='relative flex items-center justify-center'
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#F9F5FF',
                    borderRadius: '50%'
                  }}
                >
                  <div
                    className='flex items-center justify-center'
                    style={{
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#F4EBFF',
                      borderRadius: '50%'
                    }}
                  >
                    <IconMail size={20} color='#7F56D9' />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className='flex flex-col gap-1 text-center'>
                <h2 className='text-lg font-semibold text-text-100'>
                  Link Generated
                </h2>
                {/* Description */}
                <p className='px-4 text-center text-sm text-gray-600'>
                  You&apos;ve created a new shareable link to view the status of
                  the chart
                </p>
              </div>
            </div>

            {/* URL Container */}
            {/* <div className='flex items-center gap-1 px-6 pt-4'>
              <div className='w-full'>
                <div
                  className='flex items-center justify-between rounded-lg border px-3 py-[10px]'
                  style={{
                    backgroundColor: '#F9FAFB',
                    borderColor: '#E5E7EB'
                  }}
                >
                  <span className='flex-1 text-base font-medium text-gray-900'>
                    {generatedLink}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className='h-10 w-10 rounded p-2 transition-colors hover:bg-gray-100'
              >
                <IconCopy
                  size={22}
                  className={linkCopied ? 'text-green-600' : 'text-gray-500'}
                />
              </button>
            </div> */}

            {/* Grant Access Section */}
            <div className='mb-4 px-6'>
              <label className='mb-3 block text-sm font-semibold text-text-70'>
                Grant Access
              </label>

              <div className='mb-4 flex gap-3'>
                <div className='flex-1'>
                  <EmailInput
                    value={emails}
                    onChange={setEmails}
                    placeholder='Add comma separated emails'
                  />
                </div>

                <div className='min-w-[120px]'>
                  <Select value={accessLevel} onValueChange={setAccessLevel}>
                    <SelectTrigger className='rounded-2xl border-[#E4E7EE] bg-gray-50'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='view'>View only</SelectItem>
                      <SelectItem value='edit'>Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Toggle for partner submission */}
              <div className='flex items-center gap-2'>
                <Switch
                  checked={allowSubmitDeals}
                  className='h-5 w-9 data-[state=checked]:bg-green-500'
                  onCheckedChange={setAllowSubmitDeals}
                />
                <span className='text-base font-medium text-text-100'>
                  Allow partner to submit new deals
                </span>
              </div>
            </div>

            {/* Settings Section */}
            {/* <div className='mb-4 px-6'>
              <label className='mb-3 block text-sm font-semibold text-text-70'>
                Settings
              </label>

              <div className='mb-3'>
                <h4 className='mb-3 text-base font-medium text-text-100'>
                  Widgets to include
                </h4>

                <div className='space-y-3'>
                  <div className='flex items-center space-x-3'>
                    <Checkbox
                      id='progress-chart'
                      checked={includeProgress}
                      onCheckedChange={(checked) =>
                        setIncludeProgress(checked === true)
                      }
                    />
                    <label
                      htmlFor='progress-chart'
                      className='cursor-pointer text-sm font-medium text-gray-900'
                    >
                      Deals Progress Chart
                    </label>
                  </div>

                  <div className='flex items-center space-x-3'>
                    <Checkbox
                      id='notes-attachments'
                      checked={includeNotes}
                      onCheckedChange={(checked) =>
                        setIncludeNotes(checked === true)
                      }
                    />
                    <label
                      htmlFor='notes-attachments'
                      className='cursor-pointer text-sm font-medium text-gray-900'
                    >
                      Notes & Attachments
                    </label>
                  </div>
                </div>
              </div>

              {/* Link Expiry */}
            {/* <div className='mb-2 flex items-center gap-2'>
                <span className='text-sm font-medium text-gray-900'>
                  Link Expiry
                </span>
                <Select value={expiryDays} onValueChange={setExpiryDays}>
                  <SelectTrigger className='w-16'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='1'>1</SelectItem>
                    <SelectItem value='7'>7</SelectItem>
                    <SelectItem value='30'>30</SelectItem>
                    <SelectItem value='90'>90</SelectItem>
                  </SelectContent>
                </Select>
                <span className='text-sm font-medium text-gray-900'>Days</span>
                <p className='text-sm text-text-60'>
                  (Expires on {expiryDate})
                </p>
              </div>
            </div>  */}

            {/* Footer */}
            <div className='pb-4'>
              <Separator className='mb-4' />
              {error && (
                <div className='mb-4 px-6'>
                  <div className='rounded-md bg-red-50 p-3 text-sm text-red-800'>
                    {error}
                  </div>
                </div>
              )}
              <DialogFooter className='flex flex-row justify-end gap-2 px-6'>
                <Button
                  variant='primary'
                  onClick={handleCancel}
                  className={cn('px-4 py-2', isLoading && 'cursor-not-allowed')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant='primary'
                  className={cn(
                    'px-4 py-2 font-semibold',
                    (isLoading || emails.length === 0) && 'cursor-not-allowed'
                  )}
                  onClick={handleSend}
                  disabled={isLoading || emails.length === 0}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </DialogFooter>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default LinkGenerationModal
