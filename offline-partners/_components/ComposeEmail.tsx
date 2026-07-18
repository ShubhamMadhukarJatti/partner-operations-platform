import React, { useEffect, useState } from 'react'
import { useUIStore } from '@/store/uiStore'

import { getServerUser } from '@/lib/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertIcon } from '@/components/icons/icons'

interface Mailbox {
  id: string
  name: string
  email: string
  type: 'GMAIL' | 'OUTLOOK' | 'SMTP' | 'OTHER'
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  isConnected: boolean
  organizationId?: string
  createdAt: string
  updatedAt: string
}

const ComposeEmail: React.FC = () => {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)
  const [mailboxes, setMailboxes] = useState<Mailbox[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMailboxes = async () => {
      try {
        setLoading(true)
        const { user } = await getServerUser()

        if (!user?.uid) {
          setError('User not authenticated')
          return
        }

        const response = await fetch(`/api/mailboxes/user/${user.uid}`)

        if (!response.ok) {
          throw new Error('Failed to fetch mailboxes')
        }

        const data = await response.json()
        setMailboxes(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch mailboxes'
        )
        console.error('Error fetching mailboxes:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchMailboxes()
  }, [])

  const hasConnectedMailbox = mailboxes.some(
    (mailbox) => mailbox.isConnected && mailbox.status === 'ACTIVE'
  )

  return (
    <div className='w-full '>
      {/* Warning Banner - Only show if no connected mailboxes */}
      {/* {!hasConnectedMailbox && (
        <div className='flex flex-col rounded-lg border border-[#ED9E00] bg-[#FEF6E6] px-4 py-3 text-sm text-[#ED9E00]'>
          <div className='flex items-center gap-4'>
            <AlertIcon /> Your work email is not connected. Connect your work
            email using SMTP to send the email.
          </div>
          <div
            className='cursor-pointer px-10 text-sm font-semibold underline'
            onClick={toggleSidebar}
          >
            Connect work email
          </div>
        </div>
      )} */}

      {/* Mailboxes Status */}
      {mailboxes.length > 0 && (
        <div className='mt-4 rounded-lg border bg-white px-4 py-3'>
          <h4 className='mb-2 font-medium text-gray-700'>
            Connected Mailboxes
          </h4>
          <div className='space-y-2'>
            {mailboxes.map((mailbox) => (
              <div
                key={mailbox.id}
                className={`flex items-center justify-between rounded border p-2 ${
                  mailbox.isConnected && mailbox.status === 'ACTIVE'
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className='flex items-center gap-2'>
                  <span className='text-sm font-medium'>{mailbox.name}</span>
                  <span className='text-xs text-gray-500'>
                    ({mailbox.email})
                  </span>
                  <span
                    className={`rounded px-2 py-1 text-xs ${
                      mailbox.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : mailbox.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {mailbox.status}
                  </span>
                </div>
                <span className='text-xs capitalize text-gray-500'>
                  {mailbox.type.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {/* {loading && (
        <div className='mt-4 rounded-lg border bg-white px-4 py-3'>
          <div className='text-sm text-gray-500'>Loading mailboxes...</div>
        </div>
      )} */}

      {/* Error State */}
      {/* {error && (
        <div className='mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3'>
          <div className='text-sm text-red-600'>Error: {error}</div>
        </div>
      )} */}

      {/* Compose Body */}
      {/* <div className='mt-4 rounded-lg border bg-white px-4 pb-2 pt-4 '> */}
      {/* Header */}
      {/* <div className='mb-4 flex items-center justify-between'>
          <h3 className='font-medium text-gray-700'>Compose Email</h3>
          <Button
            className='hover:bg-primary-blue/90 flex w-24 gap-2 bg-primary-blue text-white'
            disabled={!hasConnectedMailbox}
          >
            Send
          </Button>
        </div> */}

      {/* To */}
      {/* <div className='mb-3 flex items-center'>
          <label className='w-10 text-sm text-gray-700'>To:</label>
          <div className='rounded-xl border border-[#4285F4] bg-[#E5EFFE] px-2 py-1 text-sm text-[#3E50F7]'>
            amitk009@gmail.com
          </div>
        </div> */}

      {/* Subject */}
      {/* <div className='mb-3 flex items-center gap-6'>
          <label className='w-10 text-sm text-gray-700'>Subject:</label>
          <Input
            type='text'
            placeholder='Enter subject line...'
            className='text-sm'
          />
        </div>

        <div className='my-6 border border-[#DEE2E6]'></div> */}

      {/* Toolbar */}
      {/* <div className='mb-4 flex w-2/3 items-center gap-2 rounded border border-gray-300 px-2 py-2 text-sm text-gray-600'>
          <span className='font-sans'>Sans Serif</span>
          <button className='font-bold'>B</button>
          <button className='italic'>I</button>
          <button className='underline'>U</button>
          <button>•</button>
          <button>1.</button>
          <button className='ml-auto'>⋮</button>
        </div> */}

      {/* Message Area */}
      {/* <textarea
          placeholder='Write your message here...'
          className='min-h-[150px] w-full resize-none rounded border-0 p-2 text-sm focus:outline-none focus:ring-0'
        />
      </div> */}
    </div>
  )
}

export default ComposeEmail
