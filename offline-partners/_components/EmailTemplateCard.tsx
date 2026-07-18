import React from 'react'
import { type EmailTemplate } from '@/constants/emailTemplates'

import { RadioGroupItem } from '@/components/ui/radio-group'

interface EmailTemplateCardProps {
  template: EmailTemplate
  index: number
  isSelected: boolean
  onSelect: () => void
}

const EmailTemplateCard: React.FC<EmailTemplateCardProps> = ({
  template,
  index,
  isSelected,
  onSelect
}) => {
  return (
    <div
      onClick={onSelect}
      className={`flex max-h-[520px] min-w-[594px] cursor-pointer flex-col rounded-lg border p-4 transition-all hover:shadow-md ${
        isSelected
          ? 'border-primary-blue bg-blue-50/30'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className='mb-3 flex items-center gap-3'>
        <RadioGroupItem value={template.id} id={template.id} />
        <label
          htmlFor={template.id}
          className='cursor-pointer text-base font-bold text-text-100'
        >
          Option {index + 1}
        </label>
      </div>

      <div className='mb-3 flex items-center gap-2'>
        <p className='text-lg font-medium text-text-50'>Subject:</p>
        <p className='text-base text-text-100'>{template.subject}</p>
      </div>

      {(template.tone ||
        template.estimated_reply_probability ||
        template.cta) && (
        <div className='mb-3 flex flex-wrap items-center gap-3 text-xs text-text-60'>
          {template.tone && (
            <span className='rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-[0.65rem] uppercase tracking-wide text-blue-700'>
              Tone: {template.tone}
            </span>
          )}
          {typeof template.estimated_reply_probability === 'number' && (
            <span className='rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[0.65rem] font-semibold text-emerald-700'>
              Reply odds: {Math.round(template.estimated_reply_probability)}%
            </span>
          )}
          {template.cta && (
            <span className='rounded-full border border-purple-200 bg-purple-50 px-2 py-1 text-[0.65rem] text-purple-700'>
              CTA: {template.cta}
            </span>
          )}
        </div>
      )}

      <div className='flex-1 overflow-hidden'>
        <div
          className='no-scrollbar prose prose-sm overflow-y-auto text-text-100'
          dangerouslySetInnerHTML={{ __html: template.body }}
          style={{
            fontSize: '14px',
            lineHeight: '1.5'
          }}
        />
      </div>

      {template.rationale && (
        <div className='bg-text-05 mt-4 rounded-lg border border-dashed border-text-20 p-3 text-xs text-text-60'>
          <span className='font-semibold text-text-80'>
            AI rationale:&nbsp;
          </span>
          {template.rationale}
        </div>
      )}
    </div>
  )
}

export default EmailTemplateCard
