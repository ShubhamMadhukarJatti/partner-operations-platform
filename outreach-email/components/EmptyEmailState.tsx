'use client'

import React from 'react'
import { FileText, Mail, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'

interface EmptyEmailStateProps {
  type: 'sent' | 'received' | 'draft'
  onComposeEmail?: () => void
}

const EmptyEmailState: React.FC<EmptyEmailStateProps> = ({
  type,
  onComposeEmail
}) => {
  const getContent = () => {
    switch (type) {
      case 'sent':
        return {
          icon: <Send className='h-16 w-16 text-gray-400' />,
          title: 'No sent emails yet',
          description:
            "You haven't sent any emails through the outreach system. Start by composing your first email to potential partners.",
          actionText: 'Compose Email',
          actionIcon: <Send className='h-4 w-4' />
        }
      case 'received':
        return {
          icon: <Mail className='h-16 w-16 text-gray-400' />,
          title: 'No received emails',
          description:
            "You haven't received any emails from partners yet. Emails from your outreach campaigns will appear here.",
          actionText: 'Check Later',
          actionIcon: <Mail className='h-4 w-4' />
        }
      case 'draft':
        return {
          icon: <FileText className='h-16 w-16 text-gray-400' />,
          title: 'No draft emails',
          description:
            "You don't have any draft emails saved. Start composing an email and save it as a draft to work on later.",
          actionText: 'Create Draft',
          actionIcon: <FileText className='h-4 w-4' />
        }
      default:
        return {
          icon: <Mail className='h-16 w-16 text-gray-400' />,
          title: 'No emails',
          description: 'No emails found in this category.',
          actionText: 'Refresh',
          actionIcon: <Mail className='h-4 w-4' />
        }
    }
  }

  const content = getContent()

  return (
    <div className='flex h-96 flex-col items-center justify-center px-6 text-center'>
      <div className='mb-6'>{content.icon}</div>

      <h3 className='mb-3 text-xl font-semibold text-gray-900'>
        {content.title}
      </h3>

      <p className='mb-8 max-w-md text-gray-600'>{content.description}</p>

      {onComposeEmail && (
        <Button
          variant='primary'
          onClick={onComposeEmail}
          className='flex items-center space-x-2'
        >
          {content.actionIcon}
          <span>{content.actionText}</span>
        </Button>
      )}
    </div>
  )
}

export default EmptyEmailState
