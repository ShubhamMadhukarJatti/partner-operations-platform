'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { type EmailTemplate } from '@/constants/emailTemplates'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { RadioGroup } from '@/components/ui/radio-group'

import EmailTemplateCard from './EmailTemplateCard'

interface EmailTemplateSelectorProps {
  onBack: () => void
  onNext: (template: EmailTemplate) => void
  templates: EmailTemplate[]
  isLoading?: boolean
  error?: string | null
  onRetry?: () => void
}

const EmailTemplateSelector: React.FC<EmailTemplateSelectorProps> = ({
  onBack,
  onNext,
  templates,
  isLoading = false,
  error,
  onRetry
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('')

  const handleNext = () => {
    const selectedTemplate = templates.find(
      (template) => template.id === selectedTemplateId
    )
    if (selectedTemplate) {
      onNext(selectedTemplate)
    }
  }

  const hasTemplates = templates.length > 0

  useEffect(() => {
    if (hasTemplates && !selectedTemplateId) {
      setSelectedTemplateId(templates[0].id)
    }
  }, [hasTemplates, selectedTemplateId, templates])

  useEffect(() => {
    if (!hasTemplates && selectedTemplateId) {
      setSelectedTemplateId('')
    }
  }, [hasTemplates, selectedTemplateId])

  const statusMessage = useMemo(() => {
    if (isLoading) {
      return 'Generating drafts...'
    }
    if (error) {
      return error
    }
    if (!hasTemplates) {
      return 'No drafts available. Try regenerating.'
    }
    return null
  }, [isLoading, error, hasTemplates])

  return (
    <div className='flex flex-col'>
      <div className='mb-4'>
        <p className='text-base font-semibold text-text-100'>
          AI generated email drafts tailored for this partner
        </p>
        <p className='mt-1 text-sm text-text-60'>
          Pick the option that best matches your intent, or regenerate for more.
        </p>
      </div>

      {statusMessage ? (
        <div className='mb-6 rounded-xl border border-dashed border-text-30 bg-text-10 p-6 text-sm text-text-60'>
          {statusMessage}
          {error && onRetry && (
            <div className='mt-3'>
              <Button size='sm' variant='primary' onClick={onRetry}>
                Try again
              </Button>
            </div>
          )}
        </div>
      ) : (
        <RadioGroup
          value={selectedTemplateId}
          onValueChange={setSelectedTemplateId}
          className='mb-6'
        >
          <div className='no-scrollbar w-full overflow-x-auto'>
            <div className='flex gap-4 pb-4'>
              {templates.map((template, index) => (
                <EmailTemplateCard
                  key={template.id}
                  template={template}
                  index={index}
                  isSelected={selectedTemplateId === template.id}
                  onSelect={() => setSelectedTemplateId(template.id)}
                />
              ))}
            </div>
          </div>
        </RadioGroup>
      )}

      <div className='flex items-center justify-between'>
        <Button
          variant='primary'
          onClick={onBack}
          className='flex items-center gap-2 border-gray-300 bg-transparent hover:bg-gray-50'
        >
          <IconArrowLeft className='h-4 w-4' />
          Back
        </Button>

        <Button
          variant='primary'
          onClick={handleNext}
          disabled={!selectedTemplateId || !hasTemplates || !!statusMessage}
          className={cn(
            'flex items-center gap-2',
            (!selectedTemplateId || !hasTemplates || !!statusMessage) &&
              'cursor-not-allowed'
          )}
        >
          Next
          <IconArrowRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}

export default EmailTemplateSelector
