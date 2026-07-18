'use client'

import React, { useEffect, useState } from 'react'
import {
  EmailMessage,
  fetchDraftEmails,
  fetchReceivedEmails,
  fetchSentEmails
} from '@/services/email-outreach'
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  RefreshCw
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EmailInboxProps {
  onContinue?: () => void
}

const EmailInbox: React.FC<EmailInboxProps> = ({ onContinue }) => {
  const [activeTab, setActiveTab] = useState<'sent' | 'received' | 'draft'>(
    'received'
  )
  const [sentEmails, setSentEmails] = useState<EmailMessage[]>([])
  const [receivedEmails, setReceivedEmails] = useState<EmailMessage[]>([])
  const [draftEmails, setDraftEmails] = useState<EmailMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedEmail, setSelectedEmail] = useState<number | null>(null)
  const emailsPerPage = 10

  useEffect(() => {
    fetchEmails()
  }, [])

  const fetchEmails = async () => {
    setIsLoading(true)
    try {
      const [sentData, receivedData] = await Promise.all([
        fetchSentEmails(),
        fetchReceivedEmails()
      ])

      setSentEmails(sentData)
      setReceivedEmails(receivedData)
    } catch (error) {
      console.error('Error fetching emails:', error)
      // Set empty arrays on error
      setSentEmails([])
      setReceivedEmails([])
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentEmails = () => {
    switch (activeTab) {
      case 'sent':
        return sentEmails
      case 'received':
        return receivedEmails
      case 'draft':
        return draftEmails
      default:
        return []
    }
  }

  const getTotalCount = () => {
    switch (activeTab) {
      case 'sent':
        return sentEmails.length
      case 'received':
        return receivedEmails.length
      case 'draft':
        return draftEmails.length
      default:
        return 0
    }
  }

  const getPaginatedEmails = () => {
    const emails = getCurrentEmails()
    const startIndex = (currentPage - 1) * emailsPerPage
    const endIndex = startIndex + emailsPerPage
    return emails.slice(startIndex, endIndex)
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })

    let dateStr = ''
    if (diffInDays === 0) {
      dateStr = 'Today'
    } else if (diffInDays === 1) {
      dateStr = 'Yesterday'
    } else if (diffInDays < 7) {
      dateStr = date.toLocaleDateString('en-US', { weekday: 'short' })
    } else {
      dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: diffInDays > 365 ? 'numeric' : undefined
      })
    }

    return { time, date: dateStr }
  }

  const stripHtml = (html: string) => {
    // Remove HTML tags and decode entities
    const tmp = html.replace(/<[^>]*>/g, '')
    const txt = document.createElement('textarea')
    txt.innerHTML = tmp
    return txt.value
  }

  const truncateText = (text: string, maxLength: number) => {
    // Strip HTML tags first
    const cleanText = stripHtml(text)
    if (cleanText.length <= maxLength) return cleanText
    return cleanText.substring(0, maxLength) + '...'
  }

  const truncateEmail = (email: string, maxLength: number) => {
    if (email.length <= maxLength) return email
    const [localPart, domain] = email.split('@')
    if (localPart.length > maxLength - 10) {
      return localPart.substring(0, maxLength - 10) + '...@' + domain
    }
    return email
  }

  const totalPages = Math.ceil(getTotalCount() / emailsPerPage)
  const currentEmails = getPaginatedEmails()

  if (isLoading) {
    return (
      <div
        className='flex items-center justify-center'
        style={{ height: 'calc(100vh - 100px)' }}
      >
        <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-primary'></div>
      </div>
    )
  }

  return (
    <div className='flex h-full flex-col bg-white'>
      {/* Header */}
      <div className='border-b border-gray-200 bg-white px-6 py-4'>
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-semibold text-gray-900'>Email Inbox</h1>
          {onContinue && (
            <Button variant='primary' onClick={onContinue}>
              Continue to Next Step
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className='border-b border-gray-200 bg-white'>
        <div className='flex space-x-8 px-6'>
          {[
            { key: 'sent', label: 'Sent', count: sentEmails.length },
            {
              key: 'received',
              label: 'Received',
              count: receivedEmails.length
            }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`border-b-2 px-1 py-3 text-sm font-medium ${
                activeTab === tab.key
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className='flex items-center justify-between border-b border-gray-200 bg-white px-6 py-2'>
        <div className='flex items-center space-x-2'>
          <Button variant='primary' size='sm' onClick={fetchEmails}>
            <RefreshCw className='h-4 w-4' />
          </Button>
        </div>
        <div className='flex items-center space-x-2 text-sm text-gray-600'>
          <span>
            {Math.min((currentPage - 1) * emailsPerPage + 1, getTotalCount())}-
            {Math.min(currentPage * emailsPerPage, getTotalCount())} of{' '}
            {getTotalCount()}
          </span>
          <Button
            variant={currentPage === 1 ? 'disable' : 'primary'}
            size='sm'
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className='disabled:cursor-not-allowed'
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant={currentPage === totalPages ? 'disable' : 'primary'}
            size='sm'
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className='disabled:cursor-not-allowed'
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className='flex-1 overflow-y-auto'>
        {currentEmails.length === 0 ? (
          <div className='flex h-64 flex-col items-center justify-center text-gray-500'>
            <h3 className='mb-2 text-lg font-medium text-gray-900'>
              No {activeTab} emails
            </h3>
            <p className='text-sm text-gray-500'>
              {activeTab === 'sent' && "You haven't sent any emails yet."}
              {activeTab === 'received' &&
                "You haven't received any emails yet."}
            </p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {currentEmails.map((email, index) => {
              const { time, date } = formatDate(email.creationTimestamp)
              const isSelected = selectedEmail === email.id

              return (
                <div
                  key={email.id}
                  className={`cursor-pointer p-4 hover:bg-gray-50 ${
                    isSelected ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedEmail(email.id)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start space-x-3'>
                        <div className='mt-1'>
                          <Input
                            type='checkbox'
                            className='h-4 w-4 rounded border-gray-300'
                          />
                        </div>
                        <div className='min-w-0 flex-1'>
                          <div className='flex items-center space-x-2'>
                            <span className='text-sm text-gray-500'>
                              {activeTab === 'sent' ? 'To:' : 'From:'}
                            </span>
                            <p className='text-sm text-gray-700'>
                              {truncateEmail(
                                activeTab === 'sent'
                                  ? email.to
                                  : email.from || 'Unknown Sender',
                                30
                              )}
                            </p>
                          </div>
                          <p className='mt-1 text-sm font-semibold text-gray-900'>
                            {email.subject || '(No Subject)'}
                          </p>
                          <p className='mt-1 text-sm text-gray-600'>
                            {email.body
                              ? truncateText(email.body, 80)
                              : 'No content'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className='ml-4 flex-shrink-0 text-right'>
                      <p className='text-sm text-gray-500'>{time}</p>
                      <p className='text-sm text-gray-500'>{date}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailInbox
